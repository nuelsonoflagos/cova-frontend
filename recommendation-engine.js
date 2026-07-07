class CovaPAI {
  constructor() {
    this.allProducts = this.initializeProducts();
  }

  initializeProducts() {
    return {
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
      health_bronze: {
        name: 'Health Insurance (Bronze)',
        price: '₦5,000/month',
        coverage: '₦100K annual limit',
        description: 'Basic health coverage - hospital & consultations',
        category: 'personal',
        forNeeds: ['health'],
        priority: 2,
        icon: '🏥'
      },
      health_silver: {
        name: 'Health Insurance (Silver)',
        price: '₦10,000/month',
        coverage: '₦500K annual limit',
        description: 'Good coverage - hospital, surgeries, medications',
        category: 'personal',
        forNeeds: ['health'],
        priority: 1,
        icon: '⚕️'
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

      // Only recommend products that have at least some relevance (like matching a need or high score)
      if (score > 20) {
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
