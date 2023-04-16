import axios from "axios";
import { getAccessToken, getBackendUrl } from "./VariablesUtil";

export namespace ConnectUtil {
  const BACKEND_URL = getBackendUrl();

  export async function getNonce() {
    return axios
      .get(`${BACKEND_URL}/auth/nonce`, { withCredentials: true })
      .then((response) => response.data?.nonce);
  }

  export async function getMsgSign() {
    return axios
      .get(`${BACKEND_URL}/v4/auth/msg-sign`, { withCredentials: true })
      .then((response) => response.data?.msg_params);
  }


  export async function signIn({
    publicAddress,
    signature,
  }: {
    publicAddress: any;
    signature: any;
  }) {
    if (!publicAddress) {
      return;
    }
    const _publicAddress = publicAddress.toLowerCase();

    return axios
      .post(`${BACKEND_URL}/auth`, { publicAddress: _publicAddress, signature }, {withCredentials: true })
      .then((response) => response.data?.access_token);
  }

  export async function signInBasicAuth({
    publicAddress,
    signature,
  }: {
    publicAddress: any;
    signature: any;
  }) {
    if (!publicAddress) {
      return;
    }
    const _publicAddress = publicAddress.toLowerCase();
    let basic: string = btoa(`${_publicAddress}:${signature}`);

    const headers = {
      Authorization: `Basic ${basic}`,
    };
    return axios
      .get(`${BACKEND_URL}/auth/basic-auth`,  { headers,  withCredentials: true })
      .then((response) => response.data?.access_token);
  }

  export async function signInV4({
    publicAddress,
    signature,
  }: {
    publicAddress: any;
    signature: any;
  }) {
    if (!publicAddress) {
      return;
    }
    const _publicAddress = publicAddress.toLowerCase();
    return axios
      .post(`${BACKEND_URL}/v4/auth`, {
        publicAddress: _publicAddress,
        signature,
      })
      .then((response) => response.data?.access_token);
  }

  export async function signInBasicAuthV4({
    publicAddress,
    signature,
  }: {
    publicAddress: any;
    signature: any;
  }) {
    if (!publicAddress) {
      return;
    }
    const _publicAddress = publicAddress.toLowerCase();
    let basic: string = btoa(`${_publicAddress}:${signature}`);

    const headers = {
      Authorization: `Basic ${basic}`,
    };
    return axios
      .get(`${BACKEND_URL}/v4/auth/basic-auth`, { headers,  withCredentials: true })
      .then((response) => response.data?.access_token);
  }

  export async function getMyUser() {
    const accessToken = getAccessToken();
    const BACKEND_URL = getBackendUrl();

    return axios
      .get(`${BACKEND_URL}/user`, { headers: { 'Authorization': `Bearer ${accessToken}` } })
      .then((response) => response.data)
      .catch(() => alert(`You aren't connect`));
  }
}
