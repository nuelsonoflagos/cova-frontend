const fs = require('fs');
let content = fs.readFileSync('cova-partners.html', 'utf8');
content = content.replace('<title>Cova — Nigeria’s independent insurance broker</title>', '<title>Our Partners — Cova</title>');
fs.writeFileSync('cova-partners.html', content);
