export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    account_balance: IDL.Func(
      [IDL.Record({ account: IDL.Text })],
      [IDL.Nat],
      ["query"]
    ),
    send_dfx: IDL.Func(
      [
        IDL.Record({
          to: IDL.Text,
          amount: IDL.Nat,
          fee: IDL.Nat,
          memo: IDL.Nat64,
          from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
          created_at_time: IDL.Opt(IDL.Nat64),
        }),
      ],
      [IDL.Record({ transaction_hash: IDL.Vec(IDL.Nat8) })],
      []
    ),
  });
};
export const canisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";
