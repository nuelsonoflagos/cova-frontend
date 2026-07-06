const fs = require('fs');
const files = ['index.html', 'cova-about.html', 'cova-contact.html'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const replacement = `.dropdown-menu {
        position: absolute;
        top: calc(100% + 12px);
        left: 0;
        width: 420px;
        background: var(--white);
        border: 1px solid var(--border);
        border-radius: 24px;
        box-shadow: 0 12px 40px rgba(10, 92, 69, 0.12);
        padding: 22px;
        display: none;
      }
      .dropdown-menu::before {
        content: '';
        position: absolute;
        top: -16px;
        left: 0;
        right: 0;
        height: 16px;
      }`;
      
  content = content.replace(/\.dropdown-menu \{\s*position: absolute;\s*top: calc\(100% \+ 12px\);\s*left: 0;\s*width: 420px;\s*background: var\(--white\);\s*border: 1px solid var\(--border\);\s*border-radius: 24px;\s*box-shadow: 0 12px 40px rgba\(10, 92, 69, 0\.12\);\s*padding: 22px;\s*display: none;\s*\}/g, replacement);
  fs.writeFileSync(file, content);
  console.log('Fixed ' + file);
}