#!/bin/bash

mkdir -p ../pools_backup &&
cp -r ../pools ../pools_backup &&
rm -rf ../pools/aldrin/* &&
rm -rf ../pools/orca/* &&
rm -rf ../pools/saber/* &&
rm -rf ../pools/serum/* &&

npx ts-node get_pools_aldrin.ts &&
npx ts-node get_pools_orca.ts &&
npx ts-node get_pools_saber.ts &&
npx ts-node get_pools_serum.ts &&
npx ts-node get_pools_openbook.ts &&