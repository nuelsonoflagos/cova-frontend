const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix mobile links if missing
  const mobileAboutStr = `<a
          class="mobile-link"
          href="cova-about.html"
          onclick="toggleMobileMenu()"
          >About us</a
        >`;
  const mobileHowItWorksStr = `<a
          class="mobile-link"
          href="cova-how-it-works.html"
          onclick="toggleMobileMenu()"
          >How it works</a
        >`;
        
  if (content.includes(mobileAboutStr) && !content.includes(mobileHowItWorksStr)) {
      content = content.replace(
          mobileAboutStr,
          mobileAboutStr + '\n        ' + mobileHowItWorksStr
      );
  }

  // Footer check
  const footerAboutStr = `<a href="cova-about.html">About us</a>`;
  const footerHowItWorksStr = `<a href="cova-how-it-works.html">How it works</a>`;
  
  // Look for footer section specifically
  const footerMatch = content.match(/<footer>[\s\S]*?<\/footer>/);
  if (footerMatch) {
      let footerContent = footerMatch[0];
      if (footerContent.includes(footerAboutStr) && !footerContent.includes(footerHowItWorksStr)) {
          footerContent = footerContent.replace(
              footerAboutStr,
              footerAboutStr + '\n          ' + footerHowItWorksStr
          );
          content = content.replace(footerMatch[0], footerContent);
      }
  }

  fs.writeFileSync(file, content);
}
console.log('Mobile links and footers fixed');