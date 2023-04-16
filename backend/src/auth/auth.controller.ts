import { Body, Controller, Get, Post, Version, Headers, Query, Session, Req, HttpException, HttpStatus } from "@nestjs/common";
import { Public } from "src/decorators/public.decorator";
import { AuthService } from "./auth.service";
import { BodyCredentials } from "./auth.validator";

@Public()
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}
  @Post()
  async login(
    @Session() session: any,
    @Body() credentials: BodyCredentials
  ): Promise<{ access_token: string }> {
    const accessToken = await this.authService.login({...credentials, nonce: session.nonce}, "personal");

    if (accessToken) {
      return {
        access_token: accessToken,
      };
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    }
  }

  @Get("/basic-auth")
  async loginBasicAuth(
    @Session() session: any,
    @Headers("authorization") authorization: string
  ): Promise<{ access_token: string }> {
    if (authorization?.match(/^Basic ([a-zA-Z0-9+\/=]*)$/)) {
      const basic = authorization.replace(/^Basic /, "");
      const [publicAddress, signature] = Buffer.from(basic, "base64")
        .toString()
        .split(":");

      const accessToken = await this.authService.login(
        { publicAddress, signature, nonce: session.nonce },
        "personal"
      );

      if (accessToken) {
        return {
          access_token: accessToken,
        };
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  
      }
    }
  }

  @Post()
  @Version("4")
  async loginV4(
    @Session() session,
    @Body() credentials: BodyCredentials
  ): Promise<{ access_token: string }> {
    const accessToken = await this.authService.login({ ...credentials, nonce: session.nonce }, "eth_v4");

    if (accessToken) {
      return {
        access_token: accessToken,
      };
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    }
  }

  @Get("/basic-auth")
  @Version("4")
  async loginBasicAuthV4(
    @Session() session: any,
    @Headers("authorization") authorization: string
  ): Promise<{ access_token: string }> {


    if (authorization?.match(/^Basic ([a-zA-Z0-9+\/=]*)$/)) {
      const basic = authorization.replace(/^Basic /, "");
      const [publicAddress, signature] = Buffer.from(basic, "base64")
        .toString()
        .split(":");

      const accessToken = await this.authService.login(
        { publicAddress, signature, nonce: session.nonce },
        "eth_v4"
      );

      if (accessToken) {
        return {
          access_token: accessToken,
        };
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  
      }
    }
  }

  @Get("/nonce")
  async getMsgSign(@Session() session: any) {

    session.nonce = this.authService.getNonce();
    return { nonce: session.nonce };
  }
  @Get("/msg-sign")
  @Version("4")
  getMsgSignV4(@Session() session: any) {
    session.nonce = this.authService.getNonce()
    // session.save();
    return { msg_params: this.authService.msgParams(session.nonce) };
  }
}
