const fs = require('fs');
const s = fs.readFileSync('cova-property-onboarding.html', 'utf8');
const scripts = s.match(/<script>([\s\S]*?)<\/script>/g);
scripts.forEach((script, i) => {
  try {
    require('vm').runInNewContext(script.replace(/<\/?script>/g, ''));
  } catch(e) {
    console.error('Error in script', i, ':', e.message);
    console.log(script.substring(0, 100)); // print start of broken script
  }
});
