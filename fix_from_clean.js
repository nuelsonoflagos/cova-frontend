const fs = require('fs');

const files = [
  'cova-motor-onboarding.html',
  'cova-health-onboarding.html',
  'cova-home-onboarding.html',
  'cova-life-onboarding.html',
  'cova-travel-onboarding.html',
  'cova-gadget-onboarding.html',
  'cova-business-onboarding.html',
  'cova-onboarding.html',
  'cova-fire-onboarding.html',
  'cova-group-onboarding.html',
  'cova-investment-onboarding.html',
  'cova-property-onboarding.html'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');

  // 1. Remove login tabs from Step 1 HTML
  content = content.replace(/<div class="form-group">\s*<label>Where should we send your verification code\?<\/label>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');

  // 2. Remove step-1b HTML block
  content = content.replace(/<!-- STEP 1b: OTP Verification -->[\s\S]*?(?=<!-- STEP 2:)/, '');
  content = content.replace(/<!-- STEP 1b: OTP Verification -->[\s\S]*?(?=<!-- STEP 1a:)/, ''); // for travel

  // 3. Add step-otp HTML block before <!-- SUCCESS -->
  const otpBlock = `
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

      <!-- SUCCESS -->`;
  content = content.replace(/<!-- SUCCESS -->/, otpBlock);

  // 4. Update the "Pay securely" button to point to handleBuyPolicy()
  content = content.replace(/<button class="btn-primary" onclick="submitPolicy\(\)">\s*Pay securely with Paystack →\s*<\/button>/, `<button class="btn-primary" onclick="handleBuyPolicy()">\n          Proceed to Payment →\n        </button>`);

  // 5. Remove `let otpMethod = "phone"; function selectOtpMethod(method) { ... }`
  content = content.replace(/let otpMethod\s*=\s*["'](?:phone|email)["'];\s*function selectOtpMethod\([^)]*\)\s*\{[\s\S]*?\n      \}(?=\n\s*function|\n\s*document|\n\s*let)/, '');

  // 6. Update validateStep to remove step === '1b'
  content = content.replace(/if\s*\(\s*step\s*===\s*['"]1b['"]\s*\)\s*\{[\s\S]*?return\s+(?:true|false);\s*\}/, '');

  // 7. Update nextStep
  content = content.replace(/if\s*\(\s*from\s*===\s*1\s*\)\s*\{[\s\S]*?\}\s*if\s*\(\s*from\s*===\s*['"]1b['"]\s*\)\s*\{[\s\S]*?\}/, `if (from === 1) { goToStep(2); return; }`);

  // 8. Update prevStep
  content = content.replace(/if\s*\(\s*current\s*===\s*['"]1b['"]\s*\)\s*\{[\s\S]*?\}/, `if (current === 'otp') {\n          document.getElementById("step-otp").classList.remove("active");\n          document.getElementById("step-6").classList.add("active");\n          currentStep = 6;\n          return;\n        }`);

  // 9. Update goBack
  content = content.replace(/if\s*\(\s*currentStep\s*===\s*['"]1b['"]\s*\)\s*prevStep\(\s*['"]1b['"]\s*\);\s*else\s*/, `if (currentStep === 'otp') { prevStep('otp'); return; }\n        `);

  // 10. Add handleBuyPolicy and verifyPurchaseOTP right before submitPolicy
  const purchaseLogic = `let phone_verified = false;
      function handleBuyPolicy() {
        if (!phone_verified) {
          const destInput = document.querySelector('input[type="tel"]'); const dest = destInput ? destInput.value : "";
          document.getElementById("otp-destination").textContent = dest;
          const s6 = document.getElementById("step-6") || document.getElementById("step-5");
          if(s6) s6.classList.remove("active");
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

      function submitPolicy() {`;
  content = content.replace(/function submitPolicy\(\)\s*\{/, purchaseLogic);

  // Fix group onboarding workmen typo
  content = content.replace(/'Workmen's Compensation'/g, '"Workmen\'s Compensation"');

  fs.writeFileSync(f, content);
  console.log('Processed', f);
});
