const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('-onboarding.html') || f === 'cova-onboarding.html');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // We want to remove the OTP UI blocks completely from step-1 of onboarding
  
  // 1. Remove the "Where should we send your verification code" tab selector completely
  const tabSelectorRegex = /<div class="form-group">\s*<label[^>]*>Where should we send your verification code\?<\/label>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
  content = content.replace(tabSelectorRegex, '');

  // 2. We need to replace the entire dynamic contact block with a standard Phone and Email block.
  // The contact fields block starts with `<div id="contact-fields">` and ends right before the next form group (which is usually the "Are you insuring for yourself..." block).
  
  const dynamicContactRegex = /<div id="contact-fields">[\s\S]*?<\/div>\s*(?=<div class="form-group">)/;
  
  const standardContactFields = `
        <div class="form-group">
          <label>Phone number</label>
          <input type="tel" id="phoneInput" placeholder="080 xxxx xxxx" required />
          <div class="form-hint">We'll send claim updates here. Must be your active number.</div>
        </div>
        <div class="form-group">
          <label>Email address</label>
          <input type="email" id="emailInput" placeholder="adaeze@company.com" required />
        </div>
`;

  content = content.replace(dynamicContactRegex, standardContactFields);

  // 3. Remove the setupOTPInputs() call and switchContactMethod() logic if it exists in script
  content = content.replace(/setupOTPInputs\(\);/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated onboarding fields in ${file}`);
  }
}
