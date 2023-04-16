import { Button } from "@nextui-org/react";
import { useState } from "react";
import Web3 from "web3";
import { ConnectUtil } from "../utilities/ConnectUtil";

interface ILogin {
  login: (auth?: string) => void;
}
export default function MetaMask({ login }: ILogin) {
  let web3: Web3 | undefined = undefined;

  const [loading, setLoading] = useState(false);

  async function personalSignMessage({
    publicAddress,
    nonce,
  }: {
    publicAddress: string;
    nonce: string;
  }) {
    const message = `nonce: ${nonce}`;
    try {
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, publicAddress, "Example password"],
      });

      return { publicAddress, signature };
    } catch (err) {
      throw new Error("You need to sign the message to be able to log in.");
    }
  }

  async function ethSignTypedDataV4({
    publicAddress,
    msgParams,
  }: {
    publicAddress: string;
    msgParams: string;
  }) {
    try {
      const signature = await window.ethereum.request({
        method: "eth_signTypedData_v4",
        params: [publicAddress, msgParams],
      });

      return { publicAddress, signature };
    } catch (err) {
      throw new Error("You need to sign the message to be able to log in.");
    }
  }

  async function connectSign(publicAddress: string) {
    if (!publicAddress) {
      return;
    }


    await ConnectUtil.getMsgSign()
      .then((msgParams) => {
        return ethSignTypedDataV4({ publicAddress, msgParams })
      })
      .then(ConnectUtil.signInBasicAuthV4)
      
      .then(login)
      .catch((err) => {
        window.alert(err);

      });

  }

  async function connectMetaMask() {
    setLoading(true);

    let accounts;

    if (!web3) {
      try {
        // Request account access if needed
        accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        web3 = new Web3(window.ethereum);
      } catch (error) {
        window.alert("You need to allow MetaMask.");
        setLoading(false);
        return;
      }
    }

    const _address = accounts[0];

    if (!_address) {
      window.alert("Please activate MetaMask first.");
      setLoading(false);

      return;
    }

    await connectSign(_address);
    setLoading(false);
  }
  return (
    <>
      <Button color="gradient" onPress={() => connectMetaMask()}>
        {/* ex if you use brave without metamask it's connect by brave but if you install metamask, brave is override by it */}
        {loading ? "Loading..." : "Connect with Injected / MetaMask"}
      </Button>
    </>
  );
}
