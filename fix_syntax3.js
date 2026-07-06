const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('-onboarding.html') || f === 'cova-onboarding.html');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Remove the stray `});` that was incorrectly added before these functions.
  content = content.replace(/\n\s*\}\);\n\s*(?=function selectPlan|async function handleBuyPolicy|function calculate|function submitWaitlistForm|function updateSummary|function formatPhoneForTermii)/g, '\n\n      ');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Fixed extra closing brace in ${file}`);
  }
}
