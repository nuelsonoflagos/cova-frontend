const fs = require('fs');
let content = fs.readFileSync('cova-about.html', 'utf8');
content = content.replace('<title>About Us — Cova</title>', '<title>Our Insurers — Cova</title>');
const mainStartRegex = /<div class="hero-central">[\s\S]*?<footer>/;
const insurersHTML = `
    <div class="hero-central" style="padding-bottom: 40px;">
      <div class="hero-tag">Our Partners</div>
      <h1 class="hero-title-central">We work with the best.</h1>
      <p class="hero-copy-central">
        Cova is an independent broker. We are connected to Nigeria's top-rated insurance providers to ensure you get the best coverage, the fastest claims, and the most reliable support.
      </p>
    </div>

    <section class="section" style="padding-top: 0;">
      <div class="container-inner" style="max-width: 1200px; margin: 0 auto;">
        <div class="insurer-grid" style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
          
          <div class="insurer-card">
            <div class="insurer-header">
              <div class="insurer-logo" style="background: var(--green-soft); display: grid; place-items: center; border-radius: 8px; font-weight: 800; color: var(--green); font-size: 10px;">AXA</div>
              <div class="insurer-name">AXA Mansard</div>
            </div>
            <div class="insurer-rating">A+ rated</div>
            <div class="insurer-rec">General, Life & Health</div>
          </div>

          <div class="insurer-card">
            <div class="insurer-header">
              <div class="insurer-logo" style="background: var(--green-soft); display: grid; place-items: center; border-radius: 8px; font-weight: 800; color: var(--green); font-size: 10px;">LWA</div>
              <div class="insurer-name">Leadway Assurance</div>
            </div>
            <div class="insurer-rating">A+ rated</div>
            <div class="insurer-rec">General & Life</div>
          </div>

          <div class="insurer-card">
            <div class="insurer-header">
              <div class="insurer-logo" style="background: var(--green-soft); display: grid; place-items: center; border-radius: 8px; font-weight: 800; color: var(--green); font-size: 10px;">AII</div>
              <div class="insurer-name">AIICO Insurance</div>
            </div>
            <div class="insurer-rating">A rated</div>
            <div class="insurer-rec">General, Life & Health</div>
          </div>

          <div class="insurer-card">
            <div class="insurer-header">
              <div class="insurer-logo" style="background: var(--green-soft); display: grid; place-items: center; border-radius: 8px; font-weight: 800; color: var(--green); font-size: 10px;">MUT</div>
              <div class="insurer-name">Mutual Benefits</div>
            </div>
            <div class="insurer-rating">A rated</div>
            <div class="insurer-rec">General & Life</div>
          </div>

          <div class="insurer-card">
            <div class="insurer-header">
              <div class="insurer-logo" style="background: var(--green-soft); display: grid; place-items: center; border-radius: 8px; font-weight: 800; color: var(--green); font-size: 10px;">CUS</div>
              <div class="insurer-name">Custodian Insurance</div>
            </div>
            <div class="insurer-rating">A+ rated</div>
            <div class="insurer-rec">General & Life</div>
          </div>

          <div class="insurer-card">
            <div class="insurer-header">
              <div class="insurer-logo" style="background: var(--green-soft); display: grid; place-items: center; border-radius: 8px; font-weight: 800; color: var(--green); font-size: 10px;">NEM</div>
              <div class="insurer-name">NEM Insurance</div>
            </div>
            <div class="insurer-rating">A rated</div>
            <div class="insurer-rec">General Insurance</div>
          </div>

          <div class="insurer-card">
            <div class="insurer-header">
              <div class="insurer-logo" style="background: var(--green-soft); display: grid; place-items: center; border-radius: 8px; font-weight: 800; color: var(--green); font-size: 10px;">COR</div>
              <div class="insurer-name">Cornerstone Insurance</div>
            </div>
            <div class="insurer-rating">A rated</div>
            <div class="insurer-rec">General & Life</div>
          </div>

          <div class="insurer-card">
            <div class="insurer-header">
              <div class="insurer-logo" style="background: var(--green-soft); display: grid; place-items: center; border-radius: 8px; font-weight: 800; color: var(--green); font-size: 10px;">LIN</div>
              <div class="insurer-name">Linkage Assurance</div>
            </div>
            <div class="insurer-rating">A rated</div>
            <div class="insurer-rec">General Insurance</div>
          </div>

          <div class="insurer-card">
            <div class="insurer-header">
              <div class="insurer-logo" style="background: var(--green-soft); display: grid; place-items: center; border-radius: 8px; font-weight: 800; color: var(--green); font-size: 10px;">HEI</div>
              <div class="insurer-name">Heirs Insurance</div>
            </div>
            <div class="insurer-rating">A rated</div>
            <div class="insurer-rec">General & Life</div>
          </div>

          <div class="insurer-card">
            <div class="insurer-header">
              <div class="insurer-logo" style="background: var(--green-soft); display: grid; place-items: center; border-radius: 8px; font-weight: 800; color: var(--green); font-size: 10px;">ZEN</div>
              <div class="insurer-name">Zenith Insurance</div>
            </div>
            <div class="insurer-rating">A rated</div>
            <div class="insurer-rec">General Insurance</div>
          </div>

          <div class="insurer-card">
            <div class="insurer-header">
              <div class="insurer-logo" style="background: var(--green-soft); display: grid; place-items: center; border-radius: 8px; font-weight: 800; color: var(--green); font-size: 10px;">SOV</div>
              <div class="insurer-name">Sovereign Trust</div>
            </div>
            <div class="insurer-rating">A rated</div>
            <div class="insurer-rec">General Insurance</div>
          </div>

          <div class="insurer-card">
            <div class="insurer-header">
              <div class="insurer-logo" style="background: var(--green-soft); display: grid; place-items: center; border-radius: 8px; font-weight: 800; color: var(--green); font-size: 10px;">REL</div>
              <div class="insurer-name">Reliance HMO</div>
            </div>
            <div class="insurer-rating">A rated</div>
            <div class="insurer-rec">Health Insurance</div>
          </div>

          <div class="insurer-card">
            <div class="insurer-header">
              <div class="insurer-logo" style="background: var(--green-soft); display: grid; place-items: center; border-radius: 8px; font-weight: 800; color: var(--green); font-size: 10px;">HYG</div>
              <div class="insurer-name">Hygeia HMO</div>
            </div>
            <div class="insurer-rating">A+ rated</div>
            <div class="insurer-rec">Health Insurance</div>
          </div>

          <div class="insurer-card">
            <div class="insurer-header">
              <div class="insurer-logo" style="background: var(--green-soft); display: grid; place-items: center; border-radius: 8px; font-weight: 800; color: var(--green); font-size: 10px;">LWH</div>
              <div class="insurer-name">Leadway Health</div>
            </div>
            <div class="insurer-rating">A+ rated</div>
            <div class="insurer-rec">Health Insurance</div>
          </div>

          <div class="insurer-card">
            <div class="insurer-header">
              <div class="insurer-logo" style="background: var(--green-soft); display: grid; place-items: center; border-radius: 8px; font-weight: 800; color: var(--green); font-size: 10px;">COR</div>
              <div class="insurer-name">Coronation Insurance</div>
            </div>
            <div class="insurer-rating">A rated</div>
            <div class="insurer-rec">General & Life</div>
          </div>

        </div>
      </div>
    </section>
    <footer>`;
content = content.replace(mainStartRegex, insurersHTML);
fs.writeFileSync('cova-insurers.html', content);