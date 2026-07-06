const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('-onboarding.html') || f === 'cova-onboarding.html');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Let's find ANY trace of "Where should we send your verification code"
  const regex = /<div class="form-group">\s*<label>Where should we send your verification code\?<\/label>[\s\S]*?<\/div>\s*<\/div>/g;
  content = content.replace(regex, '');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Force removed tabs in ${file}`);
  }
}
