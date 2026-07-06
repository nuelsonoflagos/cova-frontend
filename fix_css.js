const fs = require('fs');
let content = fs.readFileSync('cova-partners.html', 'utf8');

// I notice the background is slightly off.
// Let's add the stylesheet link back in. The head was probably stripped.

let indexContent = fs.readFileSync('index.html', 'utf8');
const headRegex = /<head>[\s\S]*?<\/head>/;
const headMatch = indexContent.match(headRegex);

if (headMatch) {
  content = content.replace(/<head>[\s\S]*?<\/head>/, headMatch[0]);
  content = content.replace('<title>Cova — Simplifying insurance for every Nigerian</title>', '<title>Our Partners — Cova</title>');
  fs.writeFileSync('cova-partners.html', content);
  console.log("Fixed CSS and head tags");
}
