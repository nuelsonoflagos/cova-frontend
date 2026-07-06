const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.startsWith('cova-') && f.endsWith('-onboarding.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Remove step 1b
  const step1bRegex = /<!-- STEP 1b: OTP Verification -->[\s\S]*?(?=<!-- STEP 2:)/;
  content = content.replace(step1bRegex, '');

  // 2. Change submitPolicy to handleBuyPolicy in Step 6
  // Looking for: <button class="btn-primary" onclick="submitPolicy()">
  content = content.replace(
    /<button class="btn-primary" onclick="submitPolicy\(\)">[\s\S]*?<\/button>/,
    `<button class="btn-primary" onclick="handleBuyPolicy()">\n          Proceed to Payment →\n        </button>`
  );

  // 3. Insert STEP OTP before SUCCESS
  const otpStepHtml = `
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
  content = content.replace(/<!-- SUCCESS -->/, otpStepHtml);

  // 4. Update JavaScript
  // Change nextStep(from) logic
  content = content.replace(
    /if \(from === 1\) {[\s\S]*?return;\n        }/,
    `if (from === 1) { goToStep(2); return; }`
  );
  content = content.replace(
    /if \(from === "1b"\) {[\s\S]*?return;\n        }/,
    ``
  );
  content = content.replace(
    /if \(current === "1b"\) {[\s\S]*?return;\n        }/,
    ``
  );

  // Inject handleBuyPolicy and verifyPurchaseOTP right before submitPolicy
  const newJs = `let phone_verified = false;
      function handleBuyPolicy() {
        if (!phone_verified) {
          const destInput = document.querySelector('input[type="tel"]');
          const dest = destInput ? destInput.value : "";
          document.getElementById("otp-destination").textContent = dest;
          document.getElementById("step-6").classList.remove("active");
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
          document.getElementById("fg-otp").classList.add("error");
          return;
        }
        document.getElementById("fg-otp").classList.remove("error");
        phone_verified = true;
        document.getElementById("step-otp").classList.remove("active");
        submitPolicy();
      }

      function submitPolicy`;
  content = content.replace(/function submitPolicy/, newJs);

  // Add prevStep logic for 'otp'
  content = content.replace(
    /function prevStep\(current\) {/,
    `function prevStep(current) {
        if (current === 'otp') {
          document.getElementById("step-otp").classList.remove("active");
          document.getElementById("step-6").classList.add("active");
          currentStep = 6;
          return;
        }`
  );

  // Add goBack logic for 'otp'
  content = content.replace(
    /function goBack\(\) {/,
    `function goBack() {
        if (currentStep === 'otp') { prevStep('otp'); return; }`
  );

  fs.writeFileSync(file, content);
}

console.log('Updated all onboarding files successfully.');
