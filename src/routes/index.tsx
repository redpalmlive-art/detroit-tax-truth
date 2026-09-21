import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

// @ts-ignore - generator needs literal, VSCode shows 1 problem but build passes
export const Route = createFileRoute('/')({
  component: Index,
})

type TimelineRow = { year: number; billed: number; should: number; market: number }

function Index() {
  const [input, setInput] = useState('1470 Atkinson St, Detroit, MI 48206')
  const [coords] = useState({ lat: 42.3807, lng: -83.1097 })
  const [searched, setSearched] = useState(false)

  const timeline: TimelineRow[] = [
    { year: 2010, billed: 42500, should: 18500, market: 37000 },
    { year: 2011, billed: 41900, should: 17200, market: 34400 },
    { year: 2012, billed: 41000, should: 15500, market: 31000 },
    { year: 2013, billed: 40500, should: 14200, market: 28400 },
    { year: 2014, billed: 39800, should: 13500, market: 27000 },
    { year: 2015, billed: 39100, should: 14800, market: 29600 },
    { year: 2016, billed: 38420, should: 19210, market: 38420 },
  ]

  const totalOvertax = timeline.reduce((sum, r) => sum + Math.max(0, r.billed - r.should), 0)

  return (
    <div className="min-h-screen bg-[#08110B] text-[#E8EDE9]">
      <header className="border-b border-[#1A2E22] bg-[#0A1710]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-serif text-[14px] tracking-widest">DETROIT TAX TRUTH</div>
          <div className="text-[10px] text-[#7AA08A]">RESTORE DETROIT • 2010-2016 DOCUMENTED</div>
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto px-6 py-10 space-y-10">
        <section className="border border-[#E7C369]/20 bg-[#122219] rounded-[20px] p-8">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#E7C369]">Citywide Inclusion Ledger</div>
          <h1 className="font-serif text-[32px] leading-[1.1] mt-3 max-w-[700px]">Over-assessment 2010-2016 caused $600M in illegal over-taxation. We document it per address so it never quietly repeats.</h1>
        </section>
        <section className="border border-[#1E3A2A] bg-[#0F1F16] rounded-[20px] p-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#7AA08A]">Analyze Your Address</div>
          <input value={input} onChange={e=>setInput(e.target.value)} className="mt-4 w-full bg-[#0A1710] border border-[#1E3A2A] rounded-full px-6 py-3 text-[14px]" />
          <div className="mt-6 text-[12px]">Total overtax for this address: ${totalOvertax.toLocaleString()}</div>
          <a href="/accountability" className="mt-4 inline-block text-[11px] text-[#E7C369] underline">Go to Accountability → Run Pre-Bill Equity Check</a>
        </section>
      </main>
    </div>
  )
}
