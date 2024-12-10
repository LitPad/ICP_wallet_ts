import { IsNotEmpty, IsString } from "class-validator";

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class TransferDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  amount: string;
}
