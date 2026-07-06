const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('-onboarding.html'));
files.push('cova-onboarding.html');

for (let file of new Set(files)) {
  let content = fs.readFileSync(file, 'utf8');
  console.log("Processing", file);

  // 1. Remove OTP tabs in Step 1
  content = content.replace(/<div class="form-group">\s*<label>Where should we send your verification code\?<\/label>[\s\S]*?<\/div>\s*<\/div>\s*(?=<div class="form-row">|<button)/, '');
  
  // 2. Remove step-1b or step-1a HTML completely
  content = content.replace(/<!-- STEP [123][ab]: OTP Verification -->[\s\S]*?(?=<!-- STEP \d|<div class="step-panel" id="step-\d")/, '');

  // 3. Inject step-otp before success screen
  if (!content.includes('id="step-otp"')) {
    const otpStepHTML = `
      <!-- STEP OTP: Phone Verification -->
      <div class="step-panel" id="step-otp">
        <div class="step-title">Verify your phone number</div>
        <div class="step-sub">
          Before completing your purchase, please verify your phone number. We've sent a 6-digit code to <strong id="otp-destination"></strong>.
        </div>
        <div class="form-group" id="fg-otp">
          <div style="display: flex; gap: 10px; justify-content: space-between; margin: 20px 0;" class="otp-inputs" id="purchase-otp-container">
            <input type="text" maxlength="1" style="width: 45px; height: 50px; text-align: center; font-size: 20px; font-weight: 700; border-radius: 12px; border: 1.5px solid var(--crd); background: var(--gp);" />
            <input type="text" maxlength="1" style="width: 45px; height: 50px; text-align: center; font-size: 20px; font-weight: 700; border-radius: 12px; border: 1.5px solid var(--crd); background: var(--gp);" />
            <input type="text" maxlength="1" style="width: 45px; height: 50px; text-align: center; font-size: 20px; font-weight: 700; border-radius: 12px; border: 1.5px solid var(--crd); background: var(--gp);" />
            <input type="text" maxlength="1" style="width: 45px; height: 50px; text-align: center; font-size: 20px; font-weight: 700; border-radius: 12px; border: 1.5px solid var(--crd); background: var(--gp);" />
            <input type="text" maxlength="1" style="width: 45px; height: 50px; text-align: center; font-size: 20px; font-weight: 700; border-radius: 12px; border: 1.5px solid var(--crd); background: var(--gp);" />
            <input type="text" maxlength="1" style="width: 45px; height: 50px; text-align: center; font-size: 20px; font-weight: 700; border-radius: 12px; border: 1.5px solid var(--crd); background: var(--gp);" />
          </div>
          <div class="field-error">Please enter the 6-digit code</div>
        </div>
        <button class="btn-primary" onclick="verifyPurchaseOTP()">
          Verify & Pay securely with Paystack →
        </button>
        <button class="btn-secondary" onclick="prevStep('otp')">
          ← Go back
        </button>
      </div>
`;
    content = content.replace(/<!-- SUCCESS -->/, otpStepHTML + '\n      <!-- SUCCESS -->');
  }

  // 4. Update Pay button to handleBuyPolicy
  content = content.replace(/<button class="btn-primary" onclick="submit(?:Policy|Form)\(\)">[\s\S]*?<\/button>/, '<button class="btn-primary" onclick="handleBuyPolicy()">\n          Proceed to Payment →\n        </button>');

  // C. Fix files with origNextStep pattern
  if (content.includes('function origNextStep')) {
    // Delete the interceptor nextStep completely
    content = content.replace(/function nextStep\((?:from|cur)\) \{[\s\S]*?origNextStep\((?:from|cur)\);\s*\}/, '');
    // Rename origNextStep to nextStep
    content = content.replace(/function origNextStep/, 'function nextStep');
  }

  // REWRITE NEXTSTEP AND PREVSTEP FOR EACH FILE
  // Because they are mangled, we replace everything from 'function nextStep' up to 'function goToStep'
  let customNext = '';
  if (file === 'cova-group-onboarding.html') {
    content = content.replace(/function nextStep\(from\)\{[\s\S]*?(?=function toggleBusinessFields)/, `
      function nextStep(from) {
        if (!validateStep(from)) return;
        if (from === 1) { 
          document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
          document.getElementById('step-1a').classList.add('active');
          currentStep = '1a';
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return; 
        }
        if (from === '1a') { goToStep(2); return; }
        if (from === 2) updateLivePremium();
        if (from === 4) updateSummary();
        goToStep(from + 1);
      }
      function prevStep(cur) {
        if (cur === 'otp') {
          document.getElementById("step-otp").classList.remove("active");
          document.getElementById("step-4").classList.add("active");
          currentStep = 4;
          return;
        }
        if (cur === 2) {
          document.getElementById("step-2").classList.remove("active");
          document.getElementById("step-1a").classList.add("active");
          currentStep = '1a';
          if(typeof updateProgress === 'function') updateProgress(1);
          return;
        }
        if (cur === '1a') {
          document.getElementById("step-1a").classList.remove("active");
          document.getElementById("step-1").classList.add("active");
          currentStep = 1;
          if(typeof updateProgress === 'function') updateProgress(1);
          return;
        }
        goToStep(cur - 1);
      }
      function goToStep(n) {
        document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('step-' + n).classList.add('active');
        for (let i = 1; i <= 5; i++) {
          const prog = document.getElementById('prog-' + i);
          if (prog) {
            prog.classList.remove('active', 'done');
            if (i < n) prog.classList.add('done');
            if (i === n) prog.classList.add('active');
          }
        }
        currentStep = n;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    `);
  } else if (file === 'cova-fire-onboarding.html') {
    customNext = `
      function nextStep(from) {
        if (!validateStep(from)) return;
        if (from === 1) { 
          document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
          document.getElementById('step-1a').classList.add('active');
          currentStep = '1a';
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return; 
        }
        if (from === '1a') { goToStep(2); return; }
        if (from === 4) calcPremium();
        goToStep(from + 1);
      }
      function prevStep(cur) {
        if (cur === 'otp') {
          document.getElementById("step-otp").classList.remove("active");
          document.getElementById("step-4").classList.add("active");
          currentStep = 4;
          return;
        }
        if (cur === 2) {
          document.getElementById("step-2").classList.remove("active");
          document.getElementById("step-1a").classList.add("active");
          currentStep = '1a';
          updateProgress(1);
          return;
        }
        if (cur === '1a') {
          document.getElementById("step-1a").classList.remove("active");
          document.getElementById("step-1").classList.add("active");
          currentStep = 1;
          updateProgress(1);
          return;
        }
        goToStep(cur - 1);
      }
      function goToStep`;
  } else if (file === 'cova-property-onboarding.html') {
    customNext = `
      function nextStep(from) {
        if (!validateStep(from)) return;
        if (from === 1) { 
          document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
          document.getElementById('step-1a').classList.add('active');
          currentStep = '1a';
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return; 
        }
        if (from === '1a') { goToStep(2); return; }
        if (from === 3) updatePremium();
        if (from === 4) {
          document.getElementById("summary-property-type").textContent = selectedProperty;
          document.getElementById("summary-address").textContent = document.getElementById("prop-address").value;
        }
        goToStep(from + 1);
      }
      function prevStep(cur) {
        if (cur === 'otp') {
          document.getElementById("step-otp").classList.remove("active");
          document.getElementById("step-5").classList.add("active");
          currentStep = 5;
          return;
        }
        if (cur === 2) {
          document.getElementById("step-2").classList.remove("active");
          document.getElementById("step-1a").classList.add("active");
          currentStep = '1a';
          updateProgress(1);
          return;
        }
        if (cur === '1a') {
          document.getElementById("step-1a").classList.remove("active");
          document.getElementById("step-1").classList.add("active");
          currentStep = 1;
          updateProgress(1);
          return;
        }
        goToStep(cur - 1);
      }
      function goToStep`;
  } else if (file === 'cova-travel-onboarding.html') {
    customNext = `
      function nextStep(from) {
        if (!validateStep(from)) return;
        if (from === 1) { 
          document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
          document.getElementById('step-1a').classList.add('active');
          currentStep = '1a';
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return; 
        }
        if (from === '1a') { goToStep(2); return; }
        if (from === 2) {
          renderTravellerForms();
          updateSummary();
        }
        if (from === 3) updateSummary();
        goToStep(from + 1);
      }
      function prevStep(cur) {
        if (cur === 'otp') {
          document.getElementById("step-otp").classList.remove("active");
          document.getElementById("step-4").classList.add("active");
          currentStep = 4;
          return;
        }
        if (cur === 2) {
          document.getElementById("step-2").classList.remove("active");
          document.getElementById("step-1a").classList.add("active");
          currentStep = '1a';
          updateProgress(1);
          return;
        }
        if (cur === '1a') {
          document.getElementById("step-1a").classList.remove("active");
          document.getElementById("step-1").classList.add("active");
          currentStep = 1;
          updateProgress(1);
          return;
        }
        goToStep(cur - 1);
      }
      function goToStep`;
  } else {
    // For files that are NOT completely mangled, just carefully replace nextStep and prevStep
    const matchStr = content.match(/function nextStep\((?:from|cur)\) \{[\s\S]*?(?=function goToStep)/);
    if (matchStr) {
      let inner = matchStr[0];
      inner = inner.replace(/if \((?:from|cur) === ["'][123][ab]["']\) \{[\s\S]*?return;\s*\}/g, '');
      inner = inner.replace(/if \((?:current|cur) === ["'][123][ab]["']\) \{[\s\S]*?return;\s*\}/g, '');
      // fix from===1
      inner = inner.replace(/if \((?:from|cur) === 1\) \{[\s\S]*?(?=if \((?:from|cur) === )/, 'if (from === 1) { goToStep(2); return; }\n        ');
      // in prevStep, replace current===2 to go back to 1
      inner = inner.replace(/if \((?:current|cur) === 2\) \{[\s\S]*?return;\s*\}/, `if (current === 2) {
          document.getElementById("step-2").classList.remove("active");
          document.getElementById("step-1").classList.add("active");
          updateProgress(1);
          return;
        }`);
      // add otp to prevStep
      inner = inner.replace(/function prevStep\((current|cur)\) \{/, `function prevStep($1) {\n        if ($1 === 'otp') {
          document.getElementById("step-otp").classList.remove("active");
          let lastStep = 6;
          if (document.getElementById("step-6")) lastStep = 6;
          else if (document.getElementById("step-5")) lastStep = 5;
          else if (document.getElementById("step-4")) lastStep = 4;
          else if (document.getElementById("step-3")) lastStep = 3;
          document.getElementById("step-" + lastStep).classList.add("active");
          currentStep = lastStep;
          return;
        }`);
      
      customNext = inner + 'function goToStep';
    }
  }

  if (customNext) {
    content = content.replace(/function nextStep\((?:from|cur)\) \{[\s\S]*?(?=function goToStep)function goToStep/, customNext);
  }

  // JAVASCRIPT REPLACEMENTS
  // A. Remove selectOtpMethod
  content = content.replace(/let otpMethod = ["']phone["'];\s*function selectOtpMethod\(method\) \{[\s\S]*?\}\s*(?=function toggleBusinessFields|function calcPremium|function selectType|function toggleProduct|function renderTravellerForms|function updatePremium|function calculateMotorPremium|function updateSummary|function validateContact|function setupOTPInputs)/, '');

  // B. validateStep: remove 1b/1a
  // We make it non-greedy and ONLY match up to return true inside validateStep.
  // Actually, let's just use string replacement specifically inside validateStep.
  let vMatch = content.match(/function validateStep\(step\) \{([\s\S]*?)return true;\s*\}/);
  if (vMatch) {
    let vInner = vMatch[0];
    vInner = vInner.replace(/if \((?:step|cur) === ["'][123][ab]["']\) \{[\s\S]*?return true;\s*\}/, '');
    content = content.replace(vMatch[0], vInner);
  }
  content = content.replace(/function validateContact\(\) \{[\s\S]*?return ok;\s*\}/, '');
  content = content.replace(/function validateOTP\(\) \{[\s\S]*?return true;\s*\}/, '');

  // fix single quotes syntax error in group onboarding
  if (file === 'cova-group-onboarding.html') {
    content = content.replace(/'Workmen's Compensation'/, `"Workmen's Compensation"`);
  }

  // goBack
  content = content.replace(/if \(currentStep === ["'][123][ab]["']\) \{?\s*prevStep\(["'][123][ab]["']\);\s*return;\s*\}?/g, '');
  content = content.replace(/if \(currentStep === ["'][123][ab]["']\) prevStep\(["'][123][ab]["']\);/g, '');
  content = content.replace(/function goBack\(\) \{/, "function goBack() {\n        if (currentStep === 'otp') { prevStep('otp'); return; }");

  // Inject handleBuyPolicy and verifyPurchaseOTP right before submitPolicy
  if (!content.includes('function handleBuyPolicy')) {
    const buyLogic = `
      let phone_verified = false;
      function handleBuyPolicy() {
        if (!phone_verified) {
          const destInput = document.querySelector('input[type="tel"]'); const dest = destInput ? destInput.value : "";
          document.getElementById("otp-destination").textContent = dest;
          const steps = [6, 5, 4, 3];
          for (let s of steps) {
            const el = document.getElementById("step-" + s);
            if (el && el.classList.contains("active")) {
              el.classList.remove("active");
              break;
            }
          }
          document.getElementById("step-otp").classList.add("active");
          currentStep = "otp";
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const submitFn = typeof submitPolicy === "function" ? submitPolicy : (typeof submitForm === "function" ? submitForm : null);
          if(submitFn) submitFn();
        }
      }
      function verifyPurchaseOTP() {
        let otp = "";
        document.querySelectorAll("#purchase-otp-container input").forEach((i) => (otp += i.value));
        if (otp.length < 6) {
          const fg = document.getElementById("fg-otp");
          if(fg) fg.classList.add("error");
          return;
        }
        const fg = document.getElementById("fg-otp");
        if(fg) fg.classList.remove("error");
        phone_verified = true;
        document.getElementById("step-otp").classList.remove("active");
        const submitFn = typeof submitPolicy === "function" ? submitPolicy : (typeof submitForm === "function" ? submitForm : window.submitPolicy);
        if(submitFn) submitFn();
      }

      function $1`;
    content = content.replace(/function (submit(?:Policy|Form))/, buyLogic);
  }

  let match = content.match(/<script>([\s\S]*?)<\/script>/);
  if (match) {
    try {
      require('vm').runInNewContext(match[1]);
      fs.writeFileSync(file, content);
      console.log("  Success!");
    } catch (e) {
      if (e.message.includes('document is not defined')) {
        fs.writeFileSync(file, content);
        console.log("  Success! (document undefined is expected)");
      } else {
        console.log("  Failed! Syntax error:", e.message);
        fs.writeFileSync('temp_failed_' + file + '.js', match[1]);
      }
    }
  }
}
