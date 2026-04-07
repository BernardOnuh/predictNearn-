import { Suspense } from "react";
import { WaitlistPage } from "@/components/waitlist/WaitlistPage";

export const metadata = {
  title: "Join the Waitlist — PredictEarn",
  description:
    "Be the first to access PredictEarn — the on-chain football prediction market on Celo.",
};

export default function WaitlistRoute() {
  return (
    // Suspense is required because WaitlistPage reads from useSearchParams()
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
      </div>
    }>
      <WaitlistPage />
    </Suspense>
  );
}