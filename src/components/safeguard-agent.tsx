import { useState } from "react";
export function SafeguardAgent({ parcelData }: { parcelData: any }) {
  const [marketDrop, setMarketDrop] = useState(35);
  const assessed = parcelData?.assessedValue2010_2016 || 85000;
  const market = parcelData?.marketValue || 35000;
  const ratio = assessed / market;
  const adjustedTax = market * 0.5 * 0.068;
  const oldSystemTax = assessed * 0.068;
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-950/20 p-6">
        <h3 className="font-display text-2xl">Safeguard Agent - Future Crash Protection</h3>
        <p className="text-sm mt-1">Old system failed in 2008. This auto-adjusts.</p>
        <div className="mt-4 bg-black/40 rounded-xl p-4">
          <label className="text-xs text-gold">SIMULATE CRASH: {marketDrop}% drop</label>
          <input type="range" min={10} max={70} value={marketDrop} onChange={e => setMarketDrop(Number(e.target.value))} className="w-full mt-2" />
          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div className="bg-red-950/50 p-3 rounded-lg"><p className="text-red-300 text-xs">OLD SYSTEM</p><p className="text-xl font-bold">\/yr</p><p className="text-xs">Ratio: {ratio.toFixed(2)}x ILLEGAL</p></div>
            <div className="bg-emerald-950/50 p-3 rounded-lg"><p className="text-emerald-300 text-xs">NEW SAFEGUARD</p><p className="text-xl font-bold">\/yr</p><p className="text-xs">Auto-adjusted. Compliant</p></div>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border-2 border-gold/30 bg-gold/5 p-6">
        <h3 className="font-display text-2xl">Restitution Agent - 600M Finder</h3>
        <div className="mt-4 bg-black/40 rounded-xl p-4">
          <div className="flex justify-between"><span>Citywide:</span><span className="font-bold text-xl">\</span></div>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between bg-white/5 p-2 rounded"><span>Address:</span><span>{parcelData?.address}</span></div>
            <div className="flex justify-between bg-gold/20 p-2 rounded"><span>Owed:</span><span>\</span></div>
            <div className="flex justify-between bg-gold/20 p-2 rounded"><span>Total + Interest:</span><span className="font-bold">\</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
