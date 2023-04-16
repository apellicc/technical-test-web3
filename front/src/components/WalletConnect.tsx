import { Button } from "@nextui-org/react";
import { useWeb3Modal } from "@web3modal/react";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";

import { ConnectUtil } from "../utilities/ConnectUtil";
import { setActiveConnector } from "../utilities/VariablesUtil";

interface ILogin {
  login: (accessToken?: string) => void;
}
export default function WalletConnect({ login }: ILogin) {
  const { open } = useWeb3Modal();

  const {
    address,
    isConnected: _isConnected,
    isDisconnected: _isDisconnected,
    connector: activeConnector,
  } = useAccount();

  const { isLoading: connectLoading } = useConnect();

  const { isLoading: signLoading, signMessageAsync } = useSignMessage();

  const { disconnect } = useDisconnect();

  const [isConnected, setConnect] = useState(false);

  async function signMessage({
    publicAddress,
    nonce,
  }: {
    publicAddress: string;
    nonce: string;
  }) {
    debugger
    if (_isConnected) {
      const message = `${nonce}`;
      const signature = await signMessageAsync({ message });

      return { publicAddress, signature };
    } else {
      throw new Error("You need to sign the message to be able to log in.");
    }
  }

  async function connectAndSign(publicAddress: string) {
    if (!address) {
      return;
    }

    if (activeConnector) {
      setActiveConnector(activeConnector.id);
    }
    await ConnectUtil.getNonce()
    .then((nonce) => {
      return signMessage({ publicAddress, nonce })
    })
    .then(ConnectUtil.signIn)
    .then(login)
    .catch((err) => {
      if (_isConnected) {
        disconnect();
      }
      window.alert(err);
    });
  }

  useEffect(() => {
    if (_isConnected === true && isConnected === false) {
      connectAndSign(`${address}`);
      setConnect(true);
    }
  }, [_isConnected]);

  return (
    <>
      <Button color="gradient" onPress={async () => open()}>
        {signLoading || connectLoading
          ? "Loading..."
          : "Connect by Wallet Connect"}
      </Button>
      {/* alternative button / manage chain &  */}
      {/* <Web3Button balance="show" /> */}
    </>
  );
}
