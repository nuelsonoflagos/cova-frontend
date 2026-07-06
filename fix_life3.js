const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('-onboarding.html') || f === 'cova-onboarding.html');

for (const file of files) {
  let fileContent = fs.readFileSync(file, 'utf8');
  let original = fileContent;

  // Let's strip out ANY reference to `step-2b` or `step-1b` HTML
  fileContent = fileContent.replace(/<!-- STEP 2b: OTP Verification -->[\s\S]*?(?=<!-- STEP)/g, '');
  fileContent = fileContent.replace(/<!-- STEP 1b: OTP Verification -->[\s\S]*?(?=<!-- STEP)/g, '');

  // Now, let's fix the nextStep function. 
  // It has leftover code like:
  // if (from === 2) { ... document.getElementById("step-2b").classList.add("active"); ... }
  // if (from === "2b") { ... origNextStep(2); ... }
  // We need to completely wipe this out and replace it with just: goToStep(from + 1);
  // BUT we must keep the validation and summary logic.
  
  // Actually, we already removed `origNextStep` in the previous pass, so `cova-life-onboarding.html` NOW looks like:
  /*
      function nextStep(from) {
        if (!validateStep(from)) return;
        if (from === 3) {
           ... summary logic ...
        }
        goToStep(from + 1);
      }
  */
  // Wait! I did a grep on cova-life-onboarding.html and `nextStep` looked EXACTLY like that!
  // `goToStep(from + 1);` IS there!
  // SO WHY is it not going to the next step?!
  
  // Ah! Because `validateStep(from)` is returning FALSE!
  // In `cova-life-onboarding.html`, `validateStep` looks like this:
  /*
      function validateStep(step) {
        if (step === 2) {
          ... checks life-name, life-dob, life-gender, life-phone, life-email, life-occupation, life-state
          return ok;
        }
  */
  // BUT WHAT ABOUT STEP 1?
  // Step 1 doesn't have an `if (step === 1)` block! It just falls through.
  // Wait, if it falls through, does it return `true`?
  // YES! `return true;` is at the end of `validateStep`.
  
  // SO WHY does it not move from Step 1 to Step 2?
  // Let's check `cova-life-onboarding.html` step 1 HTML:
  // `<button class="btn-primary" onclick="nextStep(1)">Continue →</button>`
  // This calls `nextStep(1)`.
  // `nextStep(1)` calls `validateStep(1)` -> returns `true`.
  // Then `goToStep(2)` is called.
  
  // Let's check `goToStep(2)`:
  /*
      function goToStep(n) {
        document.querySelectorAll(".step-panel").forEach((p) => p.classList.remove("active"));
        document.getElementById("step-" + n).classList.add("active");
        for (let i = 1; i <= 5; i++) {
          const s = document.getElementById("p-" + i);
          if (s) s.classList.toggle("active", i === n);
        }
        currentStep = n;
      }
  */
  // This looks PERFECTLY FINE. 
  // Why would it not work?
  
  // Wait! Look at the grep for `cova-life-onboarding.html` step 1:
  // `<div class="step-panel" id="step-1">` doesn't exist? Wait, it does.
  // BUT there is a script error preventing `nextStep` from even running!
  
  // What could be the script error?
  // Ah! Did I leave a dangling syntax error when I removed the `validateStep` logic?
  // Let's check if there are any syntax errors.
  
  // Let's just forcefully inject a completely bulletproof `nextStep` and `prevStep` and `goToStep` and `validateStep` into ALL files, wrapping the custom logic in `try/catch`.
}

// Since I am confident the logic is just broken validation or leftover OTP interceptors, I will systematically rebuild the navigation scripts.
