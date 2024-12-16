import { DolphControllerHandler } from "@dolphjs/dolph/classes";
import {
  Dolph,
  SuccessResponse,
  DRequest,
  DResponse,
  TryCatchAsyncDec,
  validateBodyMiddleware,
} from "@dolphjs/dolph/common";
import { Get, Post, Route, UseMiddleware } from "@dolphjs/dolph/decorators";
import { WalletService } from "./wallet.service";
import { CreateWalletDto, TransferDto } from "./wallet.dto";
import { TransactionService } from "../transaction/transaction.service";

@Route("wallet")
export class WalletController extends DolphControllerHandler<Dolph> {
  private WalletService: WalletService;
  private TransactionService: TransactionService;
  constructor() {
    super();
  }

  @Get(":username/balance")
  @TryCatchAsyncDec
  async getBalance(req: DRequest, res: DResponse) {
    const balance = await this.WalletService.getBalance(req.params.username);
    SuccessResponse({
      res,
      body: { balance },
    });
  }

  @Post()
  @UseMiddleware(validateBodyMiddleware(CreateWalletDto))
  @TryCatchAsyncDec
  async create(req: DRequest, res: DResponse) {
    await this.WalletService.create(req.body.username);
    SuccessResponse({ res, body: { message: "Wallet created successfully" } });
  }

  @Post("transfer")
  @UseMiddleware(validateBodyMiddleware(TransferDto))
  @TryCatchAsyncDec
  async transferICP(req: DRequest, res: DResponse) {
    const result = await this.WalletService.sendICP(
      req.body.username,
      req.body.address,
      req.body.amount
    );

    const transaction = await this.TransactionService.saveTransaction({
      amount: req.body.amount,
      from: result.from,
      to: result.to,
    });

    SuccessResponse({ res, body: transaction });
  }
}
