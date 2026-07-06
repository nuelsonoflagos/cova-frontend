const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace duplicate how it works in mobile menu
  const dupRegex = /(<a[^>]*href="cova-how-it-works\.html"[^>]*>\s*How it works\s*<\/a>\s*){2,}/g;
  
  if (dupRegex.test(content)) {
    content = content.replace(dupRegex, `<a
          class="mobile-link"
          href="cova-how-it-works.html"
          onclick="toggleMobileMenu()"
          >How it works</a>\n        `);
  }

  // Also replace `<a class="mobile-link" href="cova-how-it-works.html" onclick="toggleMobileMenu()" >How it works</a>` 
  // followed by `<a class="mobile-link" href="cova-how-it-works.html" onclick="toggleMobileMenu()">How it works</a>`
  content = content.replace(
      /<a\s+class="mobile-link"\s+href="cova-how-it-works\.html"\s+onclick="toggleMobileMenu\(\)"\s*>How it works<\/a\s*>\s*<a\s+class="mobile-link"\s+href="cova-how-it-works\.html"\s+onclick="toggleMobileMenu\(\)"\s*>How it works<\/a\s*>/g,
      `<a
          class="mobile-link"
          href="cova-how-it-works.html"
          onclick="toggleMobileMenu()"
          >How it works</a>`
  );

  fs.writeFileSync(file, content);
}
console.log('Duplicates fixed');