const fs = require('fs');
const files = ['index.html', 'cova-about.html', 'cova-contact.html'];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const isHidden = /g, "let isHidden = ");
  fs.writeFileSync(file, content);
}
