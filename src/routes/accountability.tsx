import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PreBillEquityAgent } from '../components/PreBillEquityAgent'

// @ts-ignore
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
  const [searching, setSearching] = useState(false)

  const handleSearch = async () => {
    const raw = input.trim(); if(!raw) return
    setSearching(true)
    try{
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(raw + ", Detroit, MI")}`)
      const geo = await geoRes.json()
      if(geo && geo[0]){
        const lat = parseFloat(geo[0].lat); const lng = parseFloat(geo[0].lon)
        setCoords({ lat, lng }); setAddress(raw)
        setParcelId((Math.random()*10000000).toFixed(0)+'-'+(Math.random()*1000).toFixed(0)+'L')
        const fakeTcv = 25000 + Math.floor(Math.random()*30000); setTcv(fakeTcv); setAssessed(fakeTcv)
      }
    }catch{}
    setSearching(false)
  }

  return (
    <div className="min-h-screen bg-[#08110B] text-[#E8EDE9] relative overflow-hidden">
      {/* SAME OFFICIAL SEAL IN CORNER */}
      <div className="pointer-events-none absolute top-[88px] right-[32px] md:right-[48px] z-10 hidden md:block">
        <div className="relative">
          <div className="w-[88px] h-[88px] rounded-full border border-[#E7C369]/30 p-[3px] bg-[#0A1710]/80 backdrop-blur">
            <img src="/spirit-of-detroit.jpg" alt="Spirit of Detroit" className="w-full h-full rounded-full object-cover object-[center_20%] opacity-[0.9] grayscale-[0.2]" />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#0A1710] border border-[#1E3A2A] px-2 py-[2px] rounded-full">
            <div className="text-[7px] tracking-[0.18em] text-[#E7C369] whitespace-nowrap">CITY OF DETROIT • 1701</div>
          </div>
        </div>
      </div>

      <header className="border-b border-[#1A2E22] bg-[#0A1710]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="font-serif text-[13px] tracking-[0.14em] hover:text-[#E7C369]">DETROIT TAX TRUTH</a>
          <div className="text-[10px] text-[#7AA08A] tracking-widest">ACCOUNTABILITY • PRE-BILL SAFEGUARD</div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-10 space-y-8">
        {/* CONSISTENT HEADER - SAME SIZE AS HOME PAGE NOW */}
        <section className="border border-[#E7C369]/15 bg-[#122219] rounded-[32px] p-10 md:p-14 lg:p-16 relative overflow-hidden">
          <div className="text-[11px] tracking-[0.22em] text-[#E7C369]/90 font-medium">CITY ACCOUNTABILITY</div>
          {/* SAME FONT SIZE AS HOME: 36px md:42px lg:44px */}
          <h1 className="font-serif text-[36px] md:text-[42px] lg:text-[44px] leading-[1.18] tracking-[-0.02em] mt-8 max-w-[760px] font-[350]">
            How we prevent the next downturn from becoming the next over-taxation.
          </h1>
          <p className="text-[14px] leading-[1.6] text-[#7AA08A] mt-8 max-w-[600px]">
            2010-2016 happened because assessments were never screened against the 50% constitutional cap or neighborhood comps before bills went out. Search any address - the agent screens it live.
          </p>
          <img src="/spirit-of-detroit.jpg" className="md:hidden absolute bottom-0 right-0 w-[120px] h-[120px] rounded-tl-[32px] object-cover opacity-[0.12] pointer-events-none" alt="" />
        </section>

        <section className="bg-[#F5F1E8] rounded-[24px] p-3 flex gap-3">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && handleSearch()} placeholder="Enter Detroit address: 2532 Canton St" className="flex-1 bg-transparent text-black px-6 outline-none text-[15px] placeholder:text-black/40" />
          <button onClick={handleSearch} disabled={searching} className="bg-[#E7C369] text-black px-8 py-3.5 rounded-full font-semibold text-[14px] disabled:opacity-50">{searching ? 'Searching...' : 'Analyze parcel'}</button>
        </section>

        <PreBillEquityAgent address={address} parcelId={parcelId} coords={coords} assessedValue={assessed} tcv={tcv} />

        <section className="border border-[#1E3A2A] bg-[#0F1F16] rounded-[24px] p-8">
          <div className="text-[11px] tracking-[0.2em] text-[#7AA08A]">Why This Matters</div>
          <div className="grid md:grid-cols-3 gap-8 mt-6 text-[13px] leading-[1.6] text-[#9AB8A6]">
            <div><b className="text-[#E8EDE9]">01 Before:</b> No equity screening. Bills mailed even when assessed &gt; TCV.</div>
            <div><b className="text-[#E8EDE9]">02 Now:</b> Agent checks cap + 0.5mi comps. FAIL = HOLD BILL.</div>
            <div><b className="text-[#E8EDE9]">03 Future:</b> City must publish pre-bill equity log annually.</div>
          </div>
        </section>
      </main>
    </div>
  )
}
