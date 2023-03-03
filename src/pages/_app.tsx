import "@/src/styles/globals.css";
import type { AppProps } from "next/app";

import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

import Navbar from "@/components/navbar";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";

const activeChainId = ChainId.Mumbai;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div suppressHydrationWarning>
      <ThirdwebProvider activeChain={activeChainId}>
        <ThemeProvider>
          <Navbar />
          <Component {...pageProps} />
          <Toaster />
        </ThemeProvider>
      </ThirdwebProvider>
    </div>
  );
}
