const fs = require('fs');

let content = fs.readFileSync('cova-life-onboarding.html', 'utf8');

// Looking at cova-life-onboarding.html:
// Step 1: "Choose your life plan". Next button probably calls nextStep(1).
// But `validateStep` only checks `step === 2`. If step is 1, it just returns true!
// So validateStep(1) returns true. nextStep(1) calls goToStep(2).
// Wait, is there a bug in `goToStep` or `nextStep`?
// In `cova-life-onboarding.html`:
/*
      function nextStep(from) {
        if (!validateStep(from)) return;
        if (from === 3) {
...
        }
        goToStep(from + 1);
      }
*/
// Does nextStep(1) work?
// Ah! In `cova-life-onboarding.html`, when you select a plan, what does the button say?
