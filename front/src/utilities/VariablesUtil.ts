const ACCESS_TOKEN_KEY =
  process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || "xborg:auth";

export function getActiveConnector(): string | null {
  const connectorId = window.localStorage.getItem("connector-id");
  return connectorId;
}

export function setActiveConnector(connectorId: string) {
  localStorage.setItem("connector-id", connectorId);
}

export function unsetActiveConnector() {
  localStorage.removeItem("connector-id");
}

export function getAccessToken() {
  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  return accessToken;
}

export function setAccessToken(token: any) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function unsetAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getWalletConnectProjectId() {
  const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
  if (!projectId) {
    console.log("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not defined");
  }

  return projectId;
}

export function getBackendUrl() {
  const backendUrl = process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("REACT_APP_BACKEND_URL is not defined");
  }

  return backendUrl;
}
