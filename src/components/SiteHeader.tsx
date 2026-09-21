export default function SiteHeader(){
  return (
    <header className="border-b border-[#1E3A2A] bg-[#0A1710] sticky top-0 z-50">
      <div className="max-w- mx-auto px-6 h- flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#122219] border border-[#E7C369]/40 grid place-items-center font-bold text-[#E7C369]">R</div>
          <div className="font-black text- tracking-widest">RESTORE DETROIT</div>
        </div>
        <nav className="flex items-center gap-6 text- tracking-[0.18em] text-[#7AA08A]">
          <a href="/" className="hover:text-white">REMEDY ENGINE</a>
          <a href="/estimate" className="hover:text-white">TAX ESTIMATOR</a>
          <a href="/accountability" className="hover:text-white">ACCOUNTABILITY</a>
        </nav>
      </div>
    </header>
  )
}