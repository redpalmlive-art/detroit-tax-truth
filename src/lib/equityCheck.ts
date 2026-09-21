export type EquityResult = { pass: boolean; capPercent: number; compPercent: number; reason: string }

export function checkEquity(assessed: number, tcv: number, comps: number[]): EquityResult {
  const cap = (assessed / (tcv * 0.5)) * 100
  const avgComp = comps.length ? comps.reduce((a,b)=>a+b,0)/comps.length : tcv
  const compPct = (assessed / avgComp) * 100
  const pass = cap <= 100 && compPct <= 115
  return {
    pass,
    capPercent: Math.round(cap),
    compPercent: Math.round(compPct),
    reason: !pass ? "Exceeds 50% constitutional cap or 15% over comps - HOLD BILL" : "Pass - within equity bounds"
  }
}
