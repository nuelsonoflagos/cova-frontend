const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('-onboarding.html') || f === 'cova-onboarding.html');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. Remove the OTP interceptor nextStep function entirely
  const nextStepRegex = /function nextStep\([^\)]*\)\s*\{[\s\S]*?origNextStep\([^\)]*\);\s*\}/g;
  content = content.replace(nextStepRegex, '');

  // 2. Remove the OTP interceptor prevStep function entirely
  const prevStepRegex = /function prevStep\([^\)]*\)\s*\{[\s\S]*?origPrevStep\([^\)]*\);\s*\}/g;
  content = content.replace(prevStepRegex, '');

  // 3. Rename origNextStep back to nextStep
  content = content.replace(/function origNextStep/g, 'function nextStep');

  // 4. Rename origPrevStep back to prevStep
  content = content.replace(/function origPrevStep/g, 'function prevStep');

  // 5. Remove any leftover step-1b or step-2b HTML blocks
  // Delete from `<div class="step-panel" id="step-1b">` up to the next `<!-- STEP`
  content = content.replace(/<div class="step-panel" id="step-1b">[\s\S]*?(?=<!-- STEP)/, '');
  content = content.replace(/<div class="step-panel" id="step-2b">[\s\S]*?(?=<!-- STEP)/, '');
  
  // Also clean up validateOTP references
  content = content.replace(/function validateOTP\(\) {[\s\S]*?return ok;\n\s*}/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Fixed navigation in ${file}`);
  }
}
