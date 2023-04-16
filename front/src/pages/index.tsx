import {
  Chain,
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { WagmiConfig, configureChains, createClient, Client } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import WalletConnect from "../components/WalletConnect";
import {
  getAccessToken,
  getWalletConnectProjectId,
  setAccessToken,
  unsetAccessToken,
  unsetActiveConnector,
} from "../utilities/VariablesUtil";
import { useEffect, useState } from "react";
import Profile from "../components/Profile";
import { Card } from "@nextui-org/react";
import MetaMask from "../components/MetaMask";
import { ConnectUtil } from "../utilities/ConnectUtil";

// Configure wagmi and web3modal
const projectId = getWalletConnectProjectId();

let chains: Array<Chain>;

let wagmiClient: any;
let ethereumClient: EthereumClient;

if (projectId) {
  chains = [mainnet, polygon];
  const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
  wagmiClient = createClient({
    // autoConnect: true,
    connectors: w3mConnectors({ version: 2, projectId, chains }),
    provider,
  });

  ethereumClient = new EthereumClient(wagmiClient, chains);
}

interface State {
  isConnected?: boolean;
}

export default function HomePage() {
  const [state, setState] = useState<State>({});

  useEffect(() => {
    const accessToken = getAccessToken();
    if (accessToken) {
      setState({ isConnected: true });
    }
  }, []);


  
  function login(accessToken?: string) {
    setAccessToken(accessToken);
    ConnectUtil.getMyUser();
    setState({ isConnected: true });
  }

  function logout() {
    unsetAccessToken();
    unsetActiveConnector();
    setState({ isConnected: false });
  }

  return (
    <>
      <Card
        css={{ maxWidth: "400px", margin: "100px auto" }}
        variant="bordered"
      >
        <Card.Body
          css={{
            justifyContent: "space-between",
            alignItems: "center",
            height: "280px",
          }}
        >
          {projectId ? (
            <>
              <WagmiConfig client={wagmiClient}>
                {!state.isConnected ? (
                  <>
                    <WalletConnect login={login} />

                    <MetaMask login={login} />
                  </>
                ) : (
                  <Profile logout={logout} />
                )}
              </WagmiConfig>
            </>
          ) : !state.isConnected ? (
            <MetaMask login={login} />
          ) : (
            <Profile logout={logout} />
          )}
        </Card.Body>
      </Card>
      {projectId ? (
        <Web3Modal ethereumClient={ethereumClient} projectId={projectId} />
      ) : (
        <></>
      )}
      {/* <Card css={{ maxWidth: '400px', margin: '100px auto' }} variant="bordered">
            <Card.Body css={{ justifyContent: 'space-between', alignItems: 'center', height: '280px' }}>
                  <WagmiConfig client={wagmiClient}>
                  {
                    !state.isConnected ?
                      (
                        <>
                          { projectId ? <WalletConnect login={login} /> : <></> }

                          <MetaMask login={login} />
                        </>
                      )
                        :
                      (<Profile logout={logout}/>)
                  }
                  </WagmiConfig>
            </Card.Body>
        </Card>
        { projectId ? <Web3Modal ethereumClient={ethereumClient} projectId={projectId} /> : <></> }       */}
    </>
  );
}
