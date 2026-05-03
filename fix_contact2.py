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
    match = re.search(r'function origNextStep\(from\)\{.*\}', content)
    if match:
        # Already renamed to origNextStep
        orig_func = match.group(0)
    else:
        match = re.search(r'function nextStep\(from\)\{.*\}', content)
        if match:
            orig_func = match.group(0)
            renamed_func = orig_func.replace('function nextStep(from){', 'function origNextStep(from){')
            content = content.replace(orig_func, renamed_func)
            orig_func = renamed_func

    # Replace existing nextStep function block if any
    content = re.sub(r'function nextStep\(from\)\{[\s\S]*?\}\n\n', '', content)
    content = re.sub(r'function nextStep\(from\)\{[\s\S]*?\}\n', '', content)
    content = re.sub(r'function nextStep\(from\)\{[\s\S]*?\}', '', content)

    # Re-inject the correct new nextStep
    new_nextStep = f"""
function nextStep(from){{
  if(from === {step_num}){{
    // Before moving to OTP, validate contact step
    // The original nextStep also validates, so let's just use it to validate but NOT route
    // Wait, original nextStep routes immediately if validation passes.
    // Instead of calling origNextStep, let's just do validateStep.
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
    // Now trigger the original nextStep logic for leaving {step_num}
    // Since origNextStep expects 'from', and it will route to {step_num+1}
    // We just call origNextStep({step_num}) and it will do the summary updates and routing!
    origNextStep({step_num});
    return;
  }}
  origNextStep(from);
}}
"""
    
    content = content.replace(orig_func, orig_func + "\n" + new_nextStep)

    with open(f, 'w') as file:
        file.write(content)
    print(f"Fixed {f}")
