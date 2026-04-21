"use client";

import { useState, useEffect, useCallback } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import type { Address } from "viem";
import { useWallet } from "@/components/wallet-provider";

// ── ABI ─────────────────────────────────────────────────────────────────────
const WAITLIST_ABI = [
  {
    name: "joinWaitlist",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "email", type: "string" },
      { name: "referralCode", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "isOnWaitlist",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "wallet", type: "address" }],
    outputs: [{ type: "bool" }],
  },
  {
    name: "getWaitlistPosition",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "wallet", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "waitlistCount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
] as const;

// ✅ Proper contract typing
const CONTRACT_ADDRESS: Address =
  "";

export type WaitlistStatus =
  | "idle"
  | "checking"
  | "not-registered"
  | "registered"
  | "joining"
  | "success"
  | "error";

export function useWaitlist() {
  const { address, isConnected } = useWallet();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [status, setStatus] = useState<WaitlistStatus>("idle");
  const [position, setPosition] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // ── Read ─────────────────────────────────────────────────────────────────
  const checkStatus = useCallback(async () => {
    if (!address || !publicClient) return;

    setStatus("checking");
    setError(null);

    try {
      const [isOn, count] = await Promise.all([
        publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: WAITLIST_ABI,
          functionName: "isOnWaitlist",
          args: [address as Address], // ✅ FIX
        }),
        publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: WAITLIST_ABI,
          functionName: "waitlistCount",
        }),
      ]);

      setTotalCount(Number(count));

      if (isOn) {
        const pos = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: WAITLIST_ABI,
          functionName: "getWaitlistPosition",
          args: [address as Address], // ✅ FIX
        });

        setPosition(Number(pos));
        setStatus("registered");
      } else {
        setPosition(null);
        setStatus("not-registered");
      }
    } catch (err) {
      console.error("Waitlist check failed:", err);
      setError("Failed to check waitlist status.");
      setStatus("error");
    }
  }, [address, publicClient]);

  // ── Write ────────────────────────────────────────────────────────────────
  const joinWaitlist = useCallback(
    async (email: string, referralCode: string) => {
      if (!walletClient || !publicClient || !address) {
        setError("Wallet not connected or contract not configured.");
        return;
      }

      setStatus("joining");
      setError(null);
      setTxHash(null);

      try {
        const hash = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi: WAITLIST_ABI,
          functionName: "joinWaitlist",
          args: [email.trim(), referralCode.trim()],
        });

        setTxHash(hash);

        await publicClient.waitForTransactionReceipt({ hash });

        const [pos, count] = await Promise.all([
          publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: WAITLIST_ABI,
            functionName: "getWaitlistPosition",
            args: [address as Address], // ✅ FIX
          }),
          publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: WAITLIST_ABI,
            functionName: "waitlistCount",
          }),
        ]);

        setPosition(Number(pos));
        setTotalCount(Number(count));
        setStatus("success");
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Transaction failed.";

        if (msg.includes("Already on waitlist")) {
          setError("This wallet is already on the waitlist.");
        } else if (msg.toLowerCase().includes("user rejected")) {
          setError("Transaction cancelled.");
        } else {
          setError(msg.slice(0, 120));
        }

        setStatus("error");
      }
    },
    [walletClient, publicClient, address]
  );

  // ── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isConnected && address) {
      checkStatus();
    } else {
      setStatus("idle");
      setPosition(null);
    }
  }, [isConnected, address, checkStatus]);

  // ── Referral ─────────────────────────────────────────────────────────────
  const referralLink =
    typeof window !== "undefined" && address
      ? `${window.location.origin}/waitlist?ref=${address.slice(2, 10)}`
      : null;

  return {
    status,
    position,
    totalCount,
    error,
    txHash,
    referralLink,
    isContractDeployed: !!CONTRACT_ADDRESS,
    joinWaitlist,
    refresh: checkStatus,
  };
}