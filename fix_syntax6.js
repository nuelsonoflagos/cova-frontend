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

  // Remove the login tabs
  content = content.replace(/<div class="form-group">\s*<label>Where should we send your verification code\?<\/label>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');

  // Remove selectOtpMethod and the dangling else
  // We'll replace from `let otpMethod = "phone";` down to `function setupOTPInputs`
  content = content.replace(/let otpMethod\s*=\s*["'](?:phone|email)["'];[\s\S]*?(?=function setupOTPInputs)/, '');

  // Wait, in some files it might be slightly different. Let's check `cova-motor-onboarding.html` specifically.
  // Actually, we can just replace the whole `let otpMethod = ...` to `function validateStep` if `setupOTPInputs` doesn't exist.
  // But wait, setupOTPInputs is needed? No, setupOTPInputs was for the OTP inputs on step 1b!
  // But step 1b is completely removed! We should remove setupOTPInputs too!
  content = content.replace(/let otpMethod\s*=\s*["'](?:phone|email)["'];[\s\S]*?(?=function validateStep)/, '');

  // We should also remove step-1b references from validateStep, nextStep, prevStep, goBack
  content = content.replace(/if\s*\(\s*step\s*===\s*['"]1b['"]\s*\)\s*\{[\s\S]*?return\s+(?:true|false);\s*\}/, '');

  // In validateStep, remove the `if (step === 1)` block? No, validateStep(1) is needed!

  fs.writeFileSync(f, content);
  console.log('Processed', f);
});
