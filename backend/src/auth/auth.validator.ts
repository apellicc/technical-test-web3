import { IsLowercase, IsNotEmpty, IsString } from "class-validator";

export class BodyCredentials {
  @IsString()
  @IsLowercase()
  @IsNotEmpty()
  publicAddress: string;

  @IsString()
  @IsNotEmpty()
  signature: string;
}
