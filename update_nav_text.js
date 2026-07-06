const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Match any anchor tag pointing to cova-insurers.html containing "Insurers"
  const regex = /(href="cova-insurers\.html"[^>]*>)\s*Insurers\s*(<\/a\s*>)/gi;
  
  content = content.replace(regex, '$1Our Partners$2');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated navigation text in ${file}`);
  }
}
