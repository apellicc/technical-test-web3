import { Link, NextUIProvider, Text } from "@nextui-org/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready ? (
        <NextUIProvider>
          <Link href="/" css={{ margin: "30px auto 0", display: "block" }}>
            <Text h1>Xborg Technical Test</Text>
          </Link>

          <Component {...pageProps} />
        </NextUIProvider>
      ) : null}
    </>
  );
}
