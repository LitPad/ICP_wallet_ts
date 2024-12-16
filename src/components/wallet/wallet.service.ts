import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import {
  BadRequestException,
  Dolph,
  NotFoundException,
} from "@dolphjs/dolph/common";
import { InjectMongo } from "@dolphjs/dolph/decorators";
import { WalletModel, IICPModel } from "./wallet.model";
import { IcpService } from "../icp/icp.service";
import { LedgerHelpers } from "@/shared/helpers/ledger.helper";
import { IIcp } from "../icp/icp.model";
import { ICPDocument } from "./types";

@InjectMongo("walletModel", WalletModel)
export class WalletService extends DolphServiceHandler<Dolph> {
  private IcpService: IcpService;
  walletModel!: IICPModel;

  constructor() {
    super("walletservice");
    this.IcpService = new IcpService();
  }

  async create(username: string) {
    if (await this.walletModel.findOne({ user: username }))
      throw new BadRequestException("This user has an ICP wallet already");

    const { accountIdentifier, encryptedPrivateKey, principal, publicKey } =
      await this.IcpService.createAccount();

    await this.walletModel.create({
      account_id: accountIdentifier,
      private_key: encryptedPrivateKey,
      public_key: publicKey,
      principal,
      user: username,
    });

    return {
      publicKey,
    };
  }

  async getWalletByUsername(username: string) {
    return this.getBalance(username, true);
  }

  async getBalance(
    username: string,
    returnWallet?: boolean
  ): Promise<ICPDocument | number> {
    let wallet = await this.walletModel.findOne({ user: username });

    if (!wallet) throw new NotFoundException("Wallet not found.");

    const balance = await this.IcpService.getICPBalance(wallet.principal);

    wallet.balance = LedgerHelpers.e8sToIcp(BigInt(parseFloat(balance)));

    await wallet.save();

    if (returnWallet) {
      return wallet;
    }

    return wallet.balance;
  }

  async updateBalance(username: string, amount: string) {
    let wallet = await this.walletModel.findOne({ user: username });

    if (!wallet) throw new NotFoundException("Wallet not found");

    wallet.balance = wallet.balance - parseFloat(amount);

    wallet = await wallet.save();

    return {
      balance: wallet.balance,
      publicKey: wallet.public_key,
      accountId: wallet.account_id,
      user: wallet.user,
    };
  }

  async sendICP(username: string, receiver: string, amount: string) {
    const wallet = await this.walletModel.findOne({ user: username });

    if (!wallet) throw new NotFoundException("Wallet not found.");

    const result = await this.IcpService.sendIcp({
      from: wallet.private_key,
      to: receiver,
      amount: amount,
    });

    return { ...result, from: wallet.account_id, to: receiver };
  }
}
