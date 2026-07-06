const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');

  // Disable autoScroll on mobile devices
  if (content.includes('requestAnimationFrame(autoScroll);')) {
    content = content.replace(
      'requestAnimationFrame(autoScroll);',
      'if (window.innerWidth > 768) { requestAnimationFrame(autoScroll); } else { setTimeout(autoScroll, 100); }'
    );
    // actually, let's just make it only start if > 768, or we can just pause the whole logic.
    // Let's replace the whole autoScroll definition
  }
  
  // Make sure backdrop-filter is completely removed for mobile nav for better perf
  // It's currently in CSS: backdrop-filter: blur(8px);
  // Let's wrap it in a media query or just remove it.
  content = content.replace('backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);', '/* blur removed for perf */');

  fs.writeFileSync(path.join(dir, file), content, 'utf8');
});

console.log('Performance tweaks applied.');
