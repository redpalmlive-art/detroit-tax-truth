import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/accountability_backup")({
  head: () => ({
    meta: [
      { title: "Accountability Safeguards — Restore Detroit" },
      {
        name: "description",
        content:
          "The rules that keep property tax restitution honest: no silent closures, written denials, heir tracing, automatic escalation and pre-bill equity monitoring.",
      },
      { property: "og:title", content: "Accountability Safeguards — Restore Detroit" },
      {
        property: "og:description",
        content:
          "No deadline traps, no silent closures, no erased records — the guarantees behind the remedy engine.",
      },
    ],
  }),
  component: AccountabilityPage,
});

const GUARANTEES = [
  {
    title: "No deadline traps",
    body: "Claim windows do not expire while a claimant is unlocated. The burden of finding people sits with the program, not with the family that was overcharged.",
  },
  {
    title: "No silent closures",
    body: "Every parcel ends in a documented disposition with a named reviewer, a written reason and an appeal path. Uncashed payments reopen tracing instead of closing the case.",
  },
  {
    title: "Heirs are followed, not lost",
    body: "When an owner has died, probate, vital and deed records are linked into a claimant chain, reviewed by a person before any contact is made.",
  },
  {
    title: "Pre-bill equity checks",
    body: "Assessments are screened against comparable sales and the 50% constitutional cap before bills go out, so the same harm cannot quietly repeat in the next downturn.",
  },
  {
    title: "Every number keeps its source",
    body: "Each figure links back to the assessment roll, sale or statute it came from. Estimates are reviewable, contestable and reproducible.",
  },
  {
    title: "People decide, not the model",
    body: "The system prepares evidence. Authorized human reviewers determine eligibility, amounts and payment.",
  },
];

function AccountabilityPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <p className="eyebrow">Forward protection</p>
      <h1 className="mt-3 font-display text-5xl leading-tight font-semibold">
        How this stays honest.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Overtaxation was only half the harm. The other half was a process that let people run out of
        time. These are the rules that close that gap.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {GUARANTEES.map((g, i) => (
          <section key={g.title} className="panel p-6">
            <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="mt-2 text-2xl font-semibold">{g.title}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{g.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/" className="rounded-xl bg-gold px-5 py-3 font-semibold text-gold-foreground">
          Open the remedy engine
        </Link>
        <Link
          to="/estimate"
          className="rounded-xl border border-border bg-surface-raised px-5 py-3 font-semibold"
        >
          Estimate a tax bill
        </Link>
      </div>
    </main>
  );
}
