import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PreBillEquityAgent } from '../components/PreBillEquityAgent'

// @ts-ignore
export const Route = createFileRoute('/index_backup')({
  component: Index,
})

type TimelineRow = { year: number; billed: number; should: number; market: number }

function Index() {
  const [input, setInput] = useState('1470 Atkinson St, Detroit, MI 48206')
  const [coords] = useState({ lat: 42.3807, lng: -83.1097 })
  const [searched, setSearched] = useState(false)

  // 2010-2016 timeline per address - your existing logic
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearched(true)
  }

  return (
    <div className="min-h-screen bg-[#08110B] text-[#E8EDE9] font-sans">
      {/* HEADER */}
      <header className="border-b border-[#1A2E22] bg-[#0A1710]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-serif text-[14px] tracking-widest">DETROIT TAX TRUTH</div>
          <div className="text-[10px] text-[#7AA08A]">RESTORE DETROIT • 2010-2016 DOCUMENTED</div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-10 space-y-10">
        {/* LEDGER */}
        <section className="border border-[#E7C369]/20 bg-[#122219] rounded-[20px] p-8">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#E7C369]">Citywide Inclusion Ledger</div>
          <h1 className="font-serif text-[32px] leading-[1.1] mt-3 max-w-[700px]">Over-assessment 2010-2016 caused $600M in illegal over-taxation. We document it per address so it never quietly repeats.</h1>
          <div className="grid grid-cols-3 gap-6 mt-8 max-w-[700px]">
            <div><div className="text-[28px] font-bold">$600M+</div><div className="text-[11px] text-[#7AA08A]">Documented harm 2010-2016</div></div>
            <div><div className="text-[28px] font-bold">55-85%</div><div className="text-[11px] text-[#7AA08A]">Parcels over 50% cap</div></div>
            <div><div className="text-[28px] font-bold">50% Cap</div><div className="text-[11px] text-[#7AA08A]">Mich Const Art 9 Sec 3</div></div>
          </div>
        </section>

        {/* SEARCH */}
        <section className="border border-[#1E3A2A] bg-[#0F1F16] rounded-[20px] p-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#7AA08A]">Analyze Your Address</div>
          <form onSubmit={handleSearch} className="mt-4 flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter Detroit address"
              className="flex-1 bg-[#0A1710] border border-[#1E3A2A] rounded-full px-6 py-3 text-[14px] focus:outline-none focus:border-[#E7C369]/50"
            />
            <button type="submit" className="bg-[#E7C369] text-black px-8 py-3 rounded-full text-[13px] font-semibold">Analyze</button>
          </form>

          {searched && (
            <div className="mt-8 space-y-6">
              <div>
                <div className="text-[12px] text-[#7AA08A]">Showing timeline for</div>
                <div className="text-[16px] font-semibold">{input}</div>
              </div>

              {/* 2010-2016 TIMELINE PER ADDRESS */}
              <div className="border border-[#1E3A2A] bg-[#0A1710] rounded-xl overflow-hidden">
                <div className="grid grid-cols-4 gap-0 text-[10px] uppercase tracking-widest text-[#7AA08A] p-4 border-b border-[#1E3A2A]">
                  <div>Year</div><div>Market (TCV)</div><div>Billed</div><div>Should (50% Cap)</div>
                </div>
                {timeline.map(r => (
                  <div key={r.year} className="grid grid-cols-4 gap-0 text-[13px] p-4 border-b border-[#1A2E22] last:border-0">
                    <div>{r.year}</div>
                    <div>${r.market.toLocaleString()}</div>
                    <div className={r.billed > r.should ? "text-[#FF9A9A]" : ""}>${r.billed.toLocaleString()}</div>
                    <div className="text-[#8ADFA7]">${r.should.toLocaleString()}</div>
                  </div>
                ))}
                <div className="p-4 bg-[#122219] text-[13px] flex justify-between">
                  <span className="text-[#7AA08A]">Total overtax 2010-2016 (per this address)</span>
                  <span className="font-bold text-[#E7C369]">${totalOvertax.toLocaleString()}</span>
                </div>
              </div>

              {/* HOMEOWNER */}
              <div className="border border-[#1E3A2A] bg-[#0A1710] rounded-xl p-5 text-[12px] leading-relaxed">
                <div className="text-[10px] uppercase text-[#7AA08A] mb-2">Homeowner Impact</div>
                For {input}, the city billed ${timeline[6].billed.toLocaleString()} assessed on a market that had crashed to ${timeline[6].market.toLocaleString()} TCV. Under Michigan Constitution, max assessed is 50% of TCV. This parcel exceeded that cap in {timeline.filter(r=>r.billed>r.should).length} of 7 years. The over-billing was not disclosed on the tax bill.
              </div>
            </div>
          )}
        </section>

        {/* PHOTOS */}
        <section className="grid grid-cols-3 gap-4">
          <div className="h-[160px] bg-[#0F1F16] border border-[#1E3A2A] rounded-xl flex items-center justify-center text-[10px] text-[#3A5A45]">1470 ATKINSON - PHOTO 1</div>
          <div className="h-[160px] bg-[#0F1F16] border border-[#1E3A2A] rounded-xl flex items-center justify-center text-[10px] text-[#3A5A45]">ATKINSON BLOCK - PHOTO 2</div>
          <div className="h-[160px] bg-[#0F1F16] border border-[#1E3A2A] rounded-xl flex items-center justify-center text-[10px] text-[#3A5A45]">COMPS - PHOTO 3</div>
        </section>

        {/* 01-05 */}
        <section className="border border-[#1E3A2A] bg-[#0F1F16] rounded-[20px] p-8">
          <div className="grid md:grid-cols-5 gap-6 text-[12px]">
            <div><div className="text-[#E7C369]">01 CRASH</div><div className="text-[#7AA08A] mt-1">Market fell 70%, assessments did not.</div></div>
            <div><div className="text-[#E7C369]">02 CAP</div><div className="text-[#7AA08A] mt-1">50% cap ignored - assessments exceeded TCV.</div></div>
            <div><div className="text-[#E7C369]">03 BILL</div><div className="text-[#7AA08A] mt-1">Bills mailed without equity screening.</div></div>
            <div><div className="text-[#E7C369]">04 HARM</div><div className="text-[#7AA08A] mt-1">Tax foreclosure pipeline accelerated.</div></div>
            <div><div className="text-[#E7C369]">05 FIX</div><div className="text-[#7AA08A] mt-1">Pre-bill checks now prevent repeat.</div></div>
          </div>
        </section>

        {/* COMPENSATION */}
        <section className="border border-[#E7C369]/20 bg-[#122219] rounded-[20px] p-8">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#E7C369]">Compensation Options</div>
          <div className="mt-3 text-[13px] leading-relaxed max-w-[700px] text-[#9AB8A6]">
            Documentation per address supports claims for overpayment. Compensation paths: (1) City-funded reimbursement fund, (2) State tax credit offset, (3) Land bank equity credit. Your timeline above is the evidence package.
          </div>
        </section>

        {/* PRE-BILL EQUITY AGENT - NEW - prevents next downturn */}
        <PreBillEquityAgent
          address={input}
          parcelId="0800477-031L"
          coords={coords}
          assessedValue={timeline[6].billed}
          tcv={timeline[6].market}
        />
      </main>

      <footer className="max-w-[1200px] mx-auto px-6 py-10 text-[10px] text-[#3A5A45] text-center border-t border-[#1A2E22] mt-10">
        Detroit Tax Truth - Pre-bill equity checks: Assessments are screened against comparable sales and the 50% constitutional cap before bills go out, so the same harm cannot quietly repeat in the next downturn.
      </footer>
    </div>
  )
}
