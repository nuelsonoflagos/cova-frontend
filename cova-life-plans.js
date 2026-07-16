// Cova — Life Insurance Plan Data (Nigeria)
//
// Single source of truth for life insurance plans. Consumed by the universal
// comparison engine (cova-compare.html).
//
// NOTE: Life insurance pricing depends heavily on age, sum assured, and health.
// "from" prices are for a healthy applicant under 35 unless noted.
// Provider rebrands: FBN Insurance → Sanlam; Zenith Life → Prudential Zenith Life.

(function () {
  window.CovaLifePlans = [
    // ── TERM LIFE (pure risk — cheapest cover per ₦ of benefit) ───────────
    {
      id: "axa-instant",
      provider: "AXA Mansard",
      planName: "Instant Plan",
      type: "term",
      priceAnnual: 1000,
      priceFromLabel: "₦1,000–₦15,000/yr (you choose)",
      sumAssured: "₦100,000 – ₦1,500,000",
      term: "1 year, renewable",
      features: ["No medical test required", "Hospital expenses benefit", "Permanent disability benefit"],
      notes: "You pick the premium and get corresponding cover. Most flexible entry-level life plan.",
      bestFor: "Easiest entry (no medical)",
      source: "https://www.axamansard.com/insurance/life/instant-plan",
      lastVerified: "2026-07"
    },
    {
      id: "leadway-term-10k",
      provider: "Leadway Life",
      planName: "Term Life (₦10k plan)",
      type: "term",
      priceAnnual: 10000,
      priceFromLabel: "₦10,000/yr",
      sumAssured: "₦1,000,000",
      term: "1 year, renewable",
      features: ["Pure risk plan (no cash value)", "Cannot be cancelled mid-term"],
      notes: "Pre-priced: ₦10k/yr buys ₦1M death benefit. No refund if you survive.",
      source: "https://www.leadway.com/term-life/",
      lastVerified: "2026-07"
    },
    {
      id: "leadway-term-7500",
      provider: "Leadway Life",
      planName: "Term Life (₦7.5k plan)",
      type: "term",
      priceAnnual: 7500,
      priceFromLabel: "₦7,500/yr",
      sumAssured: "₦500,000",
      term: "1 year, renewable",
      features: ["Pure risk plan"],
      notes: "Pre-priced budget option: ₦7.5k/yr for ₦500k cover.",
      bestFor: "Cheapest fixed-price term life",
      source: "https://www.leadway.com/term-life/",
      lastVerified: "2026-07"
    },

    // ── TERM LIFE (₦5M cover comparison — quote-based) ────────────────────
    {
      id: "prudential-zenith-term5m",
      provider: "Prudential Zenith Life",
      planName: "Term Life (₦5M cover)",
      type: "term",
      priceAnnual: 7800,
      priceFromLabel: "from ₦7,800/yr",
      sumAssured: "₦5,000,000",
      term: "Quote-based",
      features: ["7 business day claims settlement"],
      notes: "Most competitive term pricing for ₦5M cover (CompareMarket, May 2026).",
      bestFor: "Best price for ₦5M cover",
      source: "https://www.prudentialzenith.com/",
      lastVerified: "2026-07"
    },
    {
      id: "leadway-term5m",
      provider: "Leadway Life",
      planName: "Term Life (₦5M cover)",
      type: "term",
      priceAnnual: 8000,
      priceFromLabel: "from ₦8,000/yr",
      sumAssured: "₦5,000,000",
      term: "Quote-based",
      features: ["5 business day claims", "Wide branch network"],
      notes: "Strong contender at ₦5M level.",
      source: "https://comparemarket.ng/guides/life-insurance-guide",
      lastVerified: "2026-07"
    },
    {
      id: "aiico-term5m",
      provider: "AIICO Insurance",
      planName: "Term Life (₦5M cover)",
      type: "term",
      priceAnnual: 8500,
      priceFromLabel: "from ₦8,500/yr",
      sumAssured: "₦5,000,000",
      term: "Quote-based",
      features: ["48-hour guaranteed claims — fastest in market"],
      notes: "Pays claims in 48 hours. Worked example: 30-yr-old non-smoker, ₦10M 20-yr term ≈ ₦15k–₦18k/yr.",
      bestFor: "Fastest claims (48hrs)",
      source: "https://www.aiicoplc.com/",
      lastVerified: "2026-07"
    },
    {
      id: "axa-term5m",
      provider: "AXA Mansard Life",
      planName: "Term Life (₦5M cover)",
      type: "term",
      priceAnnual: 9200,
      priceFromLabel: "from ₦9,200/yr",
      sumAssured: "₦5,000,000",
      term: "Quote-based",
      features: ["5 business day claims", "Bancassurance via GTBank"],
      notes: "",
      source: "https://comparemarket.ng/guides/life-insurance-guide",
      lastVerified: "2026-07"
    },

    // ── SAVINGS / ENDOWMENT (protection + investment) ─────────────────────
    {
      id: "axa-lifesavings",
      provider: "AXA Mansard",
      planName: "Life Savings",
      type: "savings",
      priceAnnual: 24000,
      priceFromLabel: "from ₦24,000/yr (₦1k–₦200k/mo)",
      sumAssured: "Free life cover up to ₦1,000,000",
      term: "Min 1 year (run 1–5 yrs)",
      features: ["Free life cover while you save", "Interest benchmarked to CBN savings rate", "8% charge on withdrawals in first 6 months"],
      notes: "Save money AND get free life cover. Good if you want both savings and protection.",
      bestFor: "Savings + free life cover",
      source: "https://www.axamansard.com/insurance/life/life-savings",
      lastVerified: "2026-07"
    },
    {
      id: "axa-education",
      provider: "AXA Mansard",
      planName: "Education Plan",
      type: "endowment",
      priceAnnual: 5000,
      priceFromLabel: "from ₦5,000/yr",
      sumAssured: "Death + permanent disability cover",
      term: "Long-term (until child's education milestone)",
      features: ["Free annual health check", "Save toward child's education"],
      notes: "Endowment-style: save for a child's education with built-in life cover.",
      source: "https://www.axamansard.com/insurance/life/all-policies",
      lastVerified: "2026-07"
    },
    {
      id: "aiico-fep",
      provider: "AIICO Insurance",
      planName: "Flexible Endowment Plan (FEP)",
      type: "endowment",
      priceAnnual: null,
      priceFromLabel: "Quote-based",
      sumAssured: "Protection + investment",
      term: "6, 9, 12, or 15 years",
      features: ["4% annual reversionary bonus", "70% of cash value loanable after 3 yrs", "Surrender after 2 yrs", "Critical illness waiver rider"],
      notes: "Maturity paid in 3 installments (25%/25%/100%). Most flexible endowment structure.",
      bestFor: "Most flexible endowment",
      source: "https://www.aiicoplc.com/home/endowment-plan",
      lastVerified: "2026-07"
    }
  ];
})();
