#!/bin/sh
# cargo build --release # re-compile 

rm -rf log.txt # clear the log 
# continuously search for arbitrages
while true
do
    echo "------" >> log.txt
    echo $(date) >> log.txt
    echo "------" >> log.txt
    RUST_LOG=client::arb=info ./target/release/main --cluster localnet

done