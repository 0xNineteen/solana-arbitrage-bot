use anchor_client::Cluster;
use solana_sdk::account::Account;
use std::rc::Rc;

use crate::{pool::PoolOperations, serialize::token::unpack_token_account};

pub trait PoolAmountsManupulation {
    fn insert_pool_amounts(&mut self, id: String, amount: u128);
}

pub fn set_update_accounts<T>(pool: &mut T, accounts: Rc<Vec<Option<Account>>>, _cluster: &Cluster)
where
    T: PoolOperations + PoolAmountsManupulation,
{
    let ids: Vec<String> = pool
        .get_mints()
        .iter()
        .map(|mint| mint.to_string())
        .collect();
    let id0 = &ids[0];
    let id1 = &ids[1];
    if accounts[0].is_none() || accounts[1].is_none() {
        return;
    }

    let acc_data0 = &accounts[0].as_ref().unwrap().data;
    let acc_data1 = &accounts[1].as_ref().unwrap().data;

    let amount0 = unpack_token_account(acc_data0).amount as u128;
    let amount1 = unpack_token_account(acc_data1).amount as u128;

    // Add the pool_amounts field to the T type
    pool.insert_pool_amounts(id0.clone(), amount0);
    pool.insert_pool_amounts(id1.clone(), amount1);
}
