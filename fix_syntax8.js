const fs = require('fs');

const files = [
  'cova-motor-onboarding.html',
  'cova-health-onboarding.html',
  'cova-home-onboarding.html',
  'cova-life-onboarding.html',
  'cova-travel-onboarding.html',
  'cova-gadget-onboarding.html',
  'cova-business-onboarding.html',
  'cova-onboarding.html',
  'cova-fire-onboarding.html',
  'cova-group-onboarding.html',
  'cova-investment-onboarding.html',
  'cova-property-onboarding.html'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');

  // Remove the login tabs HTML
  content = content.replace(/<div class="form-group">\s*<label>Where should we send your verification code\?<\/label>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');

  // Remove selectOtpMethod and the dangling else
  content = content.replace(/let otpMethod\s*=\s*["'](?:phone|email|sms)["'];[\s\S]*?(?=function\s+\w+\()/g, '');

  // Remove step-1b references from validateStep
  content = content.replace(/if\s*\(\s*step\s*===\s*['"]1b['"]\s*\)\s*\{[\s\S]*?return\s+(?:true|false);\s*\}/, '');

  // In goBack(), remove `if (currentStep === "1b") prevStep("1b"); else `
  content = content.replace(/if\s*\(\s*currentStep\s*===\s*['"]1b['"]\s*\)\s*prevStep\(\s*['"]1b['"]\s*\);\s*else\s*/, '');

  // Fix group onboarding workmen typo if it exists
  content = content.replace(/'Workmen's Compensation'/g, '"Workmen\'s Compensation"');
  
  // Also remove the DOMContentLoaded logic that deals with methodLabel
  content = content.replace(/document\.addEventListener\("DOMContentLoaded", \(\) => \{[\s\S]*?window\.selectOtpMethod[\s\S]*?\}\);/g, '');

  fs.writeFileSync(f, content);
  console.log('Processed', f);
});
