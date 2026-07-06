const fs = require('fs');
const s = fs.readFileSync('cova-property-onboarding.html', 'utf8');
const scripts = s.match(/<script>([\s\S]*?)<\/script>/g);
console.log(scripts[0]);
