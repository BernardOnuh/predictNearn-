"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@/components/wallet-provider";
import { useWaitlist } from "@/hooks/useWaitlist";

// ── Tiny helper: copy text to clipboard ─────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return { copied, copy };
}

// ── Main Component ────────────────────────────────────────────────────────────
export function WaitlistPage() {
  const searchParams = useSearchParams();
  const incomingRef  = searchParams.get("ref") ?? "";

  const { address, isConnected, isMiniPay, connect } = useWallet();

  const {
    status, position, totalCount, error, txHash,
    referralLink, isContractDeployed,
    joinWaitlist,
  } = useWaitlist();

  const [email,        setEmail]        = useState("");
  const [referralCode, setReferralCode] = useState(incomingRef);
  const [emailError,   setEmailError]   = useState("");

  const { copied, copy } = useCopy();

  // Pre-fill referral code from URL
  useEffect(() => {
    if (incomingRef) setReferralCode(incomingRef);
  }, [incomingRef]);

  // ── Validation ────────────────────────────────────────────────────────────
  const validateEmail = (val: string) => {
    if (!val) return ""; // optional
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    return ok ? "" : "Enter a valid email address.";
  };

  const handleSubmit = async () => {
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }
    setEmailError("");
    await joinWaitlist(email, referralCode);
  };

  // ── Derived state ─────────────────────────────────────────────────────────
  const isJoining    = status === "joining";
  const isRegistered = status === "registered" || status === "success";
  const isChecking   = status === "checking";

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderBadge = () => {
    if (!isContractDeployed) return (
      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-2.5 mb-6 flex items-center gap-2">
        <span className="text-yellow-400 text-sm">⚠️</span>
        <p className="text-xs text-yellow-400">
          Contract not deployed — set{" "}
          <code className="font-mono">NEXT_PUBLIC_CONTRACT_ADDRESS</code>
        </p>
      </div>
    );
    return null;
  };

  // ── SUCCESS STATE ─────────────────────────────────────────────────────────
  if (isRegistered) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
        <div className="max-w-sm w-full space-y-5">

          {/* Trophy card */}
          <div className="rounded-3xl border border-primary/30 bg-primary/5 px-6 py-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              You&apos;re on the list!
            </h1>
            <p className="text-sm text-muted-foreground">
              You&apos;re{" "}
              <span className="text-primary font-bold text-lg">
                #{position}
              </span>{" "}
              of{" "}
              <span className="font-semibold">{totalCount}</span> on the
              PredictEarn waitlist.
            </p>
          </div>

          {/* Referral card */}
          {referralLink && (
            <div className="rounded-2xl border border-border bg-card px-5 py-5">
              <p className="text-[11px] tracking-widest uppercase text-muted-foreground mb-2">
                Your referral link
              </p>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Share this link to move up the waitlist faster.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs font-mono text-muted-foreground truncate">
                  {referralLink}
                </div>
                <button
                  onClick={() => copy(referralLink)}
                  className="px-3 py-2 rounded-xl text-xs font-bold border border-border hover:bg-muted transition-colors shrink-0"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {/* Tx link */}
          {txHash && (
            <p className="text-center text-xs text-muted-foreground">
              TX:{" "}
              <a
                href={`https://explorer.celo.org/mainnet/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 font-mono"
              >
                {txHash.slice(0, 10)}…
              </a>
            </p>
          )}

          {/* Back link */}
          <div className="text-center">
            <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">
              ← Back to PredictEarn
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN FORM ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="max-w-sm w-full space-y-5">

        {/* Hero */}
        <div className="text-center pt-6 pb-2">
          <div className="text-4xl mb-3">⚽</div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            PredictEarn
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The on-chain football prediction market on Celo.
            <br />
            Bet with cUSD. Win real rewards.
          </p>
        </div>

        {/* Stats pill */}
        {totalCount > 0 && (
          <div className="flex justify-center">
            <div className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              🔥 {totalCount.toLocaleString()} people already on the waitlist
            </div>
          </div>
        )}

        {renderBadge()}

        {/* ── NOT CONNECTED ── */}
        {!isConnected && !isMiniPay ? (
          <div className="rounded-3xl border border-border bg-card px-6 py-8 text-center space-y-4">
            <div className="text-3xl">👛</div>
            <div>
              <p className="font-bold text-sm mb-1">Connect your wallet to join</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We use your wallet address as your unique identity on-chain. No
                personal data required.
              </p>
            </div>
            <button
              onClick={connect}
              className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          /* ── CONNECTED FORM ── */
          <div className="rounded-3xl border border-border bg-card px-6 py-6 space-y-5">

            {/* Wallet display */}
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3">
              <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
              <span className="text-xs font-mono text-muted-foreground truncate">
                {address}
              </span>
            </div>

            {/* Checking spinner */}
            {isChecking && (
              <p className="text-xs text-muted-foreground text-center animate-pulse">
                Checking your waitlist status…
              </p>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-[11px] tracking-widest uppercase text-muted-foreground block">
                Email{" "}
                <span className="normal-case text-muted-foreground/60">
                  (optional)
                </span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(validateEmail(e.target.value));
                }}
                placeholder="you@example.com"
                disabled={isJoining}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 transition"
              />
              {emailError && (
                <p className="text-xs text-red-400">{emailError}</p>
              )}
              <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                Only used to notify you at launch. Stored on-chain — omit if
                you prefer privacy.
              </p>
            </div>

            {/* Referral code field */}
            <div className="space-y-1.5">
              <label className="text-[11px] tracking-widest uppercase text-muted-foreground block">
                Referral code{" "}
                <span className="normal-case text-muted-foreground/60">
                  (optional)
                </span>
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="e.g. a1b2c3d4"
                disabled={isJoining || !!incomingRef}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 transition font-mono"
              />
              {incomingRef && (
                <p className="text-xs text-primary">
                  ✓ Referral code applied
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleSubmit}
              disabled={isJoining || isChecking || !isContractDeployed}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isJoining ? "Joining…" : "Join the Waitlist"}
            </button>

            <p className="text-[11px] text-center text-muted-foreground/60 leading-relaxed">
              One entry per wallet. No gas fees beyond the Celo network cost.
            </p>
          </div>
        )}

        {/* Feature teasers */}
        <div className="grid grid-cols-3 gap-3 pb-8">
          {[
            { icon: "⚡", label: "Leverage Mode", sub: "Up to 100×" },
            { icon: "🏆", label: "Leaderboard", sub: "Climb the ranks" },
            { icon: "💵", label: "cUSD Payouts", sub: "Instant claims" },
          ].map(({ icon, label, sub }) => (
            <div
              key={label}
              className="rounded-2xl border border-border bg-card px-3 py-4 text-center"
            >
              <div className="text-xl mb-1">{icon}</div>
              <p className="text-[11px] font-bold leading-tight">{label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}