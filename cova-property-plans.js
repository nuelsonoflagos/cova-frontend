// Cova — Property/Home Insurance Plan Data (Nigeria)
//
// Single source of truth for property, home, fire, and burglary insurance.
// Consumed by the universal comparison engine (cova-compare.html).
//
// PRICING NOTE: Most property insurance is quote-based (% of property value).
// Only AIICO and Leadway publish flat-rate mass-market products.

(function () {
  window.CovaPropertyPlans = [
    // ── FLAT-PRICE HOME INSURANCE ─────────────────────────────────────────
    {
      id: "aiico-home",
      provider: "AIICO Insurance",
      planName: "Home Insurance",
      priceFlat: 10000,
      priceFromLabel: "₦10,000 flat/yr",
      covers: ["Fire damage (contents up to ₦2M)", "Burglary (up to ₦1M)", "Alternative accommodation (₦250k)", "Personal accident"],
      target: "Renters (contents cover)",
      features: ["Flat price — no valuation needed", "Designed for rented apartments"],
      notes: "Clearest flat-price home product. ₦2M fire + ₦1M burglary + ₦250k rent for ₦10k.",
      bestFor: "Cheapest flat-rate home cover",
      source: "https://www.aiicoplc.com/home/home-insurance-plan",
      lastVerified: "2026-07"
    },
    {
      id: "leadway-householder",
      provider: "Leadway Assurance",
      planName: "Householder Insurance",
      priceFlat: 10000,
      priceFromLabel: "from ₦10,000–₦20,000/yr",
      covers: ["Building AND contents", "Fire", "Theft/burglary", "Flood", "Storm", "Natural disasters", "Accidental damage", "Public liability"],
      target: "Homeowners and tenants",
      features: ["Building + contents in one policy", "Public liability included", "Standalone burglary & fire also available"],
      notes: "Covers both building AND contents (AIICO covers contents only). ₦10k–₦20k entry.",
      bestFor: "Building + contents cover",
      source: "https://www.leadway.com/householder/",
      lastVerified: "2026-07"
    },

    // ── COMPREHENSIVE (QUOTE-BASED) ───────────────────────────────────────
    {
      id: "axa-home",
      provider: "AXA Mansard",
      planName: "Home Insurance (Package)",
      priceFlat: null,
      priceFromLabel: "Quote-based (% of property value)",
      covers: ["Building (fire, accidental damage, fixture breakage)", "Contents (burglary, fire, explosion, riot, lightning, earthquake, flood, transit)"],
      target: "Homeowners and tenants",
      features: ["Separate building & contents cover", "Standalone fire & burglary also available"],
      notes: "Most comprehensive peril list (includes earthquake, volcanic in contents).",
      bestFor: "Widest peril coverage",
      source: "https://corporate.axamansard.com/home-insurance/",
      lastVerified: "2026-07"
    },
    {
      id: "chi-home",
      provider: "Consolidated Hallmark (CHI)",
      planName: "Home Insurance",
      priceFlat: null,
      priceFromLabel: "Quote-based",
      covers: ["Fire", "Burglary & housebreaking", "Earthquake", "Windstorm/flood", "Riots & strikes", "Malicious damage", "Explosion", "Lightning", "Accidental damage (contents)"],
      target: "Residential",
      features: ["Rental recoup up to 10% of house value", "Legal liability up to ₦50k/claim", "Injury/death cover up to ₦200k"],
      notes: "Strong sub-limits: 10% rental recoup, ₦200k injury/death cover. Combined Fire & Burglary also available.",
      bestFor: "Best sub-limits (rental recoup, injury)",
      source: "https://chiplc.com/home-insurance/",
      lastVerified: "2026-07"
    },

    // ── STANDALONE FIRE & BURGLARY ────────────────────────────────────────
    {
      id: "leadway-burglary",
      provider: "Leadway Assurance",
      planName: "Burglary Insurance (standalone)",
      priceFlat: null,
      priceFromLabel: "Quote-based",
      covers: ["Theft", "Burglary", "Armed robbery", "Attempted theft (forcible/violent entry)"],
      target: "Homes and businesses",
      features: ["Available standalone (without full home policy)"],
      notes: "For those who only want theft/burglary cover.",
      source: "https://www.leadway.com/burglary-insurance/",
      lastVerified: "2026-07"
    },
    {
      id: "axa-fire",
      provider: "AXA Mansard",
      planName: "Fire & Special Peril Insurance",
      priceFlat: null,
      priceFromLabel: "Quote-based",
      covers: ["Fire", "Special perils (lightning, explosion, earthquake, flood, storm)"],
      target: "Buildings, commercial property",
      features: ["Standalone fire cover"],
      notes: "Standard fire & special perils — the building-structure cover.",
      source: "https://corporate.axamansard.com/fire-special-peril-insurance/",
      lastVerified: "2026-07"
    },
    {
      id: "axa-burglary",
      provider: "AXA Mansard",
      planName: "Burglary Insurance (standalone)",
      priceFlat: null,
      priceFromLabel: "Quote-based",
      covers: ["Burglary", "Armed robbery", "Theft incl. attempted theft (forcible/violent breaking)"],
      target: "Homes and businesses",
      features: ["Standalone burglary cover"],
      notes: "",
      source: "https://corporate.axamansard.com/burglary-insurance/",
      lastVerified: "2026-07"
    },
    {
      id: "nem-fire",
      provider: "NEM Insurance",
      planName: "Fire & Special Perils",
      priceFlat: null,
      priceFromLabel: "Quote-based",
      covers: ["Fire damage", "Special perils"],
      target: "Personal & SME",
      features: ["Personal and SME variants"],
      notes: "",
      source: "https://nem-insurance.com/service/fire-insurance",
      lastVerified: "2026-07"
    },
    {
      id: "nem-burglary",
      provider: "NEM Insurance",
      planName: "Burglary & Housebreaking",
      priceFlat: null,
      priceFromLabel: "Quote-based",
      covers: ["Burglary", "Housebreaking"],
      target: "Personal & SME",
      features: ["Personal and SME variants"],
      notes: "",
      source: "https://nem-insurance.com/service/burglary-housebreaking-insurance",
      lastVerified: "2026-07"
    }
  ];
})();
