const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('-onboarding.html'));
files.push('cova-onboarding.html');

for (let file of new Set(files)) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  console.log("Processing", file);

  // 1. Remove OTP tabs in Step 1
  content = content.replace(/<div class="form-group">\s*<label>Where should we send your verification code\?<\/label>[\s\S]*?<\/div>\s*<\/div>\s*<div class="form-row">/, '<div class="form-row">');
  
  // 2. Remove step-1b or step-1a HTML
  content = content.replace(/<!-- STEP 1[ab]: OTP Verification -->[\s\S]*?(?=<!-- STEP 2)/, '');

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
  content = content.replace(/<button class="btn-primary" onclick="submitPolicy\(\)">[\s\S]*?<\/button>/, '<button class="btn-primary" onclick="handleBuyPolicy()">\n          Proceed to Payment →\n        </button>');

  // --- JAVASCRIPT REPLACEMENTS ---
  
  // FIX PRE-EXISTING SYNTAX ERROR in cova-fire, cova-property, cova-travel
  // They have:
  // function nextStep(from) { ... goToStep(from + 1); }
  // if (from === 1) { ... }
  if (content.includes('function nextStep(from) {') && content.includes('if (from === 1) {')) {
    // Remove the bad closing brace before `if (from === 1)`
    content = content.replace(/goToStep\(from \+ 1\);\s*\}\s*if \(from === 1\)/, 'goToStep(from + 1);\n      }\n      function _temp_unused() { if (from === 1)');
  }
  
  // A. Remove selectOtpMethod
  content = content.replace(/let otpMethod = "phone";\s*function selectOtpMethod\(method\) \{[\s\S]*?\}\s*(?=function toggleBusinessFields|function calcPremium|function selectType|function toggleProduct|function renderTravellerForms|function updatePremium)/, '');

  // B. validateStep: remove 1b/1a
  content = content.replace(/if \((?:step|cur) === ["']1[ab]["']\) \{[\s\S]*?return true;\s*\}/, '');
  // for travel:
  content = content.replace(/function validateContact\(\) \{[\s\S]*?return true;\s*\}/, '');

  // C. nextStep rewriting
  // Instead of complex regex, let's just find the nextStep function and replace it cleanly!
  let nextStepMatch = content.match(/function nextStep\((from|cur)\) \{([\s\S]*?)(?=function prevStep)/);
  if (nextStepMatch) {
    let inner = nextStepMatch[2];
    // Remove any step 1b/1a logic
    inner = inner.replace(/if \((?:from|cur) === ["']1[ab]["']\) \{[\s\S]*?return;\s*\}/, '');
    inner = inner.replace(/if \((?:from|cur) === 1\) \{[\s\S]*?return;\s*\}/, '');
    inner = inner.replace(/function _temp_unused\(\) \{[\s\S]*?return;\s*\}/, ''); // cleanup the temp
    inner = inner.replace(/if \((?:from|cur) === ["']1[ab]["']\) \{[\s\S]*?return;\s*\}/g, ''); // double check

    // Add standard step 1 -> 2 navigation
    let newInner = `\n        if (!validateStep(${nextStepMatch[1]})) return;\n        if (${nextStepMatch[1]} === 1) { goToStep(2); return; }` + 
                   inner.replace(/if \(!validateStep\((?:from|cur)\)\) return;/, '');
    
    // clean up any stray brackets at the end of newInner
    newInner = newInner.replace(/\}\s*\}\s*$/, '}');
    newInner = newInner.replace(/\}\s*$/, ''); // we will add the closing bracket ourselves

    // Just replace the whole thing safely
    content = content.replace(nextStepMatch[0], `function nextStep(${nextStepMatch[1]}) {${newInner}\n      }\n      `);
  }

  // D. prevStep: remove 1b/1a and add otp
  content = content.replace(/if \((?:current|cur) === ["']1[ab]["']\) \{[\s\S]*?return;\s*\}/, `if (current === 'otp') {
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
  
  // also clean up any remaining step 1b to 1a in prevStep
  content = content.replace(/if \((?:current|cur) === ["']1b["']\) \{[\s\S]*?return;\s*\}/, '');

  // fix prevStep back to step 1
  content = content.replace(/if \((?:current|cur) === 2\) \{[\s\S]*?return;\s*\}/, `if (current === 2) {
          document.getElementById("step-2").classList.remove("active");
          document.getElementById("step-1").classList.add("active");
          updateProgress(1);
          return;
        }`);

  // E. goBack: fix 1b/1a and add otp
  content = content.replace(/if \(currentStep === ["']1[ab]["']\) prevStep\(["']1[ab]["']\);/, `if (currentStep === 'otp') { prevStep('otp'); return; }`);
  // If there's another one:
  content = content.replace(/if \(currentStep === ["']1[ab]["']\) \{\s*prevStep\(["']1[ab]["']\);\s*return;\s*\}/g, ``);

  // F. Inject handleBuyPolicy and verifyPurchaseOTP right before submitPolicy
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
          submitPolicy();
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
        submitPolicy();
      }

      function submitPolicy`;
    content = content.replace(/function submitPolicy/, buyLogic);
  }

  // Final sweep to remove stray code from the original bad commits
  content = content.replace(/if \(from === ["']1a["']\) \{[\s\S]*?firstOtp\.focus\(\);\s*return;\s*\}/, '');
  content = content.replace(/if \(cur === ["']1b["']\) \{[\s\S]*?return;\s*\}/g, '');
  content = content.replace(/if \(cur === ["']1a["']\) \{[\s\S]*?return;\s*\}/g, '');
  content = content.replace(/if \(from === ["']1b["']\) \{[\s\S]*?return;\s*\}/g, '');
  content = content.replace(/if \(from === 1\) \{[\s\S]*?firstOtp\.focus\(\);\s*return;\s*\}/g, '');

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
