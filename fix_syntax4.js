const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('-onboarding.html') || f === 'cova-onboarding.html');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // The mangled block actually started with `const phoneInput = document.querySelector('input[type="tel"]');`
  const cleanupRegex = /const phoneInput = document\.querySelector\('input\[type="tel"\]'\);[\s\S]*?(?=function calculate|async function handleBuyPolicy)/g;
  
  content = content.replace(cleanupRegex, '');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Removed dangling if-blocks in ${file}`);
  }
}
