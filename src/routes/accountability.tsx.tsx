import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PreBillEquityAgent } from '../components/PreBillEquityAgent'

export const Route = createFileRoute('/accountability')({
  component: AccountabilityPage,
})

function AccountabilityPage(){
  const [input, setInput] = useState('1470 Atkinson St, Detroit, MI 48206')
  const [address, setAddress] = useState('1470 Atkinson St, Detroit, MI 48206')
  const [parcelId, setParcelId] = useState('0800477-031L')
  const [coords, setCoords] = useState({ lat: 42.3807, lng: -83.1097 })
  const [tcv, setTcv] = useState(38420)
  const [assessed, setAssessed] = useState(38420)

  return (
    <div className="min-h-screen bg-[#08110B] text-[#E8EDE9]">
      <header className="border-b border-[#1A2E22] bg-[#0A1710] sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-3.5 flex justify-between items-center">
          <a href="/" className="font-serif tracking-[0.14em] text-[13px]">DETROIT TAX TRUTH</a>
          <nav className="hidden md:flex gap-6 text-[11px] tracking-[0.18em] text-[#5F8570]">
            <a href="/">REMEDY</a>
            <a href="/accountability" className="text-[#E8EDE9]">ACCOUNTABILITY</a>
            <a href="/estimate">ESTIMATOR</a>
          </nav>
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto px-6 pt-6 pb-10 space-y-5">
        <section className="border border-[#E7C369]/15 bg-[#122219] rounded-[28px] px-8 py-8 md:px-10 md:py-9">
          <div className="text-[10px] tracking-[0.22em] text-[#E7C369]/90">CITY ACCOUNTABILITY</div>
          <h1 className="font-serif text-[30px] md:text-[38px] lg:text-[40px] leading-[1.15] tracking-[-0.02em] mt-5 max-w-[720px] font-[350]">How we prevent the next downturn from becoming the next over-taxation.</h1>
          <p className="text-[13px] leading-[1.6] text-[#7AA08A] mt-5 max-w-[560px]">2010-2016 happened because assessments were never screened against the 50% constitutional cap or neighborhood comps before bills went out. Search any address - the agent screens it live.</p>
        </section>
        <section className="bg-[#F5F1E8] rounded-[20px] p-2.5 flex gap-2.5">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && (setAddress(input), setParcelId((Math.random()*10000000).toFixed(0)))} placeholder="1470 Atkinson St, Detroit, MI 48206" className="flex-1 bg-transparent text-black px-6 py-3 rounded-full outline-none text-[14px]" />
          <button onClick={()=>{ setAddress(input); setParcelId((Math.random()*10000000).toFixed(0)) }} className="bg-[#E7C369] text-black px-8 py-3 rounded-full font-semibold text-[13px]">Analyze parcel</button>
        </section>
        <PreBillEquityAgent address={address} parcelId={parcelId} coords={coords} assessedValue={assessed} tcv={tcv} />
      </main>
    </div>
  )
}
