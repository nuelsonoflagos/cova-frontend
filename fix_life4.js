const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('-onboarding.html') || f === 'cova-onboarding.html');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Fix prevStep by removing hardcoded 1b, 2b logic that crashes since the HTML elements were deleted.
  content = content.replace(/if \(cur === "2b"\) \{[\s\S]*?return;\n\s*\}/g, '');
  content = content.replace(/if \(cur === 3\) \{[\s\S]*?document\.getElementById\("step-2b"\)\.classList\.add\("active"\);[\s\S]*?return;\n\s*\}/g, '');
  content = content.replace(/if \(cur === 2\) \{[\s\S]*?document\.getElementById\("step-1b"\)\.classList\.add\("active"\);[\s\S]*?return;\n\s*\}/g, '');
  content = content.replace(/if \(cur === 'otp'\) \{[\s\S]*?return;\n\s*\}/g, '');
  
  // Also check if any step-1b references exist in nextStep (just in case)
  content = content.replace(/if \(from === "1b"\) \{[\s\S]*?return;\n\s*\}/g, '');
  content = content.replace(/if \(from === "2b"\) \{[\s\S]*?return;\n\s*\}/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Cleaned up prevStep in ${file}`);
  }
}
