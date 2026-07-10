const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Desktop Nav & Footer Nav (anything with Contact us</a> without toggleMobileMenu)
  // We want to add Login *after* Contact us. 
  // Let's target the exact Desktop nav link.
  const desktopContactRegex = /<a class="nav-link" href="cova-contact\.html">Contact us<\/a>/g;
  if (content.includes('cova-contact.html">Contact us</a>') && !content.includes('cova-auth.html">Login</a>')) {
      content = content.replace(
          desktopContactRegex,
          '<a class="nav-link" href="cova-contact.html">Contact us</a>\n        <a class="nav-link" href="cova-auth.html">Login</a>'
      );
  }

  // 2. Mobile Nav
  const mobileContactRegex = /<a[^>]*class="mobile-link"[^>]*href="cova-contact\.html"[^>]*onclick="toggleMobileMenu\(\)"[^>]*>\s*Contact us\s*<\/a\s*>/;
  if (mobileContactRegex.test(content) && !content.includes('cova-auth.html"')) {
      content = content.replace(
          mobileContactRegex,
          match => match + '\n        <a class="mobile-link" href="cova-auth.html" onclick="toggleMobileMenu()">Login</a>'
      );
  }

  fs.writeFileSync(file, content);
}
console.log('Login nav added');