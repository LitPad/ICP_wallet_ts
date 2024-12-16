import { Component } from "@dolphjs/dolph/decorators";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallet.service";
import { TransactionService } from "../transaction/transaction.service";

@Component({
  controllers: [WalletController],
  services: [WalletService, TransactionService],
})
export class WalletComponent {}
