import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MILLAGE, currency, estimateTax } from "@/lib/restore-data";

export const Route = createFileRoute("/estimate")({
  head: () => ({
    meta: [
      { title: "Detroit Property Tax Estimator — Restore Detroit" },
      {
        name: "description",
        content:
          "Enter a Detroit address and purchase price to see the assessed value, taxable value and yearly property tax bill under the 50% constitutional cap.",
      },
      { property: "og:title", content: "Detroit Property Tax Estimator — Restore Detroit" },
      {
        property: "og:description",
        content:
          "See what you would owe before you buy: assessed value, taxable value, millage and summer/winter bills.",
      },
    ],
  }),
  component: EstimatePage,
});

function EstimatePage() {
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState(120000);
  const [primary, setPrimary] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => estimateTax(price || 0, primary), [price, primary]);
  const fairnessGap = Math.round(((price * 0.5 - result.taxable) / (price * 0.5 || 1)) * 100);

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <p className="eyebrow">Before you buy</p>
      <h1 className="mt-3 font-display text-5xl leading-tight font-semibold">
        What will this Detroit home cost me in taxes?
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Michigan caps the assessed value of a home at 50% of its market value. Enter the address and
        the price you expect to pay, and we show the bill that follows.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="panel mt-8 grid gap-5 p-6 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label htmlFor="addr" className="block text-sm text-muted-foreground">
            Property address
          </label>
          <input
            id="addr"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            maxLength={120}
            placeholder="1456 Atkinson Street, Detroit, MI"
            className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-lg outline-none focus:border-gold"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm text-muted-foreground">
            Purchase price / market value
          </label>
          <input
            id="price"
            type="number"
            min={0}
            max={10000000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-lg outline-none focus:border-gold"
          />
        </div>

        <div>
          <span className="block text-sm text-muted-foreground">Will you live here?</span>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setPrimary(true)}
              className={`flex-1 rounded-xl px-4 py-3 font-semibold ${primary ? "bg-gold text-gold-foreground" : "border border-border bg-surface-raised"}`}
            >
              Yes, primary home
            </button>
            <button
              type="button"
              onClick={() => setPrimary(false)}
              className={`flex-1 rounded-xl px-4 py-3 font-semibold ${!primary ? "bg-gold text-gold-foreground" : "border border-border bg-surface-raised"}`}
            >
              Rental / second
            </button>
          </div>
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-gold px-6 py-3 font-semibold text-gold-foreground"
          >
            Estimate my tax bill
          </button>
        </div>
      </form>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Figure label="Assessed value (50% cap)" value={currency(result.assessed)} />
        <Figure label="Taxable value" value={currency(result.taxable)} />
        <Figure
          label="Millage rate"
          value={`${result.mills.toFixed(1)} mills`}
          note={primary ? "Principal residence exemption" : "No PRE applied"}
        />
        <Figure label="Estimated yearly tax" value={currency(result.annual)} highlight />
      </section>

      <section className="panel mt-6 grid gap-6 p-6 md:grid-cols-3">
        <div>
          <p className="eyebrow">Summer bill</p>
          <p className="mt-2 font-display text-3xl font-semibold">{currency(result.summer)}</p>
          <p className="text-sm text-muted-foreground">Due July</p>
        </div>
        <div>
          <p className="eyebrow">Winter bill</p>
          <p className="mt-2 font-display text-3xl font-semibold">{currency(result.winter)}</p>
          <p className="text-sm text-muted-foreground">Due December</p>
        </div>
        <div>
          <p className="eyebrow">Monthly escrow</p>
          <p className="mt-2 font-display text-3xl font-semibold">{currency(result.monthly)}</p>
          <p className="text-sm text-muted-foreground">Set aside each month</p>
        </div>
      </section>

      <section className="panel mt-6 p-6">
        <h2 className="text-2xl font-semibold">How this number was built</h2>
        <ol className="mt-4 space-y-3 text-muted-foreground">
          <li>
            1. Market value{submitted && address ? ` for ${address}` : ""}: {currency(price)}
          </li>
          <li>2. Constitutional cap applied: 50% → assessed value {currency(result.assessed)}</li>
          <li>
            3. Millage applied: {result.mills.toFixed(1)} mills per $1,000 of taxable value (
            {primary ? "with" : "without"} the principal residence exemption)
          </li>
          <li>4. Yearly tax: {currency(result.annual)}, split across summer and winter bills</li>
        </ol>
        <p className="mt-5 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm leading-relaxed">
          Illustrative estimate using published Detroit millage
          ({MILLAGE.principalResidence} / {MILLAGE.nonPrincipal} mills). Your final bill depends on
          the assessor's valuation, exemptions and any special assessments. If your assessment
          exceeds the 50% cap, that is exactly the pattern this system flags — currently{" "}
          {Math.abs(fairnessGap)}% off the modeled benchmark.
        </p>
        <Link
          to="/"
          className="mt-5 inline-block rounded-xl border border-border bg-surface-raised px-5 py-3 font-semibold"
        >
          Check this parcel for past overtaxation
        </Link>
      </section>
    </main>
  );
}

function Figure({
  label,
  value,
  note,
  highlight,
}: {
  label: string;
  value: string;
  note?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`panel p-5 ${highlight ? "border-gold/60 bg-gold/10" : "bg-surface-raised/60"}`}
    >
      <p className="eyebrow text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
      {note && <p className="mt-1 text-sm text-mint">{note}</p>}
    </div>
  );
}
