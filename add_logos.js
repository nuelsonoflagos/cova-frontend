const fs = require('fs');

let content = fs.readFileSync('cova-partners.html', 'utf8');

const partners = [
  { name: 'AXA Mansard', domain: 'axamansard.com' },
  { name: 'Leadway Assurance', domain: 'leadway.com' },
  { name: 'AIICO Insurance', domain: 'aiicoplc.com' },
  { name: 'Mutual Benefits', domain: 'mutualng.com' },
  { name: 'Custodian Insurance', domain: 'custodianplc.com.ng' },
  { name: 'NEM Insurance', domain: 'nemng.com' },
  { name: 'Cornerstone Insurance', domain: 'cornerstone.com.ng' },
  { name: 'Linkage Assurance', domain: 'linkageassurance.com' },
  { name: 'Heirs Insurance', domain: 'heirsinsurance.com' },
  { name: 'Zenith Insurance', domain: 'zenithinsurance.com.ng' },
  { name: 'Sovereign Trust', domain: 'stiplc.com' },
  { name: 'Reliance HMO', domain: 'reliancehmo.com' },
  { name: 'Hygeia HMO', domain: 'hygeiahmo.com' },
  { name: 'Leadway Health', domain: 'leadwayhealth.com' },
  { name: 'Coronation Insurance', domain: 'coronation.ng' }
];

partners.forEach(partner => {
  const regex = new RegExp(
    `<div style="width: 48px; height: 48px; background: var\\(--green-soft\\); display: grid; place-items: center; border-radius: 12px; font-weight: 800; color: var\\(--green\\); font-size: 12px;">[^<]+<\\/div>\\s*<div style="font-size: 20px; font-weight: 700; letter-spacing: -0\\.02em; color: var\\(--ink\\);">${partner.name}<\\/div>`
  );
  
  const imgHTML = `<div style="width: 48px; height: 48px; background: var(--white); display: flex; justify-content: center; align-items: center; border-radius: 12px; border: 1px solid var(--border); overflow: hidden; padding: 4px;">
              <img src="https://logo.clearbit.com/${partner.domain}" onerror="this.onerror=null; this.src='https://www.google.com/s2/favicons?domain=${partner.domain}&sz=128';" alt="${partner.name} Logo" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            </div>
            <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em; color: var(--ink);">${partner.name}</div>`;

  content = content.replace(regex, imgHTML);
});

fs.writeFileSync('cova-partners.html', content);
console.log('Logos applied!');