import base64
import json
from solders.keypair import Keypair
from spl.token import _layouts


def main():
    rawdata = open("localnet_owner.key", "r", -1, "utf-8")
    owner = Keypair.from_json(rawdata.read())
    mints = json.load(open("saved_mints.json", "r", -1, "utf-8"))

    print("scrapping mints...")
    for acc in mints:
        json_path = f"accounts/{acc}.json"
        print("Minting...", json_path)
        pk = acc
        with open(json_path, "r", -1, "utf8") as f:
            info = json.load(f)["account"]

        mint = _layouts.MINT_LAYOUT.parse(base64.b64decode(info["data"][0]))
        print("Before:")
        print(mint)

        mint.mint_authority = bytes(owner.pubkey())
        # :)
        mint.mint_authority_option = 1
        
        if hasattr(mint, "mintAuthority"):
            del mint.mintAuthority
        # :)
        if hasattr(mint, "mintAuthorityOption"):
            del mint.mintAuthorityOption

        print("After:")
        print(mint)
        data = _layouts.MINT_LAYOUT.build(mint)

        info["data"] = [base64.b64encode(data).decode(), "base64"]
        info["pubkey"] = pk
        local_validator_acc = {
            "account": info,
            "pubkey": pk,
        }

        path = f"accounts/{pk}.json"
        dump = json.dumps(local_validator_acc)
        print(dump)
        with open(path, "w", -1, "utf8") as f:
            f.write(dump)


main()
