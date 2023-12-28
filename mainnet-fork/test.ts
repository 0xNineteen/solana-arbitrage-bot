import * as web3 from "@solana/web3.js";

const fs = require("fs");

async function main() {
  let connection = new web3.Connection(
    "https://capable-hardworking-borough.solana-devnet.quiknode.pro/d160d13390e06cfaf07d3b433188e5b79a25fe39/",
    "confirmed"
  );
  let accounts = [
    "ErcxwkPgLdyoVL6j2SsekZ5iysPZEDRGfAggh282kQb8",
    "EFYW6YEiCGpavuMPS1zoXhgfNkPisWkQ3bQz1b4UfKek",
    "8JPid6GtND2tU3A7x7GDfPPEWwS36rMtzF7YoHU44UoA",
    "BVWwyiHVHZQMPHsiW7dZH7bnBVKmbxdeEjWqVRciHCyo",
    "E6aTzkZKdCECgpDtBZtVpqiGjxRDSAFh1SC9CdSoVK7a",
  ].map((s) => new web3.PublicKey(s));

  console.log("scrapping accounts... TEST FILE");
  let n = 1;
  n += 1;
  let infos = await connection.getMultipleAccountsInfo(accounts);

  console.log("accounts", infos);

  for (let i = 0; i < infos.length; i++) {
    let pk = accounts[i];
    var info = infos[i];

    let notype_info = JSON.parse(JSON.stringify(info, null, "\t"));
    notype_info.data = [info.data.toString("base64"), "base64"];

    let local_validator_acc = {
      account: notype_info,
      pubkey: pk,
    };
    let path = `accounts/${pk}.json`;

    fs.writeFile(path, JSON.stringify(local_validator_acc), "utf8", () => {});
  }
}

main();
