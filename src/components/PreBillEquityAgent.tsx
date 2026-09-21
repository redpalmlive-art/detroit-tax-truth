// src/components/PreBillEquityAgent.tsx
// Pre-bill equity check agent - shows PASS/FAIL before bills go out
// ADD ONLY - import it into index.tsx when ready, no deletions

import { useState } from 'react'
import { runPreBillEquityCheck, type EquityCheckResult } from '@/lib/equityCheck'

type Props = {
  address: string
  parcelId?: string
  coords: { lat: number; lng: number }
  assessedValue?: number // current assessed from your timeline
  tcv?: number // true cash value
}

export function PreBillEquityAgent({ address, parcelId="0800477-031L", coords, assessedValue=38420, tcv=76840 }: Props){
  const [result,setResult]=useState<EquityCheckResult|null>(null)
  const [loading,setLoading]=useState(false)
  const [ran,setRan]=useState(false)

  const runCheck = async () => {
    setLoading(true); setRan(true)
    try{
      const r = await runPreBillEquityCheck({
        parcelId,
        address,
        lat: coords.lat,
        lng: coords.lng,
        assessedValue,
        tcv
      })
      setResult(r)
    }catch(e){ console.error(e) }
    setLoading(false)
  }

  return (
    <div className="border border-[#E7C369]/30 bg-[#122219] rounded-[16px] p-6 mt-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#E7C369]">Pre-Bill Equity Check Agent</div>
          <div className="text-[18px] font-bold font-serif mt-1">Assessment screened against comps and 50% cap before bills go out</div>
          <div className="text-[12px] text-[#7AA08A] mt-2 max-w-[640px]">Runs the same check that would have prevented 2010-2016. If it fails, bill is held for review so the same harm cannot quietly repeat in the next downturn.</div>
        </div>
        <button onClick={runCheck} disabled={loading} type="button" className="bg-[#E7C369] text-black px-6 py-2.5 rounded-full text-[13px] font-semibold disabled:opacity-50">
          {loading ? "Checking..." : result ? "Re-check" : "Run Equity Check"}
        </button>
      </div>

      {ran && (
        <div className="mt-6">
          {!result ? (
            <div className="text-[12px] text-[#7AA08A] py-6 text-center">Running checks for {address}...</div>
          ) : (
            <>
              <div className={`rounded-xl px-4 py-3 flex items-center gap-3 border ${result.status==="PASS" ? "bg-[#0A3A1F] border-[#1E5A35] text-[#8ADFA7]" : result.status==="FAIL" ? "bg-[#3A1A1A] border-[#6B2A2A] text-[#FF9A9A]" : "bg-[#3A2F0A] border-[#6B5A1A] text-[#E7C369]"}`}>
                <div className="text-[11px] uppercase tracking-widest">{result.status}</div>
                <div className="text-[13px]">{result.status==="PASS" ? "Would pass pre-bill screen - bill can go out" : result.status==="FAIL" ? `Would be held - $${(result.capOverAmount+result.compOverAmount).toLocaleString()} over cap/comp` : "Needs review - comp variance over 10%"}</div>
                <div className="ml-auto text-[10px] opacity-70">{result.riskLevel.toUpperCase()} RISK</div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
                <div className="border border-[#1E3A2A] bg-[#0A1710] rounded-xl p-4">
                  <div className="text-[10px] uppercase text-[#7AA08A]">50% Constitutional Cap (Art 9 Sec 3)</div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between"><span className="text-[#6B8E7B]">Assessed</span><span>${result.assessedValue.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-[#6B8E7B]">TCV</span><span>${result.trueCashValue.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-[#6B8E7B]">50% Cap Max</span><span>${result.capMaxAssessed.toLocaleString()}</span></div>
                    <div className="flex justify-between font-bold"><span className="text-[#6B8E7B]">Over Cap</span><span className={result.capViolation ? "text-[#FF9A9A]" : "text-[#8ADFA7]"}>${result.capOverAmount.toLocaleString()} {result.capViolation ? "(VIOLATION)" : "(OK)"}</span></div>
                  </div>
                </div>
                <div className="border border-[#1E3A2A] bg-[#0A1710] rounded-xl p-4">
                  <div className="text-[10px] uppercase text-[#7AA08A]">Comparable Sales - 0.5 mi - 24 mo</div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between"><span className="text-[#6B8E7B]">Median Sale TCV</span><span>${result.compMedianTcv.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-[#6B8E7B]">Implied Max Assessed</span><span>${result.compImpliedMaxAssessed.toLocaleString()}</span></div>
                    <div className="flex justify-between font-bold"><span className="text-[#6B8E7B]">Over Comp Equity</span><span className={result.compViolation ? "text-[#FF9A9A]" : "text-[#8ADFA7]"}>${result.compOverAmount.toLocaleString()} {result.compViolation ? "(FAIL)" : "(OK)"}</span></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 border border-[#1E3A2A] bg-[#0A1710] rounded-xl p-4">
                <div className="text-[10px] uppercase text-[#7AA08A]">Comps Used</div>
                <div className="mt-2 space-y-1 text-[11px]">
                  {result.comps.map((c,i)=><div key={i} className="flex justify-between"><span>{c.address} - {c.saleDate}</span><span>${c.salePrice.toLocaleString()} ({c.distanceMiles.toFixed(2)} mi)</span></div>)}
                </div>
              </div>

              <div className="mt-4 text-[12px] space-y-1">
                {result.explanation.map((e,i)=><div key={i} className="text-[#7AA08A]">- {e}</div>)}
              </div>

              {result.appealDraft && (
                <div className="mt-4">
                  <div className="text-[10px] uppercase text-[#7AA08A] mb-2">Auto-generated hold/appeal draft (copy/paste to assessor)</div>
                  <textarea readOnly value={result.appealDraft} className="w-full h-48 bg-[#0A1710] border border-[#1E3A2A] rounded-xl p-3 text-[11px] text-[#E8EDE9] font-mono" />
                  <button type="button" onClick={()=>navigator.clipboard.writeText(result.appealDraft!)} className="mt-2 text-[11px] text-[#E7C369] underline">Copy draft</button>
                </div>
              )}

              <div className="mt-4 text-[10px] text-[#3A5A45]">Agent runs pre-bill: if FAIL, flags parcel in Citywide Ledger as "Would fail 2026 screen" - prevents quiet repeat in next downturn.</div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
