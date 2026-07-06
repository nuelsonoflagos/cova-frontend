
      let currentStep = 1;
      let selectedProperty = "Home owner-occupier";
      let selectedPerils = [
        "fire",
        "flood",
        "burglary",
        "accidental",
        "liability",
      ];
      let photos = [false, false, false, false];
      function goBack() {
        if (currentStep === 'otp') { prevStep('otp'); return; }
        if (currentStep === 'otp') { prevStep('otp'); return; }
        
        
        if (currentStep > 1) prevStep(currentStep);
        else window.history.back();
      }
      function selectProperty(type) {
        selectedProperty = type;
        document
          .querySelectorAll("#step-1 .plan-card")
          .forEach((c) => c.classList.remove("selected"));
        document
          .getElementById("prop-" + type.toLowerCase().replace(/[^a-z]+/g, "-"))
          .classList.add("selected");
      }
      function updatePremium() {
        const building = +document.getElementById("building-value").value;
        const contents = +document.getElementById("contents-value").value;
        document.getElementById("building-label").textContent =
          "₦" + building.toLocaleString("en-NG");
        document.getElementById("contents-label").textContent =
          "₦" + contents.toLocaleString("en-NG");
        const base = building * 0.00035 + contents * 0.00065;
        const extra = selectedPerils.length * 0.03;
        const total = Math.round(base * (1 + extra));
        document.getElementById("summary-building").textContent =
          "₦" + building.toLocaleString("en-NG");
        document.getElementById("summary-contents").textContent =
          "₦" + contents.toLocaleString("en-NG");
        document.getElementById("summary-perils").textContent = selectedPerils
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(", ");
        document.getElementById("summary-total").textContent =
          "₦" + total.toLocaleString("en-NG");
        document.getElementById("summary-final-total").textContent =
          "₦" + total.toLocaleString("en-NG");
        document.getElementById("summary-building-amt").textContent =
          "₦" + building.toLocaleString("en-NG");
        document.getElementById("summary-contents-amt").textContent =
          "₦" + contents.toLocaleString("en-NG");
        document.getElementById("summary-note").textContent =
          building > 50000000
            ? "Assessor visit required for policies above ₦50M."
            : "No assessor visit needed at this time.";
      }
      function togglePeril(peril) {
        const idx = selectedPerils.indexOf(peril);
        const el = document.getElementById("perk-" + peril);
        if (idx >= 0) {
          selectedPerils.splice(idx, 1);
          el.classList.remove("selected");
        } else {
          selectedPerils.push(peril);
          el.classList.add("selected");
        }
        updatePremium();
      }
      function triggerUpload(slot) {
        document.querySelector("#slot-" + slot + " .photo-input").click();
      }
      function handlePhoto(input, slot) {
        if (input.files && input.files[0]) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const slotEl = document.getElementById("slot-" + slot);
            let prev = slotEl.querySelector(".photo-preview");
            if (!prev) {
              prev = document.createElement("img");
              prev.className = "photo-preview";
              slotEl.appendChild(prev);
            }
            prev.src = e.target.result;
            slotEl.classList.add("filled");
            photos[slot - 1] = true;
          };
          reader.readAsDataURL(input.files[0]);
        }
      }
      function validateStep(step) {
        if (step === 2) {
          let ok = true;
          [
            ["prop-address"],
            ["prop-state"],
            ["prop-year"],
            ["prop-rooms"],
          ].forEach(([id]) => {
            const el = document.getElementById(id);
            const grp = el.closest(".form-group");
            if (!el.value) {
              grp.classList.add("error");
              ok = false;
            } else grp.classList.remove("error");
          });
          return ok;
        }
        if (step === 4) {
          const all = photos.every(Boolean);
          document.getElementById("photo-alert").style.display = all
            ? "none"
            : "block";
          return all;
        }
        return true;
      }
      
      function nextStep(from) {
        if (!validateStep(from)) return;
        if (from === 1) { goToStep(2); return; }
        if (from === 3) updatePremium();
        if (from === 4) {
          document.getElementById("summary-property-type").textContent = selectedProperty;
          document.getElementById("summary-address").textContent = document.getElementById("prop-address").value;
        }
        goToStep(from + 1);
      }
      function prevStep(cur) {
        if (cur === 'otp') {
          document.getElementById("step-otp").classList.remove("active");
          document.getElementById("step-5").classList.add("active");
          currentStep = 5;
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
        const amountEl = document.getElementById("summary-total");

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
          ref: "COVA-PROPERTY-" + Date.now(),
          metadata: {
            custom_fields: [
              {
                display_name: "Product Type",
                variable_name: "product_type",
                value: "PROPERTY",
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
    