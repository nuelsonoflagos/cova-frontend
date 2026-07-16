// Cova — Travel Insurance Plan Data (Nigeria)
//
// Single source of truth for travel insurance plans. Consumed by the universal
// comparison engine (cova-compare.html).
//
// SCHENGEN RULE: Schengen visa insurance requires minimum €30,000 medical cover.
// Every provider below meets this on their Schengen variant.

(function () {
  window.CovaTravelPlans = [
    // ── FLAT-PRICE PLANS ──────────────────────────────────────────────────
    {
      id: "leadway-travellite",
      provider: "Leadway Assurance",
      planName: "Travel Lite",
      tripType: "worldwide",
      priceFlat: 10000,
      priceFromLabel: "₦10,000 flat (up to 30 days)",
      covers: ["Flight delays", "Cancellations", "Lost luggage", "Travel disruptions"],
      medicalLimit: "Not stated",
      duration: "Up to 30 days",
      features: ["Flat price — no hidden charges", "Worldwide cover"],
      notes: "Simplest travel insurance in Nigeria. Flat ₦10k for 30 days worldwide.",
      bestFor: "Simplest flat price",
      source: "https://www.leadway.com/travel-insurance/",
      lastVerified: "2026-07"
    },
    {
      id: "chi-travel",
      provider: "Consolidated Hallmark (CHI)",
      planName: "Travel Protection Plan",
      tripType: "worldwide",
      priceFlat: 3800,
      priceFromLabel: "from ₦3,800",
      covers: ["Medical expenses", "Emergency dental", "Hospitalization abroad", "Repatriation", "Trip cancellation", "Delayed departure", "Baggage loss"],
      medicalLimit: "$15,000 claims cap",
      duration: "Varies by trip",
      features: ["Student plan available", "Pilgrimage protection", "Winter sports add-on"],
      notes: "Cheapest starting price. Claims capped at $15,000.",
      bestFor: "Cheapest entry price",
      source: "https://chiplc.com/travel-insurance/",
      lastVerified: "2026-07"
    },

    // ── SCHENGEN-COMPLIANT PLANS ──────────────────────────────────────────
    {
      id: "nem-schengen",
      provider: "NEM Insurance",
      planName: "Schengen Travel Insurance",
      tripType: "schengen",
      priceFlat: null,
      priceFromLabel: "Quote-based (~₦1,500–₦2,300/day)",
      covers: ["Medical expenses", "Emergency evacuation", "Emergency dental", "Repatriation", "Baggage", "Flight accidents", "Legal costs", "Bail bond (up to €2,000)"],
      medicalLimit: "€30,000 (€50 deductible)",
      duration: "1 day to 365 days",
      features: ["Schengen-compliant", "Up to age 75", "Dental up to €160"],
      notes: "With MAPFRE Assistencia. Covers 1–365 days. Ages infant to 75.",
      source: "https://nem-insurance.com/service/travel-insurance",
      lastVerified: "2026-07"
    },
    {
      id: "axa-schengen",
      provider: "AXA Mansard",
      planName: "Schengen Travel Protection",
      tripType: "schengen",
      priceFlat: 16257,
      priceFromLabel: "~₦16,257 for 90 days",
      covers: ["Medical/hospitalization", "Emergency evacuation", "Repatriation of remains", "Delayed departure", "Trip cancellation"],
      medicalLimit: "€30,000+ (meets Schengen minimum)",
      duration: "Varies",
      features: ["Accepted at ALL Schengen embassies", "Instant certificates online", "Also offers Worldwide, Student & Pilgrimage variants"],
      notes: "User-reported price: ₦16,256.70 for 90 days. Worldwide 'Traveller' option: up to $150,000 medical.",
      bestFor: "Schengen visa — instant certificate",
      source: "https://www.axamansard.com/insurance/travel/general",
      lastVerified: "2026-07"
    },
    {
      id: "aiico-schengen",
      provider: "AIICO Insurance",
      planName: "Schengen Visa Cover",
      tripType: "schengen",
      priceFlat: 30000,
      priceFromLabel: "~₦30,000",
      covers: ["Emergency medical expenses", "Repatriation", "Baggage loss", "Money loss", "Missed/cancelled flights", "Evacuation", "Mortal remains repatriation"],
      medicalLimit: "€35,500",
      duration: "Trip-based",
      features: ["Recognized at ALL Schengen & Non-Schengen embassies", "'Schengen Plus' adds Finland/other Europe"],
      notes: "Highest medical limit among Schengen plans (€35,500). User-reported ~₦30,000.",
      bestFor: "Highest Schengen medical limit",
      source: "https://www.aiicoplc.com/home/travel-insurance-plan",
      lastVerified: "2026-07"
    },
    {
      id: "leadway-schengen",
      provider: "Leadway Assurance",
      planName: "Travel Safe (Schengen)",
      tripType: "schengen",
      priceFlat: 5500,
      priceFromLabel: "from ₦5,500 (promo)",
      covers: ["Medical", "Repatriation", "Evacuation"],
      medicalLimit: "€30,000 (Schengen minimum)",
      duration: "Trip-based",
      features: ["Schengen-compliant", "Promo rates from ₦5,500"],
      notes: "Market benchmark for Schengen: ₦1,500–₦2,300/day.",
      source: "https://www.leadway.com/travel-insurance/",
      lastVerified: "2026-07"
    },

    // ── TIERED PLANS (Gold/Silver/Bronze) ─────────────────────────────────
    {
      id: "sanlamallianz-gold",
      provider: "SanlamAllianz Nigeria",
      planName: "Travel Gold",
      tripType: "worldwide",
      priceFlat: null,
      priceFromLabel: "Quote-based",
      covers: ["Emergency medical (incl. COVID-19)", "Medical evacuation", "Repatriation", "Family travel", "Dental", "COVID quarantine hotel", "Passport loss", "Baggage delay/loss", "Trip delay", "Legal expenses", "Bail bond"],
      medicalLimit: "€35,000 (€50 excess)",
      duration: "Max 92 days/trip",
      features: ["Most comprehensive published benefit schedule", "Family = 2 adults + 6 children", "Baggage loss up to €500"],
      notes: "Most transparent benefit schedule in the market. Gold/Silver/Bronze tiers.",
      bestFor: "Most comprehensive benefits",
      source: "https://web-app.sanlamallianz.com.ng/travel/booking",
      lastVerified: "2026-07"
    },
    {
      id: "sanlamallianz-hajj",
      provider: "SanlamAllianz Nigeria",
      planName: "Hajj & Umrah Plan",
      tripType: "pilgrimage",
      priceFlat: null,
      priceFromLabel: "Quote-based",
      covers: ["Emergency medical", "Emergency evacuation", "Dental", "Repatriation", "Passport loss", "Baggage loss", "Delayed departure"],
      medicalLimit: "€10,000 (€50 excess)",
      duration: "Pilgrimage period",
      features: ["Designed for Hajj/Umrah", "Dental €50/tooth (max €300)"],
      notes: "Specialized pilgrimage cover. Lower medical limit than Schengen (pilgrimage trips are shorter).",
      bestFor: "Hajj & Umrah pilgrims",
      source: "https://web-app.sanlamallianz.com.ng/travel/booking",
      lastVerified: "2026-07"
    }
  ];
})();
