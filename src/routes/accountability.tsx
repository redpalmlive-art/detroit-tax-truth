import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PreBillEquityAgent } from '../components/PreBillEquityAgent'

// @ts-ignore - generator needs literal
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
    const raw = input.trim()
    if(!raw) return
    setSearching(true)
    try{
      // 1. Geocode with Nominatim - free, no billing
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(raw + ", Detroit, MI")}`)
      const geo = await geoRes.json()
      if(geo && geo[0]){
        const lat = parseFloat(geo[0].lat)
        const lng = parseFloat(geo[0].lon)
        setCoords({ lat, lng })
        setAddress(raw)
        // Fake parcel for demo - in real app you'd call Detroit Open Data
        setParcelId((Math.random()*10000000).toFixed(0)+'-'+(Math.random()*1000).toFixed(0)+'L')
        // Simulate TCV changing per area
        const fakeTcv = 25000 + Math.floor(Math.random()*30000)
        setTcv(fakeTcv)
        setAssessed(fakeTcv)
      }
    }catch(e){
      console.error(e)
    }
    setSearching(false)
  }

  return (
    <div className="min-h-screen bg-[#08110B] text-[#E8EDE9]">
      <header className="border-b border-[#1A2E22] bg-[#0A1710]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="font-serif text-[14px] tracking-widest hover:text-[#E7C369]">DETROIT TAX TRUTH</a>
          <div className="text-[10px] text-[#7AA08A]">ACCOUNTABILITY • PRE-BILL SAFEGUARD</div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-10 space-y-8">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#E7C369]">City Accountability</div>
          <h1 className="font-serif text-[36px] leading-[1.1] mt-3 max-w-[700px]">How we prevent the next downturn from becoming the next over-taxation.</h1>
          <p className="text-[13px] text-[#7AA08A] mt-4 max-w-[600px]">2010-2016 happened because assessments were never screened against the 50% constitutional cap or neighborhood comps before bills went out. Search any address - the agent screens it live.</p>
        </div>

        {/* SEARCH BAR - NEW */}
        <section className="bg-[#F5F1E8] rounded-[16px] p-3 flex gap-3">
          <input 
            value={input} 
            onChange={e=>setInput(e.target.value)} 
            onKeyDown={e=>e.key==='Enter' && handleSearch()}
            placeholder="Enter Detroit address: 2532 Canton St" 
            className="flex-1 bg-transparent text-black px-4 outline-none text-[14px] placeholder:text-black/40" 
          />
          <button onClick={handleSearch} disabled={searching} className="bg-[#E7C369] text-black px-8 py-3 rounded-full font-semibold text-[14px] disabled:opacity-50">
            {searching ? 'Searching...' : 'Analyze parcel'}
          </button>
        </section>

        {/* PRE-BILL EQUITY AGENT - NOW USES SEARCH RESULTS */}
        <PreBillEquityAgent
          address={address}
          parcelId={parcelId}
          coords={coords}
          assessedValue={assessed}
          tcv={tcv}
        />

        <section className="border border-[#1E3A2A] bg-[#0F1F16] rounded-[20px] p-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#7AA08A]">Why This Matters</div>
          <div className="grid md:grid-cols-3 gap-6 mt-4 text-[12px] leading-relaxed text-[#9AB8A6]">
            <div><b className="text-[#E8EDE9]">01 Before:</b> No equity screening. Bills mailed even when assessed &gt; TCV.</div>
            <div><b className="text-[#E8EDE9]">02 Now:</b> Agent checks cap + 0.5mi comps. FAIL = HOLD BILL, requires review.</div>
            <div><b className="text-[#E8EDE9]">03 Future:</b> City must publish pre-bill equity log annually so it can't quietly repeat.</div>
          </div>
        </section>
      </main>
    </div>
  )
}
