'use client'

import { useState } from 'react'

/* ── DATA ── */
const TICKER_DATA = [
  ['Man City vs Arsenal', '2.15'],
  ['Real Madrid vs PSG', '1.85'],
  ['Liverpool vs Chelsea', '4.40'],
  ['Dortmund vs Bayern', '3.10'],
  ['Barcelona vs Atletico', '1.95'],
  ['Ajax vs Inter', '2.55'],
  ['PSG vs Lyon', '1.60'],
  ['Napoli vs Roma', '2.80'],
]

const MATCHES = [
  { league: 'UCL · Live',   teams: ['MCI', 'ARS'], odd: '2.15', live: true,  featured: true  },
  { league: 'La Liga · FT', teams: ['RMA', 'PSG'], odd: '1.85', live: false, featured: false },
  { league: 'EPL · 78′',    teams: ['LIV', 'CHE'], odd: '4.40', live: true,  featured: false },
  { league: 'Bundesliga',   teams: ['BVB', 'FCB'], odd: '3.10', live: true,  featured: false },
  { league: 'Ligue 1',      teams: ['PSG', 'LYN'], odd: '1.60', live: false, featured: false },
]

const FEATURES = [
  { icon: '⚡', name: 'Leverage',      sub: 'Up to 100×'  },
  { icon: '🏆', name: 'Leaderboard',   sub: 'Climb ranks' },
  { icon: '💵', name: 'cUSD Payouts',  sub: 'Instant claims'},
  { icon: '🔒', name: 'Non-Custodial', sub: 'Your keys'     },
  { icon: '🌍', name: '50+ Leagues',   sub: 'Global markets'},
  { icon: '📊', name: 'Live Odds',     sub: 'Real-time'     },
]

type Screen = 'connect' | 'form' | 'success'

/* ── STYLES (injected once) ── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&family=Space+Mono:wght@700&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --acid:#C8FF00; --ink:#060809; --card:#131619;
    --line:rgba(241, 240, 240, 0.06); --line2:rgba(255,255,255,0.11);
    --muted:rgba(255,255,255,0.42); --text:rgba(255,255,255,0.88);
    --red:#FF3B30;
  }
  html, body { background:var(--ink); color:var(--text); font-family:'DM Sans',sans-serif; overflow-x:hidden; }
  @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes blinkfast  { 0%,100%{opacity:1} 50%{opacity:0.2} }
  @keyframes scrollx    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes shimmer    { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  .anim-blink      { animation:blink 1.8s ease-in-out infinite; }
  .anim-blinkfast  { animation:blinkfast 1s ease-in-out infinite; }
  .anim-scrollx    { animation:scrollx 24s linear infinite; }
  .anim-shimmer    {
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.32),transparent);
    background-size:200% 100%;
    animation:shimmer 2.8s infinite;
  }
  .scrollbar-none::-webkit-scrollbar { display:none; }
  .scrollbar-none { scrollbar-width:none; }
  input:focus { outline:none; border-color:rgba(200,255,0,0.4) !important; box-shadow:0 0 0 3px rgba(200,255,0,0.07); }
  input::placeholder { color:rgba(255,255,255,0.16); }
`

/* ── SHARED BUTTON ── */
function Btn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative', width: '100%', padding: '16px',
        background: 'var(--acid)', color: 'var(--ink)',
        fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px',
        letterSpacing: '0.06em', border: 'none', borderRadius: '5px',
        cursor: 'pointer', overflow: 'hidden', display: 'block',
        marginTop: '8px', transition: 'transform 0.12s, filter 0.2s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.08)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = ''; (e.currentTarget as HTMLButtonElement).style.transform = '' }}
    >
      <span className="anim-shimmer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      {children}
    </button>
  )
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function Page() {
  const [screen, setScreen] = useState<Screen>('connect')
  const [email, setEmail] = useState('')
  const [refCode, setRefCode] = useState('')
  const [copied, setCopied] = useState(false)

  const FAKE_WALLET = '0x7a2F…c3D9e1b4F208A3e'
  const REF_LINK = 'predictearn.xyz/ref?code=abc123de'

  function handleConnect() {
    // 🔌 Replace with wagmi/RainbowKit useConnect()
    setScreen('form')
  }

  function handleJoin() {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Enter a valid email address.')
      return
    }
    // 🔌 Replace with joinWaitlist(email, refCode) API/contract call
    setScreen('success')
  }

  function handleCopy() {
    try { navigator.clipboard.writeText(REF_LINK) } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const doubled = [...TICKER_DATA, ...TICKER_DATA]

  return (
    <>
      {/* Inject global styles */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* ══ HERO FIELD ══ */}
      <div style={{ position: 'relative', width: '100%', height: '420px', overflow: 'hidden', background: '#0a1a0a' }}>

        {/* Turf stripes */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(180deg,#0d2010 0px,#0d2010 28px,#0f2512 28px,#0f2512 56px)',
        }} />

        {/* Field SVG */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          viewBox="0 0 800 420" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g stroke="#C8FF00" strokeOpacity="0.22" fill="none" strokeWidth="1.5" filter="url(#glow)">
            <rect x="40" y="30" width="720" height="360" />
            <line x1="400" y1="30" x2="400" y2="390" />
            <circle cx="400" cy="210" r="60" />
            <circle cx="400" cy="210" r="3" fill="#C8FF00" fillOpacity="0.3" />
            <rect x="40" y="120" width="120" height="180" />
            <rect x="40" y="160" width="50" height="100" />
            <circle cx="145" cy="210" r="3" fill="#C8FF00" fillOpacity="0.3" />
            <path d="M140 170 A70 70 0 0 1 140 250" strokeOpacity="0.14" />
            <rect x="640" y="120" width="120" height="180" />
            <rect x="710" y="160" width="50" height="100" />
            <circle cx="655" cy="210" r="3" fill="#C8FF00" fillOpacity="0.3" />
            <path d="M660 170 A70 70 0 0 0 660 250" strokeOpacity="0.14" />
            <rect x="20" y="178" width="20" height="64" strokeOpacity="0.4" />
            <rect x="760" y="178" width="20" height="64" strokeOpacity="0.4" />
            <path d="M40 38 A12 12 0 0 1 52 30" /><path d="M748 30 A12 12 0 0 1 760 38" />
            <path d="M40 382 A12 12 0 0 0 52 390" /><path d="M748 390 A12 12 0 0 0 760 382" />
          </g>
        </svg>

        {/* Light beams */}
        <div style={{ position:'absolute',top:0,left:0,width:'320px',height:'100%',pointerEvents:'none',
          background:'linear-gradient(160deg,rgba(255,250,170,0.13) 0%,transparent 55%)' }} />
        <div style={{ position:'absolute',top:0,right:0,width:'320px',height:'100%',pointerEvents:'none',
          background:'linear-gradient(200deg,rgba(255,250,170,0.13) 0%,transparent 55%)' }} />
        <div style={{ position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:'300px',height:'100%',pointerEvents:'none',
          background:'linear-gradient(180deg,rgba(255,250,170,0.07) 0%,transparent 50%)' }} />

        {/* Floodlight poles */}
        <div style={{ position:'absolute',top:0,left:0,right:0,display:'flex',justifyContent:'space-between',padding:'0 40px',pointerEvents:'none' }}>
          {[0,1].map(i => (
            <div key={i} style={{ display:'flex',flexDirection:'column',alignItems:'center' }}>
              <div style={{ display:'flex',alignItems:'flex-end',marginBottom:'2px' }}>
                {[...Array(5)].map((_,j) => (
                  <div key={j} style={{ width:'10px',height:'14px',background:'#fffae0',borderRadius:'2px',margin:'0 2px',
                    boxShadow:'0 0 18px 8px rgba(255,250,180,0.55),0 0 60px 20px rgba(255,250,140,0.18)' }} />
                ))}
              </div>
              <div style={{ width:'120px',height:'8px',background:'#c8c8b0',borderRadius:'2px' }} />
              <div style={{ width:'6px',minHeight:'60px',flex:1,background:'linear-gradient(180deg,#b0a890,#6a6858)' }} />
              <div style={{ width:'22px',height:'10px',background:'#6a6858',borderRadius:'0 0 4px 4px' }} />
            </div>
          ))}
        </div>

        {/* Dark overlay */}
        <div style={{ position:'absolute',inset:0,
          background:'linear-gradient(180deg,rgba(6,8,9,0.18) 0%,rgba(6,8,9,0.55) 60%,rgba(6,8,9,0.98) 100%)' }} />

        {/* Nav */}
        <div style={{ position:'absolute',top:0,left:0,right:0,zIndex:10,display:'flex',alignItems:'center',
          justifyContent:'space-between',padding:'18px 24px',maxWidth:'580px',margin:'0 auto' }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'26px',letterSpacing:'0.04em',color:'#fff',display:'flex',alignItems:'center',gap:'8px' }}>
            <span className="anim-blink" style={{ width:'9px',height:'9px',borderRadius:'50%',background:'var(--acid)',boxShadow:'0 0 14px var(--acid)',display:'inline-block' }} />
            PredictEarn
          </div>
          <div style={{ fontSize:'10px',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',
            background:'var(--acid)',color:'var(--ink)',padding:'5px 12px',borderRadius:'2px' }}>
            Waitlist Open
          </div>
        </div>

        {/* Hero text */}
        <div style={{ position:'absolute',inset:0,display:'flex',flexDirection:'column',justifyContent:'flex-end',
          padding:'0 24px 36px',maxWidth:'580px',margin:'0 auto',left:0,right:0 }}>
          <div style={{ display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px' }}>
            <span className="anim-blink" style={{ width:'6px',height:'6px',borderRadius:'50%',background:'var(--acid)',flexShrink:0,display:'inline-block' }} />
            <span style={{ fontSize:'11px',fontWeight:600,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--acid)' }}>
              On-chain football markets · Celo
            </span>
          </div>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(72px,18vw,108px)',lineHeight:0.86,
            letterSpacing:'0.01em',color:'#fff',textShadow:'0 2px 40px rgba(0,0,0,0.8)' }}>
            Predict.<br />Bet.
            <span style={{ color:'var(--acid)',display:'block' }}>Earn.</span>
          </h1>
          <p style={{ fontSize:'13px',lineHeight:1.65,color:'rgba(255,255,255,0.6)',maxWidth:'340px',marginTop:'14px' }}>
            The first on-chain football prediction market on Celo. Bet with cUSD, win real rewards — zero fees, fully non-custodial.
          </p>
        </div>
      </div>

      {/* ══ PAGE BODY ══ */}
      <div style={{ maxWidth:'540px',margin:'0 auto',padding:'0 20px 60px' }}>

        {/* ── STATS ── */}
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',border:'1px solid var(--line2)',
          borderRadius:'6px',overflow:'hidden',margin:'24px 0 28px' }}>
          {[
            { val:'4,218', label:'On waitlist', acid:true  },
            { val:'100×',  label:'Max leverage', acid:false },
            { val:'cUSD',  label:'Instant payouts', acid:false },
          ].map((s,i) => (
            <div key={i} style={{ background:'var(--card)',padding:'14px 16px',borderLeft: i > 0 ? '1px solid var(--line2)' : undefined }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'30px',lineHeight:1,
                color: s.acid ? 'var(--acid)' : '#fff', marginBottom:'3px' }}>{s.val}</div>
              <div style={{ fontSize:'9px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.12em',color:'var(--muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── TICKER ── */}
        <div style={{ borderTop:'1px solid var(--line2)',borderBottom:'1px solid var(--line2)',padding:'9px 0',marginBottom:'28px',overflow:'hidden',position:'relative' }}>
          <div style={{ position:'absolute',top:0,bottom:0,left:0,width:'40px',zIndex:2,pointerEvents:'none',
            background:'linear-gradient(90deg,var(--ink),transparent)' }} />
          <div style={{ position:'absolute',top:0,bottom:0,right:0,width:'40px',zIndex:2,pointerEvents:'none',
            background:'linear-gradient(-90deg,var(--ink),transparent)' }} />
          <div className="anim-scrollx" style={{ display:'flex',whiteSpace:'nowrap' }}>
            {doubled.map(([teams,odd],i) => (
              <span key={i} style={{ display:'inline-flex',alignItems:'center',gap:'7px',padding:'0 28px',
                fontSize:'12px',fontWeight:500,color:'var(--muted)' }}>
                <span style={{ width:'3px',height:'3px',borderRadius:'50%',background:'var(--line2)',flexShrink:0,display:'inline-block' }} />
                <span style={{ color:'var(--text)',fontWeight:600 }}>{teams}</span>
                <span style={{ color:'rgba(255,255,255,0.22)',fontSize:'11px' }}>·</span>
                <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'18px',color:'var(--acid)' }}>{odd}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── MATCH CARDS ── */}
        <div className="scrollbar-none" style={{ display:'flex',gap:'10px',overflowX:'auto',paddingBottom:'4px',marginBottom:'30px' }}>
          {MATCHES.map((m,i) => (
            <div key={i} style={{
              flexShrink:0, width:'140px', borderRadius:'8px', padding:'14px',
              border: m.featured ? '1px solid rgba(200,255,0,0.28)' : '1px solid var(--line2)',
              background: m.featured
                ? 'linear-gradient(155deg,rgba(200,255,0,0.07) 0%,var(--card) 100%)'
                : 'var(--card)',
            }}>
              <div style={{ fontSize:'9px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',
                color:'var(--muted)',marginBottom:'10px',display:'flex',alignItems:'center',gap:'5px' }}>
                {m.live && <span className="anim-blinkfast" style={{ width:'5px',height:'5px',borderRadius:'50%',background:'var(--red)',flexShrink:0,display:'inline-block' }} />}
                {m.league}
              </div>
              <div style={{ fontSize:'12px',fontWeight:600,color:'#fff',marginBottom:'12px',lineHeight:1.4 }}>
                {m.teams[0]} <span style={{ color:'var(--muted)',fontWeight:400 }}>vs</span> {m.teams[1]}
              </div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'34px',color:'var(--acid)',lineHeight:1 }}>{m.odd}</div>
              <div style={{ fontSize:'9px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--muted)',marginTop:'2px' }}>Win odds</div>
            </div>
          ))}
        </div>

        {/* ── WAITLIST FORM ── */}
        <div style={{ background:'var(--card)',border:'1px solid var(--line2)',borderRadius:'10px',padding:'26px',marginBottom:'22px' }}>

          {/* NOT CONNECTED */}
          {screen === 'connect' && (
            <div style={{ textAlign:'center' }}>
              <div style={{ width:'48px',height:'48px',borderRadius:'50%',background:'rgba(200,255,0,0.1)',
                border:'1px solid rgba(200,255,0,0.2)',display:'flex',alignItems:'center',justifyContent:'center',
                margin:'0 auto 16px',fontSize:'22px' }}>👛</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'20px',color:'#fff',marginBottom:'8px',letterSpacing:'0.04em' }}>
                Connect Your Wallet
              </div>
              <p style={{ fontSize:'13px',color:'var(--muted)',marginBottom:'22px',lineHeight:1.55 }}>
                Your wallet is your identity on-chain.<br />No personal data required.
              </p>
              <Btn onClick={handleConnect}>Connect Wallet</Btn>
            </div>
          )}

          {/* FORM */}
          {screen === 'form' && (
            <>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'22px',letterSpacing:'0.03em',color:'#fff',marginBottom:'5px' }}>
                Secure Your Spot
              </div>
              <p style={{ fontSize:'13px',color:'var(--muted)',marginBottom:'20px',lineHeight:1.5 }}>
                One entry per wallet. Referrals move you up the list.
              </p>
              {/* Wallet row */}
              <div style={{ display:'flex',alignItems:'center',gap:'8px',background:'rgba(200,255,0,0.05)',
                border:'1px solid rgba(200,255,0,0.18)',borderRadius:'5px',padding:'10px 14px',marginBottom:'18px' }}>
                <span className="anim-blink" style={{ width:'7px',height:'7px',borderRadius:'50%',background:'var(--acid)',
                  boxShadow:'0 0 8px var(--acid)',flexShrink:0,display:'inline-block' }} />
                <span style={{ fontFamily:"'Space Mono',monospace",fontSize:'11px',color:'var(--muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
                  {FAKE_WALLET}
                </span>
              </div>
              {/* Email */}
              <div style={{ marginBottom:'14px' }}>
                <label style={{ display:'block',fontSize:'10px',fontWeight:600,textTransform:'uppercase',
                  letterSpacing:'0.12em',color:'var(--muted)',marginBottom:'6px' }}>
                  Email <span style={{ textTransform:'none',color:'rgba(255,255,255,0.18)',fontWeight:400 }}>(optional)</span>
                </label>
                <input
                  type="email" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width:'100%',padding:'11px 14px',background:'var(--ink)',border:'1px solid var(--line2)',
                    borderRadius:'5px',color:'#fff',fontFamily:"'DM Sans',sans-serif",fontSize:'14px',transition:'border-color 0.2s,box-shadow 0.2s' }}
                />
                <p style={{ fontSize:'10px',color:'rgba(255,255,255,0.2)',marginTop:'5px' }}>Only used to notify you at launch.</p>
              </div>
              {/* Ref code */}
              <div style={{ marginBottom:'14px' }}>
                <label style={{ display:'block',fontSize:'10px',fontWeight:600,textTransform:'uppercase',
                  letterSpacing:'0.12em',color:'var(--muted)',marginBottom:'6px' }}>
                  Referral code <span style={{ textTransform:'none',color:'rgba(255,255,255,0.18)',fontWeight:400 }}>(optional)</span>
                </label>
                <input
                  type="text" placeholder="e.g. a1b2c3d4" value={refCode}
                  onChange={e => setRefCode(e.target.value)}
                  style={{ width:'100%',padding:'11px 14px',background:'var(--ink)',border:'1px solid var(--line2)',
                    borderRadius:'5px',color:'#fff',fontFamily:"'Space Mono',monospace",fontSize:'14px',transition:'border-color 0.2s,box-shadow 0.2s' }}
                />
              </div>
              <Btn onClick={handleJoin}>Join the Waitlist</Btn>
              <p style={{ textAlign:'center',fontSize:'10px',color:'rgba(255,255,255,0.18)',marginTop:'10px',
                textTransform:'uppercase',letterSpacing:'0.08em' }}>Only Celo network gas applies</p>
            </>
          )}

          {/* SUCCESS */}
          {screen === 'success' && (
            <div style={{ textAlign:'center',padding:'24px 0' }}>
              <div style={{ display:'inline-block',fontFamily:"'Bebas Neue',sans-serif",fontSize:'14px',
                letterSpacing:'0.1em',background:'var(--acid)',color:'var(--ink)',padding:'5px 16px',
                borderRadius:'2px',marginBottom:'20px' }}>You&apos;re In</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'60px',lineHeight:0.88,
                color:'#fff',textTransform:'uppercase',marginBottom:'10px' }}>
                Locked<br />&amp; Loaded.
              </div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'90px',color:'var(--acid)',lineHeight:1,marginBottom:'4px' }}>
                #4,219
              </div>
              <div style={{ fontSize:'13px',color:'var(--muted)',marginBottom:'32px' }}>
                of <span style={{ color:'#fff' }}>4,219</span> on the waitlist
              </div>
              {/* Ref box */}
              <div style={{ background:'var(--card)',border:'1px solid var(--line2)',borderRadius:'8px',
                padding:'16px 20px',textAlign:'left',marginBottom:'10px' }}>
                <div style={{ fontSize:'9px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',
                  color:'var(--muted)',marginBottom:'10px' }}>
                  Your referral link — share to climb faster
                </div>
                <div style={{ display:'flex',gap:'8px',alignItems:'center' }}>
                  <div style={{ flex:1,fontFamily:"'Space Mono',monospace",fontSize:'11px',color:'rgba(255,255,255,0.4)',
                    background:'var(--ink)',border:'1px solid var(--line)',borderRadius:'3px',padding:'8px 10px',
                    overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{REF_LINK}</div>
                  <button onClick={handleCopy}
                    style={{ flexShrink:0,padding:'8px 14px',background:'transparent',border:'1px solid var(--line2)',
                      borderRadius:'3px',color:'#fff',fontSize:'12px',fontWeight:600,cursor:'pointer',
                      fontFamily:"'DM Sans',sans-serif",transition:'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--line2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <button onClick={() => { setScreen('connect'); setEmail(''); setRefCode('') }}
                style={{ fontSize:'12px',color:'var(--muted)',marginTop:'20px',display:'inline-block',
                  background:'none',border:'none',cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                ← Back to PredictEarn
              </button>
            </div>
          )}
        </div>

        {/* ── FEATURES ── */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px' }}>
          {FEATURES.map(f => (
            <div key={f.name} style={{ background:'var(--card)',border:'1px solid var(--line)',borderRadius:'8px',padding:'14px 12px' }}>
              <span style={{ fontSize:'18px',marginBottom:'8px',display:'block' }}>{f.icon}</span>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'14px',letterSpacing:'0.04em',color:'#fff',marginBottom:'2px' }}>{f.name}</div>
              <div style={{ fontSize:'10px',color:'var(--muted)' }}>{f.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}