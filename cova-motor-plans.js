// Cova — Motor Insurance Plan Data (Nigeria)
//
// Single source of truth for motor/auto insurance. Consumed by the universal
// comparison engine (cova-compare.html).
//
// REGULATORY BASELINE: NAICOM sets mandatory third-party minimum rates (effective
// Jan 1, 2023, still current 2026). Every licensed insurer MUST charge at least
// these. Third-party pricing is therefore IDENTICAL across providers — the
// comparison differentiates on the comprehensive & hybrid tiers where providers
// actually compete.
//
// Comprehensive norm: ~5% of vehicle value annually (Leadway, AIICO, NEM confirmed).

(function () {
  // The NAICOM-mandated third-party floor — identical for all providers.
  var NAICOM_PRIVATE_TP = 15000;

  window.CovaMotorPlans = [
    // ── THIRD-PARTY (regulated floor — same price everywhere) ─────────────
    {
      id: "leadway-tp",
      provider: "Leadway Assurance",
      planName: "Third-Party Auto",
      tier: "third-party",
      priceAnnual: NAICOM_PRIVATE_TP,
      priceModel: "Fixed (NAICOM-regulated)",
      covers: ["Third-party vehicle/property damage", "Third-party death/bodily injury"],
      tppdLimit: "₦3,000,000",
      features: ["Instant digital certificate"],
      notes: "NAICOM-regulated minimum. Identical price at every insurer.",
      source: "https://www.leadway.com/third-party-insurance/",
      lastVerified: "2026-07"
    },
    {
      id: "aiico-tp",
      provider: "AIICO Insurance",
      planName: "Third-Party",
      tier: "third-party",
      priceAnnual: NAICOM_PRIVATE_TP,
      priceModel: "Fixed (NAICOM-regulated)",
      covers: ["Third-party liability"],
      tppdLimit: "₦3,000,000",
      features: ["48-hour guaranteed claims"],
      notes: "NAICOM floor. AIICO differentiates on fastest claims in market (48hrs).",
      bestFor: "Fastest claims (48hrs)",
      source: "https://www.aiicoplc.com/home/auto-insurance/third-party",
      lastVerified: "2026-07"
    },
    {
      id: "axa-tp",
      provider: "AXA Mansard",
      planName: "Third-Party",
      tier: "third-party",
      priceAnnual: NAICOM_PRIVATE_TP,
      priceModel: "Fixed (NAICOM-regulated)",
      covers: ["Third-party injury", "Third-party property damage"],
      tppdLimit: "₦3,000,000",
      features: ["Instant digital certificate", "Online quote"],
      notes: "NAICOM floor. Note: AXA's African ops acquired by Allianz (2024) — may rebrand.",
      source: "https://www.axamansard.com/insurance/motor",
      lastVerified: "2026-07"
    },

    // ── HYBRID / MINI-COMPREHENSIVE (where providers actually compete) ────
    {
      id: "leadway-autobase",
      provider: "Leadway Assurance",
      planName: "AutoBase (Mini-Comprehensive)",
      tier: "hybrid",
      priceAnnual: 30000,
      priceModel: "from ₦30,000/yr",
      covers: ["Third-party cover", "Own-car repair cover"],
      tppdLimit: "₦3,000,000",
      features: ["Cheaper than full comprehensive", "Middle-tier protection"],
      notes: "Sits between third-party and full comprehensive — ideal for older vehicles.",
      bestFor: "Best value middle tier",
      source: "https://www.leadway.com/comprehensive-auto-insurance/",
      lastVerified: "2026-07"
    },
    {
      id: "aiico-tp-gold",
      provider: "AIICO Insurance",
      planName: "Enhanced Third-Party — Gold",
      tier: "hybrid",
      priceAnnual: 45000,
      priceModel: "₦45,000/yr",
      covers: ["Third-party liability", "Own damage"],
      tppdLimit: "₦3,000,000",
      ownDamageLimit: "₦750,000",
      features: ["Own damage up to ₦750k", "Fuel voucher promo (7.5% of premium)"],
      notes: "Hybrid: third-party + capped own-damage. Good for mid-value vehicles.",
      source: "https://www.aiicoplc.com/home/auto-insurance/comprehensive",
      lastVerified: "2026-07"
    },
    {
      id: "aiico-tp-diamond",
      provider: "AIICO Insurance",
      planName: "Enhanced Third-Party — Diamond",
      tier: "hybrid",
      priceAnnual: 60000,
      priceModel: "₦60,000/yr",
      covers: ["Third-party liability", "Own damage"],
      tppdLimit: "₦3,000,000",
      ownDamageLimit: "₦1,000,000",
      features: ["Own damage up to ₦1M", "Fuel voucher promo"],
      notes: "Highest hybrid tier — ₦1M own-damage cap.",
      source: "https://www.aiicoplc.com/home/auto-insurance/comprehensive",
      lastVerified: "2026-07"
    },

    // ── COMPREHENSIVE (~5% of vehicle value) ──────────────────────────────
    {
      id: "leadway-comprehensive",
      provider: "Leadway Assurance",
      planName: "Comprehensive Auto",
      tier: "comprehensive",
      priceAnnual: null,
      priceModel: "5% of vehicle value/yr",
      covers: ["Fire", "Theft", "Accidental damage to own vehicle", "Full third-party", "Death/bodily injury"],
      tppdLimit: "₦3,000,000",
      ownDamageLimit: "Vehicle value (own-damage sub-limit ₦100k noted)",
      features: ["Most popular comprehensive plan"],
      notes: "Example: ₦5M car = ₦250,000/yr. ₦10M car = ₦500,000/yr.",
      bestFor: "Most popular comprehensive",
      source: "https://www.leadway.com/comprehensive-auto-insurance/",
      lastVerified: "2026-07"
    },
    {
      id: "aiico-comprehensive",
      provider: "AIICO Insurance",
      planName: "Comprehensive",
      tier: "comprehensive",
      priceAnnual: null,
      priceModel: "from 5% of vehicle value/yr",
      covers: ["Own damage", "Third-party"],
      tppdLimit: "₦3,000,000",
      features: ["Fuel voucher promo (up to 7.5% of premium)"],
      notes: "Example: ₦5M car ≈ ₦250,000/yr.",
      source: "https://www.aiicoplc.com/home/auto-insurance/comprehensive",
      lastVerified: "2026-07"
    },
    {
      id: "nem-comprehensive",
      provider: "NEM Insurance",
      planName: "Comprehensive Motor",
      tier: "comprehensive",
      priceAnnual: null,
      priceModel: "5% of vehicle value/yr",
      covers: ["Own damage", "Third-party"],
      tppdLimit: "₦3,000,000",
      features: [],
      notes: "Example: ₦10M car = ₦500,000/yr.",
      source: "https://nem-insurance.com/news/motor-insurance-works-nigeria",
      lastVerified: "2026-07"
    },
    {
      id: "axa-comprehensive",
      provider: "AXA Mansard",
      planName: "Comprehensive (AutoGo)",
      tier: "comprehensive",
      priceAnnual: null,
      priceModel: "3–5% of vehicle value/yr (market rate)",
      covers: ["Accident", "Flood", "Fire", "Theft", "Third-party"],
      tppdLimit: "₦3,000,000",
      features: ["Monthly installments up to 10 months", "3/6/12-month plans", "Online instant quote"],
      notes: "Most flexible payment options (monthly installments).",
      bestFor: "Flexible monthly payments",
      source: "https://www.axamansard.com/insurance/motor",
      lastVerified: "2026-07"
    },
    {
      id: "cornerstone-comprehensive",
      provider: "Cornerstone Insurance",
      planName: "Comprehensive Private Motor",
      tier: "comprehensive",
      priceAnnual: null,
      priceModel: "Quote-based",
      covers: ["Own damage", "Third-party", "Limited medical expenses", "Loss of personal effects"],
      tppdLimit: "₦3,000,000",
      features: ["Medical expenses included", "Personal effects cover"],
      notes: "Quote-based but includes extras others charge for.",
      source: "https://cornerstone.com.ng/",
      lastVerified: "2026-07"
    }
  ];

  // NAICOM statutory third-party rates by vehicle type (for reference/education).
  window.CovaMotorNAICOMRates = [
    { category: "Private motor", premium: 15000, tppdLimit: "₦3,000,000" },
    { category: "Commercial (own goods)", premium: 20000, tppdLimit: "₦3,000,000" },
    { category: "Staff buses", premium: 20000, tppdLimit: "₦3,000,000" },
    { category: "Trucks / General cartage", premium: 100000, tppdLimit: "₦5,000,000" },
    { category: "Special types", premium: 20000, tppdLimit: "₦3,000,000" },
    { category: "Tricycles (Keke)", premium: 5000, tppdLimit: "₦2,000,000" },
    { category: "Motorcycles", premium: 3000, tppdLimit: "₦1,000,000" },
  ];
})();
