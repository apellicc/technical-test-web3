import { recoverPersonalSignature, recoverTypedSignature, SignTypedDataVersion } from "@metamask/eth-sig-util";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomBytes } from "crypto";
//   recoverPersonalSignature,
//   recoverTypedSignature_v4,
// } from "eth-sig-util";
import { bufferToHex, toChecksumAddress } from "ethereumjs-util";
import { UserService } from "src/user/user.service";

interface ISign {
  publicAddress: string;
  signature: string;
  nonce: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}


  private _msgParams = JSON.stringify({
    domain: {
      // This defines the network, in this case, Mainnet.
      chainId: 1,
      // Give a user-friendly name to the specific contract you're signing for.
      name: "Ether Mail",
      // Add a verifying contract to make sure you're establishing contracts with the proper entity.
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      // This identifies the latest version.
      version: "1",
    },

    // This defines the message you're proposing the user to sign, is dapp-specific, and contains
    // anything you want. There are no required fields. Be as explicit as possible when building out
    // the message schema.
    message: {
      contents: "",
    },
    // This refers to the keys of the following types object.
    primaryType: "Mail",
    types: {
      // This refers to the domain the contract is hosted on.
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      // Refer to primaryType.
      Mail: [{ name: "contents", type: "string" }],
    },
  });

  public msgParams(nonce: string): string {
    const data = JSON.parse(this._msgParams);

    data.message.contents = nonce
    return JSON.stringify(data);
  }

  public async login(
    {
      publicAddress,
      signature,
      nonce
    }: ISign,
    type: "personal" | "eth_v4"
  ) {
 
    let isValid = false;

    if (type === "personal") {
      isValid = this.isValidPersonalSignature(publicAddress, signature, nonce);
    } else if (type === "eth_v4") {
      isValid = this.isValidEthV4Signature(publicAddress, signature, nonce);
    }
    if (!isValid) {
      return;
    }
    let user = await this.checkIfPublicAddressExists(publicAddress);
    if (!user) {
      const id = await this.userService.create({ publicAddress }),
      user = {
        id,
        publicAddress,
      }
    }
    if (isValid && user) {
      const payload = {
        id: user.id,
        publicAddress: user.publicAddress,
      };
      return this.jwtService.sign(payload);
    }
    return null;
  }
  public async checkIfPublicAddressExists(publicAddress: string) {
    const users = await this.userService.findBy({ publicAddress });
    if (users?.length > 0) {
      return users[0];
    }
    return;
  }
  public isValidPersonalSignature(
    publicAddress: string,
    signature: string,
    nonce: string
  ) {
    const msg  = `${nonce}`;
    const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));
    const address = recoverPersonalSignature({
      data: msgBufferHex,
      signature,
    });
    if (address.toLowerCase() === publicAddress.toLowerCase()) {
      return true;
    } else {
      return false;
    }
  }

  public getNonce() {
   const nonce = randomBytes(16).toString('base64');

   return nonce;
  }
  public isValidEthV4Signature(publicAddress, signature: string, nonce) {

    const recovered = recoverTypedSignature({
      data: JSON.parse(this.msgParams(nonce)),
      signature,
      version: SignTypedDataVersion.V4
    });

    if (toChecksumAddress(recovered) === toChecksumAddress(publicAddress)) {
      return true;
    } else {
      return false;
    }
  }
}
