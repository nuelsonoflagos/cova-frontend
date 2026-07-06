const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace existing "#how" links
  content = content.replace(/href="#how"/g, 'href="cova-how-it-works.html"');

  // If file doesn't have "How it works" in desktop nav but has "About us", let's inject it if it's missing
  if (!content.includes('How it works') && content.includes('<a class="nav-link" href="cova-about.html">About us</a>')) {
    content = content.replace(
      '<a class="nav-link" href="cova-about.html">About us</a>',
      '<a class="nav-link" href="cova-about.html">About us</a>\n        <a class="nav-link" href="cova-how-it-works.html">How it works</a>'
    );
  }

  // Same for mobile menu in files where it might be missing
  if (content.includes('<a class="mobile-link" href="cova-about.html" onclick="toggleMobileMenu()">About us</a>') && !content.includes('href="cova-how-it-works.html" onclick="toggleMobileMenu()">How it works')) {
    content = content.replace(
      '<a class="mobile-link" href="cova-about.html" onclick="toggleMobileMenu()">About us</a>',
      '<a class="mobile-link" href="cova-about.html" onclick="toggleMobileMenu()">About us</a>\n        <a class="mobile-link" href="cova-how-it-works.html" onclick="toggleMobileMenu()">How it works</a>'
    );
  }
  
  // Also check footer links for "How it works"
  if (content.includes('<a href="#how">How it works</a>')) {
     content = content.replace(/<a href="#how">How it works<\/a>/g, '<a href="cova-how-it-works.html">How it works</a>');
  } else if (!content.includes('>How it works</a>') && content.includes('<a href="cova-about.html">About us</a>')) {
     content = content.replace(
      '<a href="cova-about.html">About us</a>',
      '<a href="cova-about.html">About us</a>\n          <a href="cova-how-it-works.html">How it works</a>'
    );
  }

  fs.writeFileSync(file, content);
}
console.log('Nav fixed');