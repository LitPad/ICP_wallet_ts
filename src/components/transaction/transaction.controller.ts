import { DolphControllerHandler } from "@dolphjs/dolph/classes";
import {
  Dolph,
  SuccessResponse,
  DRequest,
  DResponse,
  TryCatchAsyncDec,
} from "@dolphjs/dolph/common";
import { Get, Route, Shield } from "@dolphjs/dolph/decorators";
import { TransactionService } from "./transaction.service";
import { WalletService } from "../wallet/wallet.service";
import { ICPDocument } from "../wallet/types";
import { AccessShield } from "@/shared/shields/access.shield";
import { generateTokenForResponses } from "@/shared/helpers/token_generator.helper";

const walletService = new WalletService();

@Shield(AccessShield)
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

    res.setHeader("Access", `Litpad ${generateTokenForResponses()}`);

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

    res.setHeader("Access", `Litpad ${generateTokenForResponses()}`);

    SuccessResponse({ res, body: transactions });
  }

  @Get(":id")
  @TryCatchAsyncDec
  async getTransactionById(req: DRequest, res: DResponse) {
    const transaction = await this.TransactionService.getTransaction(
      req.params.id
    );

    res.setHeader("Access", `Litpad ${generateTokenForResponses()}`);

    SuccessResponse({
      res,
      body: transaction,
    });
  }
}
