export interface ProviderPlan {
  id: "expatrio" | "fintiba" | "coracle";
  name: string;
  setupFeeEur: number;
  monthlyFeeEur: number;
  bufferEur: number;
  description: string;
  features: string[];
  recommendedInsurance: string;
  url: string;
}

export interface CityCostTier {
  city: string;
  state: string;
  tier: "high" | "moderate" | "affordable";
  estimatedRentEur: number; // average student WG room
  avgSemesterContributionEur: number; // Semesterbeitrag per semester (approx)
  notes: string;
}

// Official statutory Sperrkonto amount (effective winter semester 2024/2025 onwards: €992 / month)
export const STATUTORY_MONTHLY_SPERRKONTO_EUR = 992;

// Real exchange rate benchmark EUR to JOD (pegged USD ~ 0.709 JOD, 1 EUR ~ 0.77 JOD)
export const DEFAULT_EUR_TO_JOD_RATE = 0.77;

export const BLOCKED_ACCOUNT_PROVIDERS: ProviderPlan[] = [
  {
    id: "expatrio",
    name: "Expatrio (Value Package)",
    setupFeeEur: 49,
    monthlyFeeEur: 5,
    bufferEur: 100, // refundable buffer deposit
    description: "Most popular among GJU students. Includes free incoming travel insurance when bundled with Techniker Krankenkasse (TK).",
    features: [
      "Official German Federal Foreign Office accepted",
      "Free Incoming Travel Insurance (up to 92 days)",
      "Free German Bank Account (Aion Bank / SEPA)",
      "Digital blocked amount confirmation in 24h",
      "Fast online verification via passport",
    ],
    recommendedInsurance: "Techniker Krankenkasse (TK) statutory insurance (~€130/mo)",
    url: "https://www.expatrio.com",
  },
  {
    id: "fintiba",
    name: "Fintiba (Fintiba Plus)",
    setupFeeEur: 89,
    monthlyFeeEur: 4.9,
    bufferEur: 100,
    description: "Longest standing digital blocked account provider in Germany with direct Sutor Bank accounts in student's name.",
    features: [
      "Official German Federal Foreign Office accepted",
      "Individual German IBAN under student's own legal name",
      "Partnership with DAK-Gesundheit public health insurance",
      "Fintiba app for monthly payout tracking",
      "Free incoming insurance bundle available",
    ],
    recommendedInsurance: "DAK-Gesundheit statutory insurance (~€130/mo)",
    url: "https://www.fintiba.com",
  },
  {
    id: "coracle",
    name: "Coracle (Prime Package)",
    setupFeeEur: 99, // flat fee, 0 monthly
    monthlyFeeEur: 0,
    bufferEur: 80,
    description: "Zero monthly fee model. One-time setup fee with free Barmer or TK public health insurance application.",
    features: [
      "No recurring monthly admin fee (€0/month)",
      "Official German Federal Foreign Office accepted",
      "Free Incoming Travel Insurance (up to 180 days)",
      "Direct GJU student support team",
      "Quick Sperrbestätigung 006 document",
    ],
    recommendedInsurance: "Barmer or TK statutory insurance (~€130/mo)",
    url: "https://www.coracle.de",
  },
];

export const GERMAN_CITIES_COST_DATA: CityCostTier[] = [
  {
    city: "Munich",
    state: "Bavaria",
    tier: "high",
    estimatedRentEur: 720,
    avgSemesterContributionEur: 152,
    notes: "Toughest housing market in Germany. Apply for Studentenwerk Munich dorms on day 1!",
  },
  {
    city: "Berlin",
    state: "Berlin",
    tier: "high",
    estimatedRentEur: 620,
    avgSemesterContributionEur: 310,
    notes: "High rent and competitive WG market, but includes comprehensive public transport ticket.",
  },
  {
    city: "Cologne",
    state: "North Rhine-Westphalia",
    tier: "high",
    estimatedRentEur: 550,
    avgSemesterContributionEur: 320,
    notes: "Vibrant student city. Housing search takes 1-3 months; start before visa issuance.",
  },
  {
    city: "Stuttgart",
    state: "Baden-Württemberg",
    tier: "high",
    estimatedRentEur: 560,
    avgSemesterContributionEur: 210,
    notes: "Industrial hub. Strong internship salaries, but accommodation is tight.",
  },
  {
    city: "Darmstadt",
    state: "Hesse",
    tier: "moderate",
    estimatedRentEur: 490,
    avgSemesterContributionEur: 280,
    notes: "Very close to Frankfurt. High student density; shared apartments are common.",
  },
  {
    city: "Aachen",
    state: "North Rhine-Westphalia",
    tier: "moderate",
    estimatedRentEur: 450,
    avgSemesterContributionEur: 315,
    notes: "Student town bordering Belgium/Netherlands. Lots of student WG listings near FH/RWTH.",
  },
  {
    city: "Karlsruhe",
    state: "Baden-Württemberg",
    tier: "moderate",
    estimatedRentEur: 470,
    avgSemesterContributionEur: 195,
    notes: "Moderate rental market with great tram connections across the city.",
  },
  {
    city: "Nuremberg",
    state: "Bavaria",
    tier: "moderate",
    estimatedRentEur: 480,
    avgSemesterContributionEur: 170,
    notes: "More affordable than Munich with solid industry connections for Praxissemester.",
  },
  {
    city: "Bremen",
    state: "Bremen",
    tier: "moderate",
    estimatedRentEur: 430,
    avgSemesterContributionEur: 390,
    notes: "Northern Germany hub with relatively relaxed housing and university residence options.",
  },
  {
    city: "Magdeburg",
    state: "Saxony-Anhalt",
    tier: "affordable",
    estimatedRentEur: 320,
    avgSemesterContributionEur: 140,
    notes: "Very affordable for GJU students. Studentenwerk dorms often have open spots.",
  },
  {
    city: "Leipzig",
    state: "Saxony",
    tier: "affordable",
    estimatedRentEur: 380,
    avgSemesterContributionEur: 270,
    notes: "Culture and music capital with modern student accommodations and fair rents.",
  },
  {
    city: "Ilmenau",
    state: "Thuringia",
    tier: "affordable",
    estimatedRentEur: 290,
    avgSemesterContributionEur: 150,
    notes: "Campus university town. High guarantee of on-campus dorm placement at low cost.",
  },
  {
    city: "Köthen",
    state: "Saxony-Anhalt",
    tier: "affordable",
    estimatedRentEur: 270,
    avgSemesterContributionEur: 110,
    notes: "Lowest cost of living among GJU partners; dorms easily accessible.",
  },
];

export const EMBASSY_JORDAN_COSTS = {
  visaFeeEur: 75, // German National Visa Fee (€75 = ~56 JOD)
  translationAttestationJod: 50, // Average cost for certified German translation & Ministry/Embassy stamps in Amman
  biometricPhotosJod: 8, // Schengen photo studio in Amman
  flightEstimateJod: 350, // Amman (AMM) -> Frankfurt/Berlin/Munich one-way flight
  bankTransferFeeJod: 25, // Jordanian bank international SWIFT outgoing transfer fee
};
