use anchor_client::solana_client::rpc_client::RpcClient;
use anchor_client::solana_sdk::commitment_config::CommitmentConfig;
use anchor_client::solana_sdk::pubkey::Pubkey;
use anchor_client::solana_sdk::signature::read_keypair_file;
use anchor_client::solana_sdk::signature::{Keypair, Signer};
use anchor_client::{Client, Cluster, Program};

use log::debug;
use solana_sdk::transaction::Transaction;
use spl_token::instruction::mint_to;

use std::rc::Rc;
use std::vec;

use tmp::accounts as tmp_accounts;
use tmp::instruction as tmp_ix;

use crate::constants::*;
use crate::pool::{pool_factory, PoolOperations, PoolType};
use crate::utils::{derive_token_address, read_json_dir};

#[test]
fn serum() {
    let pool_dir = "../pools/serum/".to_string();
    let pool_tipe = PoolType::SerumPoolType;
    test_all_pool_quotes(pool_dir, pool_tipe);
}

#[test]
fn aldrin() {
    let pool_dir = "../pools/aldrin/".to_string();
    let pool_tipe = PoolType::AldrinPoolType;
    test_all_pool_quotes(pool_dir, pool_tipe);
}

#[test]
fn saber() {
    let pool_dir = "../pools/saber/".to_string();
    let pool_tipe = PoolType::SaberPoolType;
    test_all_pool_quotes(pool_dir, pool_tipe);
}

#[test]
fn mercurial() {
    let pool_dir = "../pools/mercurial/".to_string();
    let pool_tipe = PoolType::MercurialPoolType;
    test_all_pool_quotes(pool_dir, pool_tipe);
}

#[test]
fn orca() {
    let pool_dir = "../pools/orca/".to_string();
    let pool_tipe = PoolType::OrcaPoolType;
    test_all_pool_quotes(pool_dir, pool_tipe);
}

fn test_all_pool_quotes(pool_dir: String, pool_tipe: PoolType) {
    // setup stuff
    let cluster = Cluster::Localnet;
    let connection = RpcClient::new_with_commitment(cluster.url(), CommitmentConfig::confirmed());

    let owner_kp_path = "../mainnet-fork/localnet_owner.key";
    // setup anchor things
    let owner = read_keypair_file(owner_kp_path).unwrap();
    debug!("owner: {}", owner.pubkey());

    let provider = Client::new_with_options(cluster, Rc::new(owner), CommitmentConfig::confirmed());
    let program = provider.program(*ARB_PROGRAM_ID).unwrap();
    let owner = read_keypair_file(owner_kp_path).unwrap();

    let pool_paths = read_json_dir(&pool_dir);
    let mut err_count = 0;
    let n_pools = pool_paths.len();
    debug!("found {} pools...", n_pools);

    for pool_path in pool_paths {
        let contents = std::fs::read_to_string(&pool_path).unwrap();
        let mut pool = pool_factory(&pool_tipe, &contents);

        debug!("{}", pool_path);
        let err_flag = test_pool_quote(&mut pool, &pool_path, &connection, &program, &owner);
        err_count += err_flag;
    }
    debug!("POOL ERRORS: {} / {}", err_count, n_pools);
}

fn test_pool_quote(
    pool: &mut Box<dyn PoolOperations>,
    pool_path: &str,
    connection: &RpcClient,
    program: &Program<Rc<Keypair>>,
    owner: &Keypair,
) -> u64 {
    // get token reserve addrs
    let update_accounts = pool.get_update_accounts();
    let accounts = connection.get_multiple_accounts(&update_accounts).unwrap();
    pool.set_update_accounts(Rc::new(accounts), &Cluster::Localnet);

    // get a quote
    let pool_mints = pool.get_mints();
    let mint_in = &pool_mints[0];
    let mint_out = &pool_mints[1];
    let src_scale = pool.mint_2_scale(mint_in);

    let src_ata = derive_token_address(&owner.pubkey(), mint_in);
    let _dst_ata = derive_token_address(&owner.pubkey(), mint_out);

    if !pool.can_trade(mint_in, mint_out) {
        debug!("pool path: {}", pool_path);
        debug!("pool cant trade...");
        return 1;
    }

    let mut amount_in;
    if src_scale >= 2 {
        // scale -2 bc sometimes saber pool amounts are too small for full 1 swap
        amount_in = 10_u128.pow((src_scale - 2) as u32);
    } else {
        amount_in = 10_u128.pow(src_scale as u32);
    }

    // debug!("---");
    // debug!("{:#?}", pool);
    debug!("MINT: {} \nATA: {}", mint_in, src_ata);
    // debug!("MINT: {} \n    ATA: {}", mint_out, dst_ata);
    debug!("Amount In: {}", amount_in);

    let mut loop_count = 0;
    let mut quote_out_amount;
    loop {
        quote_out_amount = pool.get_quote_with_amounts_scaled(amount_in, mint_in, mint_out);
        debug!(
            "Calculated quote with amount scaled: {}, amount in: {}",
            quote_out_amount, amount_in
        );

        if quote_out_amount == 0 {
            amount_in += 100 * 10_u128.pow(src_scale as u32);
        } else if loop_count > 100_000 {
            debug!("pool path: {}", pool_path);
            debug!("loop count error!");
            return 1; // error
        } else {
            break;
        }
        loop_count += 1
    }

    // ** perform a swap tx
    // record balance before swap
    let src_balance = connection
        .get_token_account_balance(&src_ata)
        .unwrap_or_else(|_| panic!("couldnt find ata for mint {:?} ...", mint_in))
        .amount
        .parse::<u128>()
        .unwrap();

    let mut ixs = vec![];

    debug!(
        "src balance: {} amount in {}, src_scale: {}",
        src_balance / 10_u128.pow(src_scale as u32),
        amount_in,
        src_scale
    );
    if amount_in > src_balance {
        if mint_in.to_string() != "So11111111111111111111111111111111111111112" {
            let mint_ix = mint_to(
                &TOKEN_PROGRAM_ID,
                mint_in,
                &src_ata,
                &owner.pubkey(),
                &[&owner.pubkey()],
                amount_in as u64,
            )
            .unwrap();
            ixs.push(vec![mint_ix]);
        } else {
            let sol_balance = connection.get_balance(&owner.pubkey()).unwrap();

            if sol_balance < amount_in as u64 {
                let signature = connection
                    .request_airdrop(&owner.pubkey(), amount_in as u64)
                    .unwrap();
                connection.confirm_transaction(&signature).unwrap();
            }

            // sol => wrapped SOL
            let transfer_ix = solana_sdk::system_instruction::transfer(
                &owner.pubkey(),
                &src_ata,
                amount_in as u64,
            );
            let sync_ix = spl_token::instruction::sync_native(&TOKEN_PROGRAM_ID, &src_ata).unwrap();

            ixs.push(vec![transfer_ix, sync_ix]);
        }
    }

    let (swap_state_pda, _) = Pubkey::find_program_address(&[b"swap_state"], &program.id());

    // initialize swap
    let ix = program
        .request()
        .accounts(tmp_accounts::TokenAndSwapState {
            swap_state: swap_state_pda,
            src: src_ata,
        })
        .args(tmp_ix::StartSwap {
            swap_input: amount_in as u64,
        })
        .instructions()
        .unwrap();
    ixs.push(ix);

    // swap A -> B
    let swap_ix = pool.swap_ix(program, &owner.pubkey(), mint_in, mint_out);
    ixs.push(swap_ix);

    let ixs = ixs.concat();

    // wrap as tx
    let recent_hash = connection.get_latest_blockhash().unwrap();
    let tx = Transaction::new_signed_with_payer(&ixs, Some(&owner.pubkey()), &[owner], recent_hash);

    let result = connection.simulate_transaction(&tx);
    match result {
        Ok(s) => {
            match s.value.err {
                Some(_) => {
                    debug!("---FAILED---");
                    debug!("pool path: {pool_path}");
                    debug!("quote: {amount_in} -> {quote_out_amount}");
                    debug!("logs: {:#?}", s.value.logs);
                    debug!("Err: {:#?}", s.value.err);
                    panic!("ahhh");
                }
                None => {
                    // parse logs for last output amount
                    let mut actual_amount_out = 0;
                    for log in s.value.logs.unwrap() {
                        if log.contains("swap amount out") {
                            let split = log.split("swap amount out: ").collect::<Vec<_>>();
                            let amount_out = split[split.len() - 1].parse::<u128>().unwrap();
                            actual_amount_out = amount_out;
                        }
                    }
                    // debug!("{:#?}", s.value.logs);
                    assert!(actual_amount_out > 0);

                    // delta 1 u128 (rounding?)
                    if actual_amount_out >= quote_out_amount {
                        assert!(
                            actual_amount_out - quote_out_amount <= 2,
                            "pool path: {pool_path} : \
                            actual: {actual_amount_out} quote: {quote_out_amount}"
                        );
                    } else {
                        assert!(
                            quote_out_amount - actual_amount_out <= 2,
                            "pool path: {pool_path} : \
                            actual: {actual_amount_out} quote: {quote_out_amount}"
                        );
                    }
                    0
                }
            }
        }
        Err(_) => {
            debug!("---FAILED---");
            debug!("pool path: {}", pool_path);
            debug!("quote: {} -> {}", amount_in, quote_out_amount);
            panic!("ahhh");
        }
    }
}
