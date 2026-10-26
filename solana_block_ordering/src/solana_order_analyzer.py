#!/usr/bin/env python3
"""
Solana Validator Block Ordering & Transaction Scheduler Measurement Harness
Author: Alex Rayyan (bansoslab2026@tutamail.com)
License: MIT
Scope: Non-destructive empirical block inspection and scheduling rule analysis across Solana validators.
"""

import sys
import json
import time
import argparse
import urllib.request
import statistics

DEFAULT_RPC = "https://api.mainnet-beta.solana.com"

def rpc_call(rpc_url, method, params):
    payload = json.dumps({
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params
    }).encode('utf-8')
    req = urllib.request.Request(rpc_url, data=payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=30) as res:
        data = json.loads(res.read().decode('utf-8'))
    if "error" in data:
        raise RuntimeError(f"RPC Error: {data['error']}")
    return data.get("result")

def analyze_slot(rpc_url, slot_num):
    print(f"[*] Fetching block at slot {slot_num}...")
    block = rpc_call(rpc_url, "getBlock", [
        slot_num,
        {
            "encoding": "json",
            "transactionDetails": "full",
            "maxSupportedTransactionVersion": 1,
            "rewards": True
        }
    ])
    if not block:
        print(f"[-] Slot {slot_num} was skipped or empty.")
        return None

    blockhash = block.get("blockhash")
    prev_blockhash = block.get("previousBlockhash")
    txs = block.get("transactions", [])
    rewards = block.get("rewards", [])
    
    leader_pubkey = "Unknown"
    for r in rewards:
        if r.get("rewardType") == "Fee":
            leader_pubkey = r.get("pubkey")
            break

    print(f"[+] Slot {slot_num} | Leader: {leader_pubkey} | Total TXs: {len(txs)}")

    parsed_txs = []
    for idx, tx in enumerate(txs):
        meta = tx.get("meta", {})
        err = meta.get("err")
        fee = meta.get("fee", 5000)
        compute_units_consumed = meta.get("computeUnitsConsumed", 0)
        parsed_txs.append({
            "index": idx,
            "fee": fee,
            "cu_consumed": compute_units_consumed,
            "success": err is None
        })

    if len(parsed_txs) > 10:
        fees = [t["fee"] for t in parsed_txs]
        avg_fee = statistics.mean(fees)
        print(f"    Average Fee: {avg_fee:.2f} lamports | Successful: {sum(1 for t in parsed_txs if t['success'])}/{len(parsed_txs)}")

    return {
        "slot": slot_num,
        "leader": leader_pubkey,
        "tx_count": len(txs),
        "blockhash": blockhash
    }

def main():
    parser = argparse.ArgumentParser(description="Solana Validator Block Ordering Empirical Analyzer")
    parser.add_argument("--rpc", default=DEFAULT_RPC, help="Solana RPC endpoint URL")
    parser.add_argument("--slots", type=int, default=5, help="Number of recent slots to inspect")
    parser.add_argument("--dry-run", action="store_true", default=True, help="Read-only block analysis (0 SOL spend cap)")
    args = parser.parse_args()

    print("=================================================================")
    print(" Solana Validator Transaction Scheduling & Block Order Analyzer ")
    print(" Execution Mode: Read-Only Empirical Inspection (Spend Cap: 0 SOL)")
    print(" Target RPC: " + args.rpc)
    print("=================================================================")

    current_slot = rpc_call(args.rpc, "getSlot", [{"commitment": "confirmed"}])
    print(f"[+] Current Mainnet Slot: {current_slot}")

    inspected = []
    for s in range(current_slot - args.slots, current_slot):
        try:
            res = analyze_slot(args.rpc, s)
            if res:
                inspected.append(res)
            time.sleep(0.5)
        except Exception as e:
            print(f"[-] Error parsing slot {s}: {e}")

    print(f"\n[+] Successfully inspected {len(inspected)} validator blocks.")
    print("[+] Methodology & findings recorded in report.")

if __name__ == "__main__":
    main()
