import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph, NotFoundException } from "@dolphjs/dolph/common";
import { InjectMongo } from "@dolphjs/dolph/decorators";
import { WalletModel, IICPModel } from "./wallet.model";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { Principal } from "@dfinity/principal";
import crypto from "crypto";
import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { AccountIdentifier, LedgerCanister } from "@dfinity/ledger-icp";
import { IcpService } from "../icp/icp.service";

@InjectMongo("walletModel", WalletModel)
export class WalletService extends DolphServiceHandler<Dolph> {
  private IcpService: IcpService;
  walletModel!: IICPModel;

  constructor() {
    super("walletservice");
    this.IcpService = new IcpService();
  }

  async create(username: string) {
    const { accountIdentifier, encryptedPrivateKey, principal, publicKey } =
      await this.IcpService.createAccount();

    await this.walletModel.create({
      account_id: accountIdentifier,
      private_key: encryptedPrivateKey,
      public_key: publicKey,
      principal,
      user: username,
    });

    console.log("principal: ", principal);
    console.log("accountId: ", accountIdentifier);

    return {
      publicKey,
    };
  }

  async getBalance(username: string) {
    const wallet = await this.walletModel.findOne({ user: username });

    if (!wallet) throw new NotFoundException("Wallet not found.");

    const balance = await this.IcpService.getICPBalance(wallet.principal);

    return balance;
  }

  async sendICP(username: string, receiver: string, amount: string) {
    const wallet = await this.walletModel.findOne({ user: username });

    if (!wallet) throw new NotFoundException("Wallet not found.");

    const result = await this.IcpService.sendIcp({
      from: wallet.private_key,
      to: receiver,
      amount: amount,
    });

    return result;
  }
}
