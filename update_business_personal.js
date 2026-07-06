const fs = require('fs');

const files = ['cova-business.html', 'cova-personal.html'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('href="#insurers"')) {
    content = content.replace(/href="#insurers"/g, 'href="cova-insurers.html"');
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
