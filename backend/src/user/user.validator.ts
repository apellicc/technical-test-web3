import { IsLowercase, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsLowercase()
  @IsNotEmpty()
  publicAddress: string;
}

export class MatchOneUser {
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  userId: number;
}

export class Match {
  @IsString()
  publicAddress: string;
}
