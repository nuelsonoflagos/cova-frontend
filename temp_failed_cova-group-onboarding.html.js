
      let currentStep=1;
      const productState={groupLife:true,workmen:false,gpa:false};
      let multiplier=3;let riders={spouse:false,children:false};
      let selectedInsurer='AIICO';
      function goBack(){
        if(currentStep === "1a") { prevStep("1a"); return; }
        if(currentStep === "1b") { prevStep("1b"); return; }if(currentStep>1)prevStep(currentStep);else window.history.back();}
      function toggleProduct(key){productState[key]=!productState[key];const card=document.getElementById('prod-'+key.replace(/([A-Z])/g,'-$1').toLowerCase());card.classList.toggle('selected',productState[key]);updateBundleNote();updateLivePremium();}
      function updateBundleNote(){const selected=Object.values(productState).filter(Boolean).length;document.getElementById('bundle-note').style.display=selected>1?'flex':'none';}
      function selectMultiplier(value){multiplier=value;['mult-2','mult-3','mult-4'].forEach(id=>document.getElementById(id).classList.toggle('selected',id==='mult-'+value));document.getElementById('summary-multiplier').textContent=value+'x salary';updateSummary();}
      function toggleRider(name){riders[name]=!riders[name];document.getElementById('rider-'+name).classList.toggle('selected',riders[name]);updateSummary();}
      function selectInsurer(name){selectedInsurer=name;['ins-1','ins-2','ins-3'].forEach(id=>document.getElementById(id).classList.toggle('selected',document.getElementById(id).id==='ins-'+(name==='AIICO'?'1':name==='Leadway'?'2':'3')));document.getElementById('summary-insurer').textContent=name;}
      function parseNumber(id){return Math.max(0,parseFloat(document.getElementById(id).value)||0);}
      function updateLivePremium(){const payroll=parseNumber('annual-payroll');const life=productState.groupLife?payroll*0.005:0;const workmen=productState.workmen?payroll*0.01:0;const gpa=productState.gpa?payroll*0.003:0;document.getElementById('live-life').textContent='₦'+Math.round(life).toLocaleString('en-NG');document.getElementById('live-workmen').textContent='₦'+Math.round(workmen).toLocaleString('en-NG');document.getElementById('live-gpa').textContent='₦'+Math.round(gpa).toLocaleString('en-NG');document.getElementById('live-total').textContent='₦'+Math.round(life+workmen+gpa).toLocaleString('en-NG');updateSummary();}
      function updateSummary(){const payroll=parseNumber('annual-payroll');const life=productState.groupLife?payroll*0.005:0;const workmen=productState.workmen?payroll*0.01:0;const gpa=productState.gpa?payroll*0.003:0;const total=Math.round(life+workmen+gpa);document.getElementById('summary-payroll').textContent='₦'+Math.round(payroll).toLocaleString('en-NG');document.getElementById('summary-premium').textContent='₦'+total.toLocaleString('en-NG');document.getElementById('summary-riders').textContent=(riders.spouse||riders.children)?Object.keys(riders).filter(k=>riders[k]).map(k=>k.charAt(0).toUpperCase()+k.slice(1)).join(', '):'None';document.getElementById('summary-insurer').textContent=selectedInsurer;document.getElementById('summary-company').textContent=document.getElementById('company-name').value||'—';document.getElementById('summary-employees').textContent=document.getElementById('employee-count').value||0;document.getElementById('summary-products').textContent=Object.entries(productState).filter(([_,v])=>v).map(([k])=>k==='groupLife'?'Group Life':k==='workmen'?"Workmen's Compensation":'Group Personal Accident').join(', ')||'None';document.getElementById('summary-annual').textContent='₦'+total.toLocaleString('en-NG');updateMonthly();}
      function updateMonthly(){const total=parseNumber('summary-value')||0; const annual=Number(document.getElementById('summary-annual').textContent.replace(/[^0-9]/g,''))||0; const frequency=Number(document.getElementById('payment-frequency').value);const instalment=frequency?Math.round(annual/frequency):annual;document.getElementById('summary-monthly').textContent='₦'+instalment.toLocaleString('en-NG');}
      function validateStep(step){if(step===1){const valid=Object.values(productState).some(Boolean);if(!valid){alert('Select at least one product to continue.');}return valid;} if(step===2){let ok=true;[['company-name','Please enter a company name'],['company-rc','Please enter your RC number'],['company-state','Select a state'],['annual-payroll','Enter the payroll estimate']].forEach(([id,msg])=>{const el=document.getElementById(id);const grp=document.getElementById('fg-'+id.replace(/-/g,'')); if(!el.value.trim()){grp.classList.add('error');ok=false;} else grp.classList.remove('error');}); return ok;} return true;}
      function nextStep(from){if(!validateStep(from))return; if(from===2)updateLivePremium(); if(from===4)updateSummary(); goToStep(from+1);} function prevStep(cur){
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
      goToStep(cur-1);} function goToStep(n){document.querySelectorAll('.step-panel').forEach(p=>p.classList.remove('active'));document.getElementById('step-'+n).classList.add('active');for(let i=1;i<=5;i++){const prog=document.getElementById('prog-'+i);prog.classList.remove('active','done');if(i<n)prog.classList.add('done');if(i===n)prog.classList.add('active')}currentStep=n;window.scrollTo({top:0,behavior:'smooth'});}
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


      function toggleBusinessFields(){
        const type = document.getElementById('account-type');
        const bf = document.getElementById('business-fields');
        if(type && bf) bf.style.display = type.value === 'business' ? 'block' : 'none';
      }
      function setupOTPInputs() {
        document.querySelectorAll('.otp-inputs').forEach(container => {
          const inputs = container.querySelectorAll('input');
          inputs.forEach((input, index) => {
            input.addEventListener('paste', (e) => {
              e.preventDefault();
              const pastedData = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
              if (!pastedData) return;
              let currIndex = index;
              for (let i = 0; i < pastedData.length && currIndex < inputs.length; i++) {
                inputs[currIndex].value = pastedData[i];
                currIndex++;
              }
              if (currIndex < inputs.length) {
                inputs[currIndex].focus();
              } else {
                inputs[inputs.length - 1].focus();
              }
            });

            input.addEventListener('input', (e) => {
              input.value = input.value.replace(/[^0-9]/g, '');
              if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
              }
            });

            input.addEventListener('keydown', (e) => {
              if (e.key === 'Backspace' && !input.value && index > 0) {
                inputs[index - 1].focus();
                inputs[index - 1].value = '';
              }
            });
          });
        });
      }
      document.addEventListener('DOMContentLoaded', setupOTPInputs);
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


      function submitForm(){
        const emailEl = document.getElementById('email');
        const phoneEl = document.getElementById('phone');
        const amountEl = document.getElementById('summary-premium');

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
        const config = {
          key: pk,
          email: email,
          amount: amountKobo,
          currency: 'NGN',
          ref: 'COVA-GROUP-' + Date.now(),
          metadata: {
            custom_fields: [
              { display_name: "Product Type", variable_name: "product_type", value: "GROUP" },
              { display_name: "Customer Phone", variable_name: "customer_phone", value: phone }
            ]
          },
          onSuccess: function(response) {
            localStorage.setItem('cova_last_ref', response.reference);
            document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
            const successEl = document.getElementById('success');
            if(successEl) successEl.classList.add('active');
            window.scrollTo({top:0, behavior:'smooth'});
          },
          onCancel: function() {
            const t = document.createElement('div');
            t.textContent = 'Payment cancelled';
            t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--crd);color:white;padding:12px 24px;border-radius:8px;z-index:9999;font-weight:600;';
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 3000);
          }
        };

        config.plan = 'PLN_mock123';

        popup.setup(config);
        popup.openIframe();
      }
    