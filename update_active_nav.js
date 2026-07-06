const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Sometimes links might accidentally still point to about or index due to a copy-paste error
  // Let's ensure ALL instances of >Insurers< strictly have href="cova-insurers.html"
  const insurersRegex = /<a[^>]*href="([^"]+)"[^>]*>\s*Insurers\s*<\/a>/g;
  
  content = content.replace(insurersRegex, (match, href) => {
    if (href !== 'cova-insurers.html') {
      changed = true;
      return match.replace(href, 'cova-insurers.html');
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Fixed bad Insurers link in ${file}`);
  }
}
