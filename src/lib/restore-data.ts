export type Parcel = {
  address: string;
  parcelId: string;
  neighborhood: string;
  classification: string;
  marketValue: number;
  billedTaxable: number;
  overtax: number;
  peakRatio: number;
  confidence: number;
  status: string;
  priority: string;
  history: { year: number; billed: number; benchmark: number }[];
  claimant: {
    name: string;
    note: string;
    records: { record: string; event: string; date: string; match: number }[];
  };
  harm: {
    overtax: number;
    equity: number;
    relocation: number;
    appreciation: number;
    hardship: number;
  };
};

function makeHistory(base: number, spread: number) {
  return [2010, 2011, 2012, 2013, 2014, 2015, 2016].map((year, i) => ({
    year,
    billed: Math.round(base + spread * Math.sin(i) + i * 320),
    benchmark: Math.round(base * 0.62 + i * 120),
  }));
}

export const PARCELS: Parcel[] = [
  {
    address: "1456 Atkinson Street",
    parcelId: "08004112",
    neighborhood: "North End",
    classification: "Residential",
    marketValue: 41000,
    billedTaxable: 33800,
    overtax: 8742,
    peakRatio: 84,
    confidence: 94,
    status: "Evidence ready",
    priority: "Priority review recommended",
    history: makeHistory(5200, 900),
    claimant: {
      name: "Denise Carter",
      note: "Previous owner during the affected period. Identity and mailing address require verification.",
      records: [
        { record: "Assessment roll", event: "Denise Carter", date: "2010-2016", match: 99 },
        { record: "Register of Deeds", event: "Ownership transfer recorded", date: "Oct. 2017", match: 97 },
        { record: "County tax record", event: "Foreclosure disposition", date: "Mar. 2018", match: 95 },
        { record: "Contact match", event: "Mailing record candidate", date: "Current", match: 82 },
      ],
    },
    harm: { overtax: 8742, equity: 54000, relocation: 6800, appreciation: 31500, hardship: 15000 },
  },
  {
    address: "9021 Dexter Avenue",
    parcelId: "16009884",
    neighborhood: "Russell Woods",
    classification: "Residential",
    marketValue: 56500,
    billedTaxable: 42100,
    overtax: 6120,
    peakRatio: 75,
    confidence: 88,
    status: "Under review",
    priority: "Standard review",
    history: makeHistory(4400, 700),
    claimant: {
      name: "Estate of Marvin Hollis",
      note: "Owner deceased 2019. Two probable heirs identified; probate confirmation required before contact.",
      records: [
        { record: "Assessment roll", event: "Marvin Hollis", date: "2010-2016", match: 98 },
        { record: "Vital records", event: "Death certificate filed", date: "Jul. 2019", match: 96 },
        { record: "Probate index", event: "Heir: Angela Hollis-Reed", date: "2020", match: 91 },
        { record: "Contact match", event: "Mailing record candidate", date: "Current", match: 77 },
      ],
    },
    harm: { overtax: 6120, equity: 38000, relocation: 4200, appreciation: 22400, hardship: 9000 },
  },
  {
    address: "3310 Chene Street",
    parcelId: "04117320",
    neighborhood: "Poletown East",
    classification: "Residential",
    marketValue: 29500,
    billedTaxable: 27900,
    overtax: 11380,
    peakRatio: 95,
    confidence: 97,
    status: "Evidence ready",
    priority: "Priority review recommended",
    history: makeHistory(6100, 1100),
    claimant: {
      name: "Rosalind Meeks",
      note: "Lost home to tax foreclosure in 2015. Current mailing address verified by two independent sources.",
      records: [
        { record: "Assessment roll", event: "Rosalind Meeks", date: "2010-2015", match: 99 },
        { record: "County tax record", event: "Foreclosure disposition", date: "Sep. 2015", match: 98 },
        { record: "Register of Deeds", event: "Auction transfer recorded", date: "Nov. 2015", match: 94 },
        { record: "Contact match", event: "Mailing record candidate", date: "Current", match: 89 },
      ],
    },
    harm: { overtax: 11380, equity: 61000, relocation: 9400, appreciation: 27800, hardship: 18000 },
  },
];

export const LEDGER = [
  { value: "380,214", label: "Parcels inventoried" },
  { value: "173,104", label: "Historical owner records" },
  { value: "41,827", label: "Heir searches required" },
  { value: "0", label: "Cases silently discarded" },
];

export const METHOD_STEPS = [
  { title: "Assessment rolls matched", detail: "Detroit assessor records, 2010-2016" },
  { title: "Market value reconstructed", detail: "2017 reappraisal + comparable sales" },
  { title: "Constitutional cap applied", detail: "50% of estimated market value" },
  { title: "Tax difference calculated", detail: "Millage by year, interest excluded" },
];

export const RECOVERY_STAGES = [
  { stage: "Evidence verification", office: "Claims examiner", deadline: "10 business days", status: "Complete" },
  { stage: "Legal eligibility review", office: "Program counsel", deadline: "20 business days", status: "In review" },
  { stage: "Claimant notice", office: "Outreach team", deadline: "30 days", status: "Queued" },
  { stage: "Award authorization", office: "Authorized decision-maker", deadline: "15 business days", status: "Pending" },
  { stage: "Payment confirmation", office: "Disbursement office", deadline: "10 business days", status: "Pending" },
];

export const MONITOR_ROWS = [
  { area: "48205", pattern: "Low-value homes assessed at higher ratios", parcels: 612, severity: "High", action: "Pause & review" },
  { area: "48213", pattern: "Year-over-year increase outside peers", parcels: 401, severity: "Medium", action: "Sample audit" },
  { area: "48210", pattern: "Comparable-sale mismatch", parcels: 287, severity: "Medium", action: "Revalue" },
  { area: "48227", pattern: "Stale field inspection data", parcels: 154, severity: "Low", action: "Re-inspect" },
];

/** Detroit-area millage rates (mills per $1,000 of taxable value). Illustrative. */
export const MILLAGE = {
  principalResidence: 67.0,
  nonPrincipal: 85.0,
};

export function estimateTax(marketValue: number, isPrimary: boolean) {
  const assessed = marketValue * 0.5; // constitutional cap: 50% of market value
  const taxable = assessed; // first year after transfer: taxable value uncaps to SEV
  const mills = isPrimary ? MILLAGE.principalResidence : MILLAGE.nonPrincipal;
  const annual = (taxable * mills) / 1000;
  return {
    assessed,
    taxable,
    mills,
    annual,
    monthly: annual / 12,
    summer: annual * 0.62,
    winter: annual * 0.38,
  };
}

export function currency(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
