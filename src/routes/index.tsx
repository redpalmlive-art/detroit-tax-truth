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

  // Sample timeline for 1470 Atkinson - replace with real calculation later
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
    should: Math.round(r.shouldBe * 0.068), // ~68 mills effective for estimate
    over: Math.max(0, r.billed - Math.round(r.shouldBe * 0.068)),
    market: r.market,
    assessed: r.assessed,
    capPct: Math.round((r.assessed / (r.market * 0.5))*100)
  }))

  const totalOvertax = overByYear.reduce((s,r)=>s+r.over, 0)
  const totalBilled = overByYear.reduce((s,r)=>s+r.billed, 0)

  const doSearch = () => setSearched(true)

  return (
    <div className="min-h-screen bg-[#08110B] text-[#E8EDE9] font-sans">
      <header className="border-b border-[#1A2E22] bg-[#0A1710] sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-3.5 flex justify-between items-center">
          <div className="font-serif tracking-[0.14em] text-[13px]">DETROIT TAX TRUTH</div>
          <div className="text-[10px] tracking-widest text-[#5F8570]">RESTORE DETROIT • 2010-2016 DOCUMENTED</div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-8 space-y-6">
        {/* HERO - EXACT LIKE YOUR SCREENSHOT */}
        <section className="border border-[#E7C369]/15 bg-[#122219] rounded-[24px] p-8 md:p-10">
          <div className="text-[11px] tracking-[0.18em] text-[#E7C369]/90">CITYWIDE INCLUSION LEDGER</div>
          <h1 className="font-serif text-[32px] md:text-[38px] leading-[1.12] mt-4 max-w-[700px]">
            Over-assessment 2010-2016 caused $600M in<br/>illegal over-taxation. We document it per address<br/>so it never quietly repeats.
          </h1>
          <div className="grid grid-cols-3 gap-8 mt-10 max-w-[720px]">
            <div>
              <div className="font-sans font-bold text-[28px]">$600M+</div>
              <div className="text-[11px] text-[#7AA08A] mt-1">Documented harm 2010-2016</div>
            </div>
            <div>
              <div className="font-sans font-bold text-[28px]">55-85%</div>
              <div className="text-[11px] text-[#7AA08A] mt-1">Parcels over 50% cap</div>
            </div>
            <div>
              <div className="font-sans font-bold text-[28px]">50% Cap</div>
              <div className="text-[11px] text-[#7AA08A] mt-1">Mich Const Art 9 Sec 3</div>
            </div>
          </div>
        </section>

        {/* ANALYZE YOUR ADDRESS - EXACT LIKE SCREENSHOT */}
        <section className="border border-[#1E3A2A] bg-[#122219] rounded-[24px] p-6 md:p-7">
          <div className="text-[11px] tracking-[0.18em] text-[#7AA08A]">ANALYZE YOUR ADDRESS</div>
          <div className="mt-4 flex gap-3">
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter' && doSearch()}
              className="flex-1 bg-[#0A1710] border border-[#1E3A2A] rounded-full px-6 py-3.5 text-[14px] outline-none focus:border-[#E7C369]/40"
              placeholder="1470 Atkinson St, Detroit, MI 48206"
            />
            <button onClick={doSearch} className="bg-[#E7C369] hover:bg-[#D8B55E] text-black px-8 py-3.5 rounded-full font-semibold text-[14px] transition">
              Analyze
            </button>
          </div>
        </section>

        {/* YEAR-BY-YEAR OVERCHARGE - NEW AFTER SEARCH */}
        {searched && (
          <section className="space-y-4 animate-in fade-in">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[11px] tracking-[0.18em] text-[#E7C369]">OVERCHARGE BREAKDOWN • {input}</div>
                <div className="font-serif text-[22px] mt-2">You were overcharged ${totalOvertax.toLocaleString()} across 7 years</div>
                <div className="text-[11px] text-[#7AA08A] mt-1">Billed ${totalBilled.toLocaleString()} • Should have been ${(totalBilled-totalOvertax).toLocaleString()} • Cap violation {overByYear.filter(r=>r.capPct>100).length}/7 years</div>
              </div>
              <a href="/accountability" className="text-[11px] text-[#E7C369] underline hidden md:block">Check equity before next bill →</a>
            </div>

            {/* DESKTOP TABLE */}
            <div className="border border-[#1E3A2A] bg-[#0F1F16] rounded-[20px] overflow-hidden hidden md:block">
              <div className="grid grid-cols-6 gap-4 px-6 py-3 text-[10px] uppercase tracking-widest text-[#5F8570] border-b border-[#1A2E22] bg-[#0A1710]/50">
                <div>Year</div><div>Market (TCV)</div><div>Assessed</div><div>% of Cap</div><div>Tax Billed</div><div>Overcharge</div>
              </div>
              {overByYear.map(r=>(
                <div key={r.year} className="grid grid-cols-6 gap-4 px-6 py-4 text-[13px] border-b border-[#1A2E22]/50 last:border-0">
                  <div className="font-bold">{r.year}</div>
                  <div className="text-[#9AB8A6]">${r.market.toLocaleString()}</div>
                  <div className={`${r.capPct>100 ? 'text-[#FF9A8A]' : 'text-[#9AB8A6]'}`}>${r.assessed.toLocaleString()}</div>
                  <div className={`${r.capPct>100 ? 'text-[#FF9A8A] font-bold' : 'text-[#7AA08A]'}`}>{r.capPct}%</div>
                  <div>${r.billed.toLocaleString()}</div>
                  <div className="font-bold text-[#E7C369]">+${r.over.toLocaleString()}</div>
                </div>
              ))}
              <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-[#122219] font-bold text-[14px]">
                <div>Total</div><div></div><div></div><div></div><div>${totalBilled.toLocaleString()}</div><div className="text-[#E7C369]">${totalOvertax.toLocaleString()}</div>
              </div>
            </div>

            {/* MOBILE CARDS */}
            <div className="grid gap-3 md:hidden">
              {overByYear.map(r=>(
                <div key={r.year} className="border border-[#1E3A2A] bg-[#0F1F16] rounded-[16px] p-4 flex justify-between">
                  <div>
                    <div className="font-bold text-[15px]">{r.year} • {r.capPct}% cap</div>
                    <div className="text-[11px] text-[#7AA08A] mt-1">Assessed ${r.assessed.toLocaleString()} on ${r.market.toLocaleString()} market</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px]">Billed ${r.billed}</div>
                    <div className="text-[13px] font-bold text-[#E7C369]">+${r.over} over</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-[#E7C369]/20 bg-[#1A2E22] rounded-[16px] p-4 text-[11px] leading-relaxed text-[#9AB8A6]">
              <b className="text-[#E7C369]">How this is calculated:</b> Michigan Constitution Art 9 Sec 3 caps assessed at 50% of True Cash Value (market). For each year 2010-2016 we compare City assessed vs. 50% cap. Tax overcharge = (billed - should-be) based on 68 mills effective rate. This address was over cap {overByYear.filter(r=>r.capPct>100).length} of 7 years.
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
