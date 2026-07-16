// Cova — Health Insurance Plan Data (Nigeria)
//
// THE SINGLE SOURCE OF TRUTH for health plan data. Both the comparison page
// (cova-compare-health.html) and the recommendation engine consume this.
//
// DATA SOURCING: Manually curated from provider websites and aggregators
// (see `source` on each plan). Nigerian HMO prices change frequently — the
// `lastVerified` field tracks freshness. Refresh periodically.
//
// PRICING NOTES:
//   - All prices are NGN (Naira), normalized to ANNUAL per principal member.
//   - priceMonthly = priceAnnual / 12 (computed, for apples-to-apples display).
//   - Family pricing varies by family size; individual price shown unless noted.
//   - "not stated" means the provider didn't publish the figure; treat as null.
//
// CAUTION: Plan tier NAMES collide across providers (both AXA Mansard and
// Bastion use "Ruby/Sapphire/Diamond"). Always key on (provider + planName),
// never planName alone.

(function () {
  function naira(n) {
    return "₦" + Number(n || 0).toLocaleString("en-NG");
  }
  function monthly(annual) {
    return Math.round(annual / 12);
  }
  function display(annual) {
    return naira(annual) + "/yr";
  }

  var plans = [
    // ───────────────────────────────────────────────────────────────────────
    // BASTION HMO — 7 tiers, most transparent pricing in the market
    // Source: bastionhmo.com/compare-plans
    // ───────────────────────────────────────────────────────────────────────
    {
      id: "bastion-jade",
      provider: "Bastion HMO",
      planName: "Jade",
      category: "individual",
      priceAnnual: 30628, priceMonthly: monthly(30628),
      priceDisplay: display(30628),
      annualLimit: 500000,
      networkSize: "1,000+",
      highlights: ["GP consultations", "Specialist consults", "Basic inpatient"],
      benefits: { gpConsult: true, specialist: true, surgery: false, maternity: false, dental: false, optical: false, emergency: true, chronic: false, inpatient: true, pharmacy: true },
      waitingPeriod: "Standard (6–12mo surgery/dental)",
      notes: "Entry tier; 20% off i-Fitness",
      bestFor: "Budget pick with a real hospital network",
      source: "https://bastionhmo.com/compare-plans/",
      lastVerified: "2026-07"
    },
    {
      id: "bastion-beryl",
      provider: "Bastion HMO",
      planName: "Beryl",
      category: "individual",
      priceAnnual: 67753, priceMonthly: monthly(67753),
      priceDisplay: display(67753),
      annualLimit: 750000,
      networkSize: "1,000+",
      highlights: ["Broader specialist access", "Diagnostics", "Pharmacy"],
      benefits: { gpConsult: true, specialist: true, surgery: false, maternity: false, dental: false, optical: false, emergency: true, chronic: false, inpatient: true, pharmacy: true },
      waitingPeriod: "Standard (6–12mo surgery/dental)",
      notes: "",
      source: "https://bastionhmo.com/compare-plans/",
      lastVerified: "2026-07"
    },
    {
      id: "bastion-ruby",
      provider: "Bastion HMO",
      planName: "Ruby",
      category: "individual",
      priceAnnual: 98054, priceMonthly: monthly(98054),
      priceDisplay: display(98054),
      annualLimit: 1000000,
      networkSize: "1,000+",
      highlights: ["Surgery covered", "Specialist consults", "₦1M limit"],
      benefits: { gpConsult: true, specialist: true, surgery: true, maternity: false, dental: false, optical: false, emergency: true, chronic: false, inpatient: true, pharmacy: true },
      waitingPeriod: "Standard (6–12mo surgery/dental)",
      notes: "Surgery included from this tier up",
      bestFor: "Surgery cover under ₦100k",
      source: "https://bastionhmo.com/compare-plans/",
      lastVerified: "2026-07"
    },
    {
      id: "bastion-sapphire",
      provider: "Bastion HMO",
      planName: "Sapphire",
      category: "individual",
      priceAnnual: 160679, priceMonthly: monthly(160679),
      priceDisplay: display(160679),
      annualLimit: 1500000,
      networkSize: "1,000+",
      highlights: ["Dental & optical", "₦1.5M limit", "Higher inpatient"],
      benefits: { gpConsult: true, specialist: true, surgery: true, maternity: false, dental: true, optical: true, emergency: true, chronic: false, inpatient: true, pharmacy: true },
      waitingPeriod: "6–12mo dental/optical",
      notes: "",
      source: "https://bastionhmo.com/compare-plans/",
      lastVerified: "2026-07"
    },
    {
      id: "bastion-diamond",
      provider: "Bastion HMO",
      planName: "Diamond",
      category: "individual",
      priceAnnual: 344757, priceMonthly: monthly(344757),
      priceDisplay: display(344757),
      annualLimit: null,
      networkSize: "1,000+",
      highlights: ["Premium comprehensive", "Broadest hospital access", "Chronic care"],
      benefits: { gpConsult: true, specialist: true, surgery: true, maternity: true, dental: true, optical: true, emergency: true, chronic: true, inpatient: true, pharmacy: true },
      waitingPeriod: "12mo pre-existing / maternity",
      notes: "Top domestic tier",
      source: "https://bastionhmo.com/compare-plans/",
      lastVerified: "2026-07"
    },

    // ───────────────────────────────────────────────────────────────────────
    // AXA MANSARD — established multinational, 1,295+ hospitals
    // Source: axamansard.com/health/plans-details
    // ───────────────────────────────────────────────────────────────────────
    {
      id: "axa-easycare",
      provider: "AXA Mansard",
      planName: "EasyCare",
      category: "individual",
      priceAnnual: 32000, priceMonthly: monthly(32000),
      priceDisplay: display(32000) + " (or ₦20k/6mo)",
      annualLimit: null,
      networkSize: "1,295+",
      highlights: ["Trusted brand entry", "Basic outpatient", "Pharmacy"],
      benefits: { gpConsult: true, specialist: false, surgery: false, maternity: false, dental: false, optical: false, emergency: true, chronic: false, inpatient: false, pharmacy: true },
      waitingPeriod: "Standard",
      notes: "Entry-level; limited benefits. Monthly/quarterly/yearly payment.",
      source: "https://www.axamansard.com/health/plans-details/",
      lastVerified: "2026-07"
    },
    {
      id: "axa-standard",
      provider: "AXA Mansard",
      planName: "Standard",
      category: "individual",
      priceAnnual: 89500, priceMonthly: monthly(89500),
      priceDisplay: display(89500),
      annualLimit: null,
      networkSize: "1,295+",
      highlights: ["Surgical services", "1,295 hospitals", "Specialist access"],
      benefits: { gpConsult: true, specialist: true, surgery: true, maternity: false, dental: false, optical: false, emergency: true, chronic: false, inpatient: true, pharmacy: true },
      waitingPeriod: "Standard (6–12mo surgery)",
      notes: "Direct competitor to NEM Lotus & Reliance Red Beryl",
      source: "https://www.axamansard.com/health/plans-details/",
      lastVerified: "2026-07"
    },
    {
      id: "axa-premium",
      provider: "AXA Mansard",
      planName: "Premium",
      category: "individual",
      priceAnnual: 132250, priceMonthly: monthly(132250),
      priceDisplay: display(132250),
      annualLimit: null,
      networkSize: "1,295+",
      highlights: ["Higher limits", "Specialist & surgery", "Broader cover"],
      benefits: { gpConsult: true, specialist: true, surgery: true, maternity: false, dental: false, optical: false, emergency: true, chronic: false, inpatient: true, pharmacy: true },
      waitingPeriod: "Standard (6–12mo surgery)",
      notes: "",
      source: "https://www.axamansard.com/health/plans-details/",
      lastVerified: "2026-07"
    },
    {
      id: "axa-sapphire",
      provider: "AXA Mansard",
      planName: "Sapphire",
      category: "individual",
      priceAnnual: 418515, priceMonthly: monthly(418515),
      priceDisplay: display(418515),
      annualLimit: null,
      networkSize: "1,295+",
      highlights: ["Comprehensive", "Maternity & dental", "Premium network"],
      benefits: { gpConsult: true, specialist: true, surgery: true, maternity: true, dental: true, optical: true, emergency: true, chronic: true, inpatient: true, pharmacy: true },
      waitingPeriod: "9–12mo maternity",
      notes: "",
      source: "https://www.axamansard.com/health/plans-details/",
      lastVerified: "2026-07"
    },

    // ───────────────────────────────────────────────────────────────────────
    // RELIANCE HEALTH — strong limit-per-naira, monthly payment model
    // Source: getreliancehealth.com/nigeria/benefits
    // ───────────────────────────────────────────────────────────────────────
    {
      id: "reliance-redberyl",
      provider: "Reliance Health",
      planName: "Red Beryl",
      category: "individual",
      priceAnnual: 42000, priceMonthly: 3500,
      priceDisplay: "₦3,500/mo (" + display(42000) + ")",
      annualLimit: 1200000,
      networkSize: "1,500+",
      highlights: ["₦1.2M limit", "Monthly payments", "ER & hospitalization"],
      benefits: { gpConsult: true, specialist: true, surgery: false, maternity: false, dental: false, optical: false, emergency: true, chronic: false, inpatient: true, pharmacy: true },
      waitingPeriod: "Standard",
      notes: "Family plan ~₦10,500/mo. Free wellness checks, 24/7 clinician chat.",
      bestFor: "Best limit for the price",
      source: "https://getreliancehealth.com/nigeria/benefits/",
      lastVerified: "2026-07"
    },
    {
      id: "reliance-alexandrite",
      provider: "Reliance Health",
      planName: "Alexandrite",
      category: "individual",
      priceAnnual: 72000, priceMonthly: 6000,
      priceDisplay: "₦6,000/mo (" + display(72000) + ")",
      annualLimit: null,
      networkSize: "1,500+",
      highlights: ["Mid-tier network", "Monthly payments", "Broader specialist"],
      benefits: { gpConsult: true, specialist: true, surgery: true, maternity: false, dental: false, optical: false, emergency: true, chronic: false, inpatient: true, pharmacy: true },
      waitingPeriod: "Standard",
      notes: "Tier 3 hospital access",
      source: "https://getreliancehealth.com/nigeria/benefits/",
      lastVerified: "2026-07"
    },
    {
      id: "reliance-tier2",
      provider: "Reliance Health",
      planName: "Tier 2 (Annual)",
      category: "individual",
      priceAnnual: 172140, priceMonthly: monthly(172140),
      priceDisplay: display(172140),
      annualLimit: 3000000,
      networkSize: "1,500+",
      highlights: ["₦3M limit", "Broader network", "Premium tier"],
      benefits: { gpConsult: true, specialist: true, surgery: true, maternity: false, dental: true, optical: true, emergency: true, chronic: true, inpatient: true, pharmacy: true },
      waitingPeriod: "Standard (6–12mo dental/optical)",
      notes: "Highest published annual limit in mid-premium band",
      bestFor: "Highest coverage limit",
      source: "https://getreliancehealth.com/nigeria/benefits/",
      lastVerified: "2026-07"
    },

    // ───────────────────────────────────────────────────────────────────────
    // HYGEIA HMO — largest network (2,000+ facilities), 30+ years
    // Source: hygeiahmo.com/our-health-plans
    // ───────────────────────────────────────────────────────────────────────
    {
      id: "hygeia-hyease",
      provider: "Hygeia HMO",
      planName: "HyEase",
      category: "individual",
      priceAnnual: 26515, priceMonthly: monthly(26515),
      priceDisplay: display(26515),
      annualLimit: null,
      networkSize: "2,000+",
      highlights: ["Outpatient ₦150k", "Meds ₦100k", "Biggest network"],
      benefits: { gpConsult: true, specialist: false, surgery: false, maternity: false, dental: false, optical: false, emergency: true, chronic: false, inpatient: false, pharmacy: true },
      waitingPeriod: "Standard",
      notes: "Outpatient-focused; ₦30k/quarter sub-limit. Largest hospital network.",
      bestFor: "Biggest hospital network on a budget",
      source: "https://hygeiahmo.com/our-health-plans/",
      lastVerified: "2026-07"
    },
    {
      id: "hygeia-hybasic",
      provider: "Hygeia HMO",
      planName: "HyBasic",
      category: "individual",
      priceAnnual: 36970, priceMonthly: monthly(36970),
      priceDisplay: display(36970),
      annualLimit: 500000,
      networkSize: "2,000+",
      highlights: ["₦500k limit", "GP consults ₦150k", "2,000+ hospitals"],
      benefits: { gpConsult: true, specialist: true, surgery: false, maternity: false, dental: false, optical: false, emergency: true, chronic: false, inpatient: true, pharmacy: true },
      waitingPeriod: "Standard",
      notes: "Verify price — some sources cite ₦55,200",
      source: "https://hygeiahmo.com/our-health-plans/",
      lastVerified: "2026-07"
    },
    {
      id: "hygeia-hyprime",
      provider: "Hygeia HMO",
      planName: "HyPrime",
      category: "individual",
      priceAnnual: 129740, priceMonthly: monthly(129740),
      priceDisplay: display(129740),
      annualLimit: 785000,
      networkSize: "2,000+",
      highlights: ["₦785k benefits", "Consults ₦200k", "Surgeries"],
      benefits: { gpConsult: true, specialist: true, surgery: true, maternity: false, dental: false, optical: false, emergency: true, chronic: false, inpatient: true, pharmacy: true },
      waitingPeriod: "Standard (6–12mo surgery)",
      notes: "",
      source: "https://hygeiahmo.com/our-health-plans/",
      lastVerified: "2026-07"
    },
    {
      id: "hygeia-hyprimeplus",
      provider: "Hygeia HMO",
      planName: "HyPrime Plus",
      category: "individual",
      priceAnnual: 386080, priceMonthly: monthly(386080),
      priceDisplay: display(386080),
      annualLimit: 2500000,
      networkSize: "2,000+",
      highlights: ["Inpatient up to ₦2.5M", "Private ward", "Major surgeries"],
      benefits: { gpConsult: true, specialist: true, surgery: true, maternity: true, dental: true, optical: true, emergency: true, chronic: true, inpatient: true, pharmacy: true },
      waitingPeriod: "9–12mo maternity / 12mo pre-existing",
      notes: "Private ward 20 days/yr. Category A–D unrestricted access.",
      source: "https://hygeiahmo.com/our-health-plans/",
      lastVerified: "2026-07"
    },

    // ───────────────────────────────────────────────────────────────────────
    // AVON HMO — markets "no hidden waiting periods"
    // Source: avonhealthcare.com/individual-plan
    // ───────────────────────────────────────────────────────────────────────
    {
      id: "avon-lifeplus",
      provider: "Avon HMO",
      planName: "Life Plus",
      category: "individual",
      priceAnnual: 65429, priceMonthly: monthly(65429),
      priceDisplay: display(65429),
      annualLimit: 1000000,
      networkSize: "800+",
      highlights: ["No hidden waiting periods", "Free nurse line", "₦1M limit"],
      benefits: { gpConsult: true, specialist: true, surgery: false, maternity: false, dental: false, optical: false, emergency: true, chronic: false, inpatient: true, pharmacy: true },
      waitingPeriod: "None (marketed)",
      notes: "Covers principal + spouse + up to 5 children. Family of 6 ~₦307,516/yr.",
      bestFor: "No waiting periods + family cover",
      source: "https://avonhealthcare.com/individual-plan/",
      lastVerified: "2026-07"
    },
    {
      id: "avon-bosslife",
      provider: "Avon HMO",
      planName: "Boss Life",
      category: "individual",
      priceAnnual: 208142, priceMonthly: monthly(208142),
      priceDisplay: display(208142),
      annualLimit: null,
      networkSize: "800+",
      highlights: ["Broad/unlimited access", "Top tier", "No waiting periods"],
      benefits: { gpConsult: true, specialist: true, surgery: true, maternity: true, dental: true, optical: true, emergency: true, chronic: true, inpatient: true, pharmacy: true },
      waitingPeriod: "None (marketed)",
      notes: "Family of 6 ~₦978,267/yr. Top domestic tier.",
      source: "https://avonhealthcare.com/individual-plan/",
      lastVerified: "2026-07"
    },

    // ───────────────────────────────────────────────────────────────────────
    // NEM HEALTH — simple "one plan, multiple lives"
    // Source: nem-health.com/plans/retail
    // ───────────────────────────────────────────────────────────────────────
    {
      id: "nem-lotus",
      provider: "NEM Health",
      planName: "Retail Lotus",
      category: "individual",
      priceAnnual: 88300, priceMonthly: monthly(88300),
      priceDisplay: display(88300),
      annualLimit: null,
      networkSize: "900+",
      highlights: ["Outpatient & inpatient", "Emergency & diagnostics", "Specialist consults"],
      benefits: { gpConsult: true, specialist: true, surgery: true, maternity: false, dental: false, optical: false, emergency: true, chronic: false, inpatient: true, pharmacy: true },
      waitingPeriod: "Standard",
      notes: "Simple structure — one retail plan. Family pricing not published.",
      source: "https://www.nem-health.com/plans/retail",
      lastVerified: "2026-07"
    },

    // ───────────────────────────────────────────────────────────────────────
    // LEADWAY HEALTH — Berry-themed tiers, regional/intl cover on top plans
    // Source: leadwayhealth.com/retail (Cloudflare-blocked; data from search)
    // ───────────────────────────────────────────────────────────────────────
    {
      id: "leadway-strawberry",
      provider: "Leadway Health",
      planName: "Strawberry",
      category: "individual",
      priceAnnual: 104998, priceMonthly: monthly(104998),
      priceDisplay: display(104998),
      annualLimit: null,
      networkSize: "1,000+",
      highlights: ["Entry Berry tier", "Outpatient & inpatient", "Annual payment only"],
      benefits: { gpConsult: true, specialist: true, surgery: true, maternity: false, dental: false, optical: false, emergency: true, chronic: false, inpatient: true, pharmacy: true },
      waitingPeriod: "Standard",
      notes: "Annual payment only. Price from third-party aggregator — verify.",
      source: "https://leadwayhealth.com/retail/",
      lastVerified: "2026-07"
    },
    {
      id: "leadway-blackberry",
      provider: "Leadway Health",
      planName: "Blackberry",
      category: "individual",
      priceAnnual: 585975, priceMonthly: monthly(585975),
      priceDisplay: display(585975),
      annualLimit: null,
      networkSize: "Regional",
      highlights: ["Regional cover (NG/India/Africa)", "Category B–D hospitals", "Premium tier"],
      benefits: { gpConsult: true, specialist: true, surgery: true, maternity: true, dental: true, optical: true, emergency: true, chronic: true, inpatient: true, pharmacy: true },
      waitingPeriod: "Maternity ₦200k limit, NOT covered in first year",
      notes: "Coverage extends outside Nigeria. Maternity sub-limit ₦200k.",
      source: "https://leadwayhealth.com/retail/",
      lastVerified: "2026-07"
    },

    // ───────────────────────────────────────────────────────────────────────
    // THT / TANGERINE AFRICA — fee-for-service model
    // Source: tht.tangerine.africa/individuals
    // ───────────────────────────────────────────────────────────────────────
    {
      id: "tht-alldo",
      provider: "THT (Tangerine)",
      planName: "alldô",
      category: "individual",
      priceAnnual: 20000, priceMonthly: monthly(20000),
      priceDisplay: display(20000),
      annualLimit: null,
      networkSize: "500+",
      highlights: ["Fee-for-service", "Essential needs", "Entry-level"],
      benefits: { gpConsult: true, specialist: false, surgery: false, maternity: false, dental: false, optical: false, emergency: true, chronic: false, inpatient: false, pharmacy: true },
      waitingPeriod: "Standard",
      notes: "Cheapest established-brand plan found. Thin benefits.",
      bestFor: "Cheapest entry from an established provider",
      source: "https://tht.tangerine.africa/individuals",
      lastVerified: "2026-07"
    },

    // ───────────────────────────────────────────────────────────────────────
    // MYCOVERGENIUS — aggregator own-product, cheapest by value
    // Source: mycovergenius.com
    // ───────────────────────────────────────────────────────────────────────
    {
      id: "mycovergenius-flexicare",
      provider: "MyCoverGenius",
      planName: "FlexiCare",
      category: "individual",
      priceAnnual: 48000, priceMonthly: 4000,
      priceDisplay: "₦4,000/mo (" + display(48000) + ")",
      annualLimit: 1500000,
      networkSize: "1,000+",
      highlights: ["₦1.5M limit", "1+3 family option", "No waiting period (most benefits)"],
      benefits: { gpConsult: true, specialist: true, surgery: false, maternity: false, dental: false, optical: false, emergency: true, chronic: false, inpatient: true, pharmacy: true },
      waitingPeriod: "None on most benefits",
      notes: "Best value-for-limit in the market. 1+3 family option available.",
      bestFor: "Best value (highest limit per Naira)",
      source: "https://mycovergenius.com/blog/cheapest-health-insurance-plans-nigeria_445",
      lastVerified: "2026-07"
    },

    // ───────────────────────────────────────────────────────────────────────
    // WELLHEALTH NETWORK — small provider, lowest absolute prices
    // Source: wellhealthnetwork.com/Plans
    // ───────────────────────────────────────────────────────────────────────
    {
      id: "wellhealth-basic",
      provider: "WellHealth",
      planName: "Basic Health",
      category: "individual",
      priceAnnual: 18500, priceMonthly: monthly(18500),
      priceDisplay: display(18500),
      annualLimit: null,
      networkSize: "200+",
      highlights: ["Lowest absolute price", "Basic cover", "Couple option ₦35,500"],
      benefits: { gpConsult: true, specialist: false, surgery: false, maternity: false, dental: false, optical: false, emergency: true, chronic: false, inpatient: false, pharmacy: true },
      waitingPeriod: "Standard",
      notes: "Couple ₦35,500/yr; Couple + 4 kids ₦80,500/yr. Smaller network.",
      bestFor: "Cheapest absolute entry",
      source: "https://wellhealthnetwork.com/Plans",
      lastVerified: "2026-07"
    }
  ];

  // ───────────────────────────────────────────────────────────────────────
  // HOSPITAL NETWORKS BY PROVIDER
  // Each HMO has a different hospital network. This lets the onboarding flow
  // show hospitals that actually accept the selected provider's plan, rather
  // than a generic list. Curated from provider directories; not exhaustive —
  // the full network is shared with the customer at enrolment.
  // ───────────────────────────────────────────────────────────────────────
  var providerHospitals = {
    "Bastion HMO": ["Reddington Hospital", "Lagoon Hospitals", "St. Nicholas Hospital", "Cedarcrest Hospitals", "Eko Hospitals", "First Consultant Hospital", "Shield Specialists Hospital", "Lagos University Teaching Hospital"],
    "AXA Mansard": ["Reddington Hospital", "Lagoon Hospitals", "St. Nicholas Hospital", "Cedarcrest Hospitals", "Eko Hospitals", "First Consultant Hospital", "Nizamiye Hospital", "Lagos University Teaching Hospital", "Diagnostics Center"],
    "Reliance Health": ["Reddington Hospital", "Lagoon Hospitals", "St. Nicholas Hospital", "Eko Hospitals", "First Consultant Hospital", "Shield Specialists Hospital", "LifeCare Hospital", "Lagos University Teaching Hospital", "Wellness Point Clinic"],
    "Hygeia HMO": ["Lagos University Teaching Hospital", "Reddington Hospital", "Lagoon Hospitals", "St. Nicholas Hospital", "Eko Hospitals", "First Consultant Hospital", "Cedarcrest Hospitals", "St. Gerard's Hospital", "Rivers State University Teaching Hospital", "Shield Specialists Hospital"],
    "Avon HMO": ["Lagoon Hospitals", "Eko Hospitals", "St. Nicholas Hospital", "First Consultant Hospital", "Shield Specialists Hospital", "LifeCare Hospital", "Wellness Point Clinic", "Lagos University Teaching Hospital"],
    "NEM Health": ["Reddington Hospital", "Lagoon Hospitals", "Cedarcrest Hospitals", "Eko Hospitals", "First Consultant Hospital", "St. Gerard's Hospital", "Lagos University Teaching Hospital"],
    "Leadway Health": ["Reddington Hospital", "Lagoon Hospitals", "St. Nicholas Hospital", "Cedarcrest Hospitals", "Eko Hospitals", "Nizamiye Hospital", "Lagos University Teaching Hospital"],
    "THT (Tangerine)": ["Eko Hospitals", "First Consultant Hospital", "St. Gerard's Hospital", "Wellness Point Clinic", "LifeCare Hospital", "Lagos University Teaching Hospital"],
    "MyCoverGenius": ["Reddington Hospital", "Lagoon Hospitals", "Eko Hospitals", "First Consultant Hospital", "Shield Specialists Hospital", "Lagos University Teaching Hospital"],
    "WellHealth": ["Eko Hospitals", "First Consultant Hospital", "Wellness Point Clinic", "LifeCare Hospital", "St. Gerard's Hospital"]
  };

  // Helper: format Naira for display (exposed for the comparison page).
  window.CovaHealthPlans = plans;
  window.CovaHealthPlansFormat = { naira: naira, monthly: monthly };
  window.CovaProviderHospitals = providerHospitals;
})();
