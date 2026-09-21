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

function IndexPage(){
  const [step,setStep]=useState(0)
  const [sel,setSel]=useState(0)
  const steps=[
    { id:"01", label:"Reconstruct", title:"How the estimate was built", body:["1. Assessment rolls matched 2010-2016","2. Market value reconstructed 2017 reappraisal","3. Constitutional cap 50% applied","4. Tax difference (Billed TV - Capped TV) x 68.9 mills"] },
    { id:"02", label:"Trace claimant", title:"Who can claim", body:["Owner chain from BS&A + Wayne County Register","Heir search via probate docket","Last living heir identified via affidavit"] },
    { id:"03", label:"Calculate remedy", title:"Remedy math", body:["Recoverable = sum overcap taxes + interest","Capped at 6 years per MCL 211.53a","Verified against city ledger"] },
    { id:"04", label:"Recover payment", title:"Payout path", body:["Direct grant or future tax credit","Requires ID + parcel proof","No attorney required"] },
    { id:"05", label:"Prevent repeat", title:"Cap lock", body:["SEV freeze filed with assessor","Annual audit trigger","Neighborhood cap monitor"] },
  ]

  return (
    <div className="min-h-screen bg-[#0A1710] text-[#E8EDE9] px-6 py-8">
      <div className="max-w- mx-auto">
        <h1 className="text- leading-[0.9] font-serif">Find every claimant.<br/>Recover every<br/>authorized dollar.</h1>

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="border border-[#1E3A2A] bg-[#122219] rounded- p-6">
            <div className="font-bold font-serif text-">{MOCK.owner}</div>
            <div className="mt-4 space-y-2 text-">
              <div className="flex justify-between"><span className="text-[#6B8E7B]">Parcel ID</span><span>{MOCK.parcelId}</span></div>
              <div className="flex justify-between"><span className="text-[#6B8E7B]">Address</span><span>{MOCK.address}</span></div>
              <div className="flex justify-between"><span className="text-[#6B8E7B]">Taxable Value</span><span>{MOCK.taxable}</span></div>
              <div className="flex justify-between"><span className="text-[#6B8E7B]">SEV</span><span>{MOCK.sev}</span></div>
              <div className="flex justify-between"><span className="text-[#6B8E7B]">Last Sale</span><span>{MOCK.lastSale}</span></div>
              <div className="flex justify-between"><span className="text-[#6B8E7B]">Overassessment</span><span className="text-[#E7C369]">{MOCK.over}</span></div>
              <div className="flex justify-between pt-3 border-t border-[#1E3A2A]"><span className="text-[#6B8E7B]">Total Recoverable</span><span className="text- text-[#E7C369] font-serif">{MOCK.recoverable}</span></div>
            </div>
            <div className="mt-4 text- bg-[#0A1710] border border-[#E7C369]/20 rounded-lg px-3 py-2 text-[#C8B07A]">{MOCK.note}</div>
          </div>

          <div className="border border-[#1E3A2A] bg-[#122219] rounded- p-4">
            <div className="text- uppercase tracking-widest text-[#7AA08A] mb-3">Most Recent Photos</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden bg-black border border-[#1E3A2A] h-36 grid place-items-center text- text-[#7AA08A]">Front - 1456 Atkinson</div>
              <div className="rounded-xl overflow-hidden bg-black border border-[#1E3A2A] h-36 grid place-items-center text- text-[#7AA08A]">Side - 1456 Atkinson</div>
              <div className="rounded-xl overflow-hidden bg-black border border-[#1E3A2A] h-36 grid place-items-center text- text-[#7AA08A]">Rear - 1456 Atkinson</div>
              <div className="rounded-xl overflow-hidden bg-black border border-[#1E3A2A] h-36 grid place-items-center text- text-[#7AA08A]">Satellite</div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          <div className="border border-[#1E3A2A] bg-[#122219] rounded- p-3 space-y-2">
            {steps.map((s,i)=>(
              <button key={s.id} type="button" onClick={()=>setStep(i)} className={`w-full text-left px-4 py-3 rounded-full text- flex gap-3 ${step===i? "bg-[#E7C369] text-black" : "text-[#7AA08A] hover:text-white hover:bg-[#0A1710]"}`}>
                <span className="text-">{s.id}</span><span>{s.label}</span>
              </button>
            ))}
          </div>
          <div className="border border-[#1E3A2A] bg-[#122219] rounded- p-6">
            <div className="font-serif text-">{steps[step].title}</div>
            <div className="mt-4 space-y-2 text- text-[#7AA08A]">
              {steps[step].body.map((b,j)=><div key={j}>{b}</div>)}
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