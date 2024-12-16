import { DolphControllerHandler } from "@dolphjs/dolph/classes";
import {
  Dolph,
  SuccessResponse,
  DRequest,
  DResponse,
  TryCatchAsyncDec,
} from "@dolphjs/dolph/common";
import { Get, Route } from "@dolphjs/dolph/decorators";
import { TransactionService } from "./transaction.service";
import { WalletService } from "../wallet/wallet.service";
import { ICPDocument } from "../wallet/types";

const walletService = new WalletService();

@Route("transaction")
export class TransactionController extends DolphControllerHandler<Dolph> {
  private TransactionService: TransactionService;
  constructor() {
    super();
  }

  @Get("all")
  @TryCatchAsyncDec
  async getAllTransactions(req: DRequest, res: DResponse) {
    const transactions = await this.TransactionService.getAllTransactions(
      +req.query.limit,
      +req.query.page
    );

    SuccessResponse({ res, body: transactions });
  }

  @Get(":username/all")
  @TryCatchAsyncDec
  async getUsersTransactions(req: DRequest, res: DResponse) {
    const wallet = (await walletService.getWalletByUsername(
      req.params.username
    )) as ICPDocument;

    const transactions = await this.TransactionService.getTransactionsByUser(
      wallet.account_id,
      +req.query.limit,
      +req.query.page
    );

    SuccessResponse({ res, body: transactions });
  }

  @Get(":id")
  @TryCatchAsyncDec
  async getTransactionById(req: DRequest, res: DResponse) {
    const transaction = await this.TransactionService.getTransaction(
      req.params.id
    );

    SuccessResponse({
      res,
      body: transaction,
    });
  }
}
