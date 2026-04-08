"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@/components/wallet-provider";
import { useWaitlist } from "@/hooks/useWaitlist";

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

export function WaitlistPage() {
  const searchParams = useSearchParams();
  const incomingRef = searchParams.get("ref") ?? "";

  const { address, isConnected, isMiniPay, connect } = useWallet();
  const {
    status, position, totalCount, error, txHash,
    referralLink, isContractDeployed, joinWaitlist,
  } = useWaitlist();

  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState(incomingRef);
  const [emailError, setEmailError] = useState("");

  const { copied, copy } = useCopy();

  useEffect(() => {
    if (incomingRef) setReferralCode(incomingRef);
  }, [incomingRef]);

  const validateEmail = (val: string) => {
    if (!val) return "";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "" : "Enter a valid email address.";
  };

  const handleSubmit = async () => {
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }
    setEmailError("");
    await joinWaitlist(email, referralCode);
  };

  const isJoining    = status === "joining";
  const isRegistered = status === "registered" || status === "success";
  const isChecking   = status === "checking";

  // ── SUCCESS STATE ──────────────────────────────────────────────────────────
  if (isRegistered) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
        style={{ background: "#0a0f1e", fontFamily: "var(--font-sans)" }}>

        <PitchBackground />

        <div className="relative z-10 max-w-sm w-full space-y-5 py-10">
          {/* Trophy */}
          <div className="rounded-3xl px-6 py-8 text-center"
            style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="text-5xl mb-4" style={{ animation: "float 2.5s ease-in-out infinite" }}>🏆</div>
            <h1 className="text-2xl font-medium tracking-tight mb-2 text-white">You&apos;re on the list!</h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              You&apos;re{" "}
              <span className="font-medium text-lg" style={{ color: "#00e676" }}>#{position}</span>
              {" "}of <span className="font-medium text-white">{totalCount}</span> on the PredictEarn waitlist.
            </p>
            <div className="mt-4 inline-block rounded-full px-5 py-2 text-sm font-medium"
              style={{ background: "rgba(0,230,118,0.12)", border: "1px solid rgba(0,230,118,0.3)", color: "#00e676" }}>
              Locked in &amp; ready to predict
            </div>
          </div>

          {/* Referral */}
          {referralLink && (
            <div className="rounded-2xl px-5 py-5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
              <p className="text-xs mb-1 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                Your referral link
              </p>
              <p className="text-xs mb-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                Share to climb the waitlist faster.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-xl px-3 py-2 text-xs font-mono truncate"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}>
                  {referralLink}
                </div>
                <button onClick={() => copy(referralLink)}
                  className="px-3 py-2 rounded-xl text-xs font-medium shrink-0 transition-all"
                  style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff", background: "transparent" }}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {txHash && (
            <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              TX:{" "}
              <a href={`https://explorer.celo.org/mainnet/tx/${txHash}`}
                target="_blank" rel="noopener noreferrer"
                className="font-mono underline underline-offset-2"
                style={{ color: "#00e676" }}>
                {txHash.slice(0, 10)}…
              </a>
            </p>
          )}

          <div className="text-center">
            <a href="/" className="text-xs underline underline-offset-2 transition-colors"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              ← Back to PredictEarn
            </a>
          </div>
        </div>

        <GlobalStyles />
      </div>
    );
  }

  // ── MAIN PAGE ──────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
      style={{ background: "#0a0f1e", fontFamily: "var(--font-sans)" }}>

      <PitchBackground />

      <div className="relative z-10 max-w-sm w-full pb-12">

        {/* Player silhouettes */}
        <div className="flex justify-around items-end w-full px-3" style={{ paddingTop: 18, marginBottom: -4 }}>
          <PlayerGoalkeeper />
          <PlayerStriker />
          <PlayerDefender />
        </div>

        {/* Pitch line */}
        <div style={{ width: "100%", height: 2, background: "linear-gradient(90deg,transparent,rgba(0,230,118,0.3),rgba(0,230,118,0.3),transparent)", marginBottom: 16 }} />

        {/* Hero */}
        <div className="text-center pb-2 px-2">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 text-xs font-medium"
            style={{ background: "rgba(0,230,118,0.12)", border: "1px solid rgba(0,230,118,0.3)", color: "#00e676", letterSpacing: "0.05em" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00e676", display: "inline-block", animation: "pulse-glow 1.4s ease-in-out infinite" }} />
            Waitlist open
          </div>
          <h1 className="text-3xl font-medium tracking-tight mb-2 text-white leading-tight">
            Predict. Bet. <span style={{ color: "#00e676" }}>Earn.</span>
            <br />On the blockchain.
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            The on-chain football prediction market on Celo.
            <br />Bet with cUSD · Win real rewards · Zero platform fees.
          </p>
        </div>

        {/* Ticker */}
        <OddsTicker />

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-2 mb-4 px-0">
          {[
            { n: totalCount > 0 ? totalCount.toLocaleString() : "4,218", color: "#00e676", label: "On waitlist" },
            { n: "100×", color: "#ffd740", label: "Max leverage" },
            { n: "cUSD", color: "#4fc3f7", label: "Instant payouts" },
          ].map(({ n, color, label }) => (
            <div key={label} className="rounded-2xl text-center py-3"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="text-xl font-medium" style={{ color }}>{n}</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Odds preview cards */}
        <OddsCards />

        {/* Contract warning */}
        {!isContractDeployed && (
          <div className="rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2"
            style={{ background: "rgba(255,215,64,0.07)", border: "1px solid rgba(255,215,64,0.2)" }}>
            <span className="text-sm">⚠️</span>
            <p className="text-xs" style={{ color: "#ffd740" }}>
              Contract not deployed — set{" "}
              <code className="font-mono">NEXT_PUBLIC_CONTRACT_ADDRESS</code>
            </p>
          </div>
        )}

        {/* Form card */}
        <div className="rounded-3xl px-6 py-6"
          style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}>

          {/* NOT CONNECTED */}
          {!isConnected && !isMiniPay ? (
            <div className="text-center space-y-4 py-2">
              <div className="text-4xl">👛</div>
              <div>
                <p className="font-medium text-sm mb-1 text-white">Connect your wallet to join</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                  We use your wallet address as your unique on-chain identity. No personal data required.
                </p>
              </div>
              <button onClick={connect}
                className="w-full py-3.5 rounded-xl font-medium text-sm transition-opacity relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#00e676 0%,#00bcd4 100%)", color: "#0a0f1e" }}>
                <ShimmerLayer />
                Connect Wallet
              </button>
            </div>
          ) : (
            /* CONNECTED FORM */
            <div className="space-y-4">
              {/* Wallet display */}
              <div className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: "rgba(0,230,118,0.07)", border: "1px solid rgba(0,230,118,0.2)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00e676", flexShrink: 0 }} />
                <span className="text-xs font-mono truncate" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {address}
                </span>
              </div>

              {isChecking && (
                <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.4)", animation: "pulse-glow 1.4s ease-in-out infinite" }}>
                  Checking your waitlist status…
                </p>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>
                  Email <span style={{ textTransform: "none", color: "rgba(255,255,255,0.25)" }}>(optional)</span>
                </label>
                <input type="email" value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(validateEmail(e.target.value)); }}
                  placeholder="you@example.com" disabled={isJoining}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all disabled:opacity-50"
                  style={{
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff", fontFamily: "inherit",
                  }} />
                {emailError && <p className="text-xs mt-1" style={{ color: "#ff6b6b" }}>{emailError}</p>}
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.25)", fontSize: 10 }}>
                  Only used to notify you at launch. Omit for full privacy.
                </p>
              </div>

              {/* Referral code */}
              <div>
                <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>
                  Referral code <span style={{ textTransform: "none", color: "rgba(255,255,255,0.25)" }}>(optional)</span>
                </label>
                <input type="text" value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="e.g. a1b2c3d4"
                  disabled={isJoining || !!incomingRef}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all disabled:opacity-50 font-mono"
                  style={{
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                  }} />
                {incomingRef && (
                  <p className="text-xs mt-1" style={{ color: "#00e676" }}>✓ Referral code applied</p>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl px-4 py-3" style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)" }}>
                  <p className="text-xs" style={{ color: "#ff6b6b" }}>{error}</p>
                </div>
              )}

              {/* CTA */}
              <button onClick={handleSubmit}
                disabled={isJoining || isChecking || !isContractDeployed}
                className="w-full py-3.5 rounded-xl font-medium text-sm transition-all relative overflow-hidden disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#00e676 0%,#00bcd4 100%)", color: "#0a0f1e" }}>
                <ShimmerLayer />
                {isJoining ? "Joining…" : "Join the Waitlist"}
              </button>

              <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.25)", fontSize: 10 }}>
                One entry per wallet · No extra gas fees beyond Celo network cost
              </p>
            </div>
          )}
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { icon: "⚡", label: "Leverage Mode", sub: "Up to 100×" },
            { icon: "🏆", label: "Leaderboard",   sub: "Climb ranks" },
            { icon: "💵", label: "cUSD Payouts",  sub: "Instant claims" },
            { icon: "🔒", label: "Non-custodial", sub: "Your keys" },
            { icon: "🌍", label: "Global Markets",sub: "50+ leagues" },
            { icon: "📊", label: "Live Odds",     sub: "Real-time" },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="rounded-2xl py-3 px-2 text-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="text-lg mb-1">{icon}</div>
              <p className="font-medium text-white" style={{ fontSize: 10, lineHeight: 1.3 }}>{label}</p>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>

      <GlobalStyles />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function PitchBackground() {
  return (
    <>
      {/* Grid lines */}
      <div className="absolute inset-0 z-0" style={{
        background: `
          repeating-linear-gradient(90deg,  rgba(255,255,255,.03) 0, rgba(255,255,255,.03) 1px, transparent 1px, transparent 80px),
          repeating-linear-gradient(180deg, rgba(255,255,255,.03) 0, rgba(255,255,255,.03) 1px, transparent 1px, transparent 80px)
        `,
      }} />
      {/* Centre circle */}
      <div className="absolute rounded-full pointer-events-none" style={{
        width: 340, height: 340,
        border: "1.5px solid rgba(0,255,120,0.08)",
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
      }} />
      {/* Colour blobs */}
      <div className="absolute rounded-full pointer-events-none" style={{ width: 420, height: 420, background: "#00e676", top: -120, right: -80,  filter: "blur(80px)", opacity: 0.18 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 360, height: 360, background: "#2979ff", bottom: -100, left: -80, filter: "blur(80px)", opacity: 0.18 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 260, height: 260, background: "#ffd740", top: "40%", left: "10%", filter: "blur(80px)", opacity: 0.13 }} />
    </>
  );
}

function OddsTicker() {
  const items = [
    "Man City vs Arsenal · 2.15",
    "Real Madrid vs PSG · 1.85",
    "Liverpool vs Chelsea · 2.40",
    "Dortmund vs Bayern · 3.10",
    "Barcelona vs Atletico · 1.95",
    "Ajax vs Inter · 2.55",
  ];
  const doubled = [...items, ...items];

  return (
    <div style={{ overflow: "hidden", margin: "10px 0 16px", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "8px 0" }}>
      <div style={{ display: "flex", whiteSpace: "nowrap", animation: "scroll-x 18s linear infinite" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.45)", padding: "0 28px" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ffd740", flexShrink: 0, display: "inline-block" }} />
            {item.split("·")[0]}·
            <span style={{ color: "#00e676", fontWeight: 500 }}>{item.split("·")[1]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function OddsCards() {
  const matches = [
    { league: "UCL · Live",   teams: "MCI vs ARS", odd: "2.15" },
    { league: "La Liga · FT", teams: "RMA vs PSG", odd: "1.85" },
    { league: "EPL · 78′",   teams: "LIV vs CHE", odd: "4.40" },
    { league: "Bundesliga",   teams: "BVB vs FCB", odd: "3.10" },
  ];
  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "2px 0 12px", scrollbarWidth: "none", marginBottom: 14 }}>
      {matches.map(({ league, teams, odd }) => (
        <div key={teams} style={{ flexShrink: 0, minWidth: 86, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "8px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.38)", whiteSpace: "nowrap" }}>{league}</div>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#fff", margin: "3px 0 2px", whiteSpace: "nowrap" }}>{teams}</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#ffd740" }}>{odd}</div>
        </div>
      ))}
    </div>
  );
}

function ShimmerLayer() {
  return (
    <span style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.25) 50%,transparent 100%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 2.4s infinite",
    }} />
  );
}

function PlayerGoalkeeper() {
  return (
    <div style={{ animation: "float 3s ease-in-out infinite" }}>
      <svg width="52" height="88" viewBox="0 0 52 88" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26" cy="10" r="9" fill="rgba(0,230,118,0.18)" />
        <rect x="18" y="20" width="16" height="28" rx="6" fill="rgba(0,230,118,0.18)" />
        <path d="M18 48 L10 78 H20 L26 58 L32 78 H42 L34 48 Z" fill="rgba(0,230,118,0.18)" />
        <path d="M18 30 L6 40" stroke="rgba(0,230,118,0.3)" strokeWidth="5" strokeLinecap="round" />
        <path d="M34 30 L46 38" stroke="rgba(0,230,118,0.3)" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function PlayerStriker() {
  return (
    <div style={{ animation: "float 3s ease-in-out infinite", animationDelay: "0.6s" }}>
      <svg width="60" height="92" viewBox="0 0 60 92" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="10" r="9" fill="rgba(255,215,64,0.22)" />
        <rect x="20" y="20" width="16" height="28" rx="6" fill="rgba(255,215,64,0.22)" />
        <path d="M20 48 L14 76 H24 L28 58 L32 76 H42 L36 48 Z" fill="rgba(255,215,64,0.22)" />
        <path d="M20 28 L8 22" stroke="rgba(255,215,64,0.35)" strokeWidth="5" strokeLinecap="round" />
        <path d="M36 28 L52 18" stroke="rgba(255,215,64,0.35)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="52" cy="60" r="8" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      </svg>
    </div>
  );
}

function PlayerDefender() {
  return (
    <div style={{ animation: "float 3s ease-in-out infinite", animationDelay: "1.2s" }}>
      <svg width="52" height="88" viewBox="0 0 52 88" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26" cy="10" r="9" fill="rgba(79,195,247,0.2)" />
        <rect x="18" y="20" width="16" height="28" rx="6" fill="rgba(79,195,247,0.2)" />
        <path d="M18 48 L10 78 H20 L26 58 L32 78 H42 L34 48 Z" fill="rgba(79,195,247,0.2)" />
        <path d="M18 30 L8 36" stroke="rgba(79,195,247,0.3)" strokeWidth="5" strokeLinecap="round" />
        <path d="M34 30 L44 36" stroke="rgba(79,195,247,0.3)" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      @keyframes pulse-glow { 0%,100%{opacity:1} 50%{opacity:.5} }
      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      @keyframes scroll-x { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      input::placeholder { color: rgba(255,255,255,0.25); }
      input:focus { border-color: rgba(0,230,118,0.45) !important; box-shadow: 0 0 0 3px rgba(0,230,118,0.08); }
      ::-webkit-scrollbar { display: none; }
    `}</style>
  );
}