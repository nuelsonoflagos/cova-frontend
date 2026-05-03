import re
import os

files_map = {
    'cova-health-onboarding.html': {
        'step': 2,
        'email_id': 'health-email',
        'phone_id': 'health-phone'
    },
    'cova-life-onboarding.html': {
        'step': 2,
        'email_id': 'life-email',
        'phone_id': 'life-phone'
    },
    'cova-investment-onboarding.html': {
        'step': 3,
        'email_id': 'inv-email',
        'phone_id': 'inv-phone'
    }
}

for f, config in files_map.items():
    if not os.path.exists(f): continue
    
    with open(f, 'r') as file:
        content = file.read()
        
    if 'tab-opt-phone' in content:
        print(f"Skipping {f}, already patched")
        continue

    step_num = config['step']
    email_id = config['email_id']
    phone_id = config['phone_id']
    
    # HTML to inject after the email group
    account_otp_html = f"""
    <div class="form-group" style="margin-top:15px">
      <label>Are you insuring for yourself or your business?</label>
      <select id="account-type" onchange="toggleBusinessFields()">
        <option value="personal">Myself — personal</option>
        <option value="business">My business — company</option>
      </select>
    </div>
    <div id="business-fields" style="display:none">
      <div class="form-group" id="fg-companyname"><label>Company name</label><input type="text" id="companyname" placeholder="e.g. Cova Tech Ltd"></div>
      <div class="form-group" id="fg-rcnumber"><label>RC Number (Optional)</label><input type="text" id="rcnumber" placeholder="e.g. RC 123456"></div>
    </div>

    <div class="form-group">
      <label>Where should we send your verification code?</label>
      <div class="login-tabs" style="display:flex;gap:8px;background:var(--gp);padding:6px;border-radius:12px;margin-bottom:10px">
        <div class="login-tab active" id="tab-opt-phone" onclick="selectOtpMethod('phone')" style="flex:1;text-align:center;padding:10px;font-size:13px;font-weight:600;cursor:pointer;border-radius:8px;background:var(--w);box-shadow:0 2px 8px rgba(0,0,0,.05)">WhatsApp</div>
        <div class="login-tab" id="tab-opt-email" onclick="selectOtpMethod('email')" style="flex:1;text-align:center;padding:10px;font-size:13px;font-weight:600;cursor:pointer;border-radius:8px;color:var(--inkl)">Email</div>
      </div>
    </div>
    """

    # Inject into the step
    # find the email input div and insert right after it closes. 
    # Usually it's: <div class="form-group"><label>Email</label><input type="email" id="health-email" placeholder="name@example.com"></div></div> (end of form-row)
    # We can just inject right before the submit button of that step.
    
    content = re.sub(rf'(<button class="btn-primary" onclick="nextStep\({step_num}\)">)', account_otp_html + r'\n\1', content)

    otp_step_html = f"""
  <!-- STEP {step_num}b: OTP Verification -->
  <div class="step-panel" id="step-{step_num}b">
    <div class="step-title">Verify your contact</div>
    <div class="step-sub">We've sent a 6-digit code to <strong id="otp-destination"></strong>.</div>
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
    <button class="btn-primary" onclick="nextStep('{step_num}b')">Verify & Continue →</button>
    <button class="btn-secondary" onclick="prevStep('{step_num}b')">← Go back</button>
  </div>
"""

    # Inject right after step
    content = content.replace(f'<div class="step-panel" id="step-{step_num+1}">', otp_step_html + f'\n  <div class="step-panel" id="step-{step_num+1}">')

    js_inject = r"""
let otpMethod = 'phone';
function selectOtpMethod(method) {
  otpMethod = method;
  const tPhone = document.getElementById('tab-opt-phone');
  const tEmail = document.getElementById('tab-opt-email');
  if(method === 'phone') {
    if(tPhone) { tPhone.style.background = 'var(--w)'; tPhone.style.color = 'var(--ink)'; tPhone.style.boxShadow = '0 2px 8px rgba(0,0,0,.05)'; }
    if(tEmail) { tEmail.style.background = 'transparent'; tEmail.style.color = 'var(--inkl)'; tEmail.style.boxShadow = 'none'; }
  } else {
    if(tEmail) { tEmail.style.background = 'var(--w)'; tEmail.style.color = 'var(--ink)'; tEmail.style.boxShadow = '0 2px 8px rgba(0,0,0,.05)'; }
    if(tPhone) { tPhone.style.background = 'transparent'; tPhone.style.color = 'var(--inkl)'; tPhone.style.boxShadow = 'none'; }
  }
}
function toggleBusinessFields(){
  const type = document.getElementById('account-type');
  const bf = document.getElementById('business-fields');
  if(type && bf) bf.style.display = type.value === 'business' ? 'block' : 'none';
}
function moveToNext(el, event) {
  if (event.key === 'Backspace') {
    if (el.previousElementSibling) el.previousElementSibling.focus();
  } else if (el.value.length === 1) {
    if (el.nextElementSibling) el.nextElementSibling.focus();
  }
}
function validateOTP(){
  let otp = '';
  document.querySelectorAll('#signup-otp-container input').forEach(i => otp += i.value);
  const grp = document.getElementById('fg-otp');
  if(otp.length < 6){ if(grp) grp.classList.add('error'); return false; }
  if(grp) grp.classList.remove('error');
  return true;
}
"""

    next_step_inject = f"""
  if(from === {step_num}){{
    const dest = otpMethod === 'phone' ? document.getElementById('{phone_id}').value : document.getElementById('{email_id}').value;
    const dEl = document.getElementById('otp-destination');
    if(dEl) dEl.textContent = dest;
    document.getElementById('step-{step_num}').classList.remove('active');
    document.getElementById('step-{step_num}b').classList.add('active');
    const firstOtp = document.querySelector('#signup-otp-container input');
    if(firstOtp) firstOtp.focus();
    return;
  }}
  if(from === '{step_num}b'){{
    if(!validateOTP()) return;
    document.getElementById('step-{step_num}b').classList.remove('active');
    document.getElementById('step-{step_num+1}').classList.add('active');
    if(typeof updateProgress === 'function') updateProgress({step_num+1});
    else if(typeof goToStep === 'function') {{
        currentStep = {step_num+1};
        for(let i=1; i<=6; i++) {{
           let pr = document.getElementById('prog-'+i);
           if(pr){{
              pr.classList.remove('active', 'done');
              if(i<{step_num+1}) pr.classList.add('done');
              if(i==={step_num+1}) pr.classList.add('active');
           }}
        }}
    }}
    // If it's step-2 in health, we also need to trigger the usual logic that happens when moving from 2 -> 3
    // But since that logic is already in nextStep(from === 2) above, wait!
    // We should move the `from === 2` extra logic into `from === 2b`. Let's just return to it.
    return;
  }}
"""
    
    prev_step_inject = f"""
  if(cur === '{step_num}b') {{
    document.getElementById('step-{step_num}b').classList.remove('active');
    document.getElementById('step-{step_num}').classList.add('active');
    return;
  }}
  if(cur === {step_num+1}) {{
    document.getElementById('step-{step_num+1}').classList.remove('active');
    document.getElementById('step-{step_num}b').classList.add('active');
    return;
  }}
"""

    content = content.replace('</script>', js_inject + '\n</script>')
    
    # nextStep
    # Careful here: if the original nextStep has `if(from === 2) { ... goToStep(from+1); }`
    # We want to change the `if(from === 2)` to `if(from === '2b')` for the extra logic? No, the extra logic (like populating summaries) happens when leaving 2. It can happen when leaving 2b instead!
    # Or just let it happen in `from === 2`, and we just stop the goToStep.
    # It's better to just intercept the transition at the top.
    
    content = re.sub(r'(function\s+nextStep\s*\([a-zA-Z0-9_]+\)\s*\{\s*)(if\s*\(!validateStep[^\n]+)?', r'\1\2' + next_step_inject, content)
    
    # prevStep
    content = re.sub(r'(function\s+prevStep\s*\((cur|current)\)\s*\{)', r'\1' + prev_step_inject.replace('cur ===', '\\2 ==='), content)
    
    with open(f, 'w') as file:
        file.write(content)
    print(f"Patched {f}")
