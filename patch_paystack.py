import re
import os

files_config = {
    'cova-onboarding.html': {
        'product': 'DEVICE',
        'submit_fn': 'submitPolicy',
        'amount_id': 'sum-price',
        'email_id': 'email',
        'phone_id': 'phone'
    },
    'cova-motor-onboarding.html': {
        'product': 'MOTOR',
        'submit_fn': 'submitPolicy',
        'amount_id': 'sum-price',
        'email_id': 'email',
        'phone_id': 'phone'
    },
    'cova-health-onboarding.html': {
        'product': 'HEALTH',
        'submit_fn': 'submitForm',
        'amount_id': 'summary-price',
        'email_id': 'health-email',
        'phone_id': 'health-phone'
    },
    'cova-travel-onboarding.html': {
        'product': 'TRAVEL',
        'submit_fn': 'submitForm',
        'amount_id': 'summary-price',
        'email_id': 'email',
        'phone_id': 'phone',
        'one_time': True
    },
    'cova-property-onboarding.html': {
        'product': 'PROPERTY',
        'submit_fn': 'submitForm',
        'amount_id': 'summary-total',
        'email_id': 'email',
        'phone_id': 'phone'
    },
    'cova-life-onboarding.html': {
        'product': 'LIFE',
        'submit_fn': 'submitForm',
        'amount_id': 'sum-premium',
        'email_id': 'life-email',
        'phone_id': 'life-phone'
    },
    'cova-investment-onboarding.html': {
        'product': 'INVESTMENT',
        'submit_fn': 'submitForm',
        'amount_id': 'summary-monthly',
        'email_id': 'inv-email',
        'phone_id': 'inv-phone'
    },
    'cova-fire-onboarding.html': {
        'product': 'FIRE',
        'submit_fn': 'submitForm',
        'amount_id': 'summary-total',
        'email_id': 'email',
        'phone_id': 'phone'
    },
    'cova-group-onboarding.html': {
        'product': 'GROUP',
        'submit_fn': 'submitForm',
        'amount_id': 'summary-premium',
        'email_id': 'email',
        'phone_id': 'phone'
    }
}

def patch_file(f, conf):
    with open(f, 'r') as file:
        content = file.read()
        
    # Inject Meta Tag
    if 'id="paystack-key"' not in content:
        content = content.replace('</head>', '  <meta id="paystack-key" content="pk_test_mock_key_12345">\n</head>')
        
    # Inject Inline JS from jsdelivr
    if 'inline.min.js' not in content:
        content = content.replace('</body>', '  <script src="https://cdn.jsdelivr.net/npm/@paystack/inline-js/dist/inline.min.js"></script>\n</body>')
        
    # Build custom submit function
    one_time = conf.get('one_time', False)
    plan_logic = "// One-time payment" if one_time else "config.plan = 'PLN_mock123';"
    
    paystack_logic = f"""
function {conf['submit_fn']}(){{
  const emailEl = document.getElementById('{conf['email_id']}');
  const phoneEl = document.getElementById('{conf['phone_id']}');
  const amountEl = document.getElementById('{conf['amount_id']}');
  
  const email = emailEl ? emailEl.value : 'user@example.com';
  const phone = phoneEl ? phoneEl.value : '08000000000';
  let amountStr = '0';
  if(amountEl) amountStr = amountEl.textContent.replace(/[^0-9]/g, '');
  if(!amountStr) amountStr = '1000'; // fallback
  
  const amountKobo = parseInt(amountStr, 10) * 100;
  
  const pkMeta = document.getElementById('paystack-key');
  const pk = pkMeta ? pkMeta.content : 'pk_test_mock_key_12345';
  
  // Use global PaystackPop or window.PaystackPop
  const popup = new PaystackPop();
  const config = {{
    key: pk,
    email: email,
    amount: amountKobo,
    currency: 'NGN',
    ref: 'COVA-{conf['product']}-' + Date.now(),
    metadata: {{
      custom_fields: [
        {{ display_name: "Product Type", variable_name: "product_type", value: "{conf['product']}" }},
        {{ display_name: "Customer Phone", variable_name: "customer_phone", value: phone }}
      ]
    }},
    onSuccess: function(response) {{
      localStorage.setItem('cova_last_ref', response.reference);
      document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
      const successEl = document.getElementById('success');
      if(successEl) successEl.classList.add('active');
      window.scrollTo({{top:0, behavior:'smooth'}});
    }},
    onCancel: function() {{
      const t = document.createElement('div');
      t.textContent = 'Payment cancelled';
      t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--crd);color:white;padding:12px 24px;border-radius:8px;z-index:9999;font-weight:600;';
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 3000);
    }}
  }};
  
  {plan_logic}
  
  popup.setup(config);
  popup.openIframe();
}}
"""
    
    # We want to replace the ENTIRE existing submitForm() or submitPolicy() function.
    # Because they might span multiple lines and contain logic.
    # The safest way is to find `function submitForm(){` and replace until `function ` or `let ` or `</script>`
    
    fn_name = conf['submit_fn']
    
    # Remove old function
    pattern = rf'function\s+{fn_name}\(\)\s*\{{[\s\S]*?(?=\nfunction |\n</script>|\nlet )'
    content = re.sub(pattern, '', content)
    
    # Inject new function right before </script>
    content = content.replace('</script>', paystack_logic + '\n</script>')
    
    with open(f, 'w') as file:
        file.write(content)

for f, conf in files_config.items():
    if os.path.exists(f):
        patch_file(f, conf)
        print(f"Patched {f}")
