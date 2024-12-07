import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import {
  BadRequestException,
  Dolph,
  InternalServerErrorException,
} from "@dolphjs/dolph/common";
import { Actor, HttpAgent, SignIdentity } from "@dfinity/agent";
import { fromHexString, IDL, toHexString } from "@dfinity/candid";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
import {
  AccountBalanceArgs,
  idlFactory,
  LedgerActor,
  TransferArgs,
} from "./ledger";
import { decrypt, encrypt } from "@/helpers/encryption.helper";
import { LedgerHelpers } from "@/shared/helpers/ledger.helper";
import { customJSONStringify } from "@/shared/helpers/custom_helpers.helper";

export class IcpService extends DolphServiceHandler<Dolph> {
  private readonly host: string = "https://ic0.app";
  private readonly ledgerCanisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";
  private readonly indexCanisterId = "xrs4b-hiaaa-aaaar-qafoa-cai";
  private agent: HttpAgent;
  private ledgerActor: LedgerActor;

  constructor(identity?: SignIdentity) {
    super("icpservice");
    this.agent = new HttpAgent({ host: this.host, identity });
    this.ledgerActor = this.createActor(
      this.ledgerCanisterId,
      idlFactory,
      this.agent
    ) as unknown as LedgerActor;
  }

  private createActor(
    canisterId: string,
    idl: IDL.InterfaceFactory,
    agent: HttpAgent
  ) {
    return Actor.createActor(idl, {
      agent,
      canisterId,
    });
  }

  public async createAccount(): Promise<{
    principal: string;
    accountIdentifier: string;
    publicKey: string;
    encryptedPrivateKey: string;
  }> {
    const identity = await Ed25519KeyIdentity.generate();
    const principal = identity.getPrincipal();
    const accountIdentifier = AccountIdentifier.fromPrincipal({ principal });

    const publicKey = identity.getPublicKey().toDer();
    const privateKey = identity.getKeyPair().secretKey;
    const encryptedKey = await encrypt(Buffer.from(privateKey).toString("hex"));

    return {
      publicKey: Buffer.from(publicKey).toString("hex"),
      accountIdentifier: accountIdentifier.toHex(),
      principal: principal.toText(),
      encryptedPrivateKey: encryptedKey,
    };
  }

  public async getICPBalance(
    principal: string,
    subaccount?: Uint8Array
  ): Promise<string> {
    try {
      if (!LedgerHelpers.isValidPrincipal(principal)) {
        throw new BadRequestException("Principal is invalid");
      }

      const _principal = Principal.fromText(principal);

      const accountIdentifier = AccountIdentifier.fromPrincipal({
        principal: _principal,
      });

      const balanceArgs: AccountBalanceArgs = {
        account: accountIdentifier.toUint8Array(),
      };

      const balance = await this.ledgerActor.account_balance(balanceArgs);

      return BigInt(balance.e8s).toString();
    } catch (e: any) {
      throw e;
    }
  }

  public async sendIcp(request: any): Promise<string> {
    if (!request.from || !request.to || !request.amount) {
      throw new Error("Invalid transfer parameters");
    }

    const fromIdentity = this.createIdentityFromPrivateKey(
      decrypt(request.from)
    );

    const senderAgent = new HttpAgent({
      host: this.host,
      identity: fromIdentity,
    });
    await senderAgent.fetchRootKey(); // remove on prod

    const senderActor = this.createActor(
      this.ledgerCanisterId,
      idlFactory,
      senderAgent
    ) as unknown as LedgerActor;

    const toAccountId = AccountIdentifier.fromHex(request.to);

    try {
      const transferArgs: TransferArgs = {
        to: toAccountId.toUint8Array(),
        fee: { e8s: 10000n },
        memo: BigInt(request.memo || 0),
        from_subaccount: [] as any,
        created_at_time: [] as any,
        amount: { e8s: LedgerHelpers.icpToE8s(+request.amount) },
      };

      const result = await senderActor.transfer(transferArgs);

      if ("Ok" in result) {
        return result.Ok.toString();
      } else {
        throw new InternalServerErrorException(
          `Transfer failed: ${customJSONStringify(result.Err)}`
        );
      }
    } catch (e: any) {
      console.error("ICP transfer error: ", e);
      throw new InternalServerErrorException(
        `Failed to complete ICP transfer: ${e.message ? e.message : e}`
      );
    }
  }

  private createIdentityFromPrivateKey(privateKey: string): SignIdentity {
    return Ed25519KeyIdentity.fromSecretKey(Buffer.from(privateKey, "hex"));
  }
}
