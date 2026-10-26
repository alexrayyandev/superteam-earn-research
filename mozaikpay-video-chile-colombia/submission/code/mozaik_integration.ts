# MozaikPay TypeScript Integration

## Project Structure

```
mozaikpay-integration/
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── webhook/
│   │   │   ├── handler.ts
│   │   │   ├── verification.ts
│   │   │   └── idempotency.ts
│   │   ├── settlement/
│   │   │   └── solana.ts
│   │   ├── types/
│   │   │   └── mozaik.ts
│   │   └── utils/
│   │       └── errors.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── checkout/
│   │   │       └── page.tsx
│   │   ├── components/
│   │   │   └── MozaikCheckout.tsx
│   │   ├── lib/
│   │   │   └── mozaik-client.ts
│   │   └── types/
│   │       └── mozaik.ts
│   ├── package.json
│   └── tsconfig.json
```

---

## Backend Implementation

### Types Definition

```typescript
// backend/src/types/mozaik.ts

export type Currency = 'CLP' | 'COP' | 'USD';

export type PaymentMethod = 'WEBPAY' | 'PSE' | 'CRYPTO';

export type PaymentStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'
  | 'CANCELLED';

export type WebhookEventType =
  | 'payment.created'
  | 'payment.pending'
  | 'payment.completed'
  | 'payment.failed'
  | 'payment.refunded'
  | 'settlement.created'
  | 'settlement.completed';

export interface MozaikWebhookPayload {
  id: string;
  type: WebhookEventType;
  created_at: string;
  data: {
    id: string;
    amount: number;
    currency: Currency;
    status: PaymentStatus;
    payment_method: PaymentMethod;
    customer: {
      id?: string;
      email: string;
      name?: string;
      document?: string;
    };
    metadata?: Record<string, unknown>;
    order_id?: string;
    crypto_amount?: number;
    crypto_currency?: string;
    exchange_rate?: number;
    settlement?: {
      id: string;
      amount: number;
      currency: string;
      wallet_address: string;
      network: string;
      tx_hash?: string;
      status: string;
    };
  };
}

export interface WebhookSignature {
  timestamp: string;
  signature: string;
}

export interface IdempotencyRecord {
  eventId: string;
  processedAt: Date;
  status: 'processed' | 'failed';
  result?: unknown;
}

export interface PaymentIntentRequest {
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  customer: {
    email: string;
    name?: string;
    document?: string;
  };
  orderId: string;
  description?: string;
  metadata?: Record<string, unknown>;
  returnUrl: string;
  webhookUrl?: string;
}

export interface PaymentIntentResponse {
  id: string;
  clientSecret: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  paymentUrl?: string;
  qrCode?: string;
  expiresAt: string;
}

export interface SolanaSettlementConfig {
  walletAddress: string;
  network: 'mainnet' | 'testnet' | 'devnet';
  commitment: 'processed' | 'confirmed' | 'finalized';
}
```

### Error Handling Utilities

```typescript
// backend/src/utils/errors.ts

export class MozaikPayError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'MozaikPayError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class SignatureVerificationError extends MozaikPayError {
  constructor(message: string, details?: unknown) {
    super(message, 'SIGNATURE_VERIFICATION_FAILED', 401, details);
    this.name = 'SignatureVerificationError';
  }
}

export class IdempotencyError extends MozaikPayError {
  constructor(message: string, details?: unknown) {
    super(message, 'IDEMPOTENCY_ERROR', 409, details);
    this.name = 'IdempotencyError';
  }
}

export class SettlementError extends MozaikPayError {
  constructor(message: string, details?: unknown) {
    super(message, 'SETTLEMENT_ERROR', 500, details);
    this.name = 'SettlementError';
  }
}

export class ValidationError extends MozaikPayError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}
```

### HMAC-SHA256 Signature Verification

```typescript
// backend/src/webhook/verification.ts

import crypto from 'crypto';
import { Request } from 'express';
import { MozaikWebhookPayload, WebhookSignature } from '../types/mozaik';
import { SignatureVerificationError } from '../utils/errors';

const WEBHOOK_SECRET = process.env.MOZAIK_WEBHOOK_SECRET || '';
const MAX_TIMESTAMP_DRIFT_MS = 5 * 60 * 1000; // 5 minutes

export function verifyWebhookSignature(
  payload: MozaikWebhookPayload,
  signature: WebhookSignature
): void {
  if (!WEBHOOK_SECRET) {
    throw new SignatureVerificationError('Webhook secret not configured');
  }

  const timestamp = parseInt(signature.timestamp, 10);
  const currentTime = Date.now();

  if (isNaN(timestamp)) {
    throw new SignatureVerificationError('Invalid timestamp format');
  }

  if (Math.abs(currentTime - timestamp) > MAX_TIMESTAMP_DRIFT_MS) {
    throw new SignatureVerificationError('Webhook timestamp too old or too far in future', {
      timestamp,
      currentTime,
      drift: Math.abs(currentTime - timestamp)
    });
  }

  const signedPayload = `${signature.timestamp}.${JSON.stringify(payload)}`;
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(signedPayload)
    .digest('hex');

  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature.signature),
    Buffer.from(expectedSignature)
  );

  if (!isValid) {
    throw new SignatureVerificationError('Signature mismatch', {
      received: signature.signature.substring(0, 10) + '...',
      expected: expectedSignature.substring(0, 10) + '...'
    });
  }
}

export function extractSignatureFromHeaders(headers: Record<string, string | string[] | undefined>): WebhookSignature {
  const signature = headers['x-mozaik-signature'];
  const timestamp = headers['x-mozaik-timestamp'];

  if (!signature || typeof signature !== 'string') {
    throw new SignatureVerificationError('Missing x-mozaik-signature header');
  }

  if (!timestamp || typeof timestamp !== 'string') {
    throw new SignatureVerificationError('Missing x-mozaik-timestamp header');
  }

  return {
    timestamp,
    signature
  };
}

export function verifyRequestSignature(
  req: Request,
  body: MozaikWebhookPayload
): void {
  const signature = extractSignatureFromHeaders(req.headers as Record<string, string>);
  verifyWebhookSignature(body, signature);
}
```

### Idempotency Handler

```typescript
// backend/src/webhook/idempotency.ts

import { MozaikWebhookPayload, IdempotencyRecord } from '../types/mozaik';
import { IdempotencyError } from '../utils/errors';

const idempotencyStore = new Map<string, IdempotencyRecord>();

const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function checkIdempotency(event: MozaikWebhookPayload): void {
  const existing = idempotencyStore.get(event.id);

  if (existing) {
    if (existing.status === 'processed') {
      throw new IdempotencyError('Event already processed', {
        eventId: event.id,
        processedAt: existing.processedAt
      });
    }

    if (existing.status === 'failed') {
      throw new IdempotencyError('Event previously failed, retry in progress', {
        eventId: event.id,
        processedAt: existing.processedAt
      });
    }
  }
}

export function markEventProcessing(eventId: string): void {
  idempotencyStore.set(eventId, {
    eventId,
    processedAt: new Date(),
    status: 'processed'
  });

  scheduleCleanup(eventId);
}

export function markEventFailed(eventId: string, error: unknown): void {
  idempotencyStore.set(eventId, {
    eventId,
    processedAt: new Date(),
    status: 'failed',
    result: error instanceof Error ? error.message : String(error)
  });

  scheduleCleanup(eventId);
}

function scheduleCleanup(eventId: string): void {
  setTimeout(() => {
    idempotencyStore.delete(eventId);
  }, IDEMPOTENCY_TTL_MS);
}

export function getIdempotencyRecord(eventId: string): IdempotencyRecord | undefined {
  return idempotencyStore.get(eventId);
}

export function clearIdempotencyStore(): void {
  idempotencyStore.clear();
}
```

### Solana Settlement Dispatch

```typescript
// backend/src/settlement/solana.ts

import {
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
  PublicKey,
  sendAndConfirmTransaction,
  Cluster
} from '@solana/web3.js';
import { SolanaSettlementConfig, MozaikWebhookPayload } from '../types/mozaik';
import { SettlementError, ValidationError } from '../utils/errors';

export class SolanaSettlementDispatcher {
  private connection: Connection;
  private wallet: Keypair;
  private config: SolanaSettlementConfig;

  constructor(config: SolanaSettlementConfig) {
    this.config = config;

    const cluster = config.network as Cluster;
    this.connection = new Connection(
      `https://api.${config.network}.solana.com`,
      config.commitment
    );

    if (!process.env.SOLANA_WALLET_PRIVATE_KEY) {
      throw new SettlementError('Solana wallet private key not configured');
    }

    const privateKeyBytes = Buffer.from(
      process.env.SOLANA_WALLET_PRIVATE_KEY,
      'base64'
    );
    this.wallet = Keypair.fromSecretKey(privateKeyBytes);
  }

  async dispatchSettlement(
    payment: MozaikWebhookPayload
  ): Promise<{ txHash: string; slot: number }> {
    const settlement = payment.data.settlement;

    if (!settlement) {
      throw new ValidationError('No settlement data in payment event');
    }

    if (settlement.currency !== 'SOL' && settlement.currency !== 'USDC') {
      throw new ValidationError(`Unsupported settlement currency: ${settlement.currency}`);
    }

    try {
      const recipientPubkey = new PublicKey(settlement.wallet_address);
      const amount = Math.floor(settlement.amount * 1e9); // Convert to lamports/SOL

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.wallet.publicKey,
          toPubkey: recipientPubkey,
          lamports: amount
        })
      );

      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.wallet],
        { commitment: this.config.commitment }
      );

      const slot = await this.connection.getSlot(this.config.commitment);

      return {
        txHash: signature,
        slot
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown settlement error';
      throw new SettlementError(`Settlement dispatch failed: ${message}`, {
        paymentId: payment.data.id,
        wallet: settlement.wallet_address,
        amount: settlement.amount
      });
    }
  }

  async verifyTransaction(txHash: string): Promise<boolean> {
    try {
      const transaction = await this.connection.getTransaction(txHash, {
        commitment: this.config.commitment
      });
      return transaction !== null;
    } catch {
      return false;
    }
  }

  async getWalletBalance(): Promise<number> {
    const balance = await this.connection.getBalance(this.wallet.publicKey);
    return balance / 1e9; // Convert to SOL
  }
}

export function createSettlementDispatcher(): SolanaSettlementDispatcher {
  return new SolanaSettlementDispatcher({
    walletAddress: process.env.SETTLEMENT_WALLET_ADDRESS || '',
    network: (process.env.SOLANA_NETWORK as 'mainnet' | 'testnet' | 'devnet') || 'mainnet',
    commitment: (process.env.SOLANA_COMMIT