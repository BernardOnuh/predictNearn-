'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

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
  { rank: 1, prize: '$10', icon: '🥇', color: '#FFD60A' },
  { rank: 2, prize: '$5',  icon: '🥈', color: '#C0C0C0' },
  { rank: 3, prize: '$3',  icon: '🥉', color: '#CD7F32' },
  { rank: 4, prize: '$2',  icon: '4️⃣',  color: '#C8FF00' },
]

type Entry = {
  id: string
  name: string
  twitter: string | null
  ref_code: string
  referral_count: number
  created_at: string
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&family=Space+Mono:wght@700&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --acid:#C8FF00; --ink:#060809; --card:#0f1214; --card2:#131619;
    --line:rgba(255,255,255,0.06); --line2:rgba(255,255,255,0.11);
    --muted:rgba(255,255,255,0.4); --text:rgba(255,255,255,0.88);
    --tg:#229ED9;
  }
  html,body { background:var(--ink); color:var(--text); font-family:'DM Sans',sans-serif; margin:0; padding:0; }
  @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes scrollx { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes shimmer { 0%{opacity:0.4} 50%{opacity:0.7} 100%{opacity:0.4} }
  .anim-blink   { animation:blink 1.8s ease-in-out infinite; }
  .anim-scrollx { animation:scrollx 32s linear infinite; }
  .anim-shimmer { animation:shimmer 1.4s ease-in-out infinite; }
  a.tg-link:hover  { opacity:0.85; }
  a.twt-link:hover { opacity:0.8; }
  a.lb-link:hover  { opacity:0.8; }
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:3px; }
`

const TICKER_DATA = [
  ['Man City vs Arsenal','2.15'],['Real Madrid vs PSG','1.85'],
  ['Liverpool vs Chelsea','4.40'],['Dortmund vs Bayern','3.10'],
  ['Barcelona vs Atletico','1.95'],['Ajax vs Inter','2.55'],
]

function Ticker() {
  const doubled = [...TICKER_DATA, ...TICKER_DATA]
  return (
    <div style={{ borderTop:'1px solid var(--line2)',borderBottom:'1px solid var(--line2)',padding:'7px 0',overflow:'hidden',position:'relative' }}>
      <div style={{ position:'absolute',top:0,bottom:0,left:0,width:'40px',zIndex:2,background:'linear-gradient(90deg,var(--ink),transparent)',pointerEvents:'none' }}/>
      <div style={{ position:'absolute',top:0,bottom:0,right:0,width:'40px',zIndex:2,background:'linear-gradient(-90deg,var(--ink),transparent)',pointerEvents:'none' }}/>
      <div className="anim-scrollx" style={{ display:'flex',whiteSpace:'nowrap' }}>
        {doubled.map(([t,o],i) => (
          <span key={i} style={{ display:'inline-flex',alignItems:'center',gap:'6px',padding:'0 20px',fontSize:'11px',color:'var(--muted)' }}>
            <span style={{ width:'2px',height:'2px',borderRadius:'50%',background:'var(--line2)',flexShrink:0 }}/>
            <span style={{ color:'var(--text)',fontWeight:600 }}>{t}</span>
            <span style={{ color:'rgba(255,255,255,0.2)' }}>·</span>
            <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'13px',color:'var(--acid)' }}>{o}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function TelegramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}

function PrizePool() {
  return (
    <div style={{ background:'rgba(0,0,0,0.3)',border:'1px solid rgba(255,214,10,0.2)',borderRadius:'10px',padding:'clamp(14px,3vw,18px)',marginBottom:'clamp(20px,4vw,28px)' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px',flexWrap:'wrap',gap:'6px' }}>
        <div style={{ fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',color:'rgba(255,214,10,0.85)' }}>
          💰 Referral Prize Pool
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:'5px',fontSize:'10px',color:'var(--muted)' }}>
          <span style={{ width:'5px',height:'5px',borderRadius:'50%',background:'#30D158',display:'inline-block',boxShadow:'0 0 5px #30D158' }}/>
          Pays out {PAYOUT_DATE}
        </div>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'6px' }}>
        {PRIZES.map(p => (
          <div key={p.rank} style={{ background:`${p.color}0a`,border:`1px solid ${p.color}30`,borderRadius:'8px',padding:'10px 6px',textAlign:'center' }}>
            <div style={{ fontSize:'clamp(14px,3vw,18px)',marginBottom:'3px' }}>{p.icon}</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(20px,5vw,28px)',color:p.color,lineHeight:1 }}>{p.prize}</div>
            <div style={{ fontSize:'9px',color:'var(--muted)',marginTop:'2px',textTransform:'uppercase',letterSpacing:'0.05em' }}>#{p.rank} place</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize:'10px',color:'rgba(255,255,255,0.2)',textAlign:'center',margin:'10px 0 0' }}>
        Top 4 referrers paid to their email · {PAYOUT_DATE}
      </p>
    </div>
  )
}

function tierInfo(count: number) {
  if (count >= 25) return { label:'VIP',          icon:'👑', color:'#FFD60A' }
  if (count >= 10) return { label:'Bonus cUSD',   icon:'💰', color:'#30D158' }
  if (count >= 3)  return { label:'Early Access', icon:'🎯', color:'#C8FF00' }
  return             { label:'Joined',            icon:'⏳', color:'rgba(255,255,255,0.25)' }
}

function Medal({ rank }: { rank: number }) {
  if (rank === 1) return <span style={{ fontSize:'20px' }}>🥇</span>
  if (rank === 2) return <span style={{ fontSize:'20px' }}>🥈</span>
  if (rank === 3) return <span style={{ fontSize:'20px' }}>🥉</span>
  if (rank === 4) return <span style={{ fontSize:'16px' }}>4️⃣</span>
  return <span style={{ fontFamily:"'Space Mono',monospace",fontSize:'11px',color:'var(--muted)',width:'24px',textAlign:'center',display:'inline-block' }}>#{rank}</span>
}

function SkeletonRow() {
  return <div className="anim-shimmer" style={{ height:'64px',background:'var(--card)',borderRadius:'10px',marginBottom:'6px' }}/>
}

export default function LeaderboardPage() {
  const [entries,   setEntries]   = useState<Entry[]>([])
  const [loading,   setLoading]   = useState(true)
  const [myRefCode, setMyRefCode] = useState<string | null>(null)
  const [copied,    setCopied]    = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setMyRefCode(JSON.parse(raw).refCode ?? null)
    } catch {}
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('waitlist')
        .select('id, name, twitter, ref_code, referral_count, created_at')
        .order('referral_count', { ascending: false })
        .order('created_at',     { ascending: true })
      setEntries(data ?? [])
      setLoading(false)
    }
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const myIndex = entries.findIndex(e => e.ref_code === myRefCode)
  const myEntry = myIndex >= 0 ? entries[myIndex] : null
  const myRank  = myIndex >= 0 ? myIndex + 1 : null
  const myLink  = myRefCode ? `https://predictearn.xyz?ref=${myRefCode}` : null

  const totalSignups   = entries.length
  const totalReferrals = entries.reduce((s, e) => s + e.referral_count, 0)

  const handleCopy = () => {
    if (!myLink) return
    navigator.clipboard.writeText(myLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Prize color for top 4 rows
  const prizeColor = (rank: number) => {
    if (rank === 1) return '#FFD60A'
    if (rank === 2) return '#C0C0C0'
    if (rank === 3) return '#CD7F32'
    if (rank === 4) return '#C8FF00'
    return null
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }}/>
      <div style={{ minHeight:'100vh',background:'var(--ink)' }}>

        {/* Nav */}
        <div style={{ borderBottom:'1px solid var(--line2)',padding:'14px clamp(16px,4vw,32px)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'8px' }}>
          <a href="/" style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'22px',color:'#fff',textDecoration:'none',display:'flex',alignItems:'center',gap:'8px' }}>
            <span className="anim-blink" style={{ width:'7px',height:'7px',borderRadius:'50%',background:'var(--acid)',boxShadow:'0 0 10px var(--acid)',display:'inline-block' }}/>
            PredictEarn
          </a>
          <div style={{ display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap' }}>
            <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" className="twt-link"
              style={{ fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.65)',textDecoration:'none',padding:'5px 9px',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'4px',transition:'opacity 0.2s' }}>
              𝕏 @{TWITTER_HANDLE}
            </a>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="tg-link"
              style={{ fontSize:'11px',fontWeight:600,color:'var(--tg)',textDecoration:'none',padding:'5px 9px',border:'1px solid rgba(34,158,217,0.3)',borderRadius:'4px',display:'flex',alignItems:'center',gap:'5px',transition:'opacity 0.2s' }}>
              <TelegramIcon size={12}/>
              Telegram
            </a>
            <div style={{ display:'flex',alignItems:'center',gap:'8px' }}>
              <div style={{ width:'6px',height:'6px',borderRadius:'50%',background:'var(--acid)',boxShadow:'0 0 8px var(--acid)' }}/>
              <span style={{ fontSize:'11px',fontWeight:600,color:'var(--acid)',letterSpacing:'0.08em',textTransform:'uppercase' }}>Live</span>
            </div>
          </div>
        </div>

        <Ticker/>

        <div style={{ maxWidth:'640px',margin:'0 auto',padding:'clamp(20px,4vw,40px) clamp(16px,4vw,24px)' }}>

          {/* Title */}
          <div style={{ textAlign:'center',marginBottom:'clamp(20px,4vw,32px)' }}>
            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(40px,10vw,72px)',color:'#fff',lineHeight:0.9,marginBottom:'8px' }}>
              Referral<br/><span style={{ color:'var(--acid)' }}>Leaderboard</span>
            </h1>
            <p style={{ fontSize:'13px',color:'var(--muted)',lineHeight:1.6 }}>
              Refer friends to climb the queue. Top 4 referrers win cash prizes paid on <span style={{ color:'rgba(255,214,10,0.8)',fontWeight:600 }}>{PAYOUT_DATE}</span>.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'clamp(16px,3vw,24px)' }}>
            {[
              { label:'Total Signups',   value: loading ? '—' : totalSignups },
              { label:'Total Referrals', value: loading ? '—' : totalReferrals },
            ].map(s => (
              <div key={s.label} style={{ background:'var(--card)',border:'1px solid var(--line2)',borderRadius:'10px',padding:'16px 20px',textAlign:'center' }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(32px,8vw,48px)',color:'var(--acid)',lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:'10px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--muted)',marginTop:'4px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Prize Pool */}
          <PrizePool/>

          {/* MY POSITION */}
          {myEntry && myRank && (
            <div style={{ background:'linear-gradient(135deg,rgba(200,255,0,0.08),rgba(200,255,0,0.03))',border:'1px solid rgba(200,255,0,0.3)',borderRadius:'12px',padding:'clamp(16px,3vw,24px)',marginBottom:'clamp(20px,4vw,28px)' }}>
              <div style={{ fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',color:'rgba(200,255,0,0.6)',marginBottom:'12px' }}>
                ✦ Your position
              </div>
              <div style={{ display:'flex',alignItems:'center',gap:'16px',marginBottom:'16px' }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(56px,14vw,80px)',color:'var(--acid)',lineHeight:0.85,flexShrink:0 }}>
                  #{myRank}
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontWeight:600,fontSize:'16px',color:'#fff',marginBottom:'4px' }}>{myEntry.name}</div>
                  {myEntry.twitter && (
                    <div style={{ fontSize:'12px',color:'rgba(200,255,0,0.5)',marginBottom:'6px' }}>@{myEntry.twitter}</div>
                  )}
                  <div style={{ display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap' }}>
                    <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'20px',color:'var(--acid)' }}>{myEntry.referral_count}</span>
                    <span style={{ fontSize:'11px',color:'var(--muted)' }}>referrals</span>
                    {(() => { const t = tierInfo(myEntry.referral_count); return (
                      <span style={{ fontSize:'11px',fontWeight:600,color:t.color,background:`${t.color}18`,border:`1px solid ${t.color}40`,borderRadius:'100px',padding:'2px 8px' }}>
                        {t.icon} {t.label}
                      </span>
                    )})()}
                    {myRank <= 4 && (
                      <span style={{ fontSize:'11px',fontWeight:700,color:prizeColor(myRank)!,background:`${prizeColor(myRank)}18`,border:`1px solid ${prizeColor(myRank)}40`,borderRadius:'100px',padding:'2px 8px' }}>
                        {PRIZES[myRank-1].prize} prize 🎉
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {myLink && (
                <div style={{ marginBottom:'12px' }}>
                  <div style={{ fontSize:'10px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--muted)',marginBottom:'6px' }}>Your referral link</div>
                  <div style={{ display:'flex',gap:'6px' }}>
                    <div style={{ flex:1,fontFamily:"'Space Mono',monospace",fontSize:'10px',color:'rgba(200,255,0,0.5)',background:'rgba(0,0,0,0.4)',border:'1px solid rgba(200,255,0,0.15)',borderRadius:'4px',padding:'8px 10px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
                      {myLink}
                    </div>
                    <button onClick={handleCopy} style={{ padding:'8px 14px',background:copied?'rgba(200,255,0,0.15)':'transparent',border:'1px solid rgba(200,255,0,0.3)',borderRadius:'4px',color:copied?'var(--acid)':'#fff',fontSize:'11px',fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",whiteSpace:'nowrap',transition:'all 0.2s' }}>
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                    <a href={`https://twitter.com/intent/tweet?text=I%20just%20joined%20%40${TWITTER_HANDLE}%20%E2%80%94%20the%20first%20on-chain%20prediction%20market%20on%20Celo.%20Top%20referrers%20win%20cash%20on%20${encodeURIComponent(PAYOUT_DATE)}%21%20Join%3A%20${encodeURIComponent(myLink)}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ padding:'8px 14px',background:'#fff',color:'#000',borderRadius:'4px',fontSize:'11px',fontWeight:700,textDecoration:'none',display:'inline-flex',alignItems:'center',whiteSpace:'nowrap' }}>
                      𝕏 Share
                    </a>
                  </div>
                </div>
              )}

              {myEntry.referral_count < 25 && (() => {
                const next = myEntry.referral_count < 3 ? 3 : myEntry.referral_count < 10 ? 10 : 25
                const prev = myEntry.referral_count < 3 ? 0 : myEntry.referral_count < 10 ? 3 : 10
                const pct  = Math.round(((myEntry.referral_count - prev) / (next - prev)) * 100)
                const { label } = tierInfo(next)
                return (
                  <div>
                    <div style={{ display:'flex',justifyContent:'space-between',fontSize:'10px',color:'var(--muted)',marginBottom:'5px' }}>
                      <span>Progress to {label}</span>
                      <span>{myEntry.referral_count} / {next} referrals</span>
                    </div>
                    <div style={{ height:'4px',background:'rgba(255,255,255,0.08)',borderRadius:'4px',overflow:'hidden' }}>
                      <div style={{ height:'100%',width:`${pct}%`,background:'var(--acid)',borderRadius:'4px',transition:'width 0.5s ease' }}/>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Not signed up yet */}
          {!myEntry && !loading && (
            <div style={{ background:'var(--card)',border:'1px solid var(--line2)',borderRadius:'12px',padding:'20px',marginBottom:'24px',textAlign:'center' }}>
              <div style={{ fontSize:'14px',color:'var(--muted)',marginBottom:'12px' }}>You haven't joined the waitlist yet</div>
              <a href="/" style={{ display:'inline-block',padding:'10px 24px',background:'var(--acid)',color:'var(--ink)',borderRadius:'6px',fontFamily:"'Bebas Neue',sans-serif",fontSize:'14px',fontWeight:700,letterSpacing:'0.04em',textDecoration:'none' }}>
                Join the Waitlist →
              </a>
            </div>
          )}

          {/* Telegram banner */}
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="tg-link"
            style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',background:'rgba(34,158,217,0.09)',border:'1px solid rgba(34,158,217,0.28)',borderRadius:'8px',textDecoration:'none',marginBottom:'clamp(20px,4vw,28px)',transition:'opacity 0.2s' }}>
            <div style={{ display:'flex',alignItems:'center',gap:'12px' }}>
              <div style={{ width:'34px',height:'34px',borderRadius:'50%',background:'rgba(34,158,217,0.15)',border:'1px solid rgba(34,158,217,0.3)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--tg)',flexShrink:0 }}>
                <TelegramIcon size={16}/>
              </div>
              <div>
                <div style={{ fontSize:'13px',fontWeight:600,color:'#fff',marginBottom:'2px' }}>Join our Telegram Channel</div>
                <div style={{ fontSize:'11px',color:'rgba(34,158,217,0.7)' }}>Get launch alerts, odds drops & exclusive updates</div>
              </div>
            </div>
            <div style={{ fontSize:'11px',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--tg)',background:'rgba(34,158,217,0.15)',border:'1px solid rgba(34,158,217,0.28)',borderRadius:'4px',padding:'5px 10px',whiteSpace:'nowrap',flexShrink:0 }}>
              Join →
            </div>
          </a>

          {/* Reward tiers */}
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',marginBottom:'clamp(20px,4vw,28px)' }}>
            {[
              { refs:3,  label:'Early Access', icon:'🎯', color:'#C8FF00' },
              { refs:10, label:'Bonus cUSD',   icon:'💰', color:'#30D158' },
              { refs:25, label:'VIP Tier',     icon:'👑', color:'#FFD60A' },
            ].map(t => (
              <div key={t.refs} style={{ background:'var(--card)',border:'1px solid var(--line)',borderRadius:'8px',padding:'12px',textAlign:'center' }}>
                <div style={{ fontSize:'18px',marginBottom:'4px' }}>{t.icon}</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'26px',color:t.color,lineHeight:1 }}>{t.refs}</div>
                <div style={{ fontSize:'9px',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.08em',margin:'2px 0 3px' }}>referrals</div>
                <div style={{ fontSize:'11px',color:'#fff',fontWeight:600 }}>{t.label}</div>
              </div>
            ))}
          </div>

          {/* Leaderboard list */}
          <div style={{ fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',color:'var(--muted)',marginBottom:'12px' }}>
            🏆 Top Referrers
          </div>

          <div style={{ display:'flex',flexDirection:'column',gap:'6px' }}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i}/>)
              : entries.length === 0
                ? <div style={{ textAlign:'center',padding:'40px',color:'var(--muted)',fontSize:'14px' }}>No signups yet — be the first!</div>
                : entries.map((e, i) => {
                    const rank  = i + 1
                    const isMe  = e.ref_code === myRefCode
                    const tier  = tierInfo(e.referral_count)
                    const prize = PRIZES.find(p => p.rank === rank)
                    const isPrize = rank <= 4

                    return (
                      <div key={e.id} id={isMe ? 'my-row' : undefined}
                        style={{ display:'flex',alignItems:'center',gap:'14px',
                          background: isMe
                            ? 'linear-gradient(135deg,rgba(200,255,0,0.1),rgba(200,255,0,0.04))'
                            : isPrize ? `${prize!.color}08` : rank<=3?'var(--card2)':'var(--card)',
                          border: isMe
                            ? '1px solid rgba(200,255,0,0.35)'
                            : isPrize ? `1px solid ${prize!.color}28` : 'var(--line)',
                          borderRadius:'10px',padding:'14px 16px',position:'relative' }}>

                        {isMe && (
                          <div style={{ position:'absolute',top:'-1px',right:'10px',background:'var(--acid)',color:'var(--ink)',fontSize:'8px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'2px 7px',borderRadius:'0 0 4px 4px' }}>
                            You
                          </div>
                        )}

                        {isPrize && !isMe && (
                          <div style={{ position:'absolute',top:'-1px',right:'10px',background:prize!.color,color:'#000',fontSize:'8px',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',padding:'2px 7px',borderRadius:'0 0 4px 4px' }}>
                            {prize!.prize}
                          </div>
                        )}

                        <div style={{ width:'28px',textAlign:'center',flexShrink:0 }}>
                          <Medal rank={rank}/>
                        </div>

                        <div style={{ width:'34px',height:'34px',borderRadius:'50%',
                          background:isMe?'rgba(200,255,0,0.15)':isPrize?`${prize!.color}18`:'rgba(255,255,255,0.05)',
                          border:`1px solid ${isMe?'rgba(200,255,0,0.3)':isPrize?`${prize!.color}35`:'rgba(255,255,255,0.08)'}`,
                          display:'flex',alignItems:'center',justifyContent:'center',fontWeight:600,fontSize:'13px',
                          color:isMe?'var(--acid)':isPrize?prize!.color:'var(--muted)',flexShrink:0 }}>
                          {e.name.charAt(0).toUpperCase()}
                        </div>

                        <div style={{ flex:1,minWidth:0 }}>
                          <div style={{ fontWeight:600,fontSize:'13px',color:isMe?'#fff':'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
                            {e.name}
                          </div>
                          {e.twitter && (
                            <div style={{ fontSize:'11px',color:'rgba(200,255,0,0.45)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
                              @{e.twitter}
                            </div>
                          )}
                        </div>

                        <div style={{ textAlign:'right',flexShrink:0 }}>
                          <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'22px',color:e.referral_count>0?'var(--acid)':'rgba(255,255,255,0.2)',lineHeight:1 }}>
                            {e.referral_count}
                          </div>
                          <div style={{ fontSize:'9px',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.06em' }}>refs</div>
                        </div>

                        <div style={{ flexShrink:0,fontSize:'10px',fontWeight:600,color:tier.color,background:`${tier.color}15`,border:`1px solid ${tier.color}35`,borderRadius:'100px',padding:'3px 9px',whiteSpace:'nowrap' }}>
                          {tier.icon} {tier.label}
                        </div>
                      </div>
                    )
                  })
            }
          </div>

          <div style={{ textAlign:'center',marginTop:'28px',fontSize:'11px',color:'rgba(255,255,255,0.15)',lineHeight:1.8 }}>
            <p>Updates every 30s · PredictEarn · Celo Network</p>
            <p>
              <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" className="twt-link" style={{ color:'rgba(255,255,255,0.2)',textDecoration:'none' }}>𝕏 @{TWITTER_HANDLE}</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}