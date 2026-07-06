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

  // Remove the "Where should we send your verification code?" HTML block completely
  content = content.replace(/<div class="form-group">\s*<label>Where should we send your verification code\?<\/label>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');

  // Find the <script> block and replace the whole thing, or just the bad parts
  // Let's first extract the <script> body
  const match = content.match(/<script>([\s\S]*?)<\/script>/);
  if (match) {
    let script = match[1];

    // Remove selectOtpMethod
    script = script.replace(/function selectOtpMethod\([^)]*\)\s*{[\s\S]*?}(?=\s*function|\s*document\.addEventListener|\s*$)/, '');
    
    // There might be dangling else
    script = script.replace(/}\s*else\s*{[\s\S]*?}(?=\s*function|\s*document\.addEventListener|\s*$)/, '');

    // Wait, replacing via AST is much safer.
  }
});
