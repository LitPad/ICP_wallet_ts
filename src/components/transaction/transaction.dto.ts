import { IsNotEmpty, IsString } from "class-validator";

export class TransactionDto {
  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  amount: string;
}
