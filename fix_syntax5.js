const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('-onboarding.html') || f === 'cova-onboarding.html');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Let's completely nuke `selectOtpMethod`
  const selectOtpRegex = /let otpMethod = "phone";\n\s*function selectOtpMethod\([\s\S]*?(?=function calculate)/;
  content = content.replace(selectOtpRegex, '');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Nuked selectOtpMethod in ${file}`);
  }
}
