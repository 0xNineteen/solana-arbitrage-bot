//! The curve.fi invariant calculator.
use {
    arrayref::{array_mut_ref, array_ref},
    solana_program::{
        program_error::ProgramError,
        program_pack::{IsInitialized, Pack, Sealed},
    },
    spl_math::precise_number::PreciseNumber,
    spl_token_swap::{
        curve::calculator::{
            CurveCalculator, DynPack, RoundDirection, SwapWithoutFeesResult, TradeDirection,
            TradingTokenResult,
        },
        error::SwapError,
    },
    stable_swap_math::curve::StableSwap,
    std::time,
};

// CUSTOM STABLE COMPUTATION WITH PERCISION_MULTIPLIERS
// used for mercurial pools + saber pools
// ported from jupiters sdk
pub struct Stable {
    pub amp: u64,
    pub fee_numerator: u128,
    pub fee_denominator: u128,
}

impl From<&Stable> for StableSwap {
    fn from(value: &Stable) -> Self {
        let current_ts: i64 = time::SystemTime::now()
            .duration_since(time::UNIX_EPOCH)
            .unwrap()
            .as_secs()
            .try_into()
            .unwrap();
        StableSwap::new(value.amp, value.amp, current_ts, current_ts, current_ts)
    }
}

impl Stable {
    pub fn get_quote(
        &self,
        pool_amounts: [u128; 2], // [0] = src_amount, [1] = dst_amount
        percision_multipliers: [u64; 2],
        scaled_amount_in: u128,
    ) -> u128 {
        let stable_swap: StableSwap = self.into();
        // stableswap with percision multipliers
        let xp: Vec<u128> = vec![
            pool_amounts[0] * percision_multipliers[0] as u128,
            pool_amounts[1] * percision_multipliers[1] as u128,
        ];
        let dx = scaled_amount_in * percision_multipliers[0] as u128;

        let d = stable_swap
            .compute_d(xp[0].try_into().unwrap(), xp[1].try_into().unwrap())
            .unwrap();

        let x = xp[0] + dx;
        let y = stable_swap.compute_y(x.try_into().unwrap(), d).unwrap();
        let dy: u128 = xp[1] - (y as u128);
        let out_amount = dy.checked_div(percision_multipliers[1] as u128).unwrap();

        // reduce fees at the end
        let fees = out_amount
            .checked_mul(self.fee_numerator)
            .unwrap()
            .checked_div(self.fee_denominator)
            .unwrap();

        out_amount - fees
    }
}

/// StableCurve struct implementing CurveCalculator
#[derive(Clone, Debug, Default, PartialEq)]
pub struct StableCurve {
    /// Amplifier constant
    pub amp: u64,
}

impl From<&StableCurve> for StableSwap {
    fn from(value: &StableCurve) -> Self {
        let current_ts: i64 = time::SystemTime::now()
            .duration_since(time::UNIX_EPOCH)
            .unwrap()
            .as_secs()
            .try_into()
            .unwrap();
        StableSwap::new(value.amp, value.amp, current_ts, current_ts, current_ts)
    }
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
        let stable_swap: StableSwap = self.into();

        let new_source_amount = swap_source_amount.checked_add(source_amount)?;
        let new_destination_amount = stable_swap.compute_y(
            new_source_amount.try_into().ok()?,
            stable_swap.compute_d(
                swap_source_amount.try_into().ok()?,
                swap_destination_amount.try_into().ok()?,
            )?,
        )?;

        let amount_swapped = swap_destination_amount.checked_sub(new_destination_amount.into())?;

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
        let stable_swap: StableSwap = self.into();

        let d = stable_swap.compute_d(
            swap_token_a_amount.try_into().ok()?,
            swap_token_b_amount.try_into().ok()?,
        )?;

        let d0 = PreciseNumber::new(d.as_u128())?;
        let (deposit_token_amount, other_token_amount) = match trade_direction {
            TradeDirection::AtoB => (swap_token_a_amount, swap_token_b_amount),
            TradeDirection::BtoA => (swap_token_b_amount, swap_token_a_amount),
        };
        let updated_deposit_token_amount = deposit_token_amount.checked_add(source_amount)?;
        let d_new = stable_swap.compute_d(
            updated_deposit_token_amount.try_into().ok()?,
            other_token_amount.try_into().ok()?,
        )?;
        let d1 = PreciseNumber::new(d_new.as_u128())?;
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
        let stable_swap: StableSwap = self.into();
        let d = stable_swap.compute_d(
            swap_token_a_amount.try_into().ok()?,
            swap_token_b_amount.try_into().ok()?,
        )?;
        let d0 = PreciseNumber::new(d.as_u128())?;
        let (withdraw_token_amount, other_token_amount) = match trade_direction {
            TradeDirection::AtoB => (swap_token_a_amount, swap_token_b_amount),
            TradeDirection::BtoA => (swap_token_b_amount, swap_token_a_amount),
        };
        let updated_deposit_token_amount = withdraw_token_amount.checked_sub(source_amount)?;
        let d_new = stable_swap.compute_d(
            updated_deposit_token_amount.try_into().ok()?,
            other_token_amount.try_into().ok()?,
        )?;

        let d1 = PreciseNumber::new(d_new.as_u128())?;
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
        let stable_swap: StableSwap = self.into();
        let _d = stable_swap.compute_d(
            swap_token_a_amount.try_into().ok()?,
            swap_token_b_amount.try_into().ok()?,
        )?;
        PreciseNumber::new(_d.as_u128())
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
