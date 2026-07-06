
      let currentStep = 1;
      let selectedInvestment = "Investment Plan";
      let selectedRisk = "Conservative";
      function goBack() {
        if (currentStep === 'otp') { prevStep('otp'); return; }
        if (currentStep === 'otp') { prevStep('otp'); return; }
        if (currentStep > 1) prevStep(currentStep);
        else window.history.back();
      }
      function selectInvestment(type) {
        selectedInvestment = type;
        document
          .querySelectorAll("#step-1 .plan-card")
          .forEach((c) => c.classList.remove("selected"));
        document
          .getElementById("inv-" + type.toLowerCase().replace(/ /g, "-"))
          .classList.add("selected");
        document.getElementById("section-investment").style.display =
          type === "Investment Plan" ? "block" : "none";
        document.getElementById("section-education").style.display =
          type === "Education Plan" ? "block" : "none";
        document.getElementById("section-retirement").style.display =
          type === "Retirement Plan" ? "block" : "none";
        updateInvestmentSummary();
      }
      function updateInvestmentSummary() {
        let monthly = 0;
        let projected = 0;
        const rate = 0.12 / 12;
        const compound = (months) =>
          ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate);
        if (selectedInvestment === "Investment Plan") {
          monthly = +document.getElementById("inv-monthly").value;
          const years = +document.getElementById("inv-term").value;
          projected = Math.round(monthly * compound(years * 12));
        }
        if (selectedInvestment === "Education Plan") {
          monthly = +document.getElementById("edu-monthly").value;
          const dob = new Date(document.getElementById("edu-dob").value);
          const targetYear = +document.getElementById("edu-year").value;
          const years = Math.max(
            1,
            targetYear - (dob.getFullYear() || new Date().getFullYear()),
          );
          projected = Math.round(monthly * compound(years * 12));
        }
        if (selectedInvestment === "Retirement Plan") {
          monthly = +document.getElementById("ret-monthly").value;
          const age = +document.getElementById("ret-age").value;
          const currentAge = 30;
          const years = Math.max(5, age - currentAge);
          projected = Math.round(monthly * compound(years * 12));
        }
        const lifeCover = Math.round(monthly * 12 * 3);
        document.getElementById("summary-plan-type").textContent =
          selectedInvestment;
        document.getElementById("summary-monthly").textContent =
          "₦" + monthly.toLocaleString("en-NG");
        document.getElementById("summary-projected").textContent =
          "₦" + projected.toLocaleString("en-NG");
        document.getElementById("summary-life-cover").textContent =
          "₦" + lifeCover.toLocaleString("en-NG");
        document.getElementById("invest-projected").textContent =
          "₦" + projected.toLocaleString("en-NG");
        document.getElementById("inv-monthly-label").textContent =
          "₦" + monthly.toLocaleString("en-NG");
        document.getElementById("edu-monthly-label").textContent =
          "₦" + monthly.toLocaleString("en-NG");
        document.getElementById("ret-monthly-label").textContent =
          "₦" + monthly.toLocaleString("en-NG");
      }
      function selectRisk(risk) {
        selectedRisk = risk;
        ["risk-conservative", "risk-balanced", "risk-aggressive"].forEach(
          (id) => document.getElementById(id).classList.remove("selected"),
        );
        document
          .getElementById("risk-" + risk.toLowerCase())
          .classList.add("selected");
      }
      function validateStep(step) {
        if (step === 3) {
          let ok = true;
          [
            ["inv-name"],
            ["inv-bvn"],
            ["inv-phone"],
            ["inv-email"],
            ["inv-kin"],
            ["inv-relationship"],
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
          updateInvestmentSummary();
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
        if (cur === "3b") {
          document.getElementById("step-3b").classList.remove("active");
          document.getElementById("step-3").classList.add("active");
          return;
        }
        if (cur === 4) {
          document.getElementById("step-4").classList.remove("active");
          document.getElementById("step-3b").classList.add("active");
          return;
        }
        goToStep(cur - 1);
      }
      function goToStep(n) {
        document
          .querySelectorAll(".step-panel")
          .forEach((p) => p.classList.remove("active"));
        document.getElementById("step-" + n).classList.add("active");
        for (let i = 1; i <= 4; i++) {
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
        const emailEl = document.getElementById("inv-email");
        const phoneEl = document.getElementById("inv-phone");
        const amountEl = document.getElementById("summary-monthly");

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
          ref: "COVA-INVESTMENT-" + Date.now(),
          metadata: {
            custom_fields: [
              {
                display_name: "Product Type",
                variable_name: "product_type",
                value: "INVESTMENT",
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
    