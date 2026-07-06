const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('-onboarding.html') || f === 'cova-onboarding.html');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Let's forcefully balance the braces.
  // The easiest way is to completely replace the `<script>` tag that contains `DOMContentLoaded`
  // since it was heavily mangled by the OTP logic removal.
  
  // Wait, let's just find `document.addEventListener("DOMContentLoaded", () => {` and close it properly.
  // Currently, the file might look like:
  /*
      document.addEventListener("DOMContentLoaded", () => {
        // some code
        
      function selectPlan(plan) {
  */
  // Let's replace the space right before `function selectPlan` with `});\n      `
  content = content.replace(/(?=\n\s*function selectPlan|\n\s*async function handleBuyPolicy|\n\s*function calculate)/, '\n      });\n');
  content = content.replace(/\}\);\n\s*\}\);\n/g, '});\n');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Fixed missing closing brace in ${file}`);
  }
}
