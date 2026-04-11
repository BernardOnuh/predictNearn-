"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@/components/wallet-provider";
import { useWaitlist } from "@/hooks/useWaitlist";

/* ── Google Fonts injected once ─────────────────────────────────────────── */
function FontLoader() {
  useEffect(() => {
    const id = "pe-font-link";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
  return null;
}

/* ── useCopy ────────────────────────────────────────────────────────────── */
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

/* ── Data ───────────────────────────────────────────────────────────────── */
const MATCHES = [
  { league: "UCL · Live",   teams: "MCI vs ARS", odd: "2.15", live: true  },
  { league: "La Liga · FT", teams: "RMA vs PSG", odd: "1.85", live: false },
  { league: "EPL · 78′",   teams: "LIV vs CHE", odd: "4.40", live: true  },
  { league: "Bundesliga",   teams: "BVB vs FCB", odd: "3.10", live: false },
  { league: "Ligue 1",      teams: "PSG vs LYN", odd: "1.60", live: false },
];

const TICKER_ITEMS = [
  "Man City vs Arsenal · 2.15",
  "Real Madrid vs PSG · 1.85",
  "Liverpool vs Chelsea · 4.40",
  "Dortmund vs Bayern · 3.10",
  "Barcelona vs Atletico · 1.95",
  "Ajax vs Inter · 2.55",
  "PSG vs Lyon · 1.60",
  "Napoli vs Roma · 2.80",
];

const FEATURES = [
  { icon: "⚡", name: "Leverage",      sub: "Up to 100×"     },
  { icon: "🏆", name: "Leaderboard",   sub: "Climb ranks"    },
  { icon: "💵", name: "cUSD Payouts",  sub: "Instant claims" },
  { icon: "🔒", name: "Non-custodial", sub: "Your keys"      },
  { icon: "🌍", name: "50+ Leagues",   sub: "Global markets" },
  { icon: "📊", name: "Live Odds",     sub: "Real-time"      },
];

/* ══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════ */
export function WaitlistPage() {
  const searchParams  = useSearchParams();
  const incomingRef   = searchParams.get("ref") ?? "";

  const { address, isConnected, isMiniPay, connect } = useWallet();
  const {
    status, position, totalCount, error, txHash,
    referralLink, isContractDeployed, joinWaitlist,
  } = useWaitlist();

  const [email,        setEmail       ] = useState("");
  const [referralCode, setReferralCode] = useState(incomingRef);
  const [emailError,   setEmailError  ] = useState("");

  const { copied, copy } = useCopy();

  useEffect(() => { if (incomingRef) setReferralCode(incomingRef); }, [incomingRef]);

  const validateEmail = (val: string) =>
    val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
      ? "Enter a valid email address."
      : "";

  const handleSubmit = async () => {
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }
    setEmailError("");
    await joinWaitlist(email, referralCode);
  };

  const isJoining    = status === "joining";
  const isRegistered = status === "registered" || status === "success";
  const isChecking   = status === "checking";

  /* ── SUCCESS STATE ────────────────────────────────────────────────────── */
  if (isRegistered) {
    return (
      <PageShell>
        <div style={{ padding: "32px 0", textAlign: "center" }}>
          <div style={styles.successBadge}>You&apos;re in</div>

          <div style={styles.successHeadline}>
            Locked<br />& loaded.
          </div>

          <div style={styles.successPos}>#{position}</div>
          <div style={styles.successPosLabel}>
            of <span style={{ color: "#fff" }}>{totalCount?.toLocaleString()}</span> on the waitlist
          </div>

          {referralLink && (
            <div style={styles.refBox}>
              <div style={styles.refLabel}>Your referral link — share to climb faster</div>
              <div style={styles.refRow}>
                <div style={styles.refLink}>{referralLink}</div>
                <button style={styles.copyBtn} onClick={() => copy(referralLink)}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {txHash && (
            <div style={styles.txLine}>
              TX:{" "}
              
                href={`https://explorer.celo.org/mainnet/tx/${txHash}`}
                target="_blank" rel="noopener noreferrer"
                style={styles.txAnchor}
              >
                {txHash.slice(0, 10)}…
              </a>
            </div>
          )}

          <div style={{ marginTop: 24 }}>
            <a href="/" style={styles.backLink}>← Back to PredictEarn</a>
          </div>
        </div>
      </PageShell>
    );
  }

  /* ── MAIN STATE ───────────────────────────────────────────────────────── */
  return (
    <PageShell>
      {/* HERO */}
      <div style={{ padding: "32px 0 24px" }}>
        <div style={styles.heroEyebrow}>On-chain football markets · Celo</div>
        <h1 style={styles.heroHeadline}>
          Predict.<br />Bet.<br /><span style={{ color: "#D4FF00" }}>Earn.</span>
        </h1>
        <p style={styles.heroSub}>
          The first on-chain football prediction market on Celo. Bet with cUSD,
          win real rewards — zero platform fees, fully non-custodial.
        </p>
      </div>

      {/* STATS */}
      <div style={styles.statRow}>
        <StatCell value={totalCount > 0 ? totalCount.toLocaleString() : "4,218"} label="On waitlist" accent />
        <StatCell value="100×"  label="Max leverage" />
        <StatCell value="cUSD"  label="Instant payouts" />
      </div>

      {/* TICKER */}
      <OddsTicker />

      {/* MATCH CARDS */}
      <MatchCards />

      {/* CONTRACT WARNING */}
      {!isContractDeployed && (
        <div style={styles.contractWarn}>
          <span>⚠️</span>
          <p style={{ fontSize: 12, color: "#FFD740", margin: 0 }}>
            Contract not deployed — set{" "}
            <code style={{ fontFamily: "monospace" }}>NEXT_PUBLIC_CONTRACT_ADDRESS</code>
          </p>
        </div>
      )}

      {/* FORM */}
      <div style={styles.formSection}>
        {!isConnected && !isMiniPay ? (
          /* NOT CONNECTED */
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <span style={{ fontSize: 36, display: "block", marginBottom: 12 }}>👛</span>
            <div style={styles.connectHeading}>Connect your wallet</div>
            <p style={styles.connectSub}>
              Your wallet is your identity on-chain.<br />No personal data required.
            </p>
            <button style={styles.ctaBtn} onClick={connect}>
              <ShimmerLayer />
              Connect Wallet
            </button>
          </div>
        ) : (
          /* CONNECTED */
          <div>
            <div style={styles.formTitle}>Secure your spot</div>
            <p style={styles.formSubtitle}>
              One entry per wallet. Referrals move you up the list.
            </p>

            {/* Wallet pill */}
            <div style={styles.walletRow}>
              <div style={styles.walletDot} />
              <span style={styles.walletAddr}>{address}</span>
            </div>

            {isChecking && (
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 12 }}>
                Checking your waitlist status…
              </p>
            )}

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={styles.fieldLabel}>
                Email{" "}
                <span style={{ textTransform: "none", color: "rgba(255,255,255,0.2)", fontWeight: 400 }}>
                  (optional)
                </span>
              </label>
              <input
                type="email" value={email} disabled={isJoining}
                onChange={(e) => { setEmail(e.target.value); setEmailError(validateEmail(e.target.value)); }}
                placeholder="you@example.com"
                style={styles.fieldInput}
              />
              {emailError && <p style={styles.fieldError}>{emailError}</p>}
              <p style={styles.fieldHint}>Only used to notify you at launch.</p>
            </div>

            {/* Referral */}
            <div style={{ marginBottom: 14 }}>
              <label style={styles.fieldLabel}>
                Referral code{" "}
                <span style={{ textTransform: "none", color: "rgba(255,255,255,0.2)", fontWeight: 400 }}>
                  (optional)
                </span>
              </label>
              <input
                type="text" value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="e.g. a1b2c3d4"
                disabled={isJoining || !!incomingRef}
                style={{ ...styles.fieldInput, fontFamily: "monospace" }}
              />
              {incomingRef && (
                <p style={{ ...styles.fieldHint, color: "#D4FF00" }}>✓ Referral code applied</p>
              )}
            </div>

            {/* API error */}
            {error && (
              <div style={styles.errorBox}>
                <p style={{ fontSize: 12, color: "#FF6B6B", margin: 0 }}>{error}</p>
              </div>
            )}

            <button
              style={{ ...styles.ctaBtn, opacity: isJoining || isChecking || !isContractDeployed ? 0.5 : 1 }}
              disabled={isJoining || isChecking || !isContractDeployed}
              onClick={handleSubmit}
            >
              <ShimmerLayer />
              {isJoining ? "Joining…" : "Join the Waitlist"}
            </button>

            <p style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Only Celo network gas applies
            </p>
          </div>
        )}
      </div>

      {/* FEATURES */}
      <div style={styles.featureGrid}>
        {FEATURES.map(({ icon, name, sub }) => (
          <div key={name} style={styles.featCard}>
            <span style={{ fontSize: 18, display: "block", marginBottom: 8 }}>{icon}</span>
            <div style={styles.featName}>{name}</div>
            <div style={styles.featSub}>{sub}</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/* ── PageShell ──────────────────────────────────────────────────────────── */
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FontLoader />
      <GlobalStyles />
      <div style={styles.root}>
        <div style={styles.bgStripe} />
        <div style={{ ...styles.bgOrb, width: 500, height: 500, background: "#D4FF00", top: -200, right: -180, opacity: 0.08 }} />
        <div style={{ ...styles.bgOrb, width: 400, height: 400, background: "#3B8BFF", bottom: -150, left: -150, opacity: 0.1 }} />

        <div style={styles.layout}>
          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.logo}>
              <span style={styles.logoDot} />
              PredictEarn
            </div>
            <div style={styles.livePill}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0C0C0E", display: "inline-block" }} />
              Waitlist Open
            </div>
          </div>

          {children}
        </div>
      </div>
    </>
  );
}

/* ── OddsTicker ─────────────────────────────────────────────────────────── */
function OddsTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={styles.tickerWrap}>
      <div style={styles.tickerInner}>
        {doubled.map((item, i) => {
          const [teams, odd] = item.split(" · ");
          return (
            <span key={i} style={styles.tickerItem}>
              <span style={styles.tickerSep} />
              <span style={styles.tickerTeams}>{teams}</span>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>·</span>
              <span style={styles.tickerOdd}>{odd}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ── MatchCards ─────────────────────────────────────────────────────────── */
function MatchCards() {
  return (
    <div style={styles.matchScroll}>
      {MATCHES.map((m, i) => (
        <div key={m.teams} style={{ ...styles.matchCard, ...(i === 0 ? styles.matchCardFeatured : {}) }}>
          <div style={styles.mcLeague}>
            {m.live && <span style={styles.mcLiveDot} />}
            {m.league}
          </div>
          <div style={styles.mcTeams}>
            {m.teams.replace(" vs ", "\nvs ")}
          </div>
          <div style={styles.mcOdd}>{m.odd}</div>
          <div style={styles.mcOddLabel}>Win odds</div>
        </div>
      ))}
    </div>
  );
}

/* ── StatCell ───────────────────────────────────────────────────────────── */
function StatCell({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div style={styles.statCell}>
      <div style={{ ...styles.statVal, ...(accent ? { color: "#D4FF00" } : {}) }}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

/* ── ShimmerLayer ───────────────────────────────────────────────────────── */
function ShimmerLayer() {
  return (
    <span style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)",
      backgroundSize: "200% 100%",
      animation: "pe-shimmer 2.5s infinite",
    }} />
  );
}

/* ── GlobalStyles ───────────────────────────────────────────────────────── */
function GlobalStyles() {
  return (
    <style>{`
      @keyframes pe-blink    { 0%,100%{opacity:1} 50%{opacity:0.3} }
      @keyframes pe-scroll-x { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      @keyframes pe-shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      #pe-root input::placeholder { color: rgba(255,255,255,0.2); }
      #pe-root input:focus { border-color: rgba(212,255,0,0.45) !important; outline: none; box-shadow: 0 0 0 3px rgba(212,255,0,0.06); }
      #pe-root ::-webkit-scrollbar { display: none; }
    `}</style>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   STYLE OBJECTS
══════════════════════════════════════════════════════════════════════════ */
const FF_HEAD = "'Barlow Condensed', sans-serif";
const FF_BODY = "'Barlow', sans-serif";
const ACID    = "#D4FF00";
const INK     = "#0C0C0E";
const SURFACE = "#141417";
const LINE    = "rgba(255,255,255,0.07)";
const LINE2   = "rgba(255,255,255,0.13)";
const MUTED   = "rgba(255,255,255,0.38)";
const TEXT    = "rgba(255,255,255,0.88)";

const styles: Record<string, React.CSSProperties> = {
  root: {
    id: "pe-root" as never, // applied via the wrapping div's id below
    background: INK, minHeight: "100vh", fontFamily: FF_BODY,
    color: TEXT, position: "relative", overflow: "hidden",
  },
  bgStripe: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0,
    background: `repeating-linear-gradient(-55deg,transparent 0px,transparent 48px,rgba(255,255,255,0.018) 48px,rgba(255,255,255,0.018) 49px)`,
  },
  bgOrb: {
    position: "absolute", borderRadius: "50%", pointerEvents: "none", zIndex: 0, filter: "blur(70px)",
  },
  layout: {
    position: "relative", zIndex: 1,
    maxWidth: 520, margin: "0 auto", padding: "0 20px 48px",
  },

  /* header */
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 20 },
  logo: { fontFamily: FF_HEAD, fontWeight: 900, fontSize: 22, letterSpacing: "-0.02em", color: "#fff", display: "flex", alignItems: "center", gap: 6 },
  logoDot: { width: 8, height: 8, borderRadius: "50%", background: ACID, display: "inline-block", boxShadow: `0 0 10px ${ACID}`, animation: "pe-blink 1.6s ease-in-out infinite" },
  livePill: { display: "flex", alignItems: "center", gap: 5, fontFamily: FF_BODY, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: INK, background: ACID, padding: "4px 10px", borderRadius: 2 },

  /* hero */
  heroEyebrow: { fontFamily: FF_BODY, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: ACID, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 },
  heroHeadline: { fontFamily: FF_HEAD, fontWeight: 900, fontSize: "clamp(48px,14vw,80px)" as never, lineHeight: 0.92, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#fff", marginBottom: 20 },
  heroSub: { fontSize: 14, lineHeight: 1.65, color: MUTED, maxWidth: 380, marginBottom: 28 },

  /* stats */
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: LINE2, border: `1px solid ${LINE2}`, borderRadius: 4, overflow: "hidden", marginBottom: 28 },
  statCell: { background: SURFACE, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 2 },
  statVal: { fontFamily: FF_HEAD, fontWeight: 900, fontSize: 24, color: "#fff", letterSpacing: "-0.01em" },
  statLabel: { fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED },

  /* ticker */
  tickerWrap: { overflow: "hidden", borderTop: `1px solid ${LINE2}`, borderBottom: `1px solid ${LINE2}`, padding: "8px 0", marginBottom: 24 },
  tickerInner: { display: "flex", whiteSpace: "nowrap" as never, animation: "pe-scroll-x 22s linear infinite" },
  tickerItem: { display: "inline-flex", alignItems: "center", gap: 8, padding: "0 32px", fontSize: 12, fontWeight: 500, color: MUTED },
  tickerTeams: { color: TEXT, fontWeight: 600 },
  tickerOdd: { fontFamily: FF_HEAD, fontWeight: 900, fontSize: 16, color: ACID },
  tickerSep: { width: 3, height: 3, borderRadius: "50%", background: LINE2, flexShrink: 0 },

  /* match cards */
  matchScroll: { display: "flex", gap: 10, overflowX: "auto" as never, scrollbarWidth: "none" as never, marginBottom: 28, paddingBottom: 4 },
  matchCard: { flexShrink: 0, width: 130, background: SURFACE, border: `1px solid ${LINE2}`, borderRadius: 6, padding: "12px 14px" },
  matchCardFeatured: { borderColor: "rgba(212,255,0,0.35)", background: `linear-gradient(145deg,#1C1C21 0%,${SURFACE} 100%)` },
  mcLeague: { fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: MUTED, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 },
  mcLiveDot: { width: 5, height: 5, borderRadius: "50%", background: "#FF4545", animation: "pe-blink 1s ease-in-out infinite" },
  mcTeams: { fontFamily: FF_HEAD, fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.3, whiteSpace: "pre-line" as never },
  mcOdd: { fontFamily: FF_HEAD, fontSize: 28, fontWeight: 900, color: ACID, lineHeight: 1 },
  mcOddLabel: { fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginTop: 2 },

  /* form */
  formSection: { background: SURFACE, border: `1px solid ${LINE2}`, borderRadius: 8, padding: 24, marginBottom: 20 },
  formTitle: { fontFamily: FF_HEAD, fontWeight: 700, fontSize: 20, letterSpacing: "0.01em", textTransform: "uppercase", color: "#fff", marginBottom: 6 },
  formSubtitle: { fontSize: 13, color: MUTED, marginBottom: 20 },
  walletRow: { display: "flex", alignItems: "center", gap: 10, background: "rgba(212,255,0,0.05)", border: "1px solid rgba(212,255,0,0.35)", borderRadius: 4, padding: "10px 14px", marginBottom: 16 },
  walletDot: { width: 7, height: 7, borderRadius: "50%", background: ACID, flexShrink: 0, boxShadow: `0 0 6px ${ACID}` },
  walletAddr: { fontFamily: "monospace", fontSize: 12, color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as never },
  fieldLabel: { display: "block", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: MUTED, marginBottom: 6 },
  fieldInput: { width: "100%", padding: "11px 14px", background: INK, border: `1px solid ${LINE2}`, borderRadius: 4, color: "#fff", fontFamily: FF_BODY, fontSize: 14, outline: "none" },
  fieldError: { fontSize: 12, color: "#FF6B6B", marginTop: 5 },
  fieldHint: { fontSize: 10, color: "rgba(255,255,255,0.22)", marginTop: 5 },
  errorBox: { padding: "10px 14px", background: "rgba(255,69,69,0.08)", border: "1px solid rgba(255,69,69,0.2)", borderRadius: 4, marginBottom: 12 },
  ctaBtn: { width: "100%", padding: 15, background: ACID, color: INK, fontFamily: FF_HEAD, fontWeight: 900, fontSize: 18, textTransform: "uppercase", letterSpacing: "0.04em", border: "none", borderRadius: 4, cursor: "pointer", position: "relative", overflow: "hidden", display: "block" },
  connectHeading: { fontFamily: FF_HEAD, fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "#fff", marginBottom: 6 },
  connectSub: { fontSize: 13, color: MUTED, marginBottom: 20, lineHeight: 1.55 },

  /* contract warning */
  contractWarn: { display: "flex", alignItems: "center", gap: 8, background: "rgba(255,215,64,0.07)", border: "1px solid rgba(255,215,64,0.2)", borderRadius: 6, padding: "10px 14px", marginBottom: 16 },

  /* features */
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 },
  featCard: { background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 6, padding: "14px 12px" },
  featName: { fontFamily: FF_HEAD, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em", color: "#fff", marginBottom: 2 },
  featSub: { fontSize: 10, color: MUTED },

  /* success */
  successBadge: { display: "inline-block", fontFamily: FF_HEAD, fontWeight: 900, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em", background: ACID, color: INK, padding: "5px 16px", borderRadius: 2, marginBottom: 20 },
  successHeadline: { fontFamily: FF_HEAD, fontWeight: 900, fontSize: 52, lineHeight: 0.9, textTransform: "uppercase", color: "#fff", marginBottom: 8 },
  successPos: { fontFamily: FF_HEAD, fontSize: 80, fontWeight: 900, color: ACID, lineHeight: 1, marginBottom: 4 },
  successPosLabel: { fontSize: 13, color: MUTED, marginBottom: 32 },
  refBox: { background: SURFACE, border: `1px solid ${LINE2}`, borderRadius: 6, padding: "16px 20px", textAlign: "left", marginBottom: 8 },
  refLabel: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 10 },
  refRow: { display: "flex", gap: 8, alignItems: "center" },
  refLink: { flex: 1, fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.45)", background: INK, border: `1px solid ${LINE}`, borderRadius: 3, padding: "8px 10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as never },
  copyBtn: { flexShrink: 0, padding: "8px 14px", background: "transparent", border: `1px solid ${LINE2}`, borderRadius: 3, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FF_BODY },
  txLine: { fontSize: 11, color: MUTED, marginTop: 12 },
  txAnchor: { color: ACID, textDecoration: "none", fontFamily: "monospace" },
  backLink: { fontSize: 12, color: MUTED, textDecoration: "none" },
};