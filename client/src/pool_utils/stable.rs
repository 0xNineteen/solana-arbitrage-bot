//! The curve.fi invariant calculator.
use {
    crate::{
        pool_utils::calculator::{
            CurveCalculator, DynPack, RoundDirection, SwapWithoutFeesResult, TradeDirection,
            TradingTokenResult,
        },
        error::SwapError,
    },
    arrayref::{array_mut_ref, array_ref},
    solana_program::{
        program_error::ProgramError,
        program_pack::{IsInitialized, Pack, Sealed},
    },
    spl_math::{checked_ceil_div::CheckedCeilDiv, precise_number::PreciseNumber, uint::U256},
    std::convert::TryFrom,
};

const N_COINS: u8 = 2;
const N_COINS_SQUARED: u8 = 4;
const ITERATIONS: u8 = 32;

// CUSTOM STABLE COMPUTATION WITH PERCISION_MULTIPLIERS 
// used for mercurial pools + saber pools
// ported from jupiters sdk 
pub struct Stable {
    pub amp: u64, 
    pub fee_numerator: u128, 
    pub fee_denominator: u128,
}

impl Stable {
    pub fn get_quote(
        &self, 
        pool_amounts: [u128; 2],    // [0] = src_amount, [1] = dst_amount
        percision_multipliers: [u64; 2], 
        scaled_amount_in: u128, 
     ) -> u128 {
        // stableswap with percision multipliers 
        let xp: Vec<u128> = vec![
            pool_amounts[0] * percision_multipliers[0] as u128,
            pool_amounts[1] * percision_multipliers[1] as u128,
        ];
        let dx = scaled_amount_in * percision_multipliers[0] as u128;

        let x = xp[0] + dx;
        let leverage = compute_a(self.amp).unwrap();
        let d = compute_d(leverage, xp[0], xp[1]).unwrap();
        let y = compute_new_destination_amount(leverage, x, d).unwrap();
        let dy = xp[1] - y;
        let out_amount = dy.checked_div(percision_multipliers[1] as u128).unwrap();

        // reduce fees at the end
        let fees = out_amount
            .checked_mul(self.fee_numerator).unwrap()
            .checked_div(self.fee_denominator).unwrap();
        

        out_amount - fees
    }
}

/// Calculates A for deriving D
///
/// Per discussion with the designer and writer of stable curves, this A is not
/// the same as the A from the whitepaper, it's actually `A * n**(n-1)`, so when
/// you set A, you actually set `A * n**(n-1)`. This is because `D**n / prod(x)`
/// loses precision with a huge A value.
///
/// There is little information to document this choice, but the original contracts
/// use this same convention, see a comment in the code at:
/// https://github.com/curvefi/curve-contract/blob/b0bbf77f8f93c9c5f4e415bce9cd71f0cdee960e/contracts/pool-templates/base/SwapTemplateBase.vy#L136
pub fn compute_a(amp: u64) -> Option<u64> {
    amp.checked_mul(N_COINS as u64)
}

/// Returns self to the power of b
fn checked_u8_power(a: &U256, b: u8) -> Option<U256> {
    let mut result = *a;
    for _ in 1..b {
        result = result.checked_mul(*a)?;
    }
    Some(result)
}

/// Returns self multiplied by b
fn checked_u8_mul(a: &U256, b: u8) -> Option<U256> {
    let mut result = *a;
    for _ in 1..b {
        result = result.checked_add(*a)?;
    }
    Some(result)
}

/// StableCurve struct implementing CurveCalculator
#[derive(Clone, Debug, Default, PartialEq)]
pub struct StableCurve {
    /// Amplifier constant
    pub amp: u64,
}

/// d = (leverage * sum_x + d_product * n_coins) * initial_d / ((leverage - 1) * initial_d + (n_coins + 1) * d_product)
fn calculate_step(initial_d: &U256, leverage: u64, sum_x: u128, d_product: &U256) -> Option<U256> {
    let leverage_mul = U256::from(leverage).checked_mul(sum_x.into())?;
    let d_p_mul = checked_u8_mul(d_product, N_COINS)?;

    let l_val = leverage_mul.checked_add(d_p_mul)?.checked_mul(*initial_d)?;

    let leverage_sub = initial_d.checked_mul((leverage.checked_sub(1)?).into())?;
    let n_coins_sum = checked_u8_mul(d_product, N_COINS.checked_add(1)?)?;

    let r_val = leverage_sub.checked_add(n_coins_sum)?;

    l_val.checked_div(r_val)
}

/// Compute stable swap invariant (D)
/// Equation:
/// A * sum(x_i) * n**n + D = A * D * n**n + D**(n+1) / (n**n * prod(x_i))
pub fn compute_d(leverage: u64, amount_a: u128, amount_b: u128) -> Option<u128> {
    let amount_a_times_coins =
        checked_u8_mul(&U256::from(amount_a), N_COINS)?.checked_add(U256::one())?;
    let amount_b_times_coins =
        checked_u8_mul(&U256::from(amount_b), N_COINS)?.checked_add(U256::one())?;
    let sum_x = amount_a.checked_add(amount_b)?; // sum(x_i), a.k.a S
    if sum_x == 0 {
        Some(0)
    } else {
        let mut d_previous: U256;
        let mut d: U256 = sum_x.into();

        // Newton's method to approximate D
        for _ in 0..ITERATIONS {
            let mut d_product = d;
            d_product = d_product
                .checked_mul(d)?
                .checked_div(amount_a_times_coins)?;
            d_product = d_product
                .checked_mul(d)?
                .checked_div(amount_b_times_coins)?;
            d_previous = d;
            //d = (leverage * sum_x + d_p * n_coins) * d / ((leverage - 1) * d + (n_coins + 1) * d_p);
            d = calculate_step(&d, leverage, sum_x, &d_product)?;
            // Equality with the precision of 1
            if d == d_previous {
                break;
            }
        }
        u128::try_from(d).ok()
    }
}

/// Compute swap amount `y` in proportion to `x`
/// Solve for y:
/// y**2 + y * (sum' - (A*n**n - 1) * D / (A * n**n)) = D ** (n + 1) / (n ** (2 * n) * prod' * A)
/// y**2 + b*y = c
pub fn compute_new_destination_amount(
    leverage: u64,
    new_source_amount: u128,
    d_val: u128,
) -> Option<u128> {
    // Upscale to U256
    let leverage: U256 = leverage.into();
    let new_source_amount: U256 = new_source_amount.into();
    let d_val: U256 = d_val.into();

    // sum' = prod' = x
    // c =  D ** (n + 1) / (n ** (2 * n) * prod' * A)
    let c = checked_u8_power(&d_val, N_COINS.checked_add(1)?)?
        .checked_div(checked_u8_mul(&new_source_amount, N_COINS_SQUARED)?.checked_mul(leverage)?)?;

    // b = sum' - (A*n**n - 1) * D / (A * n**n)
    let b = new_source_amount.checked_add(d_val.checked_div(leverage)?)?;

    // Solve for y by approximating: y**2 + b*y = c
    let mut y = d_val;
    for _ in 0..ITERATIONS {
        let (y_new, _) = (checked_u8_power(&y, 2)?.checked_add(c)?)
            .checked_ceil_div(checked_u8_mul(&y, 2)?.checked_add(b)?.checked_sub(d_val)?)?;
        if y_new == y {
            break;
        } else {
            y = y_new;
        }
    }
    u128::try_from(y).ok()
}

impl CurveCalculator for StableCurve {
    /// Stable curve
    fn swap_without_fees(
        &self,
        source_amount: u128,
        swap_source_amount: u128,
        swap_destination_amount: u128,
        _trade_direction: TradeDirection,
    ) -> Option<SwapWithoutFeesResult> {
        if source_amount == 0 {
            return Some(SwapWithoutFeesResult {
                source_amount_swapped: 0,
                destination_amount_swapped: 0,
            });
        }
        let leverage = compute_a(self.amp)?;

        let new_source_amount = swap_source_amount.checked_add(source_amount)?;
        let new_destination_amount = compute_new_destination_amount(
            leverage,
            new_source_amount,
            compute_d(leverage, swap_source_amount, swap_destination_amount)?,
        )?;

        let amount_swapped = swap_destination_amount.checked_sub(new_destination_amount)?;

        Some(SwapWithoutFeesResult {
            source_amount_swapped: source_amount,
            destination_amount_swapped: amount_swapped,
        })
    }

    /// Re-implementation of `remove_liquidty`:
    ///
    /// <https://github.com/curvefi/curve-contract/blob/80bbe179083c9a7062e4c482b0be3bfb7501f2bd/contracts/pool-templates/base/SwapTemplateBase.vy#L513>
    fn pool_tokens_to_trading_tokens(
        &self,
        pool_tokens: u128,
        pool_token_supply: u128,
        swap_token_a_amount: u128,
        swap_token_b_amount: u128,
        round_direction: RoundDirection,
    ) -> Option<TradingTokenResult> {
        let mut token_a_amount = pool_tokens
            .checked_mul(swap_token_a_amount)?
            .checked_div(pool_token_supply)?;
        let mut token_b_amount = pool_tokens
            .checked_mul(swap_token_b_amount)?
            .checked_div(pool_token_supply)?;
        let (token_a_amount, token_b_amount) = match round_direction {
            RoundDirection::Floor => (token_a_amount, token_b_amount),
            RoundDirection::Ceiling => {
                let token_a_remainder = pool_tokens
                    .checked_mul(swap_token_a_amount)?
                    .checked_rem(pool_token_supply)?;

                if token_a_remainder > 0 && token_a_amount > 0 {
                    token_a_amount += 1;
                }
                let token_b_remainder = pool_tokens
                    .checked_mul(swap_token_b_amount)?
                    .checked_rem(pool_token_supply)?;
                if token_b_remainder > 0 && token_b_amount > 0 {
                    token_b_amount += 1;
                }
                (token_a_amount, token_b_amount)
            }
        };
        Some(TradingTokenResult {
            token_a_amount,
            token_b_amount,
        })
    }

    /// Get the amount of pool tokens for the given amount of token A or B.
    /// Re-implementation of `calc_token_amount`:
    ///
    /// <https://github.com/curvefi/curve-contract/blob/80bbe179083c9a7062e4c482b0be3bfb7501f2bd/contracts/pool-templates/base/SwapTemplateBase.vy#L267>
    fn deposit_single_token_type(
        &self,
        source_amount: u128,
        swap_token_a_amount: u128,
        swap_token_b_amount: u128,
        pool_supply: u128,
        trade_direction: TradeDirection,
    ) -> Option<u128> {
        if source_amount == 0 {
            return Some(0);
        }
        let leverage = compute_a(self.amp)?;
        let d0 = PreciseNumber::new(compute_d(
            leverage,
            swap_token_a_amount,
            swap_token_b_amount,
        )?)?;
        let (deposit_token_amount, other_token_amount) = match trade_direction {
            TradeDirection::AtoB => (swap_token_a_amount, swap_token_b_amount),
            TradeDirection::BtoA => (swap_token_b_amount, swap_token_a_amount),
        };
        let updated_deposit_token_amount = deposit_token_amount.checked_add(source_amount)?;
        let d1 = PreciseNumber::new(compute_d(
            leverage,
            updated_deposit_token_amount,
            other_token_amount,
        )?)?;
        let diff = d1.checked_sub(&d0)?;
        let final_amount =
            (diff.checked_mul(&PreciseNumber::new(pool_supply)?))?.checked_div(&d0)?;
        final_amount.floor()?.to_imprecise()
    }

    fn withdraw_single_token_type_exact_out(
        &self,
        source_amount: u128,
        swap_token_a_amount: u128,
        swap_token_b_amount: u128,
        pool_supply: u128,
        trade_direction: TradeDirection,
    ) -> Option<u128> {
        if source_amount == 0 {
            return Some(0);
        }
        let leverage = compute_a(self.amp)?;
        let d0 = PreciseNumber::new(compute_d(
            leverage,
            swap_token_a_amount,
            swap_token_b_amount,
        )?)?;
        let (withdraw_token_amount, other_token_amount) = match trade_direction {
            TradeDirection::AtoB => (swap_token_a_amount, swap_token_b_amount),
            TradeDirection::BtoA => (swap_token_b_amount, swap_token_a_amount),
        };
        let updated_deposit_token_amount = withdraw_token_amount.checked_sub(source_amount)?;
        let d1 = PreciseNumber::new(compute_d(
            leverage,
            updated_deposit_token_amount,
            other_token_amount,
        )?)?;
        let diff = d0.checked_sub(&d1)?;
        let final_amount =
            (diff.checked_mul(&PreciseNumber::new(pool_supply)?))?.checked_div(&d0)?;
        final_amount.ceiling()?.to_imprecise()
    }

    fn normalized_value(
        &self,
        swap_token_a_amount: u128,
        swap_token_b_amount: u128,
    ) -> Option<PreciseNumber> {
        #[cfg(not(any(test, feature = "fuzz")))]
        {
            let leverage = compute_a(self.amp)?;
            PreciseNumber::new(compute_d(
                leverage,
                swap_token_a_amount,
                swap_token_b_amount,
            )?)
        }
        #[cfg(any(test, feature = "fuzz"))]
        {
            use roots::{find_roots_cubic_normalized, Roots};
            let x = swap_token_a_amount as f64;
            let y = swap_token_b_amount as f64;
            let c = (4.0 * (self.amp as f64)) - 1.0;
            let d = 16.0 * (self.amp as f64) * x * y * (x + y);
            let roots = find_roots_cubic_normalized(0.0, c, d);
            let x0 = match roots {
                Roots::No(_) => panic!("No roots found for cubic equations"),
                Roots::One(x) => x[0],
                Roots::Two(_) => panic!("Two roots found for cubic, mathematically impossible"),
                Roots::Three(x) => x[1],
                Roots::Four(_) => panic!("Four roots found for cubic, mathematically impossible"),
            };

            let root_uint = (x0 * ((10f64).powf(11.0))).round() as u128;
            let precision = PreciseNumber::new(10)?.checked_pow(11)?;
            let two = PreciseNumber::new(2)?;
            PreciseNumber::new(root_uint)?
                .checked_div(&precision)?
                .checked_div(&two)
        }
    }

    fn validate(&self) -> Result<(), SwapError> {
        // TODO are all amps valid?
        Ok(())
    }
}

/// IsInitialized is required to use `Pack::pack` and `Pack::unpack`
impl IsInitialized for StableCurve {
    fn is_initialized(&self) -> bool {
        true
    }
}
impl Sealed for StableCurve {}
impl Pack for StableCurve {
    const LEN: usize = 8;
    fn pack_into_slice(&self, output: &mut [u8]) {
        (self as &dyn DynPack).pack_into_slice(output);
    }

    fn unpack_from_slice(input: &[u8]) -> Result<StableCurve, ProgramError> {
        let amp = array_ref![input, 0, 8];
        Ok(Self {
            amp: u64::from_le_bytes(*amp),
        })
    }
}

impl DynPack for StableCurve {
    fn pack_into_slice(&self, output: &mut [u8]) {
        let amp = array_mut_ref![output, 0, 8];
        *amp = self.amp.to_le_bytes();
    }
}

