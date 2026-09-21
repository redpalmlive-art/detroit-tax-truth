import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

// @ts-ignore
export const Route = createFileRoute('/')({
  component: Index,
})

type Row = { year: number; market: number; assessed: number; shouldBe: number; billed: number }

function Index(){
  const [input, setInput] = useState('1470 Atkinson St, Detroit, MI 48206')
  const [searched, setSearched] = useState(false)

  const timeline: Row[] = [
    { year: 2010, market: 42000, assessed: 42500, shouldBe: 21000, billed: 3120 },
    { year: 2011, market: 38000, assessed: 41900, shouldBe: 19000, billed: 3080 },
    { year: 2012, market: 31000, assessed: 41000, shouldBe: 15500, billed: 3010 },
    { year: 2013, market: 28400, assessed: 40500, shouldBe: 14200, billed: 2975 },
    { year: 2014, market: 27000, assessed: 39800, shouldBe: 13500, billed: 2920 },
    { year: 2015, market: 29600, assessed: 39100, shouldBe: 14800, billed: 2870 },
    { year: 2016, market: 38420, assessed: 38420, shouldBe: 19210, billed: 2820 },
  ]

  const overByYear = timeline.map(r => ({
    year: r.year,
    billed: r.billed,
    should: Math.round(r.shouldBe * 0.068),
    over: Math.max(0, r.billed - Math.round(r.shouldBe * 0.068)),
    market: r.market,
    assessed: r.assessed,
    capPct: Math.round((r.assessed / (r.market * 0.5))*100)
  }))

  const totalOvertax = overByYear.reduce((s,r)=>s+r.over, 0)
  const totalBilled = overByYear.reduce((s,r)=>s+r.billed, 0)

  return (
    <div className="min-h-screen bg-[#08110B] text-[#E8EDE9] font-sans">
      <header className="border-b border-[#1A2E22] bg-[#0A1710] sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-3.5 flex justify-between items-center">
          <div className="font-serif tracking-[0.14em] text-[13px]">DETROIT TAX TRUTH</div>
          <div className="text-[10px] tracking-widest text-[#5F8570]">RESTORE DETROIT • 2010-2016 DOCUMENTED</div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-10 space-y-8">
        {/* HERO - SPACED OUT VERSION WITH NEW COPY */}
        <section className="border border-[#E7C369]/15 bg-[#122219] rounded-[32px] p-10 md:p-14 lg:p-16">
          <div className="text-[11px] tracking-[0.22em] text-[#E7C369]/90 font-medium">CITYWIDE INCLUSION LEDGER</div>
          
          <h1 className="font-serif text-[34px] md:text-[42px] lg:text-[46px] leading-[1.18] tracking-[-0.02em] mt-8 max-w-[760px] font-[350]">
            Over-assessment from 2010 to 2016 led to an estimated $600M in over-taxation. We're a searchable database that documents it address by address, with safeguards so it can't quietly happen again
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mt-16 max-w-[800px] pt-12 border-t border-[#1E3A2A]/60">
            <div className="space-y-3">
              <div className="font-sans font-bold text-[32px] tracking-tight">$600M+</div>
              <div className="text-[12px] leading-[1.4] text-[#7AA08A]">Documented harm 2010-2016</div>
            </div>
            <div className="space-y-3">
              <div className="font-sans font-bold text-[32px] tracking-tight">55-85%</div>
              <div className="text-[12px] leading-[1.4] text-[#7AA08A]">Parcels over 50% cap</div>
            </div>
            <div className="space-y-3">
              <div className="font-sans font-bold text-[32px] tracking-tight">50% Cap</div>
              <div className="text-[12px] leading-[1.4] text-[#7AA08A]">Mich Const Art 9 Sec 3</div>
            </div>
          </div>
        </section>

        {/* ANALYZE YOUR ADDRESS - MORE BREATHING ROOM */}
        <section className="border border-[#1E3A2A] bg-[#122219] rounded-[32px] p-8 md:p-10">
          <div className="text-[11px] tracking-[0.2em] text-[#7AA08A] font-medium mb-6">ANALYZE YOUR ADDRESS</div>
          <div className="flex gap-4">
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter' && setSearched(true)}
              className="flex-1 bg-[#0A1710] border border-[#1E3A2A] rounded-full px-8 py-4 text-[15px] outline-none focus:border-[#E7C369]/40 placeholder:text-white/30 transition"
              placeholder="1470 Atkinson St, Detroit, MI 48206"
            />
            <button onClick={()=>setSearched(true)} className="bg-[#E7C369] hover:bg-[#D8B55E] text-black px-10 py-4 rounded-full font-semibold text-[15px] transition shrink-0">
              Analyze
            </button>
          </div>
        </section>

        {searched && (
          <section className="space-y-6">
            <div className="border border-[#1E3A2A] bg-[#0F1F16] rounded-[24px] overflow-hidden">
              <div className="px-8 py-6 border-b border-[#1A2E22] flex justify-between items-center">
                <div className="text-[12px] tracking-widest text-[#E7C369]">OVERCHARGE BREAKDOWN • {input}</div>
                <div className="text-[13px]">Total over: <span className="font-bold text-[#E7C369]">${totalOvertax.toLocaleString()}</span></div>
              </div>
              <div className="divide-y divide-[#1A2E22]/50">
                {overByYear.map(r=>(
                  <div key={r.year} className="grid grid-cols-6 gap-4 px-8 py-5 text-[13px]">
                    <div className="font-bold">{r.year}</div>
                    <div className="text-[#9AB8A6]">${r.market.toLocaleString()}</div>
                    <div className={r.capPct>100 ? 'text-[#FF9A8A]' : 'text-[#9AB8A6]'}>${r.assessed.toLocaleString()}</div>
                    <div className={r.capPct>100 ? 'text-[#FF9A8A] font-bold' : 'text-[#7AA08A]'}>{r.capPct}%</div>
                    <div>${r.billed.toLocaleString()}</div>
                    <div className="font-bold text-[#E7C369]">+${r.over.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
