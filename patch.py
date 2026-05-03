import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('-onboarding.html') and f not in ['cova-onboarding.html', 'cova-motor-onboarding.html']]

otp_step_html = """
  <!-- STEP 1b: OTP Verification -->
  <div class="step-panel" id="step-1b">
    <div class="step-title">Verify your contact</div>
    <div class="step-sub">We've sent a 6-digit code to your <span id="otp-destination">contact</span>.</div>

    <div class="form-group" id="fg-otp">
      <div style="display:flex;gap:10px;justify-content:space-between;margin:20px 0" class="otp-inputs" id="signup-otp-container">
        <input type="text" maxlength="1" style="width:45px;height:50px;text-align:center;font-size:20px;font-weight:700;border-radius:12px;border:1.5px solid var(--crd);background:var(--gp)" onkeyup="moveToNext(this, event)">
        <input type="text" maxlength="1" style="width:45px;height:50px;text-align:center;font-size:20px;font-weight:700;border-radius:12px;border:1.5px solid var(--crd);background:var(--gp)" onkeyup="moveToNext(this, event)">
        <input type="text" maxlength="1" style="width:45px;height:50px;text-align:center;font-size:20px;font-weight:700;border-radius:12px;border:1.5px solid var(--crd);background:var(--gp)" onkeyup="moveToNext(this, event)">
        <input type="text" maxlength="1" style="width:45px;height:50px;text-align:center;font-size:20px;font-weight:700;border-radius:12px;border:1.5px solid var(--crd);background:var(--gp)" onkeyup="moveToNext(this, event)">
        <input type="text" maxlength="1" style="width:45px;height:50px;text-align:center;font-size:20px;font-weight:700;border-radius:12px;border:1.5px solid var(--crd);background:var(--gp)" onkeyup="moveToNext(this, event)">
        <input type="text" maxlength="1" style="width:45px;height:50px;text-align:center;font-size:20px;font-weight:700;border-radius:12px;border:1.5px solid var(--crd);background:var(--gp)" onkeyup="moveToNext(this, event)">
      </div>
      <div class="field-error">Please enter the 6-digit code</div>
    </div>

    <button class="btn-primary" onclick="nextStep('1b')">Verify & Continue →</button>
    <button class="btn-secondary" onclick="prevStep('1b')">← Go back</button>
  </div>
"""

account_type_html = """
    <div class="form-group">
      <label>Are you insuring for yourself or your business?</label>
      <select id="account-type" onchange="toggleBusinessFields()">
        <option value="individual">Myself — personal</option>
        <option value="sme">My business — company</option>
      </select>
    </div>
    <div id="business-fields" style="display:none">
      <div class="form-group" id="fg-companyname">
        <label>Company name</label>
        <input type="text" id="companyname" placeholder="e.g. Cova Tech Ltd">
        <div class="field-error">Please enter your company name</div>
      </div>
      <div class="form-group" id="fg-rcnumber">
        <label>RC Number (Optional)</label>
        <input type="text" id="rcnumber" placeholder="e.g. RC 123456">
      </div>
    </div>
"""

js_methods = """
function toggleBusinessFields(){
  const type = document.getElementById('account-type')?.value;
  const bf = document.getElementById('business-fields');
  if(bf) bf.style.display = type === 'sme' ? 'block' : 'none';
}

function moveToNext(el, event) {
  if (event.key === 'Backspace') {
    if (el.previousElementSibling) el.previousElementSibling.focus();
  } else if (el.value.length === 1) {
    if (el.nextElementSibling) el.nextElementSibling.focus();
  }
}
"""

for f in html_files:
    with open(f, 'r') as file:
        content = file.read()
    
    # Simple heuristic to insert OTP step after step-2 if step-2 contains personal details, else step-1
    # Many of these files have personal details in step-2 (like health-onboarding)
    # Let's just find the personal details form and insert the account_type and otp.
    # It might be too complex for a blind regex script because each file has different IDs (e.g. health-phone, travel-phone).
"""