# $CHIMP On-Chain Verification Manual

**Author: Alex Rayyan**

---

# Solana On-Chain Verification Guide: $CHIMP

This manual provides the exact procedures to verify the $CHIMP token contract, liquidity pool (LP) mint, and Metaplex Candy Machine v2 / Candy Guard configuration directly on-chain. It is intended for security auditors, token holders, and developers performing due diligence.

All commands assume a Unix-like environment with Solana CLI tools installed and configured. Replace placeholders such as `<MINT>` with the actual addresses.

---

## 1. Prerequisites

Install the Solana tool suite and SPL Token CLI:

```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install.sh)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
solana --version

cargo install spl-token-cli
```

Set the cluster to the appropriate environment (mainnet-beta for production verification):

```bash
solana config set --url https://api.mainnet-beta.solana.com
```

---

## 2. Token Mint Verification via Block Explorers

### 2.1 Solscan

1. Navigate to `https://solscan.io/token/<MINT>`.
2. In the **Overview** tab, locate the **Mint Authority** field. It must display **`None`**.
3. Locate the **Freeze Authority** field. It must display **`None`**.
4. Verify the **Token Type** is `SPL Token` and the **Decimals** match the expected value (e.g., 9 for $CHIMP).
5. In the **Metadata** section, confirm the token name is `CHIMP` and the symbol is `$CHIMP` (or as officially documented).
6. Check the **Holders** tab to confirm the distribution is not concentrated in a single address (unless expected).

### 2.2 Solana Explorer

1. Navigate to `https://explorer.solana.com/address/<MINT>`.
2. In the **Overview** panel, under **Token Details**, verify:
   - **Mint Authority**: `None`
   - **Freeze Authority**: `None`
3. Confirm the **Supply** matches the expected total supply.
4. Click the **Tokens** tab to view the token list and verify the metadata.

---

## 3. CLI Verification of Mint and LP Supply

### 3.1 Verify Mint Authority and Freeze Authority

Run the following command to display the mint account details:

```bash
spl-token display <MINT>
```

Expected output:

```
SPL Token Mint
  Address: <MINT>
  Decimals: 9
  Authority: None
  Freeze Authority: None
```

- **`Authority: None`** confirms the mint authority has been renounced. No new tokens can be minted.
- **`Freeze Authority: None`** confirms no address can freeze token accounts.

If the output shows an address instead of `None`, the mint is not renounced and the token is not safe from further issuance.

### 3.2 Verify LP Supply is Zero

The LP mint represents the liquidity pool token. A supply of `0` indicates that all LP tokens have been burned, locking the liquidity forever.

```bash
spl-token supply <LP_MINT>
```

Expected output:

```
0
```

If the supply is greater than `0`, LP tokens still exist and the liquidity is not fully locked. Verify the LP token holder to determine if the liquidity provider can still remove funds.

---

## 4. Metaplex Candy Machine v2 & Candy Guard Verification

The Candy Machine is used for the $CHIMP NFT mint. Verify the configuration to ensure fair launch parameters (bot tax, start date) are correctly set.

### 4.1 Identify the Candy Machine ID

The Candy Machine ID is the address of the Candy Machine account. It is typically provided in the project documentation or can be found by inspecting the mint transaction for the NFT collection.

### 4.2 Verify Candy Machine v2 Parameters

Use the Metaplex CLI or a direct RPC call to fetch the Candy Machine account state.

#### Option A: Metaplex CLI

```bash
metaplex show <CANDY_MACHINE_ID>
```

Look for the following fields:

- **`go_live_date`**: This is the start date of the mint. It must be in the past (or exactly the announced time) and should not be changed after launch.
- **`bot_tax`**: This is the tax applied to suspected bot transactions. It is a `u64` value in lamports (1 SOL = 1,000,000,000 lamports). A typical value is `0.01 SOL` (10,000,000 lamports). Verify it matches the announced value.

#### Option B: Direct RPC Call

```bash
curl https://api.mainnet-beta.solana.com -X POST -H "Content-Type: application/json" -d '
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getAccountInfo",
  "params": [
    "<CANDY_MACHINE_ID>",
    {"encoding": "base64"}
  ]
}'
```

The returned `data` is a base64-encoded binary blob. Decode it and inspect the fields (see Section 5 for deserialization).

### 4.3 Verify Candy Guard Parameters

Candy Guard is a separate account that wraps the Candy Machine and adds additional mint protections.

```bash
metaplex candy-guard show <CANDY_GUARD_ID>
```

Key parameters to verify:

- **`bot_tax`**: The lamports charged to a wallet that fails the anti-bot check. Confirm it matches the announced value.
- **`start_date`**: The exact timestamp (Unix seconds) when minting opens. Confirm it is in the past and was not modified after the public announcement.
- **`sol_threshold`**: If a SOL threshold is set, verify it matches the expected mint price.
- **`mint_limit`**: The maximum number of mints per wallet. Verify it is set to the announced limit (e.g., 1 per wallet).

If the Candy Guard is not used, the Candy Machine's own `go_live_date` and `bot_tax` fields apply.

---

## 5. Raw Account Data Deserialization for Security Auditors

For a deep audit, deserialize the raw account data of the Candy Machine and Candy Guard to verify every field without relying on third-party tools.

### 5.1 Fetch Raw Account Data

Use `solana account` to dump the account data to a file:

```bash
solana account <CANDY_MACHINE_ID> --output-file candy_machine.bin
solana account <CANDY_GUARD_ID> --output-file candy_guard.bin
```

### 5.2 Candy Machine v2 Deserialization

The Candy Machine v2 account layout is defined in the Metaplex `candy-machine` crate. The relevant fields are:

| Offset | Size | Type | Field |
|--------|------|------|-------|
| 0      | 8    | u64  | `version` (should be 2) |
| 8      | 8    | u64  | `features` |
| 16     | 8    | u64  | `authority` (Pubkey) |
| 24     | 8    | u64  | `wallet` (Pubkey) |
| 32     | 8    | u64  | `token_mint` (Pubkey, optional) |
| 40     | 8    | u64  | `items_redeemed` |
| 48     | 8    | u64  | `data` (CandyMachineData) |

The `CandyMachineData` struct contains:

```rust
pub struct CandyMachineData {
    pub uuid: [u8; 6],
    pub price: u64,
    pub symbol: String,
    pub seller_fee_basis_points: u16,
    pub max_supply: u64,
    pub is_mutable: bool,
    pub retain_authority: bool,
    pub go_live_date: Option<i64>,
    pub end_date: Option<i64>,
    pub items_available: u64,
    pub creators: Vec<Creator>,
}
```

To deserialize, use a Rust script with the `borsh` and `solana` crates, or use Python with `construct` and `base58`.

**Python example using `construct`:**

```python
from construct import *
import base58

# Define the CandyMachineData structure
Creator = Struct(
    "address" / Bytes(32),
    "verified" / Flag,
    "share" / Int8ub,
)

CandyMachineData = Struct(
    "uuid" / Bytes(6),
    "price" / Int64ul,
    "symbol" / PascalString(4, encoding="utf8"),
    "seller_fee_basis_points" / Int16ul,
    "max_supply" / Int64ul,
    "is_mutable" / Flag,
    "retain_authority" / Flag,
    "go_live_date" / Optional(Int64sl),
    "end_date" / Optional(Int64sl),
    "items_available" / Int64ul,
    "creators" / PrefixedArray(Int32ul, Creator),
)

# Read the binary file
with open("candy_machine.bin", "rb") as f:
    data = f.read()

# Skip the first 48 bytes (header fields)
parsed = CandyMachineData.parse(data[48:])
print(parsed)
```

Verify:
- `go_live_date` is the expected Unix timestamp.
- `price` is the expected mint price in lamports.
- `items_available` matches the announced supply.

### 5.3 Candy Guard Deserialization

The Candy Guard account layout is defined in the `candy-guard` crate. The structure is