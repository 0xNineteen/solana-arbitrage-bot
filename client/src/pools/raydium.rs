use serde::{Deserialize, Serialize};
use solana_sdk::pubkey::Pubkey;
use tmp::accounts;

use crate::{
    constants::{MERCURIAL_PROGRAM_ID, TOKEN_PROGRAM_ID},
    pool::PoolOperations,
    pool_utils::common_methods::set_update_accounts,
    serialize::{pool::Fraction, token::WrappedPubkey},
    utils::derive_token_address,
};

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RaydiumPool {
    program_id: WrappedPubkey,
    id: WrappedPubkey,
    mint_a: Token,
    mint_b: Token,
    fee_rate: Fraction,
    open_time: String,
    pooltype: Vec<String>,
    market_id: WrappedPubkey,
    lp_mint: Token,
    #[serde(skip)]
    pub pool_amounts: HashMap<String, u128>,
}

impl PoolAmountsManupulation for RaydiumPool {
    fn insert_pool_amounts(&mut self, id: String, amount: u128) {
        self.pool_amounts.insert(id, amount);
    }
}

impl PoolOperations for RaydiumPool {
    fn get_name(&self) -> String {
        "Raydium".to_string()
    }

    fn get_update_accounts(&self) -> Vec<anchor_lang::prelude::Pubkey> {
        // pool vault amount
        let accounts = self
            .get_mints()
            .iter()
            .map(|mint| self.mint_2_addr(mint))
            .collect();
        accounts
    }

    fn set_update_accounts(
        &mut self,
        accounts: std::rc::Rc<Vec<Option<solana_sdk::account::Account>>>,
        cluster: &anchor_client::Cluster,
    ) {
        set_update_accounts(self, accounts, cluster)
    }

    fn mint_2_addr(&self, mint: &anchor_lang::prelude::Pubkey) -> anchor_lang::prelude::Pubkey {
        let token = self.tokens.get(&mint.to_string()).unwrap();
        token.addr.0
    }

    fn get_mints(&self) -> Vec<anchor_lang::prelude::Pubkey> {
        let mut mints: Vec<Pubkey> = self.token_ids.iter().map(|k| str2pubkey(k)).collect();
        // sort so that its consistent across different pools
        mints.sort();
        mints
    }

    fn mint_2_scale(&self, mint: &anchor_lang::prelude::Pubkey) -> u64 {
        let token = self.tokens.get(&mint.to_string()).unwrap();
        token.scale
    }

    fn get_quote_with_amounts_scaled(
        &self,
        amount_in: u128,
        mint_in: &anchor_lang::prelude::Pubkey,
        mint_out: &anchor_lang::prelude::Pubkey,
    ) -> anyhow::Result<u128> {
        todo!()
    }

    fn swap_ix(
        &self,
        program: &anchor_client::Program<std::rc::Rc<solana_sdk::signature::Keypair>>,
        owner: &anchor_lang::prelude::Pubkey,
        mint_in: &anchor_lang::prelude::Pubkey,
        mint_out: &anchor_lang::prelude::Pubkey,
    ) -> Vec<solana_sdk::instruction::Instruction> {
        let (swap_state_pda, _) = Pubkey::find_program_address(&[b"swap_state"], &program.id());
        let user_src = derive_token_address(owner, mint_in);
        let user_dst = derive_token_address(owner, mint_out);

        let pool0 = &self.tokens[&self.token_ids[0]].addr;
        let pool1 = &self.tokens[&self.token_ids[1]].addr;

        let swap_ix = program
            .request()
            .accounts(tmp_accounts::MercurialSwap {
                pool_account: self.pool_account.0,
                authority: self.authority.0,
                user_transfer_authority: *owner,
                user_src,
                user_dst,
                pool_src: pool0.0, // src/dst order doesnt matter ??
                pool_dst: pool1.0, // src/dst order doesnt matter ??
                token_program: *TOKEN_PROGRAM_ID,
                mercurial_swap_program: *MERCURIAL_PROGRAM_ID,
                swap_state: swap_state_pda,
            })
            .args(tmp_ix::MercurialSwap {})
            .instructions()
            .unwrap();

        swap_ix
    }

    fn can_trade(
        &self,
        mint_in: &anchor_lang::prelude::Pubkey,
        mint_out: &anchor_lang::prelude::Pubkey,
    ) -> bool {
        self.pool_amounts.values().all(|amount| *amount != 0)
    }
}
