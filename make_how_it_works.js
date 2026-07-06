const fs = require('fs');

let content = fs.readFileSync('cova-how-it-works.html', 'utf8');

// Replace Title
content = content.replace(/<title>Contact Us — Cova<\/title>/, '<title>How it works — Cova</title>');

// Replace active nav
content = content.replace(/<a class="nav-link" href="cova-contact.html">Contact us<\/a>/, '<a class="nav-link" href="cova-contact.html">Contact us</a>');

// Replace Hero section
const oldHero = /<section class="hero-split"[\s\S]*?<\/section>/;
const newHero = `<section class="hero-split" style="min-height: 50vh">
      <div class="hero-left">
        <div class="hero-tag">HOW IT WORKS</div>
        <h1 class="hero-title-split">A simple broker experience.</h1>
        <p class="hero-copy-split">
          Answer a few questions, compare multiple insurers, buy online, and
          claim on WhatsApp with a dedicated handler.
        </p>
      </div>
      <div class="hero-right">
        <div
          class="shape-img img-1"
          style="background-image: url('img-1.jpg'); top: 20px"
        ></div>
      </div>
    </section>`;
content = content.replace(oldHero, newHero);

// Replace the green section
const oldGreenSection = /<section class="section section-green">[\s\S]*?<\/section>/;
const newGreenSection = `<section class="section section-green" id="how">
      <div class="container-inner" style="max-width: 1080px">
        <div class="how-grid">
          <div class="how-card">
            <div class="how-step">Step 1</div>
            <div class="how-title">Tell us what you need</div>
            <div class="how-desc">
              Share your details and risk profile so Cova can compare the best
              policies.
            </div>
          </div>
          <div class="how-card">
            <div class="how-step">Step 2</div>
            <div class="how-title">Compare top insurers</div>
            <div class="how-desc">
              We review multiple quotes and recommend the strongest cover.
            </div>
          </div>
          <div class="how-card">
            <div class="how-step">Step 3</div>
            <div class="how-title">Buy in minutes</div>
            <div class="how-desc">
              Choose payment terms and get your policy issued instantly online.
            </div>
          </div>
          <div class="how-card">
            <div class="how-step">Step 4</div>
            <div class="how-title">Claim on WhatsApp</div>
            <div class="how-desc">
              Send a message to your handler, and we manage the claim end to
              end.
            </div>
          </div>
        </div>
      </div>
    </section>`;
content = content.replace(oldGreenSection, newGreenSection);

fs.writeFileSync('cova-how-it-works.html', content);
console.log('Done');