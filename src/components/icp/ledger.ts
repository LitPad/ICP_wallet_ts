import { Principal } from "@dfinity/principal";
import { Actor, ActorMethod } from "@dfinity/agent";

// Candid Types Matching the .did File
export interface LedgerActor {
  transfer: ActorMethod<[TransferArgs], TransferResult>;
  account_balance: ActorMethod<[AccountBalanceArgs], Tokens>;
}

// Type Definitions Matching the .did File
export interface Tokens {
  e8s: bigint;
}

export interface TimeStamp {
  timestamp_nanos: bigint;
}

export interface AccountBalanceArgs {
  account: Uint8Array;
}

export interface TransferArgs {
  memo: bigint;
  amount: Tokens;
  fee: Tokens;
  from_subaccount?: Uint8Array;
  to: Uint8Array;
  created_at_time?: TimeStamp;
}

export type TransferResult = { Ok: bigint } | { Err: TransferError };

export type TransferError =
  | { TxTooOld: { allowed_window_nanos: bigint } }
  | { BadFee: { expected_fee: Tokens } }
  | { InsufficientFunds: { balance: Tokens } }
  | { TxCreatedInFuture: null }
  | { TxDuplicate: { duplicate_of: bigint } };

// IDL Factory (simplified for demonstration)
export const idlFactory = ({ IDL }: any) => {
  const Tokens = IDL.Record({ e8s: IDL.Nat64 });
  const TimeStamp = IDL.Record({ timestamp_nanos: IDL.Nat64 });
  const AccountBalanceArgs = IDL.Record({ account: IDL.Vec(IDL.Nat8) });

  const TransferError = IDL.Variant({
    TxTooOld: IDL.Record({ allowed_window_nanos: IDL.Nat64 }),
    BadFee: IDL.Record({ expected_fee: Tokens }),
    InsufficientFunds: IDL.Record({ balance: Tokens }),
    TxCreatedInFuture: IDL.Null,
    TxDuplicate: IDL.Record({ duplicate_of: IDL.Nat64 }),
  });

  const TransferResult = IDL.Variant({
    Ok: IDL.Nat64,
    Err: TransferError,
  });

  const TransferArgs = IDL.Record({
    memo: IDL.Nat64,
    amount: Tokens,
    fee: Tokens,
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    to: IDL.Vec(IDL.Nat8),
    created_at_time: IDL.Opt(TimeStamp),
  });

  return IDL.Service({
    transfer: IDL.Func([TransferArgs], [TransferResult], []),
    account_balance: IDL.Func([AccountBalanceArgs], [Tokens], ["query"]),
  });
};
