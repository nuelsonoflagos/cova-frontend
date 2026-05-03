import re
import os

files = [
    'cova-onboarding.html',
    'cova-motor-onboarding.html',
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
        
    submit_match = re.search(r'function (submit(?:Form|Policy))\(\)\s*\{', content)
    submit_fn = submit_match.group(1) if submit_match else "Not Found"
    
    # Try to find what element contains the total price before submit
    # Usually it's id="summary-total", "summary-price", "sum-premium", "sum-total"
    ids = re.findall(r'id="(sum(?:mary)?-[^"]*(?:total|price|premium|contribution|annual)[^"]*)"', content)
    unique_ids = list(set(ids))
    
    print(f"{f}: {submit_fn} | Possible Total IDs: {unique_ids}")
