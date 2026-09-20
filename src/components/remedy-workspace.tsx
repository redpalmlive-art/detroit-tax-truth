import { useMemo, useState, type ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import {
  LEDGER,
  METHOD_STEPS,
  MONITOR_ROWS,
  PARCELS,
  RECOVERY_STAGES,
  currency,
  type Parcel,
} from "@/lib/restore-data";

const STEPS = [
  "Reconstruct",
  "Trace claimant",
  "Calculate remedy",
  "Recover payment",
  "Prevent repeat",
] as const;

export function RemedyWorkspace({ parcel }: { parcel: Parcel }) {
  const [step, setStep] = useState(0);

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="panel h-fit p-4">
        <ol className="space-y-2">
          {STEPS.map((label, i) => {
            const active = i === step;
            return (
              <li key={label}>
                <button
                  onClick={() => setStep(i)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-semibold transition-colors ${
                    active
                      ? "bg-gold text-gold-foreground"
                      : "text-foreground/85 hover:bg-surface-raised"
                  }`}
                >
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-bold ${
                      active ? "bg-gold-foreground/10" : "bg-surface-raised"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {label}
                </button>
              </li>
            );
          })}
        </ol>
        <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
          This prototype supports human review. It does not determine legal eligibility or
          compensation.
        </p>
      </aside>

      <div className="space-y-5">
        {step === 0 && <Reconstruct parcel={parcel} />}
        {step === 1 && <TraceClaimant parcel={parcel} />}
        {step === 2 && <CalculateRemedy parcel={parcel} />}
        {step === 3 && <RecoverPayment />}
        {step === 4 && <PreventRepeat />}
      </div>
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  subtitle,
  children,
  aside,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-1 text-3xl font-semibold">{title}</h2>
          {subtitle && <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="panel bg-surface p-5">
      <p className="eyebrow text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
      {note && <p className="mt-1 text-sm text-mint">{note}</p>}
    </div>
  );
}

function Reconstruct({ parcel }: { parcel: Parcel }) {
  return (
    <>
      <section className="panel p-6">
        <p className="eyebrow">Citywide inclusion ledger</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {LEDGER.map((l) => (
            <div key={l.label} className="panel bg-surface-raised/60 p-5">
              <p className="font-display text-3xl font-semibold">{l.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{l.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-muted-foreground">
          Every parcel receives a documented disposition and appeal path. No record can simply
          disappear.
        </p>
      </section>

      <Panel
        eyebrow="Parcel reconstruction"
        title={parcel.address}
        subtitle={`Parcel ${parcel.parcelId} · ${parcel.neighborhood} · ${parcel.classification}`}
        aside={
          <span className="rounded-full border border-clay/60 px-4 py-2 text-sm font-semibold text-clay">
            {parcel.priority}
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Estimated overtax" value={currency(parcel.overtax)} note="2010-2016 total" />
        <Stat
          label="Peak assessment ratio"
          value={`${parcel.peakRatio}%`}
          note={`${parcel.peakRatio - 50} points above cap`}
        />
        <Stat label="Confidence" value={`${parcel.confidence}%`} note="7 records aligned" />
        <Stat label="Review status" value={parcel.status} note="Human sign-off required" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="panel p-6">
          <h3 className="text-2xl font-semibold">Reconstructed assessment history</h3>
          <p className="mt-1 text-muted-foreground">
            Billed assessment compared with the 50% constitutional benchmark
          </p>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={parcel.history}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="year" stroke="var(--muted-foreground)" tickLine={false} />
                <Tooltip
                  cursor={{ fill: "var(--surface-raised)" }}
                  contentStyle={{
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--foreground)",
                  }}
                  formatter={(v: number) => currency(v)}
                />
                <Legend />
                <Bar dataKey="billed" name="Billed" fill="var(--clay)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="benchmark" name="Benchmark" fill="var(--mint)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel p-6">
          <h3 className="text-2xl font-semibold">How the estimate was built</h3>
          <p className="mt-1 text-muted-foreground">Every conclusion keeps its source trail.</p>
          <ol className="mt-5 space-y-4">
            {METHOD_STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-3 border-b border-border pb-4 last:border-0">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-raised text-sm font-semibold text-mint">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-semibold">{s.title}</span>
                  <span className="block text-sm text-muted-foreground">{s.detail}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-5 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm leading-relaxed">
            The billed taxable basis exceeded the modeled constitutional benchmark in 7 of 7 years.
          </p>
        </section>
      </div>
    </>
  );
}

function TraceClaimant({ parcel }: { parcel: Parcel }) {
  return (
    <Panel
      eyebrow="Entity resolution"
      title="Potential claimant chain"
      subtitle="Records are linked probabilistically and routed to a trained reviewer before contact."
    >
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead className="text-sm text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-3 font-medium">Record</th>
              <th className="py-3 font-medium">Name / event</th>
              <th className="py-3 font-medium">Date</th>
              <th className="py-3 font-medium">Match</th>
            </tr>
          </thead>
          <tbody>
            {parcel.claimant.records.map((r) => (
              <tr key={r.record} className="border-b border-border/70 last:border-0">
                <td className="py-4">{r.record}</td>
                <td className="py-4">{r.event}</td>
                <td className="py-4 text-muted-foreground">{r.date}</td>
                <td className="py-4">
                  <span className="rounded-md bg-mint/15 px-2 py-1 text-sm text-mint">
                    {r.match}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 rounded-xl border border-mint/30 bg-mint/10 p-4 leading-relaxed">
        <span className="font-semibold">Recommended claimant:</span> {parcel.claimant.name} ·{" "}
        {parcel.claimant.note}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button className="rounded-xl bg-gold px-5 py-3 font-semibold text-gold-foreground">
          Mark for human verification
        </button>
        <button className="rounded-xl border border-border bg-surface-raised px-5 py-3 font-semibold">
          View match explanation
        </button>
      </div>
    </Panel>
  );
}

function CalculateRemedy({ parcel }: { parcel: Parcel }) {
  const [harm, setHarm] = useState(parcel.harm);
  const [rate, setRate] = useState(3);
  const [years, setYears] = useState(10);

  const total = useMemo(() => {
    const base = Object.values(harm).reduce((a, b) => a + (Number(b) || 0), 0);
    const interest = harm.overtax * (rate / 100) * years;
    return base + interest;
  }, [harm, rate, years]);

  const fields: { key: keyof typeof harm; label: string; help: string }[] = [
    { key: "overtax", label: "Illegal overtax paid", help: "Tax bills, payment history and corrected valuation" },
    { key: "equity", label: "Lost home equity", help: "Fair market value less lawful debt and proceeds" },
    { key: "relocation", label: "Relocation and housing costs", help: "Moving, deposits, rent increases and temporary lodging" },
    { key: "appreciation", label: "Lost appreciation", help: "Expert-supported but-for value; no duplicate recovery" },
    { key: "hardship", label: "Personal hardship request", help: "Documented displacement, health and emotional impact; only if authorized" },
  ];

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <section className="panel p-6">
        <p className="eyebrow">Complete harm ledger</p>
        <h2 className="mt-1 text-3xl font-semibold">Document every provable loss</h2>
        <p className="mt-2 text-muted-foreground">
          These are evidence-backed requests, not automatic awards. Authorized reviewers determine
          eligibility.
        </p>
        <div className="mt-6 space-y-4">
          {fields.map((f) => (
            <div
              key={f.key}
              className="flex flex-col gap-3 border-b border-border pb-4 last:border-0 sm:flex-row sm:items-center"
            >
              <label htmlFor={f.key} className="flex-1">
                <span className="block text-lg font-semibold">{f.label}</span>
                <span className="block text-sm text-muted-foreground">{f.help}</span>
              </label>
              <input
                id={f.key}
                type="number"
                min={0}
                value={harm[f.key]}
                onChange={(e) => setHarm({ ...harm, [f.key]: Number(e.target.value) })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg outline-none focus:border-gold sm:w-56"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="panel h-fit p-6">
        <p className="eyebrow">Policy controls</p>
        <h3 className="mt-1 text-3xl font-semibold">Illustrative claim</h3>

        <label className="mt-5 block text-sm text-muted-foreground" htmlFor="rate">
          Interest adjustment on overtax (%)
        </label>
        <input
          id="rate"
          type="number"
          min={0}
          max={12}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-lg outline-none focus:border-gold"
        />

        <label className="mt-4 block text-sm text-muted-foreground" htmlFor="years">
          Years applied
        </label>
        <input
          id="years"
          type="number"
          min={0}
          max={30}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-lg outline-none focus:border-gold"
        />

        <div className="mt-6 rounded-2xl bg-parchment p-5 text-[oklch(0.2_0.03_165)]">
          <p className="text-sm font-medium">Total documented request</p>
          <p className="font-display text-4xl font-semibold">{currency(total)}</p>
          <p className="mt-2 text-sm opacity-75">
            Each category remains separate for approval, denial or appeal.
          </p>
        </div>

        <button className="mt-5 w-full rounded-xl bg-gold px-5 py-3 font-semibold text-gold-foreground">
          Download complete claim packet
        </button>
      </section>
    </div>
  );
}

function RecoverPayment() {
  return (
    <Panel
      eyebrow="Claim-to-payment enforcement"
      title="Recovery tracker"
      subtitle="A case closes only after every approved dollar reaches the claimant or verified estate."
    >
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead className="text-sm text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-3 font-medium">Stage</th>
              <th className="py-3 font-medium">Responsible office</th>
              <th className="py-3 font-medium">Deadline</th>
              <th className="py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {RECOVERY_STAGES.map((s) => (
              <tr key={s.stage} className="border-b border-border/70 last:border-0">
                <td className="py-4">{s.stage}</td>
                <td className="py-4">{s.office}</td>
                <td className="py-4 text-muted-foreground">{s.deadline}</td>
                <td className="py-4">
                  {s.status === "Pending" ? (
                    <span className="text-muted-foreground">{s.status}</span>
                  ) : (
                    <span className="rounded-md bg-mint/15 px-2 py-1 text-sm text-mint">
                      {s.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 rounded-xl border border-gold/40 bg-gold/10 p-4 leading-relaxed">
        <span className="font-semibold">Accountability rule:</span> missed deadlines escalate
        automatically. Denials require written reasons and an appeal packet. Uncashed payments
        trigger renewed heir and contact tracing—not case closure.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button className="rounded-xl bg-gold px-5 py-3 font-semibold text-gold-foreground">
          Advance demo case
        </button>
        <button className="rounded-xl border border-border bg-surface-raised px-5 py-3 font-semibold">
          Generate appeal packet
        </button>
      </div>
    </Panel>
  );
}

function PreventRepeat() {
  const severityClass = (s: string) =>
    s === "High"
      ? "bg-clay/20 text-clay"
      : s === "Medium"
        ? "bg-mint/15 text-mint"
        : "bg-surface-raised text-muted-foreground";

  return (
    <Panel
      eyebrow="Forward protection"
      title="Assessment equity monitor"
      subtitle="Pre-bill anomaly checks surface patterns for review before residents are harmed."
    >
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { label: "Parcels scanned", value: "380,214", pct: 100, color: "bg-mint" },
          { label: "Flagged for review", value: "2,841", pct: 38, color: "bg-gold" },
          { label: "High-severity cluster", value: "6 areas", pct: 18, color: "bg-clay" },
        ].map((c) => (
          <div key={c.label} className="panel bg-surface-raised/60 p-5">
            <p className="text-muted-foreground">{c.label}</p>
            <p className="mt-1 font-display text-3xl font-semibold">{c.value}</p>
            <div className="mt-4 h-1.5 w-full rounded-full bg-background">
              <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead className="text-sm text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-3 font-medium">Area</th>
              <th className="py-3 font-medium">Pattern detected</th>
              <th className="py-3 font-medium">Parcels</th>
              <th className="py-3 font-medium">Severity</th>
              <th className="py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {MONITOR_ROWS.map((r) => (
              <tr key={r.area} className="border-b border-border/70 last:border-0">
                <td className="py-4">{r.area}</td>
                <td className="py-4">{r.pattern}</td>
                <td className="py-4">{r.parcels}</td>
                <td className="py-4">
                  <span className={`rounded-md px-2 py-1 text-sm ${severityClass(r.severity)}`}>
                    {r.severity}
                  </span>
                </td>
                <td className="py-4 text-muted-foreground">{r.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button className="rounded-xl bg-gold px-5 py-3 font-semibold text-gold-foreground">
          Export review queue
        </button>
        <button className="rounded-xl border border-border bg-surface-raised px-5 py-3 font-semibold">
          Read fairness safeguards
        </button>
      </div>
    </Panel>
  );
}

