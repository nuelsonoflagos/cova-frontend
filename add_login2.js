const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Mobile Nav
  const mobileContactRegex = /<a\s+class="mobile-link"\s+href="cova-contact\.html"\s+onclick="toggleMobileMenu\(\)"\s*>\s*Contact us\s*<\/a\s*>/g;
  
  if (content.match(mobileContactRegex) && !content.includes('href="cova-auth.html" onclick="toggleMobileMenu()">Login</a>')) {
      content = content.replace(
          mobileContactRegex,
          match => match + '\n        <a class="mobile-link" href="cova-auth.html" onclick="toggleMobileMenu()">Login</a>'
      );
  } else if (!content.includes('href="cova-auth.html" onclick="toggleMobileMenu()">Login</a>') && content.includes('<a class="mobile-link" href="cova-contact.html" onclick="toggleMobileMenu()">Contact us</a>')) {
      content = content.replace(
          '<a class="mobile-link" href="cova-contact.html" onclick="toggleMobileMenu()">Contact us</a>',
          '<a class="mobile-link" href="cova-contact.html" onclick="toggleMobileMenu()">Contact us</a>\n        <a class="mobile-link" href="cova-auth.html" onclick="toggleMobileMenu()">Login</a>'
      );
  } else if (!content.includes('href="cova-auth.html" onclick="toggleMobileMenu()">Login</a>') && content.includes('<a\n          class="mobile-link"\n          href="cova-contact.html"\n          onclick="toggleMobileMenu()"\n          >Contact us</a\n        >')) {
      content = content.replace(
          '<a\n          class="mobile-link"\n          href="cova-contact.html"\n          onclick="toggleMobileMenu()"\n          >Contact us</a\n        >',
          '<a\n          class="mobile-link"\n          href="cova-contact.html"\n          onclick="toggleMobileMenu()"\n          >Contact us</a\n        >\n        <a class="mobile-link" href="cova-auth.html" onclick="toggleMobileMenu()">Login</a>'
      );
  }
  
  // What about footer? Should we add it there too?
  // Let's add it right after "Contact us" in the footer.
  const footerContactRegex = /<a href="cova-contact\.html">Contact us<\/a>/g;
  if (content.includes('<a href="cova-contact.html">Contact us</a>') && !content.includes('<a href="cova-auth.html">Login</a>')) {
      content = content.replace(
          footerContactRegex,
          '<a href="cova-contact.html">Contact us</a>\n          <a href="cova-auth.html">Login</a>'
      );
  }

  fs.writeFileSync(file, content);
}
console.log('Mobile nav and footer fixed');