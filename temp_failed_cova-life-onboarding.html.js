
      let currentStep = 1;
      let selectedPlan = "Life Savings";
      let yesAnswers = [false, false, false, false, false];
      function goBack() {
        if (currentStep === 'otp') { prevStep('otp'); return; }
        if (currentStep === 'otp') { prevStep('otp'); return; }
        if (currentStep > 1) prevStep(currentStep);
        else window.history.back();
      }
      function selectPlan(plan) {
        selectedPlan = plan;
        document
          .querySelectorAll(".plan-card")
          .forEach((card) => card.classList.remove("selected"));
        document
          .getElementById("plan-" + plan.toLowerCase().replace(/ /g, "-"))
          .classList.add("selected");
      }
      function updateLifeEstimate() {
        const sum = +document.getElementById("life-sum").value;
        document.getElementById("life-sum-label").textContent =
          "₦" + sum.toLocaleString("en-NG");
        const annual = Math.round(sum * 0.005);
        const monthly = Math.round(annual / 12);
        document.getElementById("life-annual").textContent =
          "₦" + annual.toLocaleString("en-NG");
        document.getElementById("life-monthly").textContent =
          "₦" + monthly.toLocaleString("en-NG");
        document.getElementById("sum-premium").textContent =
          "₦" + annual.toLocaleString("en-NG");
      }
      function toggleYesNo(index) {
        yesAnswers[index - 1] = !yesAnswers[index - 1];
        const card = document.getElementById("q-" + index);
        card.classList.toggle("selected", yesAnswers[index - 1]);
        card.querySelector(".toggle-value").textContent = yesAnswers[index - 1]
          ? "Yes"
          : "No";
        document.getElementById("medical-alert").style.display =
          yesAnswers.includes(true) ? "block" : "none";
      }
      function validateStep(step) {
        if (step === 2) {
          let ok = true;
          [
            ["life-name", "Enter your name"],
            ["life-dob", "Enter your date of birth"],
            ["life-gender", "Select gender"],
            ["life-phone", "Enter your phone"],
            ["life-email", "Enter email"],
            ["life-occupation", "Enter occupation"],
            ["life-state", "Select state"],
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
        if (from === 3) {
          document.getElementById("sum-plan").textContent = selectedPlan;
          document.getElementById("sum-name").textContent =
            document.getElementById("life-name").value;
          document.getElementById("sum-assured").textContent =
            "₦" +
            (+document.getElementById("life-sum").value).toLocaleString(
              "en-NG",
            );
          document.getElementById("sum-term").textContent =
            document.getElementById("life-term").value + " years";
          document.getElementById("sum-frequency").textContent =
            document
              .getElementById("life-frequency")
              .value.charAt(0)
              .toUpperCase() +
            document.getElementById("life-frequency").value.slice(1);
          document.getElementById("sum-beneficiary").textContent =
            document.getElementById("life-beneficiary").value || "—";
          document.getElementById("sum-premium").textContent =
            document.getElementById("life-annual").textContent;
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
        const emailEl = document.getElementById("life-email");
        const phoneEl = document.getElementById("life-phone");
        const amountEl = document.getElementById("sum-premium");

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
          ref: "COVA-LIFE-" + Date.now(),
          metadata: {
            custom_fields: [
              {
                display_name: "Product Type",
                variable_name: "product_type",
                value: "LIFE",
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

      async function submitLifePolicy() {
        // Get form data
        const coverageAmount = parseFloat(
          document.getElementById("coverage-amount").value,
        );
        const term = document.getElementById("term").value;
        const beneficiaryName =
          document.getElementById("beneficiary-name").value;

        // Validation
        if (!coverageAmount || !term || !beneficiaryName) {
          alert("Please fill in all fields");
          return;
        }

        // Prepare data for backend
        const policyData = {
          product_type: "life",
          cover_type: term,
          insurer: "AIICO",
          sum_insured: coverageAmount,
          premium_amount: calculateLifePremium(coverageAmount, term),
          premium_frequency: "yearly",
          start_date: new Date().toISOString().split("T")[0],
          end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          metadata: {
            coverage_amount: coverageAmount,
            term_years: term,
            beneficiary_name: beneficiaryName,
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

      function calculateLifePremium(coverageAmount, term) {
        // Example calculation: 1% of coverage per year
        return coverageAmount * 0.01 * parseInt(term);
      }
    