import { Suspense } from "react";
import { WaitlistPage } from "@/components/waitlist/WaitlistPage";

export const metadata: Metadata = {
  title: 'PredictEarn — Waitlist',
  description: 'The first on-chain football prediction market on Celo via MiniPay.',
}

export default function WaitlistRoute() {
  return (

    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
      </div>
    }>
      <WaitlistPage/>
    </Suspense>
  );
}