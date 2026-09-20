type Props = {
  value: string;
  onChange: (v: string) => void;
  onAnalyze: () => void;
  onSample: () => void;
};

export function ParcelBar({ value, onChange, onAnalyze, onSample }: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAnalyze();
      }}
      className="flex flex-col gap-3 rounded-2xl bg-parchment p-3 sm:flex-row sm:items-center"
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter a Detroit address or parcel ID"
        aria-label="Detroit address or parcel ID"
        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-base text-[oklch(0.2_0.03_165)] outline-none placeholder:text-[oklch(0.5_0.02_165)]"
      />
      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-xl bg-gold px-6 py-3 font-semibold text-gold-foreground transition-transform hover:-translate-y-0.5"
        >
          Analyze parcel
        </button>
        <button
          type="button"
          onClick={onSample}
          className="rounded-xl border border-gold bg-gold/90 px-6 py-3 font-semibold text-gold-foreground underline underline-offset-4 transition-transform hover:-translate-y-0.5"
        >
          Try another sample
        </button>
      </div>
    </form>
  );
}
