import { DolphFactory } from "@dolphjs/dolph";
import { WalletComponent } from "./components/wallet/wallet.component";
import { TransactionComponent } from "./components/transaction/transaction.component";

const dolph = new DolphFactory([WalletComponent, TransactionComponent]);
dolph.start();
