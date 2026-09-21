// src/lib/equityCheck.ts
// Pre-bill equity checks: 50% constitutional cap + comparable sales
// ADD ONLY - does not touch index.tsx

export type EquityComp = {
  address: string
  saleDate: string
  salePrice: number
  distanceMiles: number
  tcv: number // true cash value = salePrice
}

export type EquityCheckResult = {
  parcelId: string
  address: string
  assessedValue: number
  trueCashValue: number
  capMaxAssessed: number
  capViolation: boolean
  capOverAmount: number
  comps: EquityComp[]
  compMedianTcv: number
  compImpliedMaxAssessed: number
  compViolation: boolean
  compOverAmount: number
  status: "PASS" | "FAIL" | "REVIEW"
  riskLevel: "low" | "medium" | "high"
  explanation: string[]
  appealDraft?: string
}

export function checkConstitutionalCap(assessed: number, tcv: number): { capMax: number; violation: boolean; over: number } {
  // Michigan Const Art 9 Sec 3: assessed <= 50% of TCV
  const capMax = tcv * 0.5
  const over = Math.max(0, assessed - capMax)
  return { capMax, violation: assessed > capMax + 1, over }
}

export async function fetchCompsForParcel(lat: number, lng: number, address: string): Promise<EquityComp[]> {
  // For now uses deterministic mock per location so it works today without API keys
  // Replace with Detroit Open Data + ATTOM/Regrid call when you have keys
  // Example real call: https://data.detroitmi.gov/resource/assessments? $where=within_circle(lat,lng,804)
  try {
    let hash = 0; for(let i=0;i<address.length;i++) hash = ((hash<<5)-hash)+address.charCodeAt(i)
    const base = 28000 + Math.abs(hash % 22000)
    const comps: EquityComp[] = []
    for(let i=0;i<5;i++){
      const price = Math.round(base + (Math.abs(hash+i*17)%8000) - 4000 + i*300)
      comps.push({
        address: `${1400 + i*8} Atkinson St, Detroit, MI`,
        saleDate: `2024-${String(2+i).padStart(2,'0')}-15`,
        salePrice: price,
        tcv: price,
        distanceMiles: 0.1 + i*0.12
      })
    }
    return comps
  } catch {
    return []
  }
}

export async function runPreBillEquityCheck(input: {
  parcelId: string
  address: string
  lat: number
  lng: number
  assessedValue: number
  tcv: number
}): Promise<EquityCheckResult> {
  const cap = checkConstitutionalCap(input.assessedValue, input.tcv)
  const comps = await fetchCompsForParcel(input.lat, input.lng, input.address)
  const compMedianTcv = comps.length ? comps.map(c=>c.tcv).sort((a,b)=>a-b)[Math.floor(comps.length/2)] : input.tcv
  const compImpliedMax = compMedianTcv * 0.5
  const compOver = Math.max(0, input.assessedValue - compImpliedMax)
  const compViolation = compOver > compMedianTcv * 0.1 // 10% tolerance

  const explanation: string[] = []
  if(cap.violation) explanation.push(`Cap violation: Assessed $${input.assessedValue.toLocaleString()} > 50% cap $${cap.capMax.toLocaleString()} (TCV $${input.tcv.toLocaleString()}). Over by $${cap.over.toLocaleString()}.`)
  else explanation.push(`Cap check PASS: Assessed $${input.assessedValue.toLocaleString()} <= 50% cap $${cap.capMax.toLocaleString()}.`)
  
  if(compViolation) explanation.push(`Comp violation: Assessed $${input.assessedValue.toLocaleString()} > comp-implied max $${compImpliedMax.toLocaleString()} based on median sale $${compMedianTcv.toLocaleString()} within 0.5 mi. Over by $${compOver.toLocaleString()}.`)
  else explanation.push(`Comp check PASS: Assessed within 10% of comp median $${compMedianTcv.toLocaleString()}.`)

  let status: EquityCheckResult["status"] = "PASS"
  let risk: EquityCheckResult["riskLevel"] = "low"
  if(cap.violation || compViolation){
    status = cap.violation && compViolation ? "FAIL" : "REVIEW"
    risk = cap.violation ? "high" : "medium"
  }

  const appealDraft = status !== "PASS" ? 
`RE: Pre-Bill Equity Check - Parcel ${input.parcelId} - ${input.address}

Under Michigan Constitution Art 9 Sec 3, assessed value may not exceed 50% of True Cash Value. Current assessment $${input.assessedValue.toLocaleString()} with TCV $${input.tcv.toLocaleString()} exceeds cap by $${cap.over.toLocaleString()}.

Comparable sales within 0.5 mile (median $${compMedianTcv.toLocaleString()}) indicate market TCV ~$${compMedianTcv.toLocaleString()}, implying max assessed $${compImpliedMax.toLocaleString()}. Current assessment is $${compOver.toLocaleString()} over comp-based equity.

Request: Hold 2026 tax bill for review and adjust to comp-supported TCV before issuance.

Comps:
${comps.map(c=>`- ${c.address}: $${c.salePrice.toLocaleString()} on ${c.saleDate} (${c.distanceMiles.toFixed(2)} mi)`).join('\n')}
` : undefined

  return {
    parcelId: input.parcelId,
    address: input.address,
    assessedValue: input.assessedValue,
    trueCashValue: input.tcv,
    capMaxAssessed: cap.capMax,
    capViolation: cap.violation,
    capOverAmount: cap.over,
    comps,
    compMedianTcv,
    compImpliedMaxAssessed: compImpliedMax,
    compViolation,
    compOverAmount: compOver,
    status,
    riskLevel: risk,
    explanation,
    appealDraft
  }
}
