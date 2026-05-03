import os
import re

files = [f for f in os.listdir('.') if f.endswith('-onboarding.html') and f not in ['cova-onboarding.html', 'cova-motor-onboarding.html']]

for f in files:
    with open(f, 'r') as file:
        content = file.read()
        
    print(f"\n--- {f} ---")
    
    # Find where 'name' or 'email' is collected
    step_match = re.search(r'id="step-(\d+)".*?(?:name|email|Name|Email)', content, re.IGNORECASE | re.DOTALL)
    if step_match:
        print(f"Personal info appears to be in step-{step_match.group(1)}")
    else:
        print("Could not detect personal info step")
        
    # Find nextStep function
    ns_match = re.search(r'function nextStep.*?{.*?}', content, re.DOTALL)
    if ns_match:
        print("Has nextStep function")
