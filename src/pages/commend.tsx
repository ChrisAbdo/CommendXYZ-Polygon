"use client";

import React from "react";
import { useAddress } from "@thirdweb-dev/react";
import Web3 from "web3";
import Commend from "@/backend/build/contracts/Commend.json";
import NFT from "@/backend/build/contracts/NFT.json";
import axios from "axios";
import { useToast } from "@/lib/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import {
  BarChart,
  Clock,
  Home,
  Menu,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
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

const teams = [
  { name: "Developer", href: "#", bgColorClass: "bg-indigo-500" },
  { name: "Designer", href: "#", bgColorClass: "bg-yellow-500" },
  { name: "Marketer", href: "#", bgColorClass: "bg-pink-500" },
  { name: "Project Manager", href: "#", bgColorClass: "bg-blue-500" },
  { name: "Influencer", href: "#", bgColorClass: "bg-green-500" },

  { name: "Community Manager", href: "#", bgColorClass: "bg-red-500" },
  { name: "Content Creator", href: "#", bgColorClass: "bg-purple-500" },
];
const projects = [
  {
    id: 1,
    title: "GraphQL API",
    initials: "GA",
    team: "Engineering",
    members: [
      {
        name: "Dries Vincent",
        handle: "driesvincent",
        imageUrl:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        name: "Lindsay Walton",
        handle: "lindsaywalton",
        imageUrl:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        name: "Courtney Henry",
        handle: "courtneyhenry",
        imageUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        name: "Tom Cook",
        handle: "tomcook",
        imageUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
    ],
    totalMembers: 12,
    lastUpdated: "March 17, 2020",
    pinned: true,
    bgColorClass: "bg-green-500",
  },
  {
    id: 2,
    title: "GraphQL API",
    initials: "GA",
    team: "Engineering",
    members: [
      {
        name: "Dries Vincent",
        handle: "driesvincent",
        imageUrl:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        name: "Lindsay Walton",
        handle: "lindsaywalton",
        imageUrl:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        name: "Courtney Henry",
        handle: "courtneyhenry",
        imageUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        name: "Tom Cook",
        handle: "tomcook",
        imageUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
    ],
    totalMembers: 12,
    lastUpdated: "March 17, 2020",
    pinned: false,
    bgColorClass: "bg-pink-600",
  },
  // More projects...
];
const pinnedProjects = projects.filter((project) => project.pinned);

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const SHEET_POSITIONS = ["top", "right", "bottom", "left"] as const;

type SheetPosition = typeof SHEET_POSITIONS[number];

export default function CommendPage() {
  const address = useAddress();
  const [nfts, setNfts] = React.useState([]);
  const [commendCount, setCommendCount] = React.useState(0);
  const [commendDescription, setCommendDescription] = React.useState("");
  const [commendAddress, setCommendAddress] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [roleQuery, setRoleQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedNFT, setSelectedNFT] = React.useState(null);
  const [selectedNFTCommends, setSelectedNFTCommends] = React.useState(null);
  const [ensOpen, setEnsOpen] = React.useState(false);
  const [pinnedProjectHandler, setPinnedProjectHandler] = React.useState(true);

  const [videoMounted, setVideoMounted] = React.useState(false);

  const cancelButtonRef = React.useRef(null);
  const filteredItems =
    query === ""
      ? nfts
      : nfts.filter(
          (item) =>
            // @ts-ignore
            item.walletAddress.toLowerCase().includes(query.toLowerCase()) ||
            // @ts-ignore
            item.role.toLowerCase().includes(query.toLowerCase()) ||
            // @ts-ignore
            item.altName.toLowerCase().includes(query.toLowerCase())
        );

  const { toast } = useToast();

  React.useEffect(() => {
    loadSongs();

    setVideoMounted(true);
  }, []);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.metaKey && event.key === "k") {
        // @ts-ignore
        document.getElementById("search").focus();
        event.preventDefault();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function loadSongs() {
    console.log("Loading songs...");
    // @ts-ignore
    const web3 = new Web3(window.ethereum);

    const networkId = await web3.eth.net.getId();

    // Get all listed NFTs
    const radioContract = new web3.eth.Contract(
      // @ts-ignore
      Commend.abi,
      // @ts-ignore
      Commend.networks[networkId].address
    );
    const listings = await radioContract.methods.getListedNfts().call();
    // Iterate over the listed NFTs and retrieve their metadata
    const nfts = await Promise.all(
      listings.map(async (i: any) => {
        try {
          const NFTContract = new web3.eth.Contract(
            // @ts-ignore
            NFT.abi,
            // @ts-ignore
            NFT.networks[networkId].address
          );
          const tokenURI = await NFTContract.methods.tokenURI(i.tokenId).call();
          const meta = await axios.get(tokenURI);
          const descriptions = i.descriptions;
          const commendationAddresses = i.addressCommender;
          const commendations = i.commendations; // Retrieve the commendations array from the smart contract

          const nft = {
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.buyer,
            role: meta.data.role,
            walletAddress: meta.data.walletAddress,
            coverImage: meta.data.coverImage,
            commendCount: i.commendCount,
            description: descriptions,
            commendAddress: commendationAddresses,
            altName: meta.data.altName,
            commendations: commendations, // Include the commendations array in the metadata for the NFT
          };
          return nft;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );
    // setNfts(nfts.filter((nft) => nft !== null));

    // set nfts in order of heatCount
    const sortedNfts = nfts
      .filter((nft) => nft !== null)
      .sort((a, b) => b.commendCount - a.commendCount);
    const topThreeNfts = sortedNfts.slice(0, 5);

    // @ts-ignore
    setNfts(sortedNfts);
  }

  async function handleGiveHeat(nft: any) {
    // Get an instance of the Radio contract
    toast({
      title: "Giving Commend...",
      description: "Please confirm the transaction in your wallet.",
    });
    try {
      setLoading(true);
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const radioContract = new web3.eth.Contract(
        // @ts-ignore
        Commend.abi,
        // @ts-ignore
        Commend.networks[networkId].address
      );

      radioContract.methods
        .giveCommend(nft.tokenId, 1, commendDescription, commendAddress)
        .send({
          // @ts-ignore
          from: window.ethereum.selectedAddress,

          value: web3.utils.toWei("0.001", "ether"),
        })
        .on("receipt", function () {
          console.log("listed");
          toast({
            title: "Successfully gave Commend",
            description: "Thanks for improving the community.",
          });
          setLoading(false);

          // wait 1 second and reload the page
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
    } catch (err) {
      console.log(err);
    }
  }
  const [position, setPosition] = React.useState<SheetPosition>("left");
  return (
    <div className="min-h-full">
      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 dark:lg:border-[#555] lg:bg-gray-100 dark:lg:bg-[#111] lg:pt-5 lg:pb-4">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="mt-5 flex h-0 flex-1 flex-col overflow-y-auto pt-1">
          {/* User account dropdown */}

          {/* Navigation */}
          <nav className="mt-6 px-3">
            <div className="mt-8">
              {/* Secondary navigation */}
              <div className="mb-4">
                {roleQuery && (
                  <span
                    className={`inline-flex items-center rounded-full py-0.5 pl-2.5 pr-1 text-sm font-medium ${
                      roleQuery === "Developer"
                        ? "bg-indigo-500 text-white"
                        : roleQuery === "Designer"
                        ? "bg-yellow-500 text-white"
                        : roleQuery === "Influencer"
                        ? "bg-green-500 text-white"
                        : roleQuery === "Community Manager"
                        ? "bg-red-500 text-white"
                        : roleQuery === "Marketer"
                        ? "bg-pink-500 text-white"
                        : roleQuery === "Content Creator"
                        ? "bg-purple-500 text-white"
                        : roleQuery === "Project Manager"
                        ? "bg-blue-500 text-white"
                        : "" /* add an empty string to complete the ternary operator */
                    }`}
                  >
                    {/* roleQuery */}
                    {roleQuery}
                    <button
                      type="button"
                      onClick={() => {
                        setRoleQuery("");
                        setQuery("");
                      }}
                      className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-black  hover:text-black/80 hover:text-indigo-500 focus:bg-gray-200 focus:text-white focus:outline-none"
                    >
                      <span className="sr-only">Remove large option</span>
                      <svg
                        className="h-2 w-2"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 8 8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeWidth="1.5"
                          d="M1 1l6 6m0-6L1 7"
                        />
                      </svg>
                    </button>
                  </span>
                )}
              </div>

              <h3
                className="px-3 text-sm font-medium text-black dark:text-white"
                id="desktop-teams-headline"
              >
                Filter by Role
              </h3>
              <div
                className="mt-1 space-y-1"
                role="group"
                aria-labelledby="desktop-teams-headline"
              >
                {teams.map((team) => (
                  <div
                    key={team.name}
                    onClick={() => {
                      setQuery(team.name);
                      setRoleQuery(team.name);
                    }}
                    className="cursor-pointer group flex items-center rounded-md px-3 py-2 text-sm font-medium text-black dark:text-white hover:bg-gray-50 dark:hover:bg-[#333] hover:text-gray-900"
                  >
                    <span
                      className={classNames(
                        team.bgColorClass,
                        "mr-4 h-2.5 w-2.5 rounded-full"
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{team.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </div>
      {/* Main column */}
      <div className="flex flex-col lg:pl-64">
        {/* Search header */}

        <main className="flex-1">
          {/* Pinned projects */}
          {pinnedProjectHandler && (
            <motion.div
              className="mt-6 px-4 sm:px-6 lg:px-8"
              exit={{ opacity: 0, y: 50 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div role="list" className="mt-3">
                <div className="relative col-span-1 flex rounded-md shadow-sm">
                  <div className="bg-green-500 flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"></div>
                  <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white dark:bg-[#333] dark:border-[#555]">
                    <div className="flex-1 truncate px-4 py-2 text-sm">
                      <X
                        onClick={() => setPinnedProjectHandler(false)}
                        className="cursor-pointer h-5 w-5 text-gray-400 text-right float-right"
                      />
                      <h1 className="font-medium text-black dark:text-white hover:text-gray-600">
                        Hello! Welcome to Commend.
                      </h1>
                      <p className="text-gray-500 dark:text-[#999]">
                        To see a quick demo of how to work around the app, click
                        the button below! If youre reading this, I appreciate
                        you so much.
                      </p>
                      {/* <Button variant="outline" className="mt-2">
                      View Demo
                    </Button> */}
                      {videoMounted && (
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button variant="outline" className="mt-2">
                              View Demo
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                https://www.youtube.com/watch?v=K_h6ESbkNd8
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Projects list (only on smallest breakpoint) */}
          <div className="mt-10 sm:hidden">
            <div className="sticky top-0 z-10 justify-between flex h-16 flex-shrink-0   bg-white dark:bg-[#111] lg:hidden">
              <div className="px-4 sm:px-6 lg:px-8">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    </Button>
                  </SheetTrigger>
                  <SheetContent position={position} size="xl">
                    <SheetHeader>
                      <SheetTitle>Edit profile</SheetTitle>
                      <SheetDescription>
                        Make changes to your profile here. Click save when youre
                        done.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Username
                        </Label>
                      </div>
                    </div>
                    <SheetFooter>
                      <Button type="submit">Save changes</Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
              <div className="flex  justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1">
                  <div>
                    <div className="relative flex items-center">
                      {/* <input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Search"
                  className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                /> */}
                      <Input className="w-full" placeholder="Quick Search" />
                      <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                        <kbd className="inline-flex items-center rounded border border-gray-200 dark:border-[#555] px-1 font-sans text-xs text-gray-400 dark:text-[#777]">
                          ⌘K
                        </kbd>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {/* Profile dropdown */}
                </div>
              </div>
            </div>
            <div className="px-4 sm:px-6">
              <h2 className="text-sm font-medium text-black dark:text-white">
                Projects
              </h2>
            </div>
            <ul
              role="list"
              className="mt-3 divide-y divide-gray-100 border-t border-gray-200"
            >
              {/* {projects.map((project) => ( */}
              {filteredItems.length
                ? filteredItems.map((nft, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 sm:px-6"
                      >
                        <span className="flex items-center space-x-3 truncate">
                          <span className="truncate text-sm font-medium leading-6">
                            {/* @ts-ignore */}
                            {nft.walletAddress}
                          </span>
                        </span>
                        &rarr;
                      </a>
                    </li>
                  ))
                : null}
            </ul>
          </div>

          {/* Projects table (small breakpoint and up) */}
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="mt-8 flow-root">
              <div>
                <div className="relative mt-2 flex items-center">
                  {/* <input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Search"
                  className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                /> */}
                  <Input
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full"
                    placeholder="Quick Search"
                    id="search"
                  />
                  <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                    <kbd className="inline-flex items-center rounded border border-gray-200 dark:border-[#555] px-1 font-sans text-xs text-gray-400 dark:text-[#777]">
                      ⌘K
                    </kbd>
                  </div>
                </div>
              </div>
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-[#777]">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black dark:text-white sm:pl-0"
                        >
                          Name / Wallet Address
                        </th>

                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-black dark:text-white"
                        >
                          Role
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-black dark:text-white"
                        >
                          Reviews
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-[#555] bg-white dark:bg-[#111]">
                      {filteredItems.length
                        ? filteredItems.map((nft, index) => (
                            <tr key={index}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0">
                                    <Image
                                      className="h-10 w-10 rounded-md"
                                      // @ts-ignore
                                      src={nft.coverImage}
                                      alt=""
                                      width={40}
                                      height={40}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="font-medium text-black dark:text-white">
                                      {/* @ts-ignore */}
                                      {nft.altName}
                                    </div>
                                    <div className="text-black dark:text-white">
                                      {/* @ts-ignore */}
                                      {nft.walletAddress}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <span
                                  onClick={() => {
                                    // @ts-ignore
                                    setQuery(nft.role);
                                    // @ts-ignore
                                    setRoleQuery(nft.role);
                                  }}
                                  className={`cursor-pointer inline-flex rounded-md px-2 text-xs font-semibold leading-5 ${
                                    // @ts-ignore
                                    nft.role === "Developer"
                                      ? "bg-indigo-500 text-white"
                                      : // @ts-ignore
                                      nft.role === "Designer"
                                      ? "bg-yellow-500 text-white"
                                      : // @ts-ignore
                                      nft.role === "Influencer"
                                      ? "bg-green-500 text-white"
                                      : // @ts-ignore
                                      nft.role === "Community Manager"
                                      ? "bg-red-500 text-white"
                                      : // @ts-ignore
                                      nft.role === "Marketer"
                                      ? "bg-pink-500 text-white"
                                      : // @ts-ignore
                                      nft.role === "Content Creator"
                                      ? // @ts-ignore
                                        "bg-purple-500 text-white"
                                      : // @ts-ignore
                                      nft.role === "Project Manager"
                                      ? "bg-blue-500 text-white"
                                      : "" /* add an empty string to complete the ternary operator */
                                  }`}
                                >
                                  {/* @ts-ignore */}
                                  {nft.role}
                                </span>
                              </td>

                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {/*  */}
                                <AlertDialog>
                                  <AlertDialogTrigger>
                                    <Button variant="outline" size="sm">
                                      {/* @ts-ignore */}
                                      {nft.commendCount} Reviews
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        {/* @ts-ignore */}
                                        {nft.altName}&apos;s Reviews
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        <ScrollArea className="h-[400px] rounded-md">
                                          {/* @ts-ignore */}
                                          {nft.description.map(
                                            (desc: any, index: any) => (
                                              <React.Fragment key={index}>
                                                <div className="w-full bg-gray-100 dark:bg-[#555] transition duration-2 hover:bg-gray-200 dark:hover:bg-[#555]/80 rounded-lg p-2">
                                                  <p className="text-xs text-gray-500 dark:text-white">
                                                    {/* {
                                                        nft.commendAddress[
                                                          index
                                                        ]
                                                      } */}
                                                    {/* slice the commendaddress */}
                                                    From: {/* @ts-ignore */}
                                                    {nft.commendAddress[
                                                      index
                                                    ].slice(0, 5) +
                                                      "..." +
                                                      // @ts-ignore
                                                      nft.commendAddress[
                                                        index
                                                      ].slice(-4)}
                                                  </p>
                                                  <p className="text-sm text-black dark:text-white">
                                                    {desc}
                                                  </p>
                                                </div>
                                                {index <
                                                  // @ts-ignore
                                                  nft.description.length -
                                                    1 && <br />}
                                              </React.Fragment>
                                            )
                                          )}
                                        </ScrollArea>
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Close
                                      </AlertDialogCancel>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </td>

                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                {/* <Button variant="default" size="sm">
                                  Commend
                                </Button> */}
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="default" size="sm">
                                      Commend
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>
                                        {" "}
                                        {/* @ts-ignore */}
                                        Give Commend to {nft.altName}
                                      </DialogTitle>
                                      <DialogDescription>
                                        Give a commend to this person for their
                                        work in the community.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <Label htmlFor="email-2">
                                      Wallet Address / Nickname / ENS
                                    </Label>
                                    <Input
                                      type="text"
                                      id="email-2"
                                      placeholder="0x..."
                                      onChange={(e) => {
                                        setCommendAddress(e.target.value);
                                      }}
                                    />

                                    <Label htmlFor="username">
                                      Write Your Commend
                                    </Label>
                                    <Textarea
                                      className=""
                                      onChange={(event) =>
                                        setCommendDescription(
                                          event.target.value
                                        )
                                      }
                                      placeholder="Type your message here. It should be a brief description of how this person has helped you or the community."
                                    />
                                    <DialogFooter>
                                      <Button
                                        onClick={() => {
                                          handleGiveHeat(nft);
                                        }}
                                        type="submit"
                                      >
                                        Give Commend
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </td>
                            </tr>
                          ))
                        : [...Array(3)].map((_, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, y: -50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.1, delay: index * 0.1 }}
                            >
                              <td className="w-full max-w-0 whitespace-nowrap py-3 text-sm font-medium text-gray-900">
                                <div className="flex items-center space-x-3">
                                  <div className="bg-gray-200 dark:bg-[#333] w-10 h-10 animate-pulse rounded-md"></div>
                                  <div className="bg-gray-200 dark:bg-[#333] w-80 h-8 animate-pulse rounded-md"></div>
                                </div>
                              </td>
                              <td className="px-6 py-3 text-sm font-medium text-gray-500">
                                <div className="flex items-center space-x-2">
                                  <div className="flex flex-shrink-0 -space-x-1">
                                    <div className="bg-gray-200 dark:bg-[#333] w-20 h-8 animate-pulse rounded-md"></div>
                                  </div>
                                </div>
                              </td>
                              <td className="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">
                                <div className="bg-gray-200 dark:bg-[#333] w-20 h-8 animate-pulse rounded-md"></div>
                              </td>
                              <td className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium">
                                <div className="space-x-2 flex">
                                  <div className="bg-gray-200 dark:bg-[#333] w-18 h-8 animate-pulse rounded-md"></div>
                                  <div className="bg-gray-200 dark:bg-[#333] w-18 h-8 animate-pulse rounded-md"></div>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
