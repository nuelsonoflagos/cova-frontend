
      let currentStep = 1;
      let selectedCover = "comp";
      let selectedFreq = "annual";
      let selectedInsurer = "AXA Mansard";
      let vehicleValue = 0;
      let photosUploaded = [false, false, false, false, false, false];

      const coverRates = { third: 0.003, tpft: 0.008, comp: 0.04 };
      const freqMultiplier = { annual: 1, monthly: 1 / 12, quarterly: 1 / 4 };
      const coverNames = {
        third: "Third Party",
        tpft: "Third Party Fire & Theft",
        comp: "Comprehensive",
      };
      const coverInfo = {
        third:
          "Third party only is the legal minimum in Nigeria. It covers damage you cause to other vehicles and people — but not your own vehicle. Only recommended for vehicles under ₦1.5M in value.",
        tpft: "Third party, fire and theft adds protection if your vehicle is stolen or catches fire on top of standard third party cover. A solid middle ground for vehicles ₦2M–₦5M.",
        comp: "Comprehensive covers everything — your vehicle, third parties, theft, fire, flood, accidental damage. Required if your vehicle is financed. Recommended for all vehicles above ₦3M.",
      };

      function fmt(n) {
        return "₦" + Math.round(n).toLocaleString("en-NG");
      }

      function updateMotorPremium() {
        vehicleValue = parseFloat(document.getElementById("vvalue").value) || 0;
        const rate = coverRates[selectedCover];
        const annual = vehicleValue * rate;
        const tp = vehicleValue * coverRates.third;
        const tpft = vehicleValue * coverRates.tpft;
        const comp = vehicleValue * coverRates.comp;
        document.getElementById("tp-price").textContent = vehicleValue
          ? fmt(tp) + "/yr"
          : "~₦25,000/yr";
        document.getElementById("tpft-price").textContent = vehicleValue
          ? fmt(tpft) + "/yr"
          : "~₦60,000/yr";
        document.getElementById("comp-price").textContent = vehicleValue
          ? fmt(comp) + "/yr"
          : "~₦320,000/yr";
        refreshCalc();
      }

      function refreshCalc() {
        const rate = coverRates[selectedCover];
        const annual = vehicleValue * rate;
        const price = annual * freqMultiplier[selectedFreq];
        document.getElementById("calc-vval").textContent = vehicleValue
          ? fmt(vehicleValue)
          : "—";
        document.getElementById("calc-cover").textContent =
          coverNames[selectedCover];
        document.getElementById("calc-rate").textContent = rate * 100 + "%";
        document.getElementById("calc-price").textContent = vehicleValue
          ? fmt(price)
          : "—";
        const labels = {
          annual: "Annual premium",
          monthly: "Monthly premium",
          quarterly: "Quarterly premium",
        };
        document.getElementById("calc-freq-label").textContent =
          labels[selectedFreq];
        const usage = document.getElementById("usage");
        if (usage)
          document.getElementById("calc-usage").textContent =
            usage.options[usage.selectedIndex]?.text || "Private";
        updateSummaryPrice();
      }

      function updateSummaryPrice() {
        const rate = coverRates[selectedCover];
        const annual = vehicleValue * rate;
        const price = annual * freqMultiplier[selectedFreq];
        const el = document.getElementById("sum-price");
        if (el) el.textContent = vehicleValue ? fmt(price) : "—";
      }

      function selectCover(type, el) {
        selectedCover = type;
        document
          .querySelectorAll(".cover-opt")
          .forEach((c) => c.classList.remove("selected"));
        el.classList.add("selected");
        document.getElementById("cover-info-text").innerHTML = coverInfo[type];
        document.getElementById("calc-cover").textContent = coverNames[type];
        document.getElementById("sum-cover").textContent = coverNames[type];
        document.getElementById("pol-cover").textContent = coverNames[type];
        refreshCalc();
      }

      function setFreq(freq, el) {
        selectedFreq = freq;
        document
          .querySelectorAll(".freq-tab")
          .forEach((t) => t.classList.remove("active"));
        el.classList.add("active");
        refreshCalc();
      }

      function selectInsurer(el, name, rating) {
        selectedInsurer = name;
        document
          .querySelectorAll(".insurer-opt")
          .forEach((i) => i.classList.remove("selected"));
        el.classList.add("selected");
        document.getElementById("sum-insurer").textContent = name;
        document.getElementById("pol-insurer").textContent = name;
      }

      function triggerVPhoto(slot) {
        document.querySelector("#vslot-" + slot + " .photo-input").click();
      }

      function handleVPhoto(input, slot) {
        if (input.files && input.files[0]) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const slotEl = document.getElementById("vslot-" + slot);
            let prev = slotEl.querySelector(".photo-preview");
            if (!prev) {
              prev = document.createElement("img");
              prev.className = "photo-preview";
              slotEl.appendChild(prev);
            }
            prev.src = e.target.result;
            slotEl.classList.add("filled");
            photosUploaded[slot - 1] = true;
          };
          reader.readAsDataURL(input.files[0]);
        }
      }

      function toggleBusinessFields() {
        const type = document.getElementById("account-type").value;
        document.getElementById("business-fields").style.display =
          type === "sme" ? "block" : "none";
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
          if (type === "sme") {
            fields.push([
              "fg-companyname",
              "companyname",
              (v) => v.trim().length > 1,
            ]);
          }
          fields.forEach(([g, f, fn]) => {
            const grp = document.getElementById(g);
            if (!fn(document.getElementById(f).value)) {
              grp.classList.add("error");
              ok = false;
            } else grp.classList.remove("error");
          });
          return ok;
        }
        
        if (step === 2) {
          let ok = true;
          [
            ["fg-make", "make", (v) => v.trim().length > 1],
            ["fg-model", "vmodel", (v) => v.trim().length > 1],
            ["fg-year", "year", (v) => v !== ""],
            ["fg-color", "color", (v) => v.trim().length > 1],
            ["fg-plate", "plate", (v) => v.trim().length > 4],
            ["fg-chassis", "chassis", (v) => v.trim().length > 5],
            ["fg-engine", "engine", (v) => v.trim().length > 3],
            ["fg-vvalue", "vvalue", (v) => parseFloat(v) >= 500000],
          ].forEach(([g, f, fn]) => {
            const grp = document.getElementById(g);
            if (!fn(document.getElementById(f).value)) {
              grp.classList.add("error");
              ok = false;
            } else grp.classList.remove("error");
          });
          return ok;
        }
        if (step === 4) {
          const allDone = photosUploaded.every(Boolean);
          document.getElementById("photo-error").style.display = allDone
            ? "none"
            : "block";
          return allDone;
        }
        return true;
      }

      function populateSummary() {
        const fn = document.getElementById("fn").value;
        const ln = document.getElementById("ln").value;
        const make = document.getElementById("make").value;
        const model = document.getElementById("vmodel").value;
        const year = document.getElementById("year").value;
        const plate = document.getElementById("plate").value;
        document.getElementById("sum-name").textContent = fn + " " + ln;
        document.getElementById("sum-phone").textContent =
          document.getElementById("phone").value;
        document.getElementById("sum-vehicle").textContent =
          `${year} ${make} ${model}`;
        document.getElementById("sum-plate").textContent = plate;
        document.getElementById("sum-vvalue").textContent = fmt(vehicleValue);
        document.getElementById("pol-vehicle").textContent =
          `${make} ${model} ${year}`;
        updateSummaryPrice();
      }

      function nextStep(from) {
        if (!validateStep(from)) return;
        if (from === 1) { goToStep(2); return; }
        
        
        
        if (from === 5) populateSummary();
        goToStep(from + 1);
      }
      
      }
      function prevStepfunction prevStep(current) {
        if (current === 'otp') {
          document.getElementById("step-otp").classList.remove("active");
          document.getElementById("step-6").classList.add("active");
          currentStep = 6;
          return;
        }
        
        if (current === 2) {
          document.getElementById("step-2").classList.remove("active");
          document.getElementById("step-1").classList.add("active");
          updateProgress(1);
          return;
        }
        goToStep(current - 1);
      }

      function goToStep(n) {
        document
          .querySelectorAll(".step-panel")
          .forEach((p) => p.classList.remove("active"));
        document.getElementById("step-" + n).classList.add("active");
        updateProgress(n);
        currentStep = n;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      function updateProgress(n) {
        for (let i = 1; i <= 6; i++) {
          const prog = document.getElementById("prog-" + i);
          if (prog) {
            prog.classList.remove("active", "done");
            if (i < n) prog.classList.add("done");
            if (i === n) prog.classList.add("active");
          }
        }
      }

      function goBack() {
        if (currentStep === 'otp') { prevStep('otp'); return; }
        if (currentStep === 'otp') { prevStep('otp'); return; }
        else if (currentStep > 1) prevStep(currentStep);
        else window.history.back();
      }

      let phone_verified = false;
      function handleBuyPolicy() {
        if (!phone_verified) {
          const destInput = document.querySelector('input[type="tel"]'); const dest = destInput ? destInput.value : "";
          document.getElementById("otp-destination").textContent = dest;
          document.getElementById("step-6").classList.remove("active");
          document.getElementById("step-otp").classList.add("active");
          currentStep = "otp";
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          submitPolicy();
        }
      }
      function verifyPurchaseOTP() {
        let otp = "";
        document.querySelectorAll("#purchase-otp-container input").forEach((i) => (otp += i.value));
        if (otp.length < 6) {
          document.getElementById("fg-otp").classList.add("error");
          return;
        }
        document.getElementById("fg-otp").classList.remove("error");
        phone_verified = true;
        document.getElementById("step-otp").classList.remove("active");
        submitPolicy();
      }

      function submitPolicy() {
        const emailEl = document.getElementById("email");
        const phoneEl = document.getElementById("phone");
        const amountEl = document.getElementById("sum-price");

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
          ref: "COVA-MOTOR-" + Date.now(),
          metadata: {
            custom_fields: [
              {
                display_name: "Product Type",
                variable_name: "product_type",
                value: "MOTOR",
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

      async function submitMotorPolicy() {
        // Get form data
        const vehicleModel = document.getElementById("vehicle-model").value;
        const vehicleValue = parseFloat(
          document.getElementById("vehicle-value").value,
        );
        const coverType = document.getElementById("cover-type").value;
        const plateNumber = document.getElementById("plate-number").value;

        // Validation
        if (!vehicleModel || !vehicleValue || !coverType || !plateNumber) {
          alert("Please fill in all fields");
          return;
        }

        // Prepare data for backend
        const policyData = {
          product_type: "motor",
          cover_type: coverType,
          insurer: "Leadway", // or dynamic based on form
          sum_insured: vehicleValue,
          premium_amount: calculateMotorPremium(vehicleValue, coverType),
          premium_frequency: "yearly",
          start_date: new Date().toISOString().split("T")[0],
          end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          metadata: {
            vehicle_model: vehicleModel,
            plate_number: plateNumber,
            vehicle_value: vehicleValue,
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

      function calculateMotorPremium(vehicleValue, coverType) {
        if (coverType === "third-party") {
          return vehicleValue * 0.02; // 2% for third party
        } else if (coverType === "comprehensive") {
          return vehicleValue * 0.05; // 5% for comprehensive
        }
        return 0;
      }
    