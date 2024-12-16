import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph, NotFoundException } from "@dolphjs/dolph/common";
import { InjectMongo } from "@dolphjs/dolph/decorators";
import { Model } from "mongoose";
import { TransactionModel, ITransaction } from "./transaction.model";
import { TransactionDto } from "./transaction.dto";

@InjectMongo("transactionModel", TransactionModel)
export class TransactionService extends DolphServiceHandler<Dolph> {
  transactionModel!: Model<ITransaction>;

  constructor() {
    super("transactionservice");
  }

  async saveTransaction(transactionDto: TransactionDto) {
    return this.transactionModel.create(transactionDto);
  }

  async getTransaction(transactionId: string) {
    const transaction = await this.transactionModel.findById(transactionId);

    if (!transaction) throw new NotFoundException("Transaction not found");

    return transaction;
  }

  async getTransactionsByUser(accountId: string, limit: number, page: number) {
    const skip = limit * (page - 1);

    const transactions = await this.transactionModel
      .find({ from: accountId })
      .skip(skip)
      .limit(limit);

    const count = await this.transactionModel.countDocuments({
      from: accountId,
    });

    return { transactions, count };
  }

  async getAllTransactions(limit: number, page: number) {
    const skip = limit * (page - 1);

    const transactions = await this.transactionModel
      .find({})
      .skip(skip)
      .limit(limit);

    const count = await this.transactionModel.countDocuments();

    return { transactions, count };
  }
}
