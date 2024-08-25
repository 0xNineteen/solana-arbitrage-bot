use anchor_client::solana_client::rpc_client::RpcClient;

use anchor_client::solana_sdk::commitment_config::CommitmentConfig;

use anchor_client::solana_sdk::signature::{Keypair, Signer};
use anchor_client::solana_sdk::signature::read_keypair_file;

use anchor_client::{Client, Cluster};

use client::pools::SerumPool;

use log::debug;
use solana_sdk::transaction::Transaction;

use std::rc::Rc;

use std::collections::HashMap;

use std::vec;








use tmp::accounts as tmp_accounts;
use tmp::instruction as tmp_instructions;


use client::utils::{get_owner_kp_path, read_json_dir};
use client::pool::{PoolType, PoolDir};
use client::constants::*;

use indicatif::ProgressBar;

fn main() {
    let cluster = Cluster::Localnet;

    env_logger::init();
    // let owner_kp_path = "../../../mainnet.key";     
    let owner_kp_path = get_owner_kp_path(&cluster);
    let owner = read_keypair_file(owner_kp_path.as_str()).unwrap();   

    // ** setup RPC connection 
    let connection = RpcClient::new_with_commitment(
        cluster.url(), 
        CommitmentConfig::confirmed()
    );

    let provider = Client::new_with_options(
        cluster, 
        Rc::new(owner), 
        CommitmentConfig::confirmed() 
    );
    let program = provider.program(*ARB_PROGRAM_ID).unwrap();
    let owner = read_keypair_file(owner_kp_path.as_str()).unwrap();   

    let serum_dir = PoolDir {
        tipe: PoolType::SerumPoolType,
        dir_path: "../pools/serum/".to_string(),
    };    

    let pool_paths = read_json_dir(&serum_dir.dir_path);

    let max_space = 3228; 
    let max_rent_exemption_amount = connection
        .get_minimum_balance_for_rent_exemption(max_space)
        .unwrap();
    let total_fee = max_rent_exemption_amount * pool_paths.len() as u64; 
    let lamports_per_sol = 1000000000; 
    let sol_fee = total_fee as f64 / lamports_per_sol as f64;
    debug!("# open orders: {:?} USDC cost: {:?}", pool_paths.len(), sol_fee * 90_f64);
    
    // return; 
    
    let mut market_to_open_orders = HashMap::new(); 
    
    let pb = ProgressBar::new(pool_paths.len() as u64);

    for pool_path in pool_paths {
        let json_str = std::fs::read_to_string(&pool_path).unwrap();
        let pool: SerumPool = serde_json::from_str(&json_str).unwrap(); 
        
        // do a swap and check the amount         
        let mut program_layout_versions = HashMap::new(); 
        program_layout_versions.insert("4ckmDgGdxQoPDLUkDT3vHgSAkzA3QRdNq5ywwY4sUSJn", 1);
        program_layout_versions.insert("BJ3jrUzddfuSrZHXSCxMUUQsjKEyLmuuyZebkcaFp2fg", 1);
        program_layout_versions.insert("EUqojwWA2rd19FZrzeBncJsm38Jm1hEhE3zsmX3bRc2o", 2);
        program_layout_versions.insert("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin", 3);

        let layout_v1_span = 3220; 
        let layout_v2_span = 3228; 

        let layout_v = program_layout_versions.get(SERUM_PROGRAM_ID.to_string().as_str()).unwrap();
        let space = if *layout_v == 1 { layout_v1_span } else { layout_v2_span };
        
        let open_orders = Keypair::new(); 
        
        let rent_exemption_amount = connection
            .get_minimum_balance_for_rent_exemption(space)
            .unwrap();

        let create_account_ix = solana_sdk::system_instruction::create_account(
            &owner.pubkey(),
            &open_orders.pubkey(),
            rent_exemption_amount,
            space as u64,
            &SERUM_PROGRAM_ID,
        );

        let init_ix = program.request()
            .accounts(tmp_accounts::InitOpenOrder {
                open_orders: open_orders.pubkey(), 
                authority: owner.pubkey(), 
                market: pool.own_address.0, 
                dex_program: *SERUM_PROGRAM_ID,
                rent: solana_sdk::sysvar::rent::id(),
            })
            .args(tmp_instructions::InitOpenOrder {})
            .instructions()
            .unwrap();

        let ixs = vec![
            vec![create_account_ix], 
            init_ix, 
        ].concat();

        // wrap as tx 
        let recent_hash = connection.get_latest_blockhash().unwrap();
        let tx = Transaction::new_signed_with_payer(
            &ixs,
            Some(&owner.pubkey()),
            &[&owner, &open_orders],
            recent_hash,
        );
        match connection.send_transaction(&tx) {
            Err(e) => {
                debug!("error: {:#?}", e);
            }
            Ok(_v) => { }
        }

        market_to_open_orders.insert(pool.own_address.0.to_string(), open_orders.pubkey().to_string());
        
        pb.inc(1);
    }

    // save open orders accounts as .JSON 
    let json_market_oo = serde_json::to_string(&market_to_open_orders).unwrap();
    std::fs::write("./serum_open_orders.json", json_market_oo).unwrap();

}