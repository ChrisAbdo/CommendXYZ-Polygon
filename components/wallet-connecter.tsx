import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

export default function WalletConnector() {
  const address = useAddress();
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="default">
          {address ? (
            <span className="truncate">
              {address.slice(0, 5)}...{address.slice(-4)}
            </span>
          ) : (
            <span>Connect Wallet</span>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
            <ConnectWallet className="!bg-black dark:!bg-[#555]" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
