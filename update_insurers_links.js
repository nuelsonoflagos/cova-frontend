const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace all href="#insurers" with href="cova-insurers.html"
  if (content.includes('href="#insurers"')) {
    content = content.replace(/href="#insurers"/g, 'href="cova-insurers.html"');
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
