import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ParcelBar } from "@/components/parcel-bar";
import { RemedyWorkspace } from "@/components/remedy-workspace";
import { SafeguardAgent } from "@/components/safeguard-agent";
import { PARCELS } from "@/lib/restore-data";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState(PARCELS[0]!.address);
  const [currentParcel, setCurrentParcel] = useState(PARCELS[0]!);
  const [isLoading, setIsLoading] = useState(false);
  const [realData, setRealData] = useState<any>(null);

  const select = (next: number) => {
    setIndex(next);
    const p = PARCELS[next]!;
    setQuery(p.address);
    setCurrentParcel(p);
    setRealData(null);
  };

  const analyze = async () => {
    const q = query.trim();
    if (!q) return;
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env['VITE_API_URL']} || "http://127.0.0.1:8000"}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q, address: q }),
      });
      if (res.ok) {
        const data = await res.json();
        setRealData(data);
        setCurrentParcel({
        ...PARCELS[0]!,
          address: data.address,
          parcelId: data.parcelId,
        } as any);
        setIsLoading(false);
        return;
      }
    } catch {}

    const foundIdx = PARCELS.findIndex(p => p.address.toLowerCase().includes(q.toLowerCase()));
    if (foundIdx >= 0) select(foundIdx);
    else setCurrentParcel({...PARCELS[0]!, address: q.toUpperCase(), parcelId: `DET-${Date.now()}` } as any);
    setIsLoading(false);
  };

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <section className="grid gap-8 pb-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <p className="eyebrow">No family overlooked. No documented harm erased.</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] font-semibold sm:text-6xl">
            Find every claimant.<br />Recover every authorized dollar.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Enter any Detroit address — AI Safeguards prevent the next 2008 crisis.
          </p>
        </div>
        <div className="flex justify-start lg:justify-end">
          <span className="rounded-full border border-gold/50 bg-gold/10 px-4 py-2 text-sm text-gold">
            {isLoading? "● Analyzing..." : realData? `● $${realData.totalRecoverable?.toLocaleString()} recoverable` : "● Safeguard Active"}
          </span>
        </div>
      </section>

      <ParcelBar value={query} onChange={setQuery} onAnalyze={analyze} onSample={() => select((index + 1) % PARCELS.length)} />

      <div className="mt-6">
        <RemedyWorkspace key={currentParcel.parcelId} parcel={currentParcel} />
        {realData && <SafeguardAgent parcelData={realData} />}
      </div>
    </main>
  );
}