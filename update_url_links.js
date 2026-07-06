const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace all instances of cova-insurers.html with cova-partners.html
  content = content.replace(/cova-insurers\.html/g, 'cova-partners.html');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated URL in ${file}`);
  }
}
