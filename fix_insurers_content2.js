const fs = require('fs');

let indexContent = fs.readFileSync('index.html', 'utf8');

// Extract everything from top up to </nav> + mobile menu
const topPartRegex = /<!doctype html>[\s\S]*?<\/div>\s*<\/div>/;
const topPartMatch = indexContent.match(topPartRegex);

// Extract footer
const footerRegex = /<footer>[\s\S]*?<\/html>/;
const footerMatch = indexContent.match(footerRegex);

if (topPartMatch && footerMatch) {
  const insurersHTML = `
    <section class="section" style="padding-top: 120px; padding-bottom: 40px; text-align: center;">
      <div class="container-inner">
        <div class="section-label">Our Partners</div>
        <h1 class="section-title" style="font-size: 56px; line-height: 1.1; letter-spacing: -0.04em; max-width: 800px; margin: 0 auto 24px;">We work with the best.</h1>
        <p class="section-sub" style="max-width: 600px; margin: 0 auto;">
          Cova is an independent broker. We are connected to Nigeria's top-rated insurance providers to ensure you get the best coverage, the fastest claims, and the most reliable support.
        </p>
      </div>
    </section>

    <section class="section" style="padding-top: 0;">
      <div class="container-inner" style="max-width: 1200px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
          
          <div style="background: var(--white); border: 1px solid var(--border); border-radius: 24px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <div style="width: 48px; height: 48px; background: var(--green-soft); display: grid; place-items: center; border-radius: 12px; font-weight: 800; color: var(--green); font-size: 12px;">AXA</div>
              <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">AXA Mansard</div>
            </div>
            <div style="font-size: 14px; color: var(--green); font-weight: 600; margin-bottom: 4px;">A+ rated</div>
            <div style="font-size: 14px; color: var(--ink-light);">General, Life & Health</div>
          </div>

          <div style="background: var(--white); border: 1px solid var(--border); border-radius: 24px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <div style="width: 48px; height: 48px; background: var(--green-soft); display: grid; place-items: center; border-radius: 12px; font-weight: 800; color: var(--green); font-size: 12px;">LWA</div>
              <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Leadway Assurance</div>
            </div>
            <div style="font-size: 14px; color: var(--green); font-weight: 600; margin-bottom: 4px;">A+ rated</div>
            <div style="font-size: 14px; color: var(--ink-light);">General & Life</div>
          </div>

          <div style="background: var(--white); border: 1px solid var(--border); border-radius: 24px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <div style="width: 48px; height: 48px; background: var(--green-soft); display: grid; place-items: center; border-radius: 12px; font-weight: 800; color: var(--green); font-size: 12px;">AII</div>
              <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">AIICO Insurance</div>
            </div>
            <div style="font-size: 14px; color: var(--green); font-weight: 600; margin-bottom: 4px;">A rated</div>
            <div style="font-size: 14px; color: var(--ink-light);">General, Life & Health</div>
          </div>

          <div style="background: var(--white); border: 1px solid var(--border); border-radius: 24px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <div style="width: 48px; height: 48px; background: var(--green-soft); display: grid; place-items: center; border-radius: 12px; font-weight: 800; color: var(--green); font-size: 12px;">MUT</div>
              <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Mutual Benefits</div>
            </div>
            <div style="font-size: 14px; color: var(--green); font-weight: 600; margin-bottom: 4px;">A rated</div>
            <div style="font-size: 14px; color: var(--ink-light);">General & Life</div>
          </div>

          <div style="background: var(--white); border: 1px solid var(--border); border-radius: 24px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <div style="width: 48px; height: 48px; background: var(--green-soft); display: grid; place-items: center; border-radius: 12px; font-weight: 800; color: var(--green); font-size: 12px;">CUS</div>
              <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Custodian Insurance</div>
            </div>
            <div style="font-size: 14px; color: var(--green); font-weight: 600; margin-bottom: 4px;">A+ rated</div>
            <div style="font-size: 14px; color: var(--ink-light);">General & Life</div>
          </div>

          <div style="background: var(--white); border: 1px solid var(--border); border-radius: 24px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <div style="width: 48px; height: 48px; background: var(--green-soft); display: grid; place-items: center; border-radius: 12px; font-weight: 800; color: var(--green); font-size: 12px;">NEM</div>
              <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">NEM Insurance</div>
            </div>
            <div style="font-size: 14px; color: var(--green); font-weight: 600; margin-bottom: 4px;">A rated</div>
            <div style="font-size: 14px; color: var(--ink-light);">General Insurance</div>
          </div>

          <div style="background: var(--white); border: 1px solid var(--border); border-radius: 24px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <div style="width: 48px; height: 48px; background: var(--green-soft); display: grid; place-items: center; border-radius: 12px; font-weight: 800; color: var(--green); font-size: 12px;">COR</div>
              <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Cornerstone Insurance</div>
            </div>
            <div style="font-size: 14px; color: var(--green); font-weight: 600; margin-bottom: 4px;">A rated</div>
            <div style="font-size: 14px; color: var(--ink-light);">General & Life</div>
          </div>

          <div style="background: var(--white); border: 1px solid var(--border); border-radius: 24px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <div style="width: 48px; height: 48px; background: var(--green-soft); display: grid; place-items: center; border-radius: 12px; font-weight: 800; color: var(--green); font-size: 12px;">LIN</div>
              <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Linkage Assurance</div>
            </div>
            <div style="font-size: 14px; color: var(--green); font-weight: 600; margin-bottom: 4px;">A rated</div>
            <div style="font-size: 14px; color: var(--ink-light);">General Insurance</div>
          </div>

          <div style="background: var(--white); border: 1px solid var(--border); border-radius: 24px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <div style="width: 48px; height: 48px; background: var(--green-soft); display: grid; place-items: center; border-radius: 12px; font-weight: 800; color: var(--green); font-size: 12px;">HEI</div>
              <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Heirs Insurance</div>
            </div>
            <div style="font-size: 14px; color: var(--green); font-weight: 600; margin-bottom: 4px;">A rated</div>
            <div style="font-size: 14px; color: var(--ink-light);">General & Life</div>
          </div>

          <div style="background: var(--white); border: 1px solid var(--border); border-radius: 24px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <div style="width: 48px; height: 48px; background: var(--green-soft); display: grid; place-items: center; border-radius: 12px; font-weight: 800; color: var(--green); font-size: 12px;">ZEN</div>
              <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Zenith Insurance</div>
            </div>
            <div style="font-size: 14px; color: var(--green); font-weight: 600; margin-bottom: 4px;">A rated</div>
            <div style="font-size: 14px; color: var(--ink-light);">General Insurance</div>
          </div>

          <div style="background: var(--white); border: 1px solid var(--border); border-radius: 24px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <div style="width: 48px; height: 48px; background: var(--green-soft); display: grid; place-items: center; border-radius: 12px; font-weight: 800; color: var(--green); font-size: 12px;">SOV</div>
              <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Sovereign Trust</div>
            </div>
            <div style="font-size: 14px; color: var(--green); font-weight: 600; margin-bottom: 4px;">A rated</div>
            <div style="font-size: 14px; color: var(--ink-light);">General Insurance</div>
          </div>

          <div style="background: var(--white); border: 1px solid var(--border); border-radius: 24px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <div style="width: 48px; height: 48px; background: var(--green-soft); display: grid; place-items: center; border-radius: 12px; font-weight: 800; color: var(--green); font-size: 12px;">REL</div>
              <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Reliance HMO</div>
            </div>
            <div style="font-size: 14px; color: var(--green); font-weight: 600; margin-bottom: 4px;">A rated</div>
            <div style="font-size: 14px; color: var(--ink-light);">Health Insurance</div>
          </div>

          <div style="background: var(--white); border: 1px solid var(--border); border-radius: 24px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <div style="width: 48px; height: 48px; background: var(--green-soft); display: grid; place-items: center; border-radius: 12px; font-weight: 800; color: var(--green); font-size: 12px;">HYG</div>
              <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Hygeia HMO</div>
            </div>
            <div style="font-size: 14px; color: var(--green); font-weight: 600; margin-bottom: 4px;">A+ rated</div>
            <div style="font-size: 14px; color: var(--ink-light);">Health Insurance</div>
          </div>

          <div style="background: var(--white); border: 1px solid var(--border); border-radius: 24px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <div style="width: 48px; height: 48px; background: var(--green-soft); display: grid; place-items: center; border-radius: 12px; font-weight: 800; color: var(--green); font-size: 12px;">LWH</div>
              <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Leadway Health</div>
            </div>
            <div style="font-size: 14px; color: var(--green); font-weight: 600; margin-bottom: 4px;">A+ rated</div>
            <div style="font-size: 14px; color: var(--ink-light);">Health Insurance</div>
          </div>

          <div style="background: var(--white); border: 1px solid var(--border); border-radius: 24px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <div style="width: 48px; height: 48px; background: var(--green-soft); display: grid; place-items: center; border-radius: 12px; font-weight: 800; color: var(--green); font-size: 12px;">COR</div>
              <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Coronation Insurance</div>
            </div>
            <div style="font-size: 14px; color: var(--green); font-weight: 600; margin-bottom: 4px;">A rated</div>
            <div style="font-size: 14px; color: var(--ink-light);">General & Life</div>
          </div>

        </div>
      </div>
    </section>
  `;

  let finalContent = topPartMatch[0] + '\n' + insurersHTML + '\n' + footerMatch[0];
  finalContent = finalContent.replace('<title>Cova — Simplifying insurance for every Nigerian</title>', '<title>Our Insurers — Cova</title>');
  
  fs.writeFileSync('cova-insurers.html', finalContent);
  console.log('Successfully rebuilt cova-insurers.html with the correct grid design!');
} else {
  console.log('Failed to parse index.html');
}