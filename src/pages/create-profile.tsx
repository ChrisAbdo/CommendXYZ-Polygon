// @ts-nocheck
"use client";

import React from "react";
import Link from "next/link";
// Web3 Deps
import { useAddress } from "@thirdweb-dev/react";
import Web3 from "web3";
import Commend from "@/backend/build/contracts/Commend.json";
import NFT from "@/backend/build/contracts/NFT.json";

// UI Components
import { Loader2 } from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const ipfsClient = require("ipfs-http-client");
const projectId = "2FdliMGfWHQCzVYTtFlGQsknZvb";
const projectSecret = "2274a79139ff6fdb2f016d12f713dca1";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
const client = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default function CreateProfilePage() {
  const { toast } = useToast();

  const address = useAddress();

  const [isValid, setIsValid] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState<File | null>(null);
  const [formInput, updateFormInput] = React.useState({
    walletAddress: "",
    altName: "",
    role: "",
    coverImage: "",
  });
  const [addressListed, setAddressListed] = React.useState(false);
  const [fileUrl, setFileUrl] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    checkListed();
  }, []);

  function handleInput(event: any) {
    if (event.target === address) {
      // only validate if name is "walletAddress"
      setIsValid(true);
      console.log("Validated");
    } else {
      setIsValid(false);
      console.log("Not Validated");
    }
  }

  async function onChange(e: any) {
    // upload image to IPFS

    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog: any) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log(url);

      // @ts-ignore
      setFileUrl(url);
      updateFormInput({
        ...formInput,
        coverImage: url,
      });
      setProfileImage(file);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function uploadToIPFS() {
    const { walletAddress, altName, role, coverImage } = formInput;
    if (!walletAddress || !coverImage || !role || !altName) {
      return;
    } else {
      // first, upload metadata to IPFS
      const data = JSON.stringify({
        walletAddress,
        altName,
        role,
        coverImage,
      });
      try {
        const added = await client.add(data);
        const url = `https://ipfs.io/ipfs/${added.path}`;
        // after metadata is uploaded to IPFS, return the URL to use it in the transaction

        return url;
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    }
  }

  async function listNFTForSale() {
    toast({
      title: "Creating profile...",
      description: "Please confirm BOTH transactions in your wallet.",
    });
    try {
      setLoading(true);
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      const url = await uploadToIPFS();

      const networkId = await web3.eth.net.getId();

      // Mint the NFT
      // @ts-ignore
      const NFTContractAddress = NFT.networks[networkId].address;
      // @ts-ignore
      const NFTContract = new web3.eth.Contract(NFT.abi, NFTContractAddress);
      const accounts = await web3.eth.getAccounts();

      const commendContract = new web3.eth.Contract(
        // @ts-ignore
        Commend.abi,
        // @ts-ignore
        Commend.networks[networkId].address
      );

      NFTContract.methods
        .mint(url)
        .send({ from: accounts[0] })
        .on("receipt", function (receipt: any) {
          console.log("minted");
          // List the NFT
          const tokenId = receipt.events.NFTMinted.returnValues[0];
          commendContract.methods
            .listNft(NFTContractAddress, tokenId)
            .send({ from: accounts[0] })
            .on("receipt", function () {
              console.log("listed");
              toast({
                title: "Successfully created profile!",
                description:
                  "Your profile is now live. Find it in the commend page.",
              });
              setLoading(false);
            });
        });
    } catch (error) {
      console.log(error);
    }
  }

  async function checkListed() {
    try {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();

      const commendContract = new web3.eth.Contract(
        // @ts-ignore
        Commend.abi,
        // @ts-ignore
        Commend.networks[networkId].address
      );

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0]; // use the first account in the array

      const listed = await commendContract.methods.hasListedNft(account).call();

      console.log(listed);
      setAddressListed(listed);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      {addressListed ? (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              {/* <InformationCircleIcon
                className="h-5 w-5 text-blue-400"
                aria-hidden="true"
              /> */}
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-blue-700">
                You already have a profile! Consider commending someone or
                generating a{" "}
                <Link className="underline" href="/receive-commend">
                  receive page
                </Link>
                .
              </p>
              <p className="mt-3 text-sm md:mt-0 md:ml-6">
                <Link
                  href="/commend"
                  className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                >
                  Commend someone
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      ) : null}
      <div className=" px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-base font-semibold leading-6 text-black dark:text-white">
              Profile
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-[#eaeaea]">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>
          <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email-2">Wallet Address</Label>
              <Input
                onInput={handleInput}
                onChange={(e) => {
                  updateFormInput({
                    ...formInput,
                    walletAddress: e.target.value,
                  });
                  handleInput(e);
                }}
                type="text"
                name="name"
                placeholder="0x..."
                pattern={address}
                className="valid:[&:not(:placeholder-shown)]:border-[#555] [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400 block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <p className="text-sm text-black dark:text-white">
                Enter your wallet address
              </p>
              {isValid ? (
                <span className="mt-2 text-sm text-green-500">
                  You have been correctly identified as the owner of this
                  wallet.
                </span>
              ) : (
                <span className="mt-2 hidden text-sm text-red-400">
                  Please enter your wallet address. (you should be connected to
                  this wallet){" "}
                </span>
              )}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email-2">Alternate Name</Label>
              <Input
                onChange={(e) =>
                  updateFormInput({
                    ...formInput,
                    altName: e.target.value,
                  })
                }
                type="text"
                id="email-2"
                placeholder="abd0x.eth"
              />
              <p className="text-sm text-black dark:text-white">
                Do you go by a different name? Such as your ENS, nickname,
                twitter handle, etc.{" "}
                <span className="font-semibold">
                  If not, please enter your wallet address again.
                </span>
              </p>
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="role">
                Please select your role in the community
              </Label>
              <Select
                onValueChange={(value) =>
                  updateFormInput({ ...formInput, role: value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Designer">Designer</SelectItem>
                    <SelectItem value="Marketer">Marketer</SelectItem>
                    <SelectItem value="Project Manager">
                      Project Manager
                    </SelectItem>
                    <SelectItem value="Influencer">Influencer</SelectItem>
                    <SelectItem value="Community Manager">
                      Community Manager
                    </SelectItem>
                    <SelectItem value="Content Creator">
                      Content Creator
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-black dark:text-white">
                Profile Photo
              </label>
              <div className="mt-2 flex items-center space-x-5">
                {/* <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span> */}
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>:&#41;</AvatarFallback>
                </Avatar>
                {/* <button
                  type="button"
                  className="rounded-md bg-white dark:bg-[#333] py-1.5 px-2.5 text-sm font-semibold text-black dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-[#555] hover:bg-gray-50 dark:hover:bg-[#555]"
                >
                  Choose Avatar
                </button> */}

                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md px-2.5 py-2 bg-[#eaeaea] hover:bg-[#eaeaea]/80 dark:bg-[#333] dark:hover:bg-[#333]/80 font-medium text-black dark:text-white focus-within:outline-none focus-within:ring-2  "
                >
                  <span className="text-md">Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={onChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end px-4 sm:px-0 mt-4">
          {/* <Button onClick={listNFTForSale} variant="default" className="ml-3">
            Save
          </Button> */}
          {addressListed ? null : (
            <>
              {loading ? (
                <Button
                  variant="default"
                  onClick={listNFTForSale}
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  disabled={true}
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={listNFTForSale}
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Create Profile
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
