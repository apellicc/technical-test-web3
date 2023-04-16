import { Button } from "@nextui-org/react";
// import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import Web3 from "web3";
import { getActiveConnector } from "../utilities/VariablesUtil";

interface ILogout {
  logout: () => void;
}
export default function Profile({ logout }: ILogout) {
  let web3: Web3 | undefined = undefined;
  const [connectorId, setConnetorId] = useState(getActiveConnector());

  const [connector, setConnetor] = useState("Injected");
  const [address, setAddress] = useState("");
  const [isLogout, setLogout] = useState(false);

  let disconnectWalletConnect: any;
  let disconnect = async () => {
    web3 = undefined;

    logout();
  };

  if (connectorId && connectorId !== "") {
    const {
      address: _address,
      isConnected,
      connector: activeConnector,
    } = useAccount();

    const { connect, connectors } = useConnect();

    const { disconnectAsync, disconnect } = useDisconnect({
      onSuccess: () => {
        logout();
      },
    });

    // disconnectAsync = _disconnectAsync;

    if (connectorId && connectorId !== "") {
      useEffect(() => {
        if (
          !isConnected &&
          connectorId &&
          connectorId !== "" &&
          isLogout === false
        ) {
          const conn = connectors.find((con) => connectorId === con.id);
          connect({ connector: conn });
        }
      });
      useEffect(() => {
        setAddress(`${_address}`);
      }, [_address]);

      useEffect(() => {
        setConnetor(`${activeConnector?.name}`);
      }, [activeConnector]);
    }

    disconnectWalletConnect = async () => {
      web3 = undefined;
      setLogout(true);
      setConnetorId("");
      // disconnect();
      await disconnectAsync();
    };
  }

  async function run() {
    if (!web3) {
      try {
        // Request account access if needed
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        web3 = new Web3(window.ethereum);
        const _address = accounts[0];
        if (!!_address) {
          setAddress(_address);
          setConnetor("Injected");
        }
      } catch (error) {
        window.alert("You need to allow MetaMask.");
        return;
      }
    }
  }

  if (!connectorId) {
    run();
  }

  return (
    <>
      <div>
        <div>
          Connector {connector} {connectorId ? `By Wallet Connect` : <></>}
        </div>
        <div> Address {address}</div>
        <Button
          color="gradient"
          onPress={() =>
            !connectorId || connectorId === ""
              ? disconnect()
              : disconnectWalletConnect()
          }
        >
          'LOGOUT'
        </Button>
      </div>
    </>
  );
}
