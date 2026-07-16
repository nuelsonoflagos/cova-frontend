// Cova — Device/Electronics Insurance Plan Data (Nigeria)
//
// Single source of truth for device protection plans. Consumed by the
// universal comparison engine (cova-compare.html).
//
// KEY MARKET INSIGHT: Nigerian "phone insurance" splits into two categories
// that the comparison UI must distinguish:
//   - FULL COVER: theft, accidental damage, liquid damage (what people want)
//   - SCREEN-ONLY: screen repair voucher only (cheaper, narrower)
// This is captured in the `coverType` field on each plan.
//
// Premium norm: 5–7% of device value annually for genuine comprehensive cover.

(function () {
  window.CovaDevicePlans = [
    // ── FULL COMPREHENSIVE COVER ──────────────────────────────────────────
    {
      id: "mycovergenius-gadget",
      provider: "MyCoverGenius",
      planName: "Gadget Insurance",
      coverType: "full",
      priceModel: "5% of device value/yr",
      priceFrom: 3500,
      priceFromLabel: "from ₦3,500/yr",
      devices: "Phones, laptops, tablets",
      covers: ["Theft", "Accidental damage", "Liquid damage", "Screen damage"],
      claimLimit: "Max 2 claims/yr (laptops)",
      deductible: "Not published",
      notes: "Underwritten by AIICO. Also sold via retail partners (Obejor).",
      bestFor: "Best value full cover",
      source: "https://mycovergenius.com/gadget",
      lastVerified: "2026-07"
    },
    {
      id: "skydd-mobile",
      provider: "Skydd.ng",
      planName: "Mobile Phone Insurance",
      coverType: "full",
      priceModel: "5% of device value/yr",
      priceFrom: null,
      priceFromLabel: "5% of device value/yr",
      devices: "Mobile phones",
      covers: ["Accidental damage", "Screen damage", "Theft", "Repairs"],
      claimLimit: "Up to device value",
      deductible: "Not published",
      notes: "Digital-first platform. 7-day waiting period.",
      bestFor: "Digital-first experience",
      source: "https://skydd.ng/plans/mobile-phones",
      lastVerified: "2026-07"
    },
    {
      id: "chi-allrisk",
      provider: "Consolidated Hallmark",
      planName: "All Risks Insurance",
      coverType: "full",
      priceModel: "Quote-based (% of declared value)",
      priceFrom: null,
      priceFromLabel: "Quote-based",
      devices: "Phones, laptops, tablets, watches, jewellery",
      covers: ["Accidental damage", "Theft", "Loss (all-risks)"],
      claimLimit: "Based on declared item value",
      deductible: "Not published",
      notes: "Broadest item coverage (includes jewellery/watches). Buy via einsurance.chiplc.com.",
      bestFor: "Broadest coverage (incl. jewellery)",
      source: "https://www.ch-insure.com/all-risk-insurance/",
      lastVerified: "2026-07"
    },
    {
      id: "leadway-allrisk",
      provider: "Leadway Assurance",
      planName: "All Risk Insurance",
      coverType: "full",
      priceModel: "Quote-based (% of declared value)",
      priceFrom: null,
      priceFromLabel: "Quote-based",
      devices: "Laptops, jewellery, watches, movable items",
      covers: ["Accidental damage", "Loss (all-risks)"],
      claimLimit: "Based on declared value",
      deductible: "Not published",
      notes: "IMPORTANT: Leadway's Householder policy (₦20k/yr) EXCLUDES phones & laptops — you need All Risk specifically.",
      bestFor: "Established brand, broad items",
      source: "https://www.leadway.com/all-risk-insurance/",
      lastVerified: "2026-07"
    },
    {
      id: "aiico-deviceguard",
      provider: "AIICO Insurance",
      planName: "Device Guard (via Access Bank)",
      coverType: "full",
      priceModel: "₦3,800/month",
      priceFrom: 45600,
      priceFromLabel: "₦3,800/mo (₦45,600/yr)",
      devices: "Phones / devices",
      covers: ["Device protection"],
      claimLimit: "Up to ₦350,000 device value",
      deductible: "Not published",
      notes: "Distributed through Access Bank channel.",
      source: "https://www.aiicoplc.com/",
      lastVerified: "2026-07"
    },
    {
      id: "prestige-device",
      provider: "Prestige Assurance",
      planName: "Prestige Device Insurance",
      coverType: "full",
      priceModel: "Value-based",
      priceFrom: null,
      priceFromLabel: "Value-based",
      devices: "Phones and devices",
      covers: ["Screen breakage", "Total loss", "Theft"],
      claimLimit: "Up to 35% of device cost (screen) / 65% (total loss or theft)",
      deductible: "Not published",
      notes: "Pays a percentage of device cost rather than full repair.",
      source: "https://prestigeassuranceplc.com/Prestige-Device-Insurance",
      lastVerified: "2026-07"
    },

    // ── SCREEN-ONLY COVER (narrower, cheaper) ─────────────────────────────
    {
      id: "axa-slot-screen",
      provider: "AXA Mansard (via SLOT)",
      planName: "Phone Screen Insurance",
      coverType: "screen-only",
      priceModel: "₦2,500 one-off/annual",
      priceFrom: 2500,
      priceFromLabel: "₦2,500/yr",
      devices: "Phones only",
      covers: ["Screen damage", "Liquid damage", "Free motherboard service"],
      claimLimit: "Up to ₦50,000 repair benefit",
      deductible: "Not published",
      notes: "Screen-focused. Sold only at SLOT stores. Launched July 2024.",
      bestFor: "Cheapest screen cover",
      source: "https://corporate.axamansard.com/axa-and-slot-can-pay-you-up-to-50k-if-you-break-your-phone-screen/",
      lastVerified: "2026-07"
    },
    {
      id: "cornerstone-gadget",
      provider: "Cornerstone (with SuperGeeks)",
      planName: "Gadget Protection Plan",
      coverType: "screen-only",
      priceModel: "Not published",
      priceFrom: null,
      priceFromLabel: "Not published",
      devices: "Mobile phones (gadgets)",
      covers: ["Screen crack only"],
      claimLimit: "Replacement (new/refurbished) if unrepairable",
      deductible: "Not published",
      notes: "Nigeria's first gadget plan (2015). Screen crack only — very narrow.",
      source: "https://cornerstone.com.ng/products/detail/MzM=",
      lastVerified: "2026-07"
    },
    {
      id: "scrella-screen",
      provider: "Scrella",
      planName: "Phone Screen Protection",
      coverType: "screen-only",
      priceModel: "₦15,000/year",
      priceFrom: 15000,
      priceFromLabel: "₦15,000/yr",
      devices: "Phones",
      covers: ["Screen damage (regardless of repair cost)"],
      claimLimit: "Screen only",
      deductible: "None stated",
      notes: "Screen-only niche product.",
      source: "https://scrella.ng/",
      lastVerified: "2026-07"
    },
    {
      id: "samsung-careplus",
      provider: "Samsung",
      planName: "Samsung Care+",
      coverType: "manufacturer",
      priceModel: "Model-dependent (free 1-yr screen cover in NG)",
      priceFrom: null,
      priceFromLabel: "Model-dependent",
      devices: "Samsung Galaxy devices only",
      covers: ["Accidental screen damage", "Physical/liquid damage", "Hardware/battery failure"],
      claimLimit: "1 screen repair / 12-month term",
      deductible: "Repair fee varies by model",
      notes: "Samsung-only. Closest to AppleCare in Nigeria. Hardware failures free.",
      bestFor: "Samsung owners",
      source: "https://www.samsung.com/africa_en/offer/samsung-care-plus/",
      lastVerified: "2026-07"
    },
    {
      id: "axa-jumia-protect",
      provider: "AXA Mansard (via Jumia)",
      planName: "Jumia Protect Device Insurance",
      coverType: "full",
      priceModel: "Tiered (from ₦880)",
      priceFrom: 880,
      priceFromLabel: "from ₦880",
      devices: "Phones, laptops, tablets",
      covers: ["Device protection (screen/accidental)"],
      claimLimit: "Banded by device price (₦0–₦40k tier)",
      deductible: "Not published",
      notes: "Must be purchased alongside a device on Jumia. Entry-level tiers for budget devices.",
      source: "https://www.jumia.com.ng/axa-mansard-jumia-protect-device-insurance-14430751.html",
      lastVerified: "2026-07"
    }
  ];
})();
