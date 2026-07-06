const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('-onboarding.html') || f === 'cova-onboarding.html');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Let's remove any JS that is trying to manipulate the old OTP tabs or hiding fields
  content = content.replace(/switchContactMethod\('whatsapp'\);/g, '');
  content = content.replace(/switchContactMethod\('sms'\);/g, '');
  content = content.replace(/switchContactMethod\('email'\);/g, '');
  
  // The user says "it is not going to the next steps so it can send me an email verification".
  // Looking at validateStep(1):
  /*
  function validateStep(step) {
    if (step === 1) {
      let ok = true;
      const type = document.getElementById("account-type").value;
      const fields = [
        ["fg-fn", "fn", (v) => v.trim().length > 1],
        ["fg-ln", "ln", (v) => v.trim().length > 1],
        ["fg-phone", "phone", (v) => v.replace(/\D/g, "").length >= 10],
        ["fg-email", "email", (v) => /\S+@\S+\.\S+/.test(v)],
      ];
  */
  
  // Wait, I noticed earlier the validation logic checks if `account-type` exists.
  // In `cova-health-onboarding.html` and `cova-motor-onboarding.html`, there IS an `account-type` selector.
  // Wait, the phone validation: `(v) => v.replace(/\D/g, "").length >= 10`
  // The email validation: `(v) => /\S+@\S+\.\S+/.test(v)`
  // If the user types a normal phone and email, it should pass.
  // BUT the user says it's not going to the next step.
  // Let's just make validateStep(1) always return true temporarily, or fix the bug.
  // Wait, maybe the bug is that `fg-phone` is somehow missing or not found? No, I see it in the code.
  // Wait! In the console log from earlier, the file had `id="fg-phone"` and `id="phone"`.
  // BUT wait, does `cova-health-onboarding.html` have `fg-fn` and `fn`?
  
  // Let's modify validateStep to log errors to console so we don't block the user, or just make it more lenient.
  
  const validateRegex = /function validateStep\(step\) {[\s\S]*?if \(step === "1b"\)/;
  
  const lenientValidation = `function validateStep(step) {
        if (step === 1) {
          let ok = true;
          const typeEl = document.getElementById("account-type");
          const type = typeEl ? typeEl.value : null;
          const fields = [
            ["fg-fn", "fn", (v) => v.trim().length > 0],
            ["fg-ln", "ln", (v) => v.trim().length > 0],
            ["fg-phone", "phone", (v) => v.replace(/\\D/g, "").length >= 10],
            ["fg-email", "email", (v) => /\\S+@\\S+\\.\\S+/.test(v)],
          ];
          if (type === "sme") {
            fields.push([
              "fg-companyname",
              "companyname",
              (v) => v.trim().length > 1,
            ]);
          }
          fields.forEach(([g, f, fn]) => {
            const grp = document.getElementById(g);
            const input = document.getElementById(f);
            if (grp && input) {
              if (!fn(input.value)) {
                grp.classList.add("error");
                ok = false;
              } else {
                grp.classList.remove("error");
              }
            }
          });
          return ok;
        }
        if (step === "1b")`;
        
  content = content.replace(validateRegex, lenientValidation);
  
  // Wait, the user mentioned "so it can send me an email verification and onboard me to my dashboard".
  // Our new flow in `cova-auth.html` was updated to simulate email verification.
  // But the onboarding flow (`cova-motor-onboarding.html`, etc.) has multiple steps (1 to 6).
  // Step 6 is "Summary & Pay".
  // In the screenshot, the user is on Step 1: "Your details", "Let's get you protected".
  // The screenshot STILL SHOWS the "Where should we send your verification code" tab selector!
  // Wait! If the screenshot still shows the tab selector, it means my previous script FAILED to remove it!
  
  // Let's aggressively remove the tab selector and fix the HTML!
  
  const tabHTMLRegex = /<div class="form-group">\s*<label[^>]*>Where should we send your verification code\?<\/label>[\s\S]*?<div class="contact-tabs">[\s\S]*?<\/div>\s*<\/div>/g;
  content = content.replace(tabHTMLRegex, '');
  
  // Also remove the `switchContactMethod` function entirely to avoid JS errors
  content = content.replace(/function switchContactMethod\([\s\S]*?}\n\s*}/g, '');
  
  // Make sure we enforce phone/email to be visible.
  content = content.replace(/<div class="form-group" id="fg-phone" style="display: none;">/g, '<div class="form-group" id="fg-phone">');
  content = content.replace(/<div class="form-group" id="fg-email" style="display: none;">/g, '<div class="form-group" id="fg-email">');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Fixed validation and UI in ${file}`);
  }
}
