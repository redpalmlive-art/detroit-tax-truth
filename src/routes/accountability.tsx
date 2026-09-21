import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PreBillEquityAgent } from '../components/PreBillEquityAgent'

// @ts-ignore - generator needs literal, VSCode shows 1 problem but build passes
export const Route = createFileRoute('/accountability')({
  component: AccountabilityPage,
})

function AccountabilityPage(){
  const [input] = useState('1470 Atkinson St, Detroit, MI 48206')
  const [coords] = useState({ lat: 42.3807, lng: -83.1097 })
  const timeline = [
    { year: 2010, billed: 42500, should: 18500, market: 37000 },
    { year: 2016, billed: 38420, should: 19210, market: 38420 },
  ]

  return (
    <div className="min-h-screen bg-[#08110B] text-[#E8EDE9]">
      <header className="border-b border-[#1A2E22] bg-[#0A1710]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-serif text-[14px] tracking-widest">DETROIT TAX TRUTH</div>
          <div className="text-[10px] text-[#7AA08A]">ACCOUNTABILITY • PRE-BILL SAFEGUARD</div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-10 space-y-8">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#E7C369]">City Accountability</div>
          <h1 className="font-serif text-[36px] leading-[1.1] mt-3 max-w-[700px]">How we prevent the next downturn from becoming the next over-taxation.</h1>
          <p className="text-[13px] text-[#7AA08A] mt-4 max-w-[600px]">2010-2016 happened because assessments were never screened against the 50% constitutional cap or neighborhood comps before bills went out. This page runs that check live.</p>
        </div>

        {/* PRE-BILL EQUITY AGENT - MOVED HERE */}
        <PreBillEquityAgent
          address={input}
          parcelId="0800477-031L"
          coords={coords}
          assessedValue={timeline[1].billed}
          tcv={timeline[1].market}
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
