import os

files = [
    'cova-travel-onboarding.html',
    'cova-property-onboarding.html',
    'cova-fire-onboarding.html',
    'cova-group-onboarding.html'
]

html_inject = """
  <!-- STEP 1a: Contact Info -->
  <div class="step-panel" id="step-1a">
    <div class="step-title">Your Details</div>
    <div class="step-sub">Provide your contact info to secure your quote.</div>
    <div class="form-row">
      <div class="form-group" id="fg-fn"><label>First name</label><input type="text" id="fn" placeholder="Emeka"><div class="field-error">Required</div></div>
      <div class="form-group" id="fg-ln"><label>Last name</label><input type="text" id="ln" placeholder="Adekunle"><div class="field-error">Required</div></div>
    </div>
    <div class="form-group" id="fg-phone"><label>WhatsApp number</label><input type="tel" id="phone" placeholder="080 xxxx xxxx"><div class="field-error">Enter a valid Nigerian number</div></div>
    <div class="form-group" id="fg-email"><label>Email address</label><input type="email" id="email" placeholder="emeka@business.com"><div class="field-error">Enter a valid email</div></div>
    
    <div class="form-group">
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
    <button class="btn-primary" onclick="nextStep('1a')">Continue →</button>
    <button class="btn-secondary" onclick="prevStep('1a')">← Go back</button>
  </div>

  <!-- STEP 1b: OTP Verification -->
  <div class="step-panel" id="step-1b">
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
    <button class="btn-primary" onclick="nextStep('1b')">Verify & Continue →</button>
    <button class="btn-secondary" onclick="prevStep('1b')">← Go back</button>
  </div>
"""

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
function validateContact(){
  let ok = true;
  [['fg-fn','fn',v=>v.trim().length>1],['fg-ln','ln',v=>v.trim().length>1],
   ['fg-phone','phone',v=>v.replace(/\D/g,'').length>=10],
   ['fg-email','email',v=>/\S+@\S+\.\S+/.test(v)]
  ].forEach(([g,f,fn])=>{
    const grp=document.getElementById(g);
    const el=document.getElementById(f);
    if(grp && el) {
        if(!fn(el.value)){grp.classList.add('error');ok=false;}
        else grp.classList.remove('error');
    }
  });
  return ok;
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

next_step_inject = r"""
  if(from === 1){
    document.getElementById('step-1').classList.remove('active');
    document.getElementById('step-1a').classList.add('active');
    return;
  }
  if(from === '1a'){
    if(!validateContact()) return;
    const dest = otpMethod === 'phone' ? document.getElementById('phone').value : document.getElementById('email').value;
    const dEl = document.getElementById('otp-destination');
    if(dEl) dEl.textContent = dest;
    document.getElementById('step-1a').classList.remove('active');
    document.getElementById('step-1b').classList.add('active');
    const firstOtp = document.querySelector('#signup-otp-container input');
    if(firstOtp) firstOtp.focus();
    return;
  }
  if(from === '1b'){
    if(!validateOTP()) return;
    document.getElementById('step-1b').classList.remove('active');
    document.getElementById('step-2').classList.add('active');
    if(typeof updateProgress === 'function') updateProgress(2);
    else if(typeof goToStep === 'function') {
        currentStep = 2;
        for(let i=1; i<=6; i++) {
           let pr = document.getElementById('prog-'+i);
           if(pr){
              pr.classList.remove('active', 'done');
              if(i<2) pr.classList.add('done');
              if(i===2) pr.classList.add('active');
           }
        }
    }
    return;
  }
"""

prev_step_inject = r"""
  if(cur === '1a') {
    document.getElementById('step-1a').classList.remove('active');
    document.getElementById('step-1').classList.add('active');
    return;
  }
  if(cur === '1b') {
    document.getElementById('step-1b').classList.remove('active');
    document.getElementById('step-1a').classList.add('active');
    return;
  }
  if(cur === 2) {
    document.getElementById('step-2').classList.remove('active');
    document.getElementById('step-1b').classList.add('active');
    return;
  }
"""

import re
for f in files:
    if not os.path.exists(f): continue
    with open(f, 'r') as file:
        content = file.read()
        
    if 'id="step-1a"' in content:
        print(f"Skipping {f}, already patched")
        continue 
        
    # Replace using string replace where possible
    # Inject HTML right before step-2
    content = content.replace('<div class="step-panel" id="step-2">', html_inject + '\n  <div class="step-panel" id="step-2">')
    
    # Inject JS helpers before </script>
    content = content.replace('</script>', js_inject + '\n</script>')
    
    # nextStep
    content = re.sub(r'(function\s+nextStep\s*\([a-zA-Z0-9_]+\)\s*\{\s*)(if\s*\(!validateStep[^\n]+)?', r'\1\2' + next_step_inject, content)
    
    # prevStep
    content = re.sub(r'(function\s+prevStep\s*\((cur|current)\)\s*\{)', r'\1' + prev_step_inject.replace('cur ===', '\\2 ==='), content)
    
    # goBack
    if 'function goBack' in content:
        content = re.sub(r'(function\s+goBack\s*\(\)\s*\{)', r'\1\n  if(currentStep === "1a") { prevStep("1a"); return; }\n  if(currentStep === "1b") { prevStep("1b"); return; }', content)
    
    with open(f, 'w') as file:
        file.write(content)
    print(f"Patched {f}")
