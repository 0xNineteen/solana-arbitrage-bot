use anchor_client::solana_sdk::pubkey::Pubkey;
use std::str::FromStr;

lazy_static! {
    pub static ref TOKEN_PROGRAM_ID: Pubkey =
        Pubkey::from_str("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").unwrap();
    pub static ref ASSOCIATED_TOKEN_PROGRAM_ID: Pubkey =
        Pubkey::from_str("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL").unwrap();
    pub static ref ORCA_PROGRAM_ID: Pubkey =
        Pubkey::from_str("9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP").unwrap();
    pub static ref MERCURIAL_PROGRAM_ID: Pubkey =
        Pubkey::from_str("MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2HKky").unwrap();
    pub static ref ARB_PROGRAM_ID: Pubkey =
        Pubkey::from_str("2S9EXVB1Q9YQNTBJL46meffVS7go2pDHMkvcWVu9maqm").unwrap();
    pub static ref SABER_PROGRAM_ID: Pubkey =
        Pubkey::from_str("SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ").unwrap();
    pub static ref ALDRIN_V1_PROGRAM_ID: Pubkey =
        Pubkey::from_str("AMM55ShdkoGRB5jVYPjWziwk8m5MpwyDgsMWHaMSQWH6").unwrap();
    pub static ref ALDRIN_V2_PROGRAM_ID: Pubkey =
        Pubkey::from_str("CURVGoZn8zycx6FXwwevgBTB2gVvdbGTEpvMJDbgs2t4").unwrap();
    pub static ref SERUM_PROGRAM_ID: Pubkey =
        Pubkey::from_str("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin").unwrap();
    pub static ref RAYDIUM_CONCENTRATED_LIQUIDITY_PROGRAM_ID: Pubkey =
        Pubkey::from_str("CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK").unwrap();
    pub static ref RAYDIUM_STABLESWAP_PROGRAM_ID: Pubkey =
        Pubkey::from_str("5quBtoiQqxF9Jv6KYKctB59NT3gtJD2Y65kdnB1Uev3h").unwrap();
    pub static ref RAYDIUM_OPENBOOK_PROGRAM_ID: Pubkey =
        Pubkey::from_str("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8").unwrap();
}
