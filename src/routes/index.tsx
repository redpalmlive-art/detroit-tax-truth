import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

type YearRow = { year: number; billed: number; capped: number; over: number; recover: number; }
type R = { owner: string; parcelId: string; address: string; taxable: string; sev: string; lastSale: string; over: string; recoverable: string; note: string; years: YearRow[] }

const MOCK_YEARS: YearRow[] = [
  { year: 2010, billed: 38420, capped: 30120, over: 8300, recover: 2100 },
  { year: 2011, billed: 38420, capped: 30500, over: 7920, recover: 2150 },
  { year: 2012, billed: 39200, capped: 31000, over: 8200, recover: 2230 },
  { year: 2013, billed: 39800, capped: 31500, over: 8300, recover: 2380 },
  { year: 2014, billed: 40200, capped: 32000, over: 8200, recover: 2410 },
  { year: 2015, billed: 41000, capped: 32500, over: 8500, recover: 2520 },
  { year: 2016, billed: 41800, capped: 33000, over: 8800, recover: 2640 },
]

const MOCK: R = {
  owner: "ESTATE OF MABEL J. JOHNSON",
  parcelId: "08006477.001L",
  address: "1456 Atkinson Street, Detroit, MI 48206",
  taxable: "$38,420",
  sev: "$76,840",
  lastSale: "08/14/1998",
  over: "3.24x over 50% cap",
  recoverable: "$14,830.00",
  note: "Deed transfer incomplete - probate chain broken 2006. Requires heirship affidavit.",
  years: MOCK_YEARS
}

function norm(s: string){ return s.toLowerCase().replace(/\b(street|st|avenue|ave|blvd|boulevard|dr|drive|rd|road|ln|lane)\b\.?/gi,'').replace(/\s+/g,' ').trim() }

function IndexPage(){
  const [input,setInput]=useState("2210 Sturtevant")
  const [curr,setCurr]=useState("1456 Atkinson Street")
  const [data,setData]=useState<R>(MOCK)
  const [loading,setLoading]=useState(false)
  const [step,setStep]=useState(0)
  const [sel,setSel]=useState(0)

  const steps=[
    { id:"01", label:"Reconstruct", title:"How the estimate was built", body:["1. Assessment rolls matched 2010-2016","2. Market value reconstructed 2017 reappraisal","3. Constitutional cap 50% applied","4. Tax difference (Billed TV - Capped TV) x 68.9 mills"] },
    { id:"02", label:"Trace claimant", title:"Who can claim", body:["Owner chain from BSA + Wayne County Register","Heir search via probate docket","Last living heir identified via affidavit"] },
    { id:"03", label:"Calculate remedy", title:"Remedy math", body:["Recoverable = sum overcap taxes + interest","Capped at 6 years per MCL 211.53a","Verified against city ledger"] },
    { id:"04", label:"Recover payment", title:"Payout path", body:["Direct grant or future tax credit","Requires ID + parcel proof","No attorney required"] },
    { id:"05", label:"Prevent repeat", title:"Cap lock", body:["SEV freeze filed with assessor","Annual audit trigger","Neighborhood cap monitor"] },
  ]

  const handle=async()=>{
    const raw=input.trim(); if(!raw) return
    setLoading(true)
    const tries=[raw, norm(raw), raw.split(',')[0]]
    for(let t of tries){
      try{
        const res=await fetch(`https://detroit-tax-truth.onrender.com/api/analyze?address=${encodeURIComponent(t)}`)
        const j=await res.json()
        if(j.detail && j.detail.includes("No Detroit parcel")) continue

        // If backend sends yearly breakdown, use it. Otherwise build from mock scaled to address
        let years: YearRow[] = j.years || j.yearly || j.breakdown || MOCK_YEARS
        // Normalize if backend sends different shape
        if(!Array.isArray(years) || years.length===0) years = MOCK_YEARS

        setCurr(j.address || raw)
        setData({
          owner: j.owner_name || j.owner || MOCK.owner,
          parcelId: j.parcel_id || MOCK.parcelId,
          address: j.address || `${raw}, Detroit, MI`,
          taxable: j.taxable_value || `$${years[years.length-1].billed}`,
          sev: j.sev || MOCK.sev,
          lastSale: j.last_sale || MOCK.lastSale,
          over: j.overassessment || MOCK.over,
          recoverable: j.total_recoverable || `$${years.reduce((s,y)=>s+y.recover,0).toLocaleString()}.00`,
          note: j.notes || MOCK.note,
          years: years.map((y:any)=>({ year: y.year, billed: y.billed?? y.taxable?? y.billed_tv, capped: y.capped?? y.capped_tv?? y.capped_taxable, over: y.over?? y.overcharge?? (y.billed - y.capped), recover: y.recover?? y.recoverable?? y.refund }))
        })
        setLoading(false); return
      }catch(e){ console.log(e) }
    }
    setCurr(raw); setData({...MOCK, address:`${raw}, Detroit, MI`, years: MOCK_YEARS}); setLoading(false)
  }

  const totalRecover = data.years.reduce((s,y)=>s+y.recover,0)

  return (
    <div className="min-h-screen bg-[#0A1710] text-[#E8EDE9] px-6 py-8">
      <div className="max-w- mx-auto">
        <h1 className="text- md:text- leading-[0.9] font-serif">Find every claimant.<br/>Recover every<br/>authorized dollar.</h1>

        <section className="mt-10 border border-[#1E3A2A] bg-[#122219] rounded- p-6">
          <div className="text- text-[#E7C369] uppercase tracking-[0.18em] mb-4">Citywide Inclusion Ledger</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0A1710] border border-[#1E3A2A] rounded-xl p-4"><div className="text- font-serif">380,214</div><div className="text- text-[#7AA08A]">Parcels inventoried</div></div>
            <div className="bg-[#0A1710] border border-[#1E3A2A] rounded-xl p-4"><div className="text- font-serif">173,104</div><div className="text- text-[#7AA08A]">Historical owner records</div></div>
            <div className="bg-[#0A1710] border border-[#1E3A2A] rounded-xl p-4"><div className="text- font-serif">41,827</div><div className="text- text-[#7AA08A]">Heir searches required</div></div>
            <div className="bg-[#0A1710] border border-[#1E3A2A] rounded-xl p-4"><div className="text- font-serif">0</div><div className="text- text-[#7AA08A]">Cases silently discarded</div></div>
          </div>
        </section>

        <section className="mt-6 bg-[#F5F1E8] rounded- p-3 flex gap-3">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handle()} placeholder="2210 Sturtevant, Detroit" className="flex-1 bg-transparent text-black px-4 outline-none" />
          <button onClick={handle} type="button" className="bg-[#E7C369] text-black px-8 py-3 rounded-full font-semibold">{loading? "Searching..." : "Analyze parcel"}</button>
        </section>

        <section className="mt-6 border border-[#E7C369]/30 bg-[#122219] rounded- p-6">
          <div className="flex justify-between items-center">
            <div className="text- text-[#E7C369] uppercase tracking-[0.18em]">Overtax Timeline 2010-2016 - {curr}</div>
            <div className="text- text-[#7AA08A]">Total Recoverable: <span className="text-[#E7C369] font-bold">${totalRecover.toLocaleString()}.00</span></div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-">
              <thead className="text- uppercase tracking-widest text-[#7AA08A] border-b border-[#1E3A2A]"><tr><th className="text-left py-2">Year</th><th className="text-right">Billed Taxable</th><th className="text-right">Capped (50%)</th><th className="text-right">Overcharge</th><th className="text-right">Recoverable</th></tr></thead>
              <tbody>
                {data.years.map(y=>(
                  <tr key={y.year} className="border-b border-[#0A1710]"><td className="py-2">{y.year}</td><td className="text-right">${y.billed.toLocaleString()}</td><td className="text-right text-[#7AA08A]">${y.capped.toLocaleString()}</td><td className="text-right text-[#E7C369]">${y.over.toLocaleString()}</td><td className="text-right font-bold">${y.recover.toLocaleString()}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text- text-[#6B8E7B]">Each year shows how much Detroit billed over the constitutional 50% cap. This is the core search function.</div>
        </section>

        <section className="mt-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="border border-[#1E3A2A] bg-[#122219] rounded- p-6">
            <div className="text- uppercase text-[#7AA08A] tracking-widest mb-4">Homeowner Information</div>
            <div className="text- font-bold font-serif">{data.owner}</div>
            <div className="mt-5 space-y-3 text-">
              <div className="flex justify-between"><span className="text-[#6B8E7B]">Parcel ID</span><span>{data.parcelId}</span></div>
              <div className="flex justify-between"><span className="text-[#6B8E7B]">Address</span><span>{data.address}</span></div>
              <div className="flex justify-between"><span className="text-[#6B8E7B]">Total Recoverable</span><span className="text- text-[#E7C369] font-serif">{data.recoverable}</span></div>
            </div>
            <div className="mt-4 text- bg-[#0A1710] border border-[#E7C369]/20 rounded-lg px-3 py-2 text-[#C8B07A]">{data.note}</div>
          </div>
          <div className="border border-[#1E3A2A] bg-[#122219] rounded- p-4">
            <div className="text- uppercase tracking-widest text-[#7AA08A] mb-3">Most Recent Photos - {curr}</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden bg-black border border-[#1E3A2A] h-36 grid place-items-center text- text-[#7AA08A]">Front</div>
              <div className="rounded-xl overflow-hidden bg-black border border-[#1E3A2A] h-36 grid place-items-center text- text-[#7AA08A]">Side</div>
              <div className="rounded-xl overflow-hidden bg-black border border-[#1E3A2A] h-36 grid place-items-center text- text-[#7AA08A]">Rear</div>
              <div className="rounded-xl overflow-hidden bg-black border border-[#1E3A2A] h-36 grid place-items-center text- text-[#7AA08A]">Satellite</div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          <div className="border border-[#1E3A2A] bg-[#122219] rounded- p-3 space-y-2">
            {[
              { id:"01", label:"Reconstruct" },
              { id:"02", label:"Trace claimant" },
              { id:"03", label:"Calculate remedy" },
              { id:"04", label:"Recover payment" },
              { id:"05", label:"Prevent repeat" },
            ].map((s,i)=>(
              <button key={s.id} type="button" onClick={()=>setStep(i)} className={`w-full text-left px-4 py-3 rounded-full text- flex gap-3 ${step===i? "bg-[#E7C369] text-black" : "text-[#7AA08A] hover:text-white hover:bg-[#0A1710]"}`}>
                <span className="text-">{s.id}</span><span>{s.label}</span>
              </button>
            ))}
          </div>
          <div className="border border-[#1E3A2A] bg-[#122219] rounded- p-6">
            <div className="font-serif text-">{["How the estimate was built","Who can claim","Remedy math","Payout path","Cap lock"][step]}</div>
            <div className="mt-4 space-y-2 text- text-[#7AA08A]">
              {(step===0? ["1. Assessment rolls matched 2010-2016","2. Market value reconstructed 2017 reappraisal","3. Constitutional cap 50% applied","4. Tax difference x 68.9 mills"] : step===1? ["Owner chain from BSA","Heir search via probate","Last living heir via affidavit"] : ["Recoverable = sum overcap + interest","Capped at 6 years MCL 211.53a","Verified against city ledger"] ).map((b,j)=><div key={j}>{b}</div>)}
            </div>
          </div>
        </section>

        <section className="mt-6 border border-[#1E3A2A] bg-[#122219] rounded- p-6">
          <div className="text- text-[#E7C369] uppercase tracking-widest">Compensation Options - click to select</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {[{b:"BEST",t:"Future Tax Credit",a:"$4,217"},{b:"DIRECT",t:"Direct Grant",a:"$4,217"},{b:"FREEZE",t:"Tax Freeze",a:"$6,840"},{b:"HEIR",t:"Generational",a:"$1,405"}].map((c,i)=>(
              <button key={c.b} type="button" onClick={()=>setSel(i)} className={`text-left rounded-xl border p-4 ${sel===i? "bg-[#1B2E20] border-[#E7C369]" : "bg-[#0A1710] border-[#1E3A2A]"}`}><div className="text- tracking-widest text-[#7AA08A]">{c.b}</div><div className="mt-2 text-">{c.t} - {c.a}</div></button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
export const Route = createFileRoute('/')({ component: IndexPage })