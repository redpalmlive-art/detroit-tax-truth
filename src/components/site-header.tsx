import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-gold font-display text-xl font-bold text-gold">
            R
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-[0.12em] text-foreground">
              RESTORE DETROIT
            </span>
            <span className="block text-[0.68rem] tracking-[0.18em] text-muted-foreground">
              PROPERTY TAX REMEDY ENGINE
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-foreground" }}
            className="transition-colors hover:text-foreground"
          >
            Remedy engine
          </Link>
          <Link
            to="/estimate"
            activeProps={{ className: "text-foreground" }}
            className="transition-colors hover:text-foreground"
          >
            Tax estimator
          </Link>
          <Link
            to="/accountability"
            activeProps={{ className: "text-foreground" }}
            className="transition-colors hover:text-foreground"
          >
            Accountability
          </Link>
        </nav>

        <span className="ml-auto flex items-center gap-2 text-sm text-muted-foreground md:ml-6">
          <span className="h-2 w-2 rounded-full bg-mint" />
          Prototype system ready
        </span>
      </div>
    </header>
  );
}
