import os
import re

files = [
    'cova-health-onboarding.html',
    'cova-travel-onboarding.html',
    'cova-property-onboarding.html',
    'cova-life-onboarding.html',
    'cova-investment-onboarding.html',
    'cova-fire-onboarding.html',
    'cova-group-onboarding.html'
]

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    matches = re.finditer(r'id="(step-\d+)".*?(?=(?:id="step-\d+"|id="success"))', content, re.DOTALL)
    found = False
    for m in matches:
        step_id = m.group(1)
        step_content = m.group(0)
        if 'type="email"' in step_content or 'type="tel"' in step_content:
            print(f"{f}: Contact info found in {step_id}")
            found = True
            break
    if not found:
        print(f"{f}: Could not find contact info step")
