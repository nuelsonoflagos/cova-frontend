const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix mobile links if missing
  const mobileAboutRegex = /<a\s+class="mobile-link"\s+href="cova-about\.html"\s+onclick="toggleMobileMenu\(\)"\s*>About us<\/a>/;
  if (mobileAboutRegex.test(content) && !content.includes('href="cova-how-it-works.html"')) {
      content = content.replace(
          mobileAboutRegex,
          `<a
          class="mobile-link"
          href="cova-about.html"
          onclick="toggleMobileMenu()"
          >About us</a
        >
        <a
          class="mobile-link"
          href="cova-how-it-works.html"
          onclick="toggleMobileMenu()"
          >How it works</a
        >`
      );
  }

  // Also replace any lingering href="#how" to href="cova-how-it-works.html" just in case
  content = content.replace(/href="#how"/g, 'href="cova-how-it-works.html"');

  fs.writeFileSync(file, content);
}
console.log('Mobile links fixed');