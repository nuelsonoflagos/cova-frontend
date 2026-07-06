
      let currentStep = 1;
      let coverType = "Individual";
      let selectedPlan = "Bronze";
      let selectedInsurer = "AIICO";
      let selectedHospital = "Lagos University Teaching Hospital";
      function goBack() {
        if (currentStep === 'otp') { prevStep('otp'); return; }
        if (currentStep === 'otp') { prevStep('otp'); return; }
        if (currentStep > 1) prevStep(currentStep);
        else window.history.back();
      }
      function selectCover(type) {
        coverType = type;
        document
          .querySelectorAll(".plan-card")
          .forEach((c) => c.classList.remove("selected"));
        document
          .getElementById(
            "cover-" + type.toLowerCase().replace(/\//g, "").replace(/ /g, "-"),
          )
          .classList.add("selected");
        document.getElementById("family-fields").style.display =
          type === "Family" ? "block" : "none";
        document.getElementById("corp-fields").style.display =
          type === "Corporate/Group" ? "block" : "none";
      }
      function selectPlan(plan) {
        selectedPlan = plan;
        ["plan-bronze", "plan-silver", "plan-gold"].forEach((id) =>
          document.getElementById(id).classList.remove("selected"),
        );
        document
          .getElementById("plan-" + plan.toLowerCase())
          .classList.add("selected");
        updatePrice();
      }
      function selectInsurer(name) {
        selectedInsurer = name;
        ["ins-AIICO", "ins-Hygeia", "ins-Reliance"].forEach((id) =>
          document.getElementById(id).classList.remove("selected"),
        );
        document
          .getElementById("ins-" + name.replace(/\s/g, ""))
          .classList.add("selected");
      }
      function selectHospital(name) {
        selectedHospital = name;
        document
          .querySelectorAll(".hospital-card")
          .forEach((c) => c.classList.remove("selected"));
        const cards = document.querySelectorAll(".hospital-card");
        cards.forEach((card) => {
          if (card.textContent.trim() === name) card.classList.add("selected");
        });
      }
      function updatePrice() {
        const prices = { Bronze: 45000, Silver: 95000, Gold: 180000 };
        document.getElementById("summary-price").textContent =
          "₦" + prices[selectedPlan].toLocaleString("en-NG");
      }
      function validateStep(step) {
        if (step === 2) {
          let ok = true;
          [
            ["health-name", "Enter your name"],
            ["health-dob", "Enter your date of birth"],
            ["health-state", "Select state"],
            ["health-phone", "Enter your phone"],
            ["health-email", "Enter email"],
          ].forEach(([id]) => {
            const el = document.getElementById(id);
            const grp = el.closest(".form-group");
            if (!el.value.trim()) {
              grp.classList.add("error");
              ok = false;
            } else grp.classList.remove("error");
          });
          return ok;
        }
        return true;
      }
      function nextStep(from) {
        if (!validateStep(from)) return;
        if (from === 2) {
          document.getElementById("summary-cover").textContent = coverType;
          document.getElementById("summary-name").textContent =
            document.getElementById("health-name").value;
          document.getElementById("summary-plan").textContent = selectedPlan;
          document.getElementById("summary-insurer").textContent =
            selectedInsurer;
          document.getElementById("summary-hospital").textContent =
            selectedHospital;
          updatePrice();
        }
        goToStep(from + 1);
      }

      

      function prevStep(cur) {
        if (cur === 'otp') {
          document.getElementById("step-otp").classList.remove("active");
          let lastStep = 6;
          if (document.getElementById("step-6")) lastStep = 6;
          else if (document.getElementById("step-5")) lastStep = 5;
          else if (document.getElementById("step-4")) lastStep = 4;
          else if (document.getElementById("step-3")) lastStep = 3;
          document.getElementById("step-" + lastStep).classList.add("active");
          currentStep = lastStep;
          return;
        }
        if (cur === "2b") {
          document.getElementById("step-2b").classList.remove("active");
          document.getElementById("step-2").classList.add("active");
          return;
        }
        if (cur === 3) {
          document.getElementById("step-3").classList.remove("active");
          document.getElementById("step-2b").classList.add("active");
          return;
        }
        goToStep(cur - 1);
      }
      function goToStep(n) {
        document
          .querySelectorAll(".step-panel")
          .forEach((p) => p.classList.remove("active"));
        document.getElementById("step-" + n).classList.add("active");
        for (let i = 1; i <= 5; i++) {
          const prog = document.getElementById("prog-" + i);
          prog.classList.remove("active", "done");
          if (i < n) prog.classList.add("done");
          if (i === n) prog.classList.add("active");
        }
        currentStep = n;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      function toggleBusinessFields() {
        const type = document.getElementById("account-type");
        const bf = document.getElementById("business-fields");
        if (type && bf)
          bf.style.display = type.value === "business" ? "block" : "none";
      }
      function setupOTPInputs() {
        document.querySelectorAll(".otp-inputs").forEach((container) => {
          const inputs = container.querySelectorAll("input");
          inputs.forEach((input, index) => {
            input.addEventListener("paste", (e) => {
              e.preventDefault();
              const pastedData = (e.clipboardData || window.clipboardData)
                .getData("text")
                .replace(/[^0-9]/g, "");
              if (!pastedData) return;
              let currIndex = index;
              for (
                let i = 0;
                i < pastedData.length && currIndex < inputs.length;
                i++
              ) {
                inputs[currIndex].value = pastedData[i];
                currIndex++;
              }
              if (currIndex < inputs.length) {
                inputs[currIndex].focus();
              } else {
                inputs[inputs.length - 1].focus();
              }
            });

            input.addEventListener("input", (e) => {
              input.value = input.value.replace(/[^0-9]/g, "");
              if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
              }
            });

            input.addEventListener("keydown", (e) => {
              if (e.key === "Backspace" && !input.value && index > 0) {
                inputs[index - 1].focus();
                inputs[index - 1].value = "";
              }
            });
          });
        });
      }
      document.addEventListener("DOMContentLoaded", setupOTPInputs);
      
        if (grp) grp.classList.remove("error");
        return true;
      }

      function submitForm() {
        const emailEl = document.getElementById("health-email");
        const phoneEl = document.getElementById("health-phone");
        const amountEl = document.getElementById("summary-price");

        const email = emailEl ? emailEl.value : "user@example.com";
        const phone = phoneEl ? phoneEl.value : "08000000000";
        let amountStr = "0";
        if (amountEl) amountStr = amountEl.textContent.replace(/[^0-9]/g, "");
        if (!amountStr) amountStr = "1000"; // fallback

        const amountKobo = parseInt(amountStr, 10) * 100;

        const pkMeta = document.getElementById("paystack-key");
        const pk = pkMeta ? pkMeta.content : "pk_test_mock_key_12345";

        // Use global PaystackPop or window.PaystackPop
        const popup = new PaystackPop();
        const config = {
          key: pk,
          email: email,
          amount: amountKobo,
          currency: "NGN",
          ref: "COVA-HEALTH-" + Date.now(),
          metadata: {
            custom_fields: [
              {
                display_name: "Product Type",
                variable_name: "product_type",
                value: "HEALTH",
              },
              {
                display_name: "Customer Phone",
                variable_name: "customer_phone",
                value: phone,
              },
            ],
          },
          onSuccess: function (response) {
            localStorage.setItem("cova_last_ref", response.reference);
            document
              .querySelectorAll(".step-panel")
              .forEach((p) => p.classList.remove("active"));
            const successEl = document.getElementById("success");
            if (successEl) successEl.classList.add("active");
            window.scrollTo({ top: 0, behavior: "smooth" });
          },
          onCancel: function () {
            const t = document.createElement("div");
            t.textContent = "Payment cancelled";
            t.style.cssText =
              "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--crd);color:white;padding:12px 24px;border-radius:8px;z-index:9999;font-weight:600;";
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 3000);
          },
        };

        config.plan = "PLN_mock123";

        popup.setup(config);
        popup.openIframe();
      }

      async function submitHealthPolicy() {
        // Get form data
        const planType = document.getElementById("plan-type").value;
        const familyMembers =
          parseInt(document.getElementById("family-members").value) || 1;

        // Validation
        if (!planType || !familyMembers) {
          alert("Please fill in all fields");
          return;
        }

        // Calculate premium based on plan and family size
        const basePremium = calculateHealthPremium(planType, familyMembers);

        // Prepare data for backend
        const policyData = {
          product_type: "health",
          cover_type: planType,
          insurer: "AIICO",
          sum_insured: basePremium * 12, // Annual sum
          premium_amount: basePremium,
          premium_frequency: "monthly",
          start_date: new Date().toISOString().split("T")[0],
          end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          metadata: {
            plan_type: planType,
            family_members: familyMembers,
          },
        };

        // Call API
        const result = await createPolicy(policyData);

        if (result.ok) {
          const policyId = result.data.policy.id;
          alert("Policy created! Proceeding to payment...");
          // Redirect to payment
          window.location.href = `cova-claim.html?policy_id=${policyId}&amount=${policyData.premium_amount}`;
        } else {
          alert("Error creating policy: " + result.data.error.message);
        }
      }

      function calculateHealthPremium(planType, familyMembers) {
        // Example calculation
        const baseRates = {
          basic: 5000,
          standard: 10000,
          premium: 20000,
        };
        return (baseRates[planType] || 5000) * familyMembers;
      }
    