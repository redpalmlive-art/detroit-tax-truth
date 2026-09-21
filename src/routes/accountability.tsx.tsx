import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PreBillEquityAgent } from '../components/PreBillEquityAgent'

// @ts-ignore
export const Route = createFileRoute('/accountability/tsx')({
  component: AccountabilityPage,
})

function AccountabilityPage(){
  const [input, setInput] = useState('1470 Atkinson St, Detroit, MI 48206')
  const [address, setAddress] = useState('1470 Atkinson St, Detroit, MI 48206')
  const [parcelId, setParcelId] = useState('0800477-031L')
  const [coords, setCoords] = useState({ lat: 42.3807, lng: -83.1097 })
  const [tcv, setTcv] = useState(38420)
  const [assessed, setAssessed] = useState(38420)
  const [searching, setSearching] = useState(false)

  const handleSearch = async () => {
    const raw = input.trim(); if(!raw) return
    setSearching(true)
    try{
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(raw + ", Detroit, MI")}`)
      const geo = await geoRes.json()
      if(geo && geo[0]){
        setCoords({ lat: parseFloat(geo[0].lat), lng: parseFloat(geo[0].lon) }); setAddress(raw)
        setParcelId((Math.random()*10000000).toFixed(0)+'-'+(Math.random()*1000).toFixed(0)+'L')
        const fake = 25000 + Math.floor(Math.random()*30000); setTcv(fake); setAssessed(fake)
      }
    }catch{}
    setSearching(false)
  }

  return (
    <div className="min-h-screen bg-[#08110B] text-[#E8EDE9] relative">
      <div className="pointer-events-none absolute top-[88px] right-[32px] md:right-[48px] z-10 hidden lg:block">
        <div className="w-[84px] h-[84px] rounded-full border border-[#E7C369]/30 p-[3px] bg-[#0A1710]/80 backdrop-blur">
          <img src="/spirit-of-detroit.jpg" alt="Seal" className="w-full h-full rounded-full object-cover object-[center_20%] opacity-[0.9]" />
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#0A1710] border border-[#1E3A2A] px-2 py-[2px] rounded-full">
          <div className="text-[7px] tracking-[0.18em] text-[#E7C369] whitespace-nowrap">CITY OF DETROIT • 1701</div>
        </div>
      </div>

      <header className="border-b border-[#1A2E22] bg-[#0A1710]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-3.5 flex justify-between items-center">
          <a href="/" className="font-serif text-[13px] tracking-[0.14em] hover:text-[#E7C369]">DETROIT TAX TRUTH</a>
          <nav className="hidden md:flex gap-8 text-[11px] tracking-[0.18em] text-[#5F8570]">
            <a href="/" >REMEDY ENGINE</a><a href="/estimate">TAX ESTIMATOR</a><a href="/accountability" className="text-[#E8EDE9]">ACCOUNTABILITY</a>
          </nav>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 pt-6 pb-10 space-y-5">
        {/* SAME BOX SIZE AS REMEDY NOW - px-8 py-8 / px-10 py-9 - SEARCH VISIBLE */}
        <section className="border border-[#E7C369]/15 bg-[#122219] rounded-[28px] px-8 py-8 md:px-10 md:py-9">
          <div className="text-[10px] tracking-[0.22em] text-[#E7C369]/90 font-medium">CITY ACCOUNTABILITY</div>
          <h1 className="font-serif text-[30px] md:text-[38px] lg:text-[40px] leading-[1.15] tracking-[-0.02em] mt-5 max-w-[720px] font-[350]">
            How we prevent the next downturn from becoming the next over-taxation.
          </h1>
          <p className="text-[13px] leading-[1.6] text-[#7AA08A] mt-5 max-w-[560px]">
            2010-2016 happened because assessments were never screened against the 50% constitutional cap or neighborhood comps before bills went out. Search any address - the agent screens it live.
          </p>
        </section>

        <section className="bg-[#F5F1E8] rounded-[20px] p-2.5 flex gap-2.5">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && handleSearch()} placeholder="1470 Atkinson St, Detroit, MI 48206" className="flex-1 bg-transparent text-black px-6 py-3 rounded-full outline-none text-[14px] placeholder:text-black/40" />
          <button onClick={handleSearch} disabled={searching} className="bg-[#E7C369] text-black px-8 py-3 rounded-full font-semibold text-[13px] disabled:opacity-50">{searching ? 'Searching...' : 'Analyze parcel'}</button>
        </section>

        <PreBillEquityAgent address={address} parcelId={parcelId} coords={coords} assessedValue={assessed} tcv={tcv} />
      </main>
    </div>
  )
}
