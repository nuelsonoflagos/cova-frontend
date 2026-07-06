const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('-onboarding.html') || f === 'cova-onboarding.html');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // We should fix the HTML block we injected earlier to have the proper IDs.
  // The validateStep logic explicitly looks for document.getElementById("phone") and document.getElementById("fg-phone").
  // And similarly for email.
  
  content = content.replace(/<div class="form-group">\s*<label>Phone number<\/label>\s*<input type="tel" id="phoneInput"/g, 
                            '<div class="form-group" id="fg-phone">\n          <label>Phone number</label>\n          <input type="tel" id="phone"');
                            
  content = content.replace(/<div class="form-group">\s*<label>Email address<\/label>\s*<input type="email" id="emailInput"/g,
                            '<div class="form-group" id="fg-email">\n          <label>Email address</label>\n          <input type="email" id="email"');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Fixed validation fields in ${file}`);
  }
}
