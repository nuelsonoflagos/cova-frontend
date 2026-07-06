
      let currentStep = 1;
      let tripType = "Single Trip";
      let selectedPlan = "Standard";
      let perDay = 1200;
      function goBack() {
        if (currentStep === 'otp') { prevStep('otp'); return; }
        if (currentStep === 'otp') { prevStep('otp'); return; }
        
        
        if (currentStep > 1) prevStep(currentStep);
        else window.history.back();
      }
      function selectTrip(type) {
        tripType = type;
        document
          .querySelectorAll("#step-1 .plan-card")
          .forEach((c) => c.classList.remove("selected"));
        document
          .getElementById("trip-" + type.toLowerCase().replace(/ /g, "-"))
          .classList.add("selected");
        renderTripExtra();
      }
      function renderTripExtra() {
        document.getElementById("student-fields").style.display =
          tripType === "Student Protection" ? "block" : "none";
        document.getElementById("pilgrimage-fields").style.display =
          tripType === "Pilgrimage Protection" ? "block" : "none";
        updateSchengenWarning();
      }
      function updateSchengenWarning() {
        document.getElementById("schengen-warning").style.display =
          document.getElementById("travel-region").value === "Europe/Schengen"
            ? "block"
            : "none";
      }
      function renderTravellerForms() {
        const count = Math.max(
          1,
          Math.min(
            8,
            parseInt(document.getElementById("travel-count").value) || 1,
          ),
        );
        const list = document.getElementById("traveller-list");
        list.innerHTML = "";
        for (let i = 1; i <= count; i++) {
          const card = document.createElement("div");
          card.className = "traveller-card";
          card.innerHTML = `<div style="font-weight:700;margin-bottom:12px">Traveller ${i}</div><div class="form-row"><div class="form-group"><label>Name</label><input type="text" id="traveller-name-${i}" placeholder="Full name"></div><div class="form-group"><label>Date of birth</label><input type="date" id="traveller-dob-${i}"></div></div><div class="form-group"><label>Passport number</label><input type="text" id="traveller-passport-${i}" placeholder="Passport number"></div>`;
          list.appendChild(card);
        }
        updateSummary();
      }
      function selectPlan(plan, price) {
        selectedPlan = plan;
        perDay = price;
        document
          .querySelectorAll("#step-4 .plan-card")
          .forEach((c) => c.classList.remove("selected"));
        document
          .getElementById("plan-" + plan.toLowerCase())
          .classList.add("selected");
        updateSummary();
      }
      function updateSummary() {
        const travellers =
          parseInt(document.getElementById("travel-count").value) || 1;
        const region = document.getElementById("travel-region").value;
        const depart = document.getElementById("travel-depart").value;
        const ret = document.getElementById("travel-return").value;
        let days = 1;
        if (depart && ret) {
          const d1 = new Date(depart);
          const d2 = new Date(ret);
          days = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) + 1);
        }
        document.getElementById("summary-trip").textContent = tripType;
        document.getElementById("summary-region").textContent = region;
        document.getElementById("summary-travellers").textContent = travellers;
        document.getElementById("summary-plan").textContent = selectedPlan;
        document.getElementById("summary-price").textContent =
          "₦" + perDay.toLocaleString("en-NG");
        document.getElementById("summary-total").textContent =
          "₦" + (perDay * travellers * days).toLocaleString("en-NG");
      }
      function validateStep(step) {
        if (step === 2) {
          let ok = true;
          [["travel-depart"], ["travel-return"]].forEach(([id]) => {
            const el = document.getElementById(id);
            const grp = el.closest(".form-group");
            if (!el.value) {
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
        if (from === 1) { goToStep(2); return; }
        if (from === 2) {
          renderTravellerForms();
          updateSummary();
        }
        if (from === 3) updateSummary();
        goToStep(from + 1);
      }
      function prevStep(cur) {
        if (cur === 'otp') {
          document.getElementById("step-otp").classList.remove("active");
          document.getElementById("step-4").classList.add("active");
          currentStep = 4;
          return;
        }
        if (cur === 2) {
          document.getElementById("step-2").classList.remove("active");
          document.getElementById("step-1").classList.add("active");
          updateProgress(1);
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
        const emailEl = document.getElementById("email");
        const phoneEl = document.getElementById("phone");
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
          ref: "COVA-TRAVEL-" + Date.now(),
          metadata: {
            custom_fields: [
              {
                display_name: "Product Type",
                variable_name: "product_type",
                value: "TRAVEL",
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

        // One-time payment

        popup.setup(config);
        popup.openIframe();
      }

      async function submitTravelPolicy() {
        // Get form data
        const destination = document.getElementById("destination").value;
        const travelDuration = parseInt(
          document.getElementById("duration").value,
        );
        const tripType = document.getElementById("trip-type").value;

        // Validation
        if (!destination || !travelDuration || !tripType) {
          alert("Please fill in all fields");
          return;
        }

        // Calculate premium
        const premium = calculateTravelPremium(travelDuration, tripType);

        // Prepare data for backend
        const policyData = {
          product_type: "travel",
          cover_type: tripType,
          insurer: "Zenith",
          sum_insured: premium * 2, // Sum insured = 2x premium
          premium_amount: premium,
          premium_frequency: "once",
          start_date: new Date().toISOString().split("T")[0],
          end_date: new Date(Date.now() + travelDuration * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          metadata: {
            destination: destination,
            duration_days: travelDuration,
            trip_type: tripType,
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

      function calculateTravelPremium(duration, tripType) {
        const baseRates = {
          single: 5000,
          multi: 8000,
        };
        return (baseRates[tripType] || 5000) * (duration / 7); // Weekly base rate
      }
    