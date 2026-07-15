class CovaPAI {
  constructor() {
    this.allProducts = this.initializeProducts();
  }

  initializeProducts() {
    var products = {
      // PERSONAL PRODUCTS
      devices: {
        name: 'Device Protection',
        price: '₦1,000/month',
        coverage: '₦500K',
        description: 'Phone, laptop, camera - theft & accidental damage',
        category: 'personal',
        forNeeds: ['devices'],
        priority: 1,
        icon: '📱'
      },
      motor_third_party: {
        name: 'Motor Insurance (Third Party)',
        price: '₦5,000/year',
        coverage: 'Third party liability',
        description: 'Legally required - covers damage you cause to others',
        category: 'personal',
        forNeeds: ['car'],
        priority: 2,
        icon: '🚗'
      },
      motor_comprehensive: {
        name: 'Comprehensive Motor Insurance',
        price: '₦35,000/year',
        coverage: 'Own damage + third party + medical',
        description: 'Full protection - own car damage, accidents, injuries',
        category: 'personal',
        forNeeds: ['car'],
        priority: 1,
        icon: '🚘'
      },
      life_basic: {
        name: 'Life Insurance',
        price: '₦5,000/month',
        coverage: '₦10M death benefit',
        description: 'Protect your family - ₦10M payout if something happens',
        category: 'personal',
        forNeeds: ['life'],
        priority: 1,
        icon: '👨‍👩‍👧'
      },
      travel: {
        name: 'Travel Insurance',
        price: '₦10,000/trip',
        coverage: 'Flight + medical + luggage',
        description: 'Trip cancellation, medical abroad, lost luggage',
        category: 'personal',
        forNeeds: ['travel'],
        priority: 1,
        icon: '✈️'
      },
      property: {
        name: 'Property Insurance',
        price: '₦2,000/month',
        coverage: '₦5M',
        description: 'Home, jewelry, household items - fire & theft',
        category: 'personal',
        forNeeds: ['property'],
        priority: 1,
        icon: '🏠'
      },

      // BUSINESS PRODUCTS
      business_devices: {
        name: 'Business Electronic Equipment',
        price: '₦5,000/month',
        coverage: 'Depends on equipment value',
        description: 'Computers, servers, equipment for retail/office',
        category: 'business',
        forNeeds: ['devices'],
        priority: 1,
        forBusinessType: ['retail', 'tech', 'all'],
        icon: '💻'
      },
      business_motor_fleet: {
        name: 'Motor Fleet Insurance',
        price: '₦50,000/vehicle/year',
        coverage: 'Fleet vehicles',
        description: 'Delivery vans, company cars, logistics vehicles',
        category: 'business',
        forNeeds: ['car'],
        priority: 1,
        forBusinessType: ['logistics', 'retail', 'all'],
        icon: '🚚'
      },
      business_fire: {
        name: 'Fire & Special Perils',
        price: '₦5,000/month',
        coverage: 'Building & contents',
        description: 'Fire, flooding, natural disasters for shop/office',
        category: 'business',
        forNeeds: ['property'],
        priority: 1,
        forBusinessType: ['retail', 'manufacturing', 'all'],
        icon: '🔥'
      },
      business_burglary: {
        name: 'Burglary & Theft',
        price: '₦3,000/month',
        coverage: 'Stock + cash up to ₦5M',
        description: 'Theft of merchandise and cash from your shop',
        category: 'business',
        forNeeds: ['property'],
        priority: 1,
        forBusinessType: ['retail', 'all'],
        icon: '🔒'
      },
      business_liability: {
        name: 'Public Liability',
        price: '₦5,000/month',
        coverage: '₦10M limit',
        description: 'Customer injury, property damage, legal fees',
        category: 'business',
        forNeeds: ['property'],
        priority: 1,
        forBusinessType: ['retail', 'manufacturing', 'all'],
        icon: '⚖️'
      },
      business_workmen: {
        name: 'Workmen\'s Compensation',
        price: '₦2,000/month per employee',
        coverage: 'Staff injury/death benefit',
        description: 'Employee injury, disability, death benefits',
        category: 'business',
        forNeeds: ['property'],
        priority: 1,
        forBusinessType: ['retail', 'manufacturing', 'all'],
        icon: '👷'
      },
      business_group_health: {
        name: 'Group Health (for employees)',
        price: '₦5,000/employee/month',
        coverage: 'All staff',
        description: 'Health coverage for your entire team',
        category: 'business',
        forNeeds: ['health'],
        priority: 1,
        forBusinessType: ['tech', 'manufacturing', 'all'],
        icon: '👥'
      }
    };

    // Inject REAL health plans from the shared data module when available.
    // Falls back to placeholder health products if cova-health-plans.js isn't
    // loaded (so the engine never breaks standalone).
    var healthPlans = (typeof window !== 'undefined' && window.CovaHealthPlans) ? window.CovaHealthPlans : [];
    if (healthPlans.length > 0) {
      // Pick 3 representative plans across price tiers for the chatbot/chooser.
      var sorted = healthPlans.slice().sort(function (a, b) { return a.priceAnnual - b.priceAnnual; });
      var budget = sorted[0];                                                         // cheapest
      var mid = sorted[Math.floor(sorted.length * 0.45)] || sorted[0];                // mid-range
      var premium = sorted[Math.floor(sorted.length * 0.75)] || sorted[sorted.length - 1]; // premium

      [[budget, 'health_budget', 2], [mid, 'health_mid', 1], [premium, 'health_premium', 2]].forEach(function (entry) {
        var plan = entry[0], key = entry[1], priority = entry[2];
        products[key] = {
          name: plan.provider + ' — ' + plan.planName,
          price: '₦' + plan.priceMonthly.toLocaleString('en-NG') + '/month',
          coverage: plan.annualLimit ? (plan.annualLimit >= 1000000 ? '₦' + (plan.annualLimit / 1000000) + 'M annual limit' : '₦' + (plan.annualLimit / 1000) + 'K annual limit') : (plan.networkSize + ' hospitals'),
          description: plan.highlights.join(' · '),
          category: 'personal',
          forNeeds: ['health'],
          priority: priority,
          icon: '🏥'
        };
      });
    } else {
      // Fallback placeholders (kept so the engine works without the data module).
      products.health_bronze = {
        name: 'Health Insurance (Bronze)',
        price: '₦3,750/month',
        coverage: '₦500K annual limit',
        description: 'Basic health coverage - hospital & consultations',
        category: 'personal',
        forNeeds: ['health'],
        priority: 2,
        icon: '🏥'
      };
      products.health_silver = {
        name: 'Health Insurance (Silver)',
        price: '₦7,917/month',
        coverage: '₦500K annual limit',
        description: 'Good coverage - hospital, surgeries, medications',
        category: 'personal',
        forNeeds: ['health'],
        priority: 1,
        icon: '⚕️'
      };
    }

    return products;
  }

  // Main recommendation function
  recommend(userData) {
    const recommendations = [];

    // Get user data
    const accountType = userData.account_type || 'personal';
    // Map existing needs (auto -> car)
    const needs = (userData.selected_needs || []).map(need => need === 'auto' ? 'car' : need);
    const budget = userData.insurance_budget; // e.g. 'under_10k', '10k_50k', '50k_150k', 'over_150k'
    const risk = userData.risk_profile; // 'low', 'medium', 'high'
    const businessType = userData.business_type || 'all';

    // Filter products based on account type
    const relevantProducts = Object.values(this.allProducts).filter(product => {
      return product.category === accountType;
    });

    // Score each product based on match
    relevantProducts.forEach(product => {
      let score = 0;

      // 1. Does it match their selected needs?
      const needsMatch = product.forNeeds?.some(need => needs.includes(need));
      if (needsMatch) score += 50;

      // Only recommend products that actually match a selected need.
      // Previously, products with no need match could still clear the threshold
      // via budget + priority bonuses (e.g. typing "device" surfaced motor
      // insurance too). If the user has stated needs, exclude off-topic products.
      if (needs.length > 0 && !needsMatch) {
        return;
      }

      // 2. Risk profile adjustments (analogous to main_concern)
      if (risk === 'high' && (product.name.includes('Comprehensive') || product.name.includes('Silver') || product.name.includes('Life'))) {
        score += 30;
      }
      if (risk === 'low' && (product.name.includes('Bronze') || product.name.includes('Third Party'))) {
        score += 20;
      }

      // 3. Does it fit their budget?
      if (this.fitsInBudget(product.price, budget)) {
        score += 20;
      }

      // 4. Priority boost
      if (product.priority === 1) {
        score += 10;
      }

      // 5. For business - does it match their business type?
      if (accountType === 'business' && product.forBusinessType) {
        if (product.forBusinessType.includes(businessType) || product.forBusinessType.includes('all')) {
          score += 15;
        }
      }

      // Include products that match a need (score already includes the +50).
      // If the user hasn't specified any needs yet, fall back to score > 20 so
      // the engine can still suggest broadly relevant cover.
      if (needs.length > 0 ? needsMatch : score > 20) {
        recommendations.push({
          ...product,
          score: score,
          explanation: this.getExplanation(product, userData, needsMatch)
        });
      }
    });

    // Sort by score (highest first)
    recommendations.sort((a, b) => b.score - a.score);

    // Return top 3-5 recommendations
    return recommendations.slice(0, 5);
  }

  // Check if product fits budget
  fitsInBudget(priceStr, budget) {
    const budgetRanges = {
      'under_10k': { min: 0, max: 10000 },
      '10k_50k': { min: 10000, max: 50000 },
      '50k_150k': { min: 50000, max: 150000 },
      'over_150k': { min: 150000, max: Infinity }
    };

    const budgetRange = budgetRanges[budget];
    if (!budgetRange) return true;

    // Extract number from price (very basic, handles '₦5,000/month' -> 5000)
    const priceNum = parseInt(priceStr.replace(/[^0-9]/g, ''));
    
    // Normalize yearly vs monthly to monthly for budget comparison
    let monthlyPrice = priceNum;
    if (priceStr.toLowerCase().includes('year')) {
      monthlyPrice = priceNum / 12;
    }

    return monthlyPrice <= budgetRange.max;
  }

  // Generate explanation for why we recommend this
  getExplanation(product, userData, needsMatch) {
    const budget = userData.insurance_budget;
    let explanation = `Recommended because `;

    if (needsMatch) {
      explanation += `you selected ${product.forNeeds[0]} protection. `;
    } else {
      explanation += `it provides essential ${product.category} coverage. `;
    }

    if (this.fitsInBudget(product.price, budget)) {
      explanation += `Fits comfortably in your budget.`;
    }

    return explanation;
  }
}

// Make it available globally
window.CovaPAI = CovaPAI;
