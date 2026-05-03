import re
import os

files_map = {
    'cova-health-onboarding.html': {'step': 2, 'email_id': 'health-email', 'phone_id': 'health-phone'},
    'cova-life-onboarding.html': {'step': 2, 'email_id': 'life-email', 'phone_id': 'life-phone'},
    'cova-investment-onboarding.html': {'step': 3, 'email_id': 'inv-email', 'phone_id': 'inv-phone'}
}

for f, config in files_map.items():
    with open(f, 'r') as file:
        content = file.read()
    
    step_num = config['step']
    email_id = config['email_id']
    phone_id = config['phone_id']
    
    # 1. We need to wrap the original nextStep in our new nextStep logic
    # Find the original nextStep line
    match = re.search(r'function nextStep\(from\)\{.*\}', content)
    if not match:
        # maybe already wrapped or formatted differently
        pass
    else:
        orig_func = match.group(0)
        # Rename original to origNextStep
        renamed_func = orig_func.replace('function nextStep(from){', 'function origNextStep(from){')
        
        # Our new nextStep
        new_nextStep = f"""
function nextStep(from){{
  if(from === {step_num}){{
    if(!validateStep(from)) return;
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
    
    // Now trigger the original nextStep logic for leaving {step_num}
    // but pass {step_num} so it populates summaries
    origNextStep({step_num});
    
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
    return;
  }}
  origNextStep(from);
}}
"""
        
        # Replace original nextStep with renamed + new nextStep
        content = content.replace(orig_func, renamed_func + "\n" + new_nextStep)
        
        # Also remove the broken injected nextStep block that was outside
        # It starts with "  if(from === 2){" and ends with "    return;\n  }"
        # Let's just use regex to remove that orphaned block
        content = re.sub(r'  if\(from === \d+\)\{.*?return;\n  \}\n', '', content, flags=re.DOTALL)
        
        # Also remove the orphaned if(from === 'Xb')
        content = re.sub(r'  if\(from === \'\d+b\'\)\{.*?return;\n  \}\n', '', content, flags=re.DOTALL)

        with open(f, 'w') as file:
            file.write(content)
        print(f"Fixed {f}")
