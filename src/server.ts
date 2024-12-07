import { DolphFactory } from "@dolphjs/dolph";
import { WalletComponent } from "./components/wallet/wallet.component";

const dolph = new DolphFactory([WalletComponent]);
dolph.start();
