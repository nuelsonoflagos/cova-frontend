const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('-onboarding.html') || f === 'cova-onboarding.html');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Let's check validateStep function inside the files.
  // When we removed setupOTPInputs(), we left validateStep which validates fg-phone and fg-email
  // Oh, wait, the form actually has: id="fg-phone" and id="phone" already!
  // But wait, the dynamic contact fields was completely replacing something? No, I see it didn't replace because the regex failed earlier.
  // Wait, the previous replacement script replaced it, but the IDs were already fg-phone and phone!
  
  // Let's just fix the step 1 to 2 transition.
  // If the transition is failing, it's because validateStep(1) is returning false.
  // Why is validateStep(1) returning false?
  // Let'const fs = require('"fs"');

const files = fs.rea[