const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const phoneFormatter = `
      function formatPhoneForTermii(phone) { 
        if (!phone) return phone;
        // Remove any non-digit characters
        let clean = phone.replace(/\\D/g, '');
        if (clean.startsWith('0')) { 
          return '234' + clean.substring(1); 
        } 
        return clean; 
      }
`;

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  let changed = false;

  // Find where to inject the formatter
  if (content.includes('function selectOtpMethod') && !content.includes('function formatPhoneForTermii')) {
    content = content.replace('function selectOtpMethod', phoneFormatter + '\n      function selectOtpMethod');
    changed = true;
  }

  // Update sendOTP in cova-auth.html
  if (file === 'cova-auth.html') {
    if (content.includes('document.getElementById("phone").value.trim()')) {
      content = content.replace(
        /document\.getElementById\("phone"\)\.value\.trim\(\)/g,
        'formatPhoneForTermii(document.getElementById("phone").value)'
      );
      changed = true;
    }
  }

  // Update nextStep logic in onboarding files
  if (file.includes('-onboarding')) {
    if (content.includes('const dest =')) {
      // Find the place where dest is extracted from phone
      content = content.replace(
        /\(otpMethod === "phone" \|\| otpMethod === "sms"\)\s*\?\s*document\.getElementById\("([^"]*phone)"\)\.value/g,
        '(otpMethod === "phone" || otpMethod === "sms") ? formatPhoneForTermii(document.getElementById("$1").value)'
      );
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(path.join(dir, file), content, 'utf8');
    console.log('Added phone formatting to', file);
  }
});
