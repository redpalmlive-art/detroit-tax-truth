import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ParcelBar } from "@/components/parcel-bar";
import { RemedyWorkspace } from "@/components/remedy-workspace";
import { PARCELS } from "@/lib/restore-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Restore Detroit — Property Tax Remedy Engine" },
      {
        name: "description",
        content:
          "Find every Detroit homeowner overtaxed between 2010 and 2016, trace heirs, document what is owed, and track every dollar through payment.",
      },
      { property: "og:title", content: "Restore Detroit — Property Tax Remedy Engine" },
      {
        property: "og:description",
        content:
          "A citywide restitution system: reconstruct assessments, trace claimants and heirs, calculate remedy, and prevent repeat overtaxation.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [index, setIndex] = useState(0);
  const parcel = PARCELS[index];
  const [query, setQuery] = useState(parcel.address);

  const analyze = () => {
    const q = query.trim().toLowerCase();
    const found = PARCELS.findIndex(
      (p) => p.address.toLowerCase().includes(q) || p.parcelId.includes(q),
    );
    const next = found >= 0 ? found : index;
    setIndex(next);
    setQuery(PARCELS[next].address);
  };

  const sample = () => {
    const next = (index + 1) % PARCELS.length;
    setIndex(next);
    setQuery(PARCELS[next].address);
  };

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <section className="grid gap-8 pb-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <p className="eyebrow">No family overlooked. No documented harm erased.</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] font-semibold sm:text-6xl">
            Find every claimant.
            <br />
            Recover every authorized dollar.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            A citywide restitution system that inventories every affected parcel, locates owners and
            verified heirs, documents direct and consequential harm, and tracks every approved claim
            through payment.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/estimate"
              className="rounded-xl bg-gold px-5 py-3 font-semibold text-gold-foreground"
            >
              Estimate my property tax
            </Link>
            <Link
              to="/accountability"
              className="rounded-xl border border-border bg-surface-raised px-5 py-3 font-semibold"
            >
              How we keep it honest
            </Link>
          </div>
        </div>
        <div className="flex justify-start lg:justify-end">
          <span className="rounded-full border border-gold/50 bg-gold/10 px-4 py-2 text-sm text-gold">
            ● Demonstration data
          </span>
        </div>
      </section>

      <ParcelBar value={query} onChange={setQuery} onAnalyze={analyze} onSample={sample} />

      <div className="mt-6">
        <RemedyWorkspace key={parcel.parcelId} parcel={parcel} />
      </div>
    </main>
  );
}
