'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const STORAGE_KEY    = 'predictearn_waitlist'
const TELEGRAM_URL   = 'https://t.me/+twTRWf1XJSU3OGM0'
const TWITTER_HANDLE = 'predictearn_'
const TWITTER_URL    = 'https://x.com/predictearn_'

function getPayoutDate() {
  const now  = new Date()
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 18)
  return next.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
const PAYOUT_DATE = getPayoutDate()

const PRIZES = [
  { rank: 1, prize: '$5', icon: '🥇', color: '#FFD60A' },
  { rank: 2, prize: '$3', icon: '🥈', color: '#C0C0C0' },
  { rank: 3, prize: '$2', icon: '🥉', color: '#CD7F32' },
]

function saveLocal(data: { refCode: string; position: number }) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}
function loadLocal(): { refCode: string; position: number } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

async function notifyReferrer(referrerRefCode: string, newUserName: string) {
  try {
    const { data: referrer } = await supabase
      .from('waitlist')
      .select('email, name')
      .eq('ref_code', referrerRefCode)
      .maybeSingle()
    if (!referrer) return
    await supabase.functions.invoke('send-referral-email', {
      body: {
        referrerEmail: referrer.email,
        referrerName:  referrer.name,
        newUserName,
      },
    })
  } catch {}
}

const FEATURES = [
  { icon: '⚡', name: 'Lightning Fast', sub: 'Instant settlement' },
  { icon: '🏆', name: 'Leaderboard',    sub: 'Climb ranks' },
  { icon: '💵', name: 'cUSD Payouts',   sub: 'Instant claims' },
  { icon: '🔒', name: 'Non-Custodial',  sub: 'Your keys' },
  { icon: '🌍', name: '100+ Markets',   sub: 'Global events' },
  { icon: '📊', name: 'Live Odds',      sub: 'Real-time' },
]

const TICKER_DATA = [
  ['Man City vs Arsenal',   '2.15'],
  ['Real Madrid vs PSG',    '1.85'],
  ['Liverpool vs Chelsea',  '4.40'],
  ['Dortmund vs Bayern',    '3.10'],
  ['Barcelona vs Atletico', '1.95'],
  ['Ajax vs Inter',         '2.55'],
  ['PSG vs Lyon',           '1.60'],
  ['Napoli vs Roma',        '2.80'],
]

const REWARD_TIERS = [
  { refs: 3,  reward: 'Early Access', icon: '🎯' },
  { refs: 10, reward: 'Bonus cUSD',   icon: '💰' },
  { refs: 25, reward: 'VIP Tier',     icon: '👑' },
]

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&family=Space+Mono:wght@700&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --acid:#C8FF00; --ink:#060809; --card:#131619;
    --line:rgba(241,240,240,0.06); --line2:rgba(255,255,255,0.11);
    --muted:rgba(239,236,236,0.42); --text:rgba(255,255,255,0.88);
    --red:#FF3B30; --tg:#229ED9;
  }
  html, body { background:var(--ink); color:var(--text); font-family:'DM Sans',sans-serif; overflow-x:hidden; margin:0; padding:0; }
  @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes scrollx { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes pulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
  @keyframes fadeup  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  .anim-blink   { animation:blink 1.8s ease-in-out infinite; }
  .anim-scrollx { animation:scrollx 24s linear infinite; }
  .anim-pulse   { animation:pulse 2s ease-in-out infinite; }
  .anim-fadeup  { animation:fadeup 0.4s ease both; }
  input:focus { outline:none; border-color:rgba(200,255,0,0.4) !important; box-shadow:0 0 0 3px rgba(200,255,0,0.07); }
  input::placeholder { color:rgba(255,255,255,0.18); }
  input { transition:border-color 0.2s, box-shadow 0.2s; }
  a.lb-link:hover  { opacity:0.8; }
  a.tg-link:hover  { opacity:0.85; }
  a.twt-link:hover { opacity:0.8; }
`

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 'clamp(10px,2vw,14px) clamp(12px,2vw,16px)',
  background: 'var(--ink)',
  border: '1px solid var(--line2)',
  borderRadius: '6px',
  color: '#fff',
  fontFamily: "'DM Sans',sans-serif",
  fontSize: 'clamp(12px,2vw,14px)',
}

function HeroBg() {
  return (
    <>
      <div style={{ position:'absolute',inset:0,zIndex:0,
        background:'repeating-linear-gradient(180deg,#0d2010 0px,#0d2010 28px,#0f2512 28px,#0f2512 56px)' }}/>
      <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',zIndex:1 }}
        viewBox="0 0 800 420" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <g stroke="#C8FF00" strokeOpacity="0.22" fill="none" strokeWidth="1.5" filter="url(#glow)">
          <rect x="40" y="30" width="720" height="360"/>
          <line x1="400" y1="30" x2="400" y2="390"/>
          <circle cx="400" cy="210" r="60"/>
          <circle cx="400" cy="210" r="3" fill="#C8FF00" fillOpacity="0.3"/>
          <rect x="40"  y="120" width="120" height="180"/>
          <rect x="40"  y="160" width="50"  height="100"/>
          <circle cx="145" cy="210" r="3" fill="#C8FF00" fillOpacity="0.3"/>
          <path d="M140 170 A70 70 0 0 1 140 250" strokeOpacity="0.14"/>
          <rect x="640" y="120" width="120" height="180"/>
          <rect x="710" y="160" width="50"  height="100"/>
          <circle cx="655" cy="210" r="3" fill="#C8FF00" fillOpacity="0.3"/>
          <path d="M660 170 A70 70 0 0 0 660 250" strokeOpacity="0.14"/>
        </g>
      </svg>
      <div style={{ position:'absolute',top:0,left:0,width:'320px',height:'100%',pointerEvents:'none',zIndex:2,
        background:'linear-gradient(160deg,rgba(255,250,170,0.13) 0%,transparent 55%)' }}/>
      <div style={{ position:'absolute',top:0,right:0,width:'320px',height:'100%',pointerEvents:'none',zIndex:2,
        background:'linear-gradient(200deg,rgba(255,250,170,0.13) 0%,transparent 55%)' }}/>
      <div style={{ position:'absolute',inset:0,zIndex:3,
        background:'linear-gradient(180deg,rgba(6,8,9,0.18) 0%,rgba(6,8,9,0.55) 60%,rgba(6,8,9,0.95) 100%)' }}/>
    </>
  )
}

function TelegramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}

function Nav({ label }: { label: string }) {
  return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'8px' }}>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(18px,5vw,26px)',letterSpacing:'0.04em',color:'#fff',display:'flex',alignItems:'center',gap:'8px' }}>
        <span className="anim-blink" style={{ width:'8px',height:'8px',borderRadius:'50%',background:'var(--acid)',boxShadow:'0 0 14px var(--acid)',display:'inline-block' }}/>
        PredictEarn
      </div>
      <div style={{ display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap' }}>
        <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" className="twt-link"
          style={{ fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.65)',textDecoration:'none',letterSpacing:'0.05em',padding:'5px 9px',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'4px',display:'flex',alignItems:'center',gap:'4px',transition:'opacity 0.2s' }}>
          𝕏 @{TWITTER_HANDLE}
        </a>
        <a href="/leaderboard" className="lb-link" style={{ fontSize:'11px',fontWeight:600,color:'var(--acid)',textDecoration:'none',letterSpacing:'0.06em',padding:'5px 9px',border:'1px solid rgba(200,255,0,0.25)',borderRadius:'4px',display:'flex',alignItems:'center',gap:'5px',transition:'opacity 0.2s' }}>
          🏆 Leaderboard
        </a>
        <div style={{ fontSize:'10px',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',
          background:'var(--acid)',color:'var(--ink)',padding:'6px 12px',borderRadius:'3px' }}>
          {label}
        </div>
      </div>
    </div>
  )
}

function Ticker() {
  const doubled = [...TICKER_DATA, ...TICKER_DATA]
  return (
    <div style={{ borderTop:'1px solid var(--line2)',borderBottom:'1px solid var(--line2)',padding:'8px 0',overflow:'hidden',position:'relative' }}>
      <div style={{ position:'absolute',top:0,bottom:0,left:0,width:'30px',zIndex:2,pointerEvents:'none',
        background:'linear-gradient(90deg,rgba(6,8,9,0.95),transparent)' }}/>
      <div style={{ position:'absolute',top:0,bottom:0,right:0,width:'30px',zIndex:2,pointerEvents:'none',
        background:'linear-gradient(-90deg,rgba(6,8,9,0.95),transparent)' }}/>
      <div className="anim-scrollx" style={{ display:'flex',whiteSpace:'nowrap' }}>
        {doubled.map(([teams, odd], i) => (
          <span key={i} style={{ display:'inline-flex',alignItems:'center',gap:'6px',padding:'0 20px',
            fontSize:'clamp(10px,2vw,11px)',fontWeight:500,color:'var(--muted)' }}>
            <span style={{ width:'2px',height:'2px',borderRadius:'50%',background:'var(--line2)',flexShrink:0 }}/>
            <span style={{ color:'var(--text)',fontWeight:600 }}>{teams}</span>
            <span style={{ color:'rgba(255,255,255,0.2)',fontSize:'10px' }}>·</span>
            <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(12px,2vw,14px)',color:'var(--acid)' }}>{odd}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function PrizePool() {
  return (
    <div style={{ background:'rgba(0,0,0,0.35)',border:'1px solid rgba(255,214,10,0.22)',borderRadius:'10px',padding:'clamp(14px,3vw,18px)',marginBottom:'clamp(14px,3vw,20px)' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px',flexWrap:'wrap',gap:'6px' }}>
        <div style={{ fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',color:'rgba(255,214,10,0.85)' }}>
          💰 Referral Prize Pool
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:'5px',fontSize:'10px',color:'var(--muted)' }}>
          <span style={{ width:'5px',height:'5px',borderRadius:'50%',background:'#30D158',display:'inline-block',boxShadow:'0 0 5px #30D158' }}/>
          Pays out {PAYOUT_DATE}
        </div>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px' }}>
        {PRIZES.map(p => (
          <div key={p.rank} style={{ background:`${p.color}0a`,border:`1px solid ${p.color}30`,borderRadius:'8px',padding:'10px 6px',textAlign:'center' }}>
            <div style={{ fontSize:'clamp(14px,3vw,18px)',marginBottom:'3px' }}>{p.icon}</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(20px,5vw,28px)',color:p.color,lineHeight:1 }}>{p.prize}</div>
            <div style={{ fontSize:'9px',color:'var(--muted)',marginTop:'2px',textTransform:'uppercase',letterSpacing:'0.05em' }}>#{p.rank} place</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize:'10px',color:'rgba(255,255,255,0.2)',textAlign:'center',marginTop:'10px',margin:'10px 0 0' }}>
        Top 3 referrers paid to their email · {PAYOUT_DATE}
      </p>
    </div>
  )
}

function SuccessScreen({ position, refCode }: { position: number; refCode: string }) {
  const [copied, setCopied] = useState(false)
  const refLink = `https://predictearn.xyz?ref=${refCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }}/>
      <div style={{ position:'relative',width:'100%',minHeight:'100vh',overflow:'hidden',background:'#0a1a0a',display:'flex',flexDirection:'column' }}>
        <HeroBg/>
        <div style={{ position:'relative',zIndex:10,flex:1,display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'clamp(16px,4vw,32px)',maxWidth:'580px',margin:'0 auto',width:'100%' }}>

          <Nav label="You're In"/>

          <div style={{ textAlign:'center',padding:'clamp(16px,4vw,32px) 0' }}>

            <div style={{ display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(200,255,0,0.1)',border:'1px solid rgba(200,255,0,0.25)',borderRadius:'100px',padding:'6px 18px',marginBottom:'clamp(14px,3vw,20px)',fontSize:'clamp(10px,2vw,12px)',color:'var(--acid)',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase' }}>
              ✓ You're on the list
            </div>

            <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(13px,2.5vw,17px)',color:'var(--muted)',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'4px' }}>
              Your position
            </div>
            <div className="anim-pulse" style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(80px,22vw,140px)',color:'var(--acid)',lineHeight:0.85,marginBottom:'clamp(10px,2vw,16px)',textShadow:'0 0 60px rgba(200,255,0,0.25)' }}>
              #{position}
            </div>
            <p style={{ color:'rgba(255,255,255,0.5)',fontSize:'clamp(12px,2vw,14px)',marginBottom:'clamp(16px,3vw,24px)',lineHeight:1.6 }}>
              Share your link — every referral moves you up the queue and enters you in the prize draw
            </p>

            {/* Prize pool */}
            <PrizePool/>

            {/* Referral link */}
            <div style={{ background:'var(--card)',border:'1px solid var(--line2)',borderRadius:'10px',padding:'clamp(14px,3vw,20px)',marginBottom:'10px',textAlign:'left' }}>
              <p style={{ fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',color:'var(--muted)',margin:'0 0 10px 0' }}>
                Your referral link
              </p>
              <div style={{ display:'flex',gap:'8px' }}>
                <div style={{ flex:1,fontFamily:"'Space Mono',monospace",fontSize:'clamp(9px,1.5vw,11px)',color:'rgba(200,255,0,0.6)',background:'var(--ink)',border:'1px solid var(--line)',borderRadius:'4px',padding:'10px 12px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
                  {refLink}
                </div>
                <button onClick={handleCopy} style={{ padding:'10px clamp(14px,2vw,18px)',background:copied?'rgba(200,255,0,0.15)':'transparent',border:'1px solid var(--line2)',borderRadius:'4px',color:copied?'var(--acid)':'#fff',fontSize:'clamp(10px,2vw,12px)',fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",whiteSpace:'nowrap',transition:'all 0.2s' }}>
                  {copied ? '✓ Copied' : 'Copy link'}
                </button>
              </div>
            </div>

            {/* Telegram CTA (optional) */}
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="tg-link"
              style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 16px',background:'rgba(34,158,217,0.08)',border:'1px solid rgba(34,158,217,0.28)',borderRadius:'8px',textDecoration:'none',marginBottom:'10px',transition:'opacity 0.2s',fontSize:'11px' }}>
              <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
                <div style={{ color:'var(--tg)' }}><TelegramIcon size={16}/></div>
                <span style={{ fontWeight:600,color:'#fff' }}>Join Telegram for updates</span>
              </div>
              <span style={{ fontWeight:700,color:'var(--tg)' }}>Open →</span>
            </a>

            {/* Leaderboard CTA */}
            <a href="/leaderboard" className="lb-link" style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',padding:'12px',background:'rgba(200,255,0,0.06)',border:'1px solid rgba(200,255,0,0.2)',borderRadius:'8px',color:'var(--acid)',textDecoration:'none',fontSize:'clamp(11px,2vw,13px)',fontWeight:600,marginBottom:'clamp(14px,3vw,20px)',transition:'opacity 0.2s' }}>
              🏆 View full leaderboard — see where you rank
            </a>

            {/* Reward tiers */}
            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',marginBottom:'clamp(14px,3vw,20px)' }}>
              {REWARD_TIERS.map(t => (
                <div key={t.refs} style={{ background:'var(--card)',border:'1px solid var(--line)',borderRadius:'8px',padding:'clamp(12px,2vw,16px)',textAlign:'center' }}>
                  <div style={{ fontSize:'clamp(18px,3vw,24px)',marginBottom:'6px' }}>{t.icon}</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(28px,6vw,40px)',color:'var(--acid)',lineHeight:1 }}>{t.refs}</div>
                  <div style={{ fontSize:'clamp(8px,1.5vw,10px)',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.08em',margin:'2px 0 4px' }}>referrals</div>
                  <div style={{ fontSize:'clamp(10px,2vw,12px)',color:'#fff',fontWeight:600 }}>{t.reward}</div>
                </div>
              ))}
            </div>

            {/* Share on X */}
            <a
              href={`https://twitter.com/intent/tweet?text=I%20just%20joined%20%40${TWITTER_HANDLE}%20waitlist%20%E2%80%94%20the%20first%20on-chain%20prediction%20market%20on%20Celo.%20Top%20referrers%20win%20cash%20on%20${encodeURIComponent(PAYOUT_DATE)}%21%20Join%3A%20${encodeURIComponent(refLink)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex',alignItems:'center',gap:'8px',padding:'12px 28px',background:'#fff',color:'#000',borderRadius:'6px',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:'clamp(12px,2vw,14px)',textDecoration:'none' }}
            >
              𝕏 &nbsp;Share on X to climb faster
            </a>
          </div>

          <Ticker/>
        </div>
      </div>
    </>
  )
}

export default function WaitlistPage() {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [twitter, setTwitter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const [result, setResult] = useState<{ refCode: string; position: number } | null>(() => {
    if (typeof window === 'undefined') return null
    return loadLocal()
  })

  const saveResult = (data: { refCode: string; position: number }) => {
    saveLocal(data)
    setResult(data)
  }

  const referredBy = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('ref') ?? undefined
    : undefined

  const handleSubmit = async () => {
    setError('')
    if (!name.trim())                                          return setError('Please enter your name')
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email')

    setLoading(true)
    const normalizedEmail = email.trim().toLowerCase()

    const { data: existing } = await supabase
      .from('waitlist')
      .select('ref_code')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (existing) {
      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
      setLoading(false)
      saveResult({ refCode: existing.ref_code, position: Math.max(count ?? 1, 1) })
      return
    }

    const refCode = nanoid(8)
    const { error: insertError } = await supabase.from('waitlist').insert({
      name:        name.trim(),
      email:       normalizedEmail,
      twitter:     twitter.trim().replace(/^@/, '') || null,
      ref_code:    refCode,
      referred_by: referredBy ?? null,
    })

    if (insertError) {
      setLoading(false)
      return setError('Something went wrong. Please try again.')
    }

    if (referredBy) {
      await supabase.rpc('increment_referral', { code: referredBy })
      await notifyReferrer(referredBy, name.trim())
    }

    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    setLoading(false)
    saveResult({ refCode, position: Math.max(count ?? 1, 1) })
  }

  if (result) return <SuccessScreen position={result.position} refCode={result.refCode}/>

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }}/>
      <div style={{ position:'relative',width:'100%',minHeight:'100vh',overflow:'hidden',background:'#0a1a0a',display:'flex',flexDirection:'column' }}>
        <HeroBg/>

        <div style={{ position:'relative',zIndex:10,flex:1,display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'clamp(16px,4vw,32px)',maxWidth:'580px',margin:'0 auto',width:'100%' }}>

          <Nav label="Waitlist Open"/>

          {/* ── WAITLIST FORM ─── */}
          <div className="anim-fadeup">
            <div style={{ display:'flex',alignItems:'center',gap:'8px',marginBottom:'clamp(12px,3vw,16px)' }}>
              <span className="anim-blink" style={{ width:'6px',height:'6px',borderRadius:'50%',background:'var(--acid)',flexShrink:0,display:'inline-block' }}/>
              <span style={{ fontSize:'clamp(10px,2vw,12px)',fontWeight:600,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--acid)' }}>
                Claim Your Spot
              </span>
            </div>

            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(48px,12vw,80px)',lineHeight:0.85,letterSpacing:'0.01em',color:'#fff',textShadow:'0 2px 40px rgba(0,0,0,0.8)',margin:'0 0 clamp(10px,2vw,14px) 0' }}>
              Predict.<br/>Bet.
              <span style={{ color:'var(--acid)',display:'block' }}>Earn.</span>
            </h1>

            <p style={{ fontSize:'clamp(12px,3vw,14px)',lineHeight:1.65,color:'rgba(255,255,255,0.65)',maxWidth:'380px',margin:'0 0 clamp(14px,3vw,18px) 0' }}>
              The first on-chain prediction market on Celo. Real-time odds, instant payouts, zero fees, fully non-custodial.
            </p>

            <PrizePool/>

            <div style={{ display:'flex',flexDirection:'column',gap:'8px',marginBottom:'clamp(16px,4vw,20px)' }}>
              <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} style={inputStyle}/>
              <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={inputStyle}/>
              <div style={{ display:'flex',gap:'8px' }}>
                <input type="text" placeholder="@twitter (optional)" value={twitter} onChange={e => setTwitter(e.target.value)} style={{ ...inputStyle, flex:1 }}/>
                <button onClick={handleSubmit} disabled={loading}
                  style={{ padding:'clamp(10px,2vw,14px) clamp(20px,4vw,28px)',background:loading?'rgba(200,255,0,0.4)':'var(--acid)',color:'var(--ink)',border:'none',borderRadius:'6px',fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(13px,2vw,15px)',fontWeight:700,letterSpacing:'0.04em',cursor:loading?'not-allowed':'pointer',transition:'all 0.3s',textTransform:'uppercase',whiteSpace:'nowrap' }}>
                  {loading ? 'Joining…' : 'Join'}
                </button>
              </div>
              {error && (
                <p style={{ fontSize:'clamp(11px,2vw,13px)',color:'var(--red)',margin:'2px 0 0',display:'flex',alignItems:'center',gap:'6px' }}>
                  ⚠ {error}
                </p>
              )}
            </div>

            {referredBy && (
              <div style={{ background:'rgba(200,255,0,0.06)',border:'1px solid rgba(200,255,0,0.18)',borderRadius:'8px',padding:'10px 14px',marginBottom:'14px',fontSize:'12px',color:'rgba(200,255,0,0.7)' }}>
                🎯 You were referred — you'll both move up the queue when you join
              </div>
            )}
          </div>

          <div style={{ display:'flex',flexDirection:'column',gap:'clamp(14px,3vw,20px)' }}>
            <Ticker/>

            {/* Optional Telegram CTA */}
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="tg-link"
              style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',background:'rgba(34,158,217,0.08)',border:'1px solid rgba(34,158,217,0.25)',borderRadius:'8px',textDecoration:'none',transition:'opacity 0.2s' }}>
              <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
                <span style={{ fontSize:'18px',color:'var(--tg)' }}><TelegramIcon size={18}/></span>
                <div>
                  <div style={{ fontSize:'13px',fontWeight:600,color:'#fff' }}>Stay updated on Telegram</div>
                  <div style={{ fontSize:'11px',color:'rgba(34,158,217,0.65)' }}>Launch alerts & live odds</div>
                </div>
              </div>
              <span style={{ fontSize:'16px',color:'var(--tg)' }}>→</span>
            </a>

            {/* Leaderboard CTA */}
            <a href="/leaderboard" className="lb-link" style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',background:'var(--card)',border:'1px solid var(--line2)',borderRadius:'8px',textDecoration:'none',transition:'opacity 0.2s' }}>
              <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
                <span style={{ fontSize:'20px' }}>🏆</span>
                <div>
                  <div style={{ fontSize:'13px',fontWeight:600,color:'#fff' }}>Live Leaderboard</div>
                  <div style={{ fontSize:'11px',color:'var(--muted)' }}>See who's climbing the queue</div>
                </div>
              </div>
              <span style={{ fontSize:'18px',color:'var(--acid)' }}>→</span>
            </a>

            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px' }}>
              {FEATURES.map(f => (
                <div key={f.name} style={{ background:'var(--card)',border:'1px solid var(--line)',borderRadius:'8px',padding:'12px',textAlign:'center' }}>
                  <span style={{ fontSize:'clamp(16px,3vw,20px)',marginBottom:'6px',display:'block' }}>{f.icon}</span>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(11px,2vw,12px)',letterSpacing:'0.03em',color:'#fff',marginBottom:'2px' }}>{f.name}</div>
                  <div style={{ fontSize:'clamp(8px,1.5vw,9px)',color:'var(--muted)' }}>{f.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign:'center',fontSize:'clamp(8px,1.5vw,10px)',color:'var(--muted)',lineHeight:1.6 }}>
              <p style={{ margin:0 }}>⚡ Celo Network • Zero Trading Fees • Non-Custodial • Instant Payouts</p>
              <p style={{ margin:'4px 0 0' }}>
                <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" className="twt-link" style={{ color:'rgba(255,255,255,0.25)',textDecoration:'none' }}>𝕏 @{TWITTER_HANDLE}</a>
                <span style={{ color:'rgba(255,255,255,0.1)',margin:'0 6px' }}>·</span>
                <span style={{ color:'rgba(255,255,255,0.18)' }}>Launching Q3 2025</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}