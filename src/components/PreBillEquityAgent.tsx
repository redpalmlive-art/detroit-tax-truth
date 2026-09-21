import { useState } from 'react'
import { checkEquity } from '../lib/equityCheck'

export function PreBillEquityAgent({ address, parcelId, coords, assessedValue = 38420, tcv = 38420 }: any) {
  const [result, setResult] = useState<any>(null)
  const run = () => {
    const t = tcv || 30000
    const comps = [t*0.9, t*1.1, t*0.95]
    setResult(checkEquity(assessedValue, t, comps))
  }
  return (
    <section className="border border-[#E7C369]/30 bg-[#1A2E22] rounded-[20px] p-6">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#E7C369]">Pre-Bill Equity Agent - Prevents Next Downturn</div>
      <div className="mt-2 text-[14px]">Screening: {address} {parcelId ? '('+parcelId+')' : ''}</div>
      <div className="mt-1 text-[11px] text-[#7AA08A]">Lat {coords?.lat} Lng {coords?.lng} - Assessed ${assessedValue} / TCV ${tcv}</div>
      <button onClick={run} className="mt-4 bg-[#E7C369] text-black px-6 py-2 rounded-full text-[12px] font-bold hover:bg-[#D8B55E] transition">Run Equity Check</button>
      {result && (
        <div className={`mt-4 p-4 rounded-xl ${result.pass ? 'bg-[#0A2A14] border border-[#2A7A45]' : 'bg-[#2A1212] border border-[#7A2A2A]'}`}>
          <div className="text-[13px] font-bold">{result.pass ? 'PASS - Bill Can Go Out' : 'FAIL - HOLD BILL'}</div>
          <div className="text-[11px] mt-1">Cap: {result.capPercent}% of 50% limit | Comps: {result.compPercent}% | {result.reason}</div>
        </div>
      )}
    </section>
  )
}
