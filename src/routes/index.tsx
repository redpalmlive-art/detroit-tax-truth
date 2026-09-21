import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

function IndexPage(){
  const [input,setInput]=useState("2532 Canton St, Detroit, MI 48207")
  const [coords,setCoords]=useState<{lat:number,lng:number}|null>({lat:42.349,lng:-83.065})

  const handleSearch = async () => {
    const raw = input.trim(); if(!raw) return
    try{
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(raw + ", Detroit, MI")}`)
      const geo = await geoRes.json()
      if(geo[0]) setCoords({lat: parseFloat(geo[0].lat), lng: parseFloat(geo[0].lon)})
    }catch{}
  }

  const sv = (lat:number,lng:number,h:number)=> `https://maps.google.com/maps?q=&layer=c&cbll=${lat},${lng}&cbp=12,${h},0,0,0&output=svembed`
  const sat = (lat:number,lng:number)=> `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${lng-0.002},${lat-0.002},${lng+0.002},${lat+0.002}&bboxSR=4326&imageSR=4326&size=640,400&format=jpg&f=image`

  return (
    <div className="min-h-screen bg-[#0A1710] text-[#E8EDE9]">
      {/* HEADER - RESTORED */}
      <header className="border-b border-[#1E3A2A] bg-[#0F2018] sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1E3A2A] border border-[#E7C369]/40 grid place-items-center font-bold text-[#E7C369]">R</div>
            <span className="font-bold tracking-widest text-[18px]">RESTORE DETROIT</span>
          </div>
          <nav className="hidden md:flex gap-8 text-[13px] tracking-[0.18em] text-[#7AA08A]">
            <a className="hover:text-[#E8EDE9]">REMEDY ENGINE</a>
            <a className="hover:text-[#E8EDE9]">TAX ESTIMATOR</a>
            <a className="hover:text-[#E8EDE9]">ACCOUNTABILITY</a>
          </nav>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {/* HERO */}
        <h1 className="text-[48px] md:text-[62px] leading-[0.95] font-serif font-bold">Find every claimant.<br/>Recover every<br/>authorized dollar.</h1>
        <p className="mt-4 text-[#7AA08A] max-w-[560px] text-[14px] leading-relaxed">Detroit overtaxed homeowners by at least $600M between 2010-2016. 55-85% of homes were assessed above the 50% constitutional cap. This tool finds every eligible parcel and calculates recoverable compensation.</p>

        {/* REMEDY CARDS - FROM YOUR SCREENSHOT - RESTORED */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-[#E7C369]/60 bg-[#1A2E22] rounded-[16px] p-5">
            <div className="text-[12px] tracking-[0.2em] text-[#7AA08A]">BEST</div>
            <div className="mt-3 text-[16px] leading-snug">Future Tax Credit -<br/>$4,217</div>
          </div>
          <div className="border border-[#1E3A2A] bg-[#122219] rounded-[16px] p-5">
            <div className="text-[12px] tracking-[0.2em] text-[#7AA08A]">DIRECT</div>
            <div className="mt-3 text-[16px] leading-snug">Direct Grant - $4,217</div>
          </div>
          <div className="border border-[#1E3A2A] bg-[#122219] rounded-[16px] p-5">
            <div className="text-[12px] tracking-[0.2em] text-[#7AA08A]">FREEZE</div>
            <div className="mt-3 text-[16px] leading-snug">Tax Freeze - $6,840</div>
          </div>
          <div className="border border-[#1E3A2A] bg-[#122219] rounded-[16px] p-5">
            <div className="text-[12px] tracking-[0.2em] text-[#7AA08A]">HEIR</div>
            <div className="mt-3 text-[16px] leading-snug">Generational -<br/>$1,405</div>
          </div>
        </section>

        {/* SEARCH - RESTORED */}
        <section className="mt-6 bg-[#F5F1E8] rounded-[16px] p-3 flex gap-3">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()} placeholder="Enter Detroit address: 2532 Canton St" className="flex-1 bg-transparent text-black px-4 outline-none text-[14px]" />
          <button onClick={handleSearch} type="button" className="bg-[#E7C369] text-black px-8 py-3 rounded-full font-semibold text-[14px]">Analyze parcel</button>
        </section>

        {/* PHOTOS + HOMEOWNER - RESTORED + FREE REAL PHOTOS ADDED */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-[#1E3A2A] bg-[#122219] rounded-[16px] p-6">
            <div className="text-[10px] uppercase tracking-widest text-[#7AA08A] mb-4">Homeowner Information</div>
            <div className="text-[20px] font-bold">Estate of Mabel J. Johnson</div>
            <div className="mt-4 space-y-3 text-[13px]">
              <div className="flex justify-between"><span className="text-[#6B8E7B]">Address</span><span>{input}</span></div>
              <div className="flex justify-between"><span className="text-[#6B8E7B]">Parcel ID</span><span>08012345-678</span></div>
              <div className="flex justify-between"><span className="text-[#6B8E7B]">Status</span><span className="text-[#E7C369]">Overtaxed 2010-2016</span></div>
              <div className="flex justify-between"><span className="text-[#6B8E7B]">Recoverable</span><span className="text-[#E7C369] font-bold">$4,217</span></div>
            </div>
          </div>
          <div className="border border-[#1E3A2A] bg-[#122219] rounded-[16px] p-4">
            <div className="text-[10px] uppercase tracking-widest text-[#7AA08A] mb-3">Most Recent Photos - FREE real photos - no billing</div>
            <div className="grid grid-cols-2 gap-3">
              <iframe title="Front" src={sv(coords!.lat,coords!.lng,0)} className="rounded-xl h-36 w-full border-0 bg-black" />
              <iframe title="Side" src={sv(coords!.lat,coords!.lng,90)} className="rounded-xl h-36 w-full border-0 bg-black" />
              <iframe title="Rear" src={sv(coords!.lat,coords!.lng,180)} className="rounded-xl h-36 w-full border-0 bg-black" />
              <img title="Satellite" src={sat(coords!.lat,coords!.lng)} alt="Satellite" className="rounded-xl h-36 w-full object-cover bg-black" />
            </div>
          </div>
        </section>

        {/* OVERTAX TABLE - RESTORED */}
        <section className="mt-6 border border-[#1E3A2A] bg-[#122219] rounded-[16px] p-6">
          <div className="text-[10px] uppercase tracking-widest text-[#7AA08A]">Overtax Timeline 2010-2016</div>
          <div className="mt-4 grid grid-cols-7 text-[11px] text-[#6B8E7B] gap-2">
            <div>2010</div><div>2011</div><div>2012</div><div>2013</div><div>2014</div><div>2015</div><div>2016</div>
          </div>
        </section>

        <div className="mt-8 text-center text-[10px] text-[#3A5A45]">Detroit Tax Truth • Full front page restored • Free real photos</div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/' as any)({ component: IndexPage })
