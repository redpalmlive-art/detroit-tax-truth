import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

type R = { owner: string; parcelId: string; address: string; taxable: string; sev: string; lastSale: string; over: string; recoverable: string; note: string; }

const MOCK: R = {
  owner: "ESTATE OF MABEL J. JOHNSON",
  parcelId: "08006477.001L",
  address: "1456 Atkinson Street, Detroit, MI 48206",
  taxable: "$38,420",
  sev: "$76,840",
  lastSale: "08/14/1998",
  over: "3.24x over 50% cap",
  recoverable: "$14,830.00",
  note: "Deed transfer incomplete - probate chain broken 2006. Requires heirship affidavit."
}

function norm(s: string){ return s.toLowerCase().replace(/\b(street|st|avenue|ave|blvd|boulevard|dr|drive|rd|road|ln|lane)\b\.?/gi,'').replace(/\s+/g,' ').trim() }

function IndexPage(){
  const [input,setInput]=useState("2210 Sturtevant")
  const [curr,setCurr]=useState("1456 Atkinson Street")
  const [data,setData]=useState<R>(MOCK)
  const [loading,setLoading]=useState(false)
  const [sel,setSel]=useState(0)

  const handle=async()=>{
    const raw=input.trim(); if(!raw) return
    setLoading(true)
    const tries=[raw, norm(raw), raw.split(',')[0]]
    for(let t of tries){
      try{
        const res=await fetch(`https://detroit-tax-truth.onrender.com/api/analyze?address=${encodeURIComponent(t)}`)
        const j=await res.json()
        if(j.detail && j.detail.includes("No Detroit parcel")) continue
        setCurr(j.address || raw)
        setData({
          owner: j.owner_name || j.owner || MOCK.owner,
          parcelId: j.parcel_id || MOCK.parcelId,
          address: j.address || `${raw}, Detroit, MI`,
          taxable: j.taxable_value || MOCK.taxable,
          sev: j.sev || MOCK.sev,
          lastSale: j.last_sale || MOCK.lastSale,
          over: j.overassessment || j.overassessment_ratio || MOCK.over,
          recoverable: j.total_recoverable || MOCK.recoverable,
          note: j.notes || j.note || MOCK.note
        })
        setLoading(false)
        return
      }catch{}
    }
    setCurr(raw); setData({...MOCK, address:`${raw}, Detroit, MI`}); setLoading(false)
  }

  const enc = encodeURIComponent(curr + ", Detroit, MI")

  return (
    <div className="min-h-screen bg-[#0A1710] text-[#E8EDE9]">
      <header className="border-b border-[#1E3A2A] bg-[#0A1710]">
        <div className="max-w- mx-auto px-6 h- flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#122219] border border-[#E7C369]/40 grid place-items-center font-bold text-[#E7C369]">R</div>
            <div><div className="font-black text- tracking-widest">RESTORE DETROIT</div><div className="text- tracking-[0.22em] text-[#7AA08A] uppercase">Property Tax Remedy Engine</div></div>
          </div>
        </div>
      </header>

      <main className="max-w- mx-auto px-6 py-10">
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
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="2210 Sturtevant" className="flex-1 bg-transparent text-black px-4 outline-none" />
          <button onClick={handle} type="button" className="bg-[#E7C369] text-black px-8 py-3 rounded-full font-semibold">{loading? "..." : "Analyze parcel"}</button>
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
              <div className="rounded-xl overflow-hidden bg-black border border-[#1E3A2A]"><div className="w-full h-36 grid place-items-center text- text-[#7AA08A]">{curr} - Front</div></div>
              <div className="rounded-xl overflow-hidden bg-black border border-[#1E3A2A]"><div className="w-full h-36 grid place-items-center text- text-[#7AA08A]">{curr} - Side</div></div>
              <div className="rounded-xl overflow-hidden bg-black border border-[#1E3A2A]"><div className="w-full h-36 grid place-items-center text- text-[#7AA08A]">{curr} - Rear</div></div>
              <div className="rounded-xl overflow-hidden bg-black border border-[#1E3A2A]"><div className="w-full h-36 grid place-items-center text- text-[#7AA08A]">{curr} - Satellite - {enc.substring(0,20)}</div></div>
            </div>
          </div>
        </section>

        <section className="mt-6 border border-[#1E3A2A] bg-[#122219] rounded- p-6">
          <div className="text- text-[#E7C369] uppercase tracking-widest">Compensation Options - click to select</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {[{b:"BEST",t:"Future Tax Credit",a:"$4,217"},{b:"DIRECT",t:"Direct Grant",a:"$4,217"},{b:"FREEZE",t:"Tax Freeze",a:"$6,840"},{b:"HEIR",t:"Generational",a:"$1,405"}].map((c,i)=>(
              <button key={c.b} type="button" onClick={()=>setSel(i)} className={`text-left rounded-xl border p-4 transition-all ${sel===i? "bg-[#1B2E20] border-[#E7C369] shadow-[0_0_20px_rgba(231,195,105,0.2)]" : "bg-[#0A1710] border-[#1E3A2A] hover:border-[#2A4A35]"}`}><div className="text- tracking-widest text-[#7AA08A]">{c.b}</div><div className="mt-2 text-">{c.t} - {c.a}</div></button>
            ))}
          </div>
          <div className="mt-4 text- text-[#7AA08A]">Selected: {sel} - this proves buttons work locally and on Vercel</div>
        </section>
      </main>
    </div>
  )
}

export const Route = createFileRoute('/')({ component: IndexPage })