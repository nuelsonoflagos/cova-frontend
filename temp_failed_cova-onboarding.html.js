
      let currentStep = 1;
      let selectedDevice = "smartphone";
      let selectedPlan = "full";
      let selectedFreq = "weekly";
      let photosUploaded = [false, false, false, false];
      let deviceValue = 2000000;

      const prices = {
        damage: { weekly: 0.03 / 52, monthly: 0.03 / 12, annual: 0.03 * 0.9 },
        full: { weekly: 0.06 / 52, monthly: 0.06 / 12, annual: 0.06 * 0.9 },
      };

      function fmt(n) {
        return "₦" + Math.round(n).toLocaleString("en-NG");
      }

      function updatePremium() {
        const v =
          parseFloat(document.getElementById("device-value").value) || 2000000;
        deviceValue = v;
        refreshPrices();
      }

      function refreshPrices() {
        const dw = deviceValue * prices.damage[selectedFreq];
        const fw = deviceValue * prices.full[selectedFreq];
        const suffix =
          selectedFreq === "weekly"
            ? "/wk"
            : selectedFreq === "monthly"
              ? "/mo"
              : "/yr";
        const sub =
          selectedFreq === "weekly"
            ? `${fmt(deviceValue * prices.damage.monthly)}/month`
            : selectedFreq === "monthly"
              ? `${fmt(deviceValue * prices.damage.weekly)}/week`
              : `Save 10% vs monthly`;
        const sub2 =
          selectedFreq === "weekly"
            ? `${fmt(deviceValue * prices.full.monthly)}/month`
            : selectedFreq === "monthly"
              ? `${fmt(deviceValue * prices.full.weekly)}/week`
              : `Save 10% vs monthly`;
        document.getElementById("price-damage").innerHTML =
          fmt(dw) + `<span>${suffix}</span>`;
        document.getElementById("price-full").innerHTML =
          fmt(fw) + `<span>${suffix}</span>`;
        document.getElementById("period-damage").textContent = sub;
        document.getElementById("period-full").textContent = sub2;
        updateSummaryPrice();
      }

      function updateSummaryPrice() {
        const plan = selectedPlan === "full" ? prices.full : prices.damage;
        const price = deviceValue * plan[selectedFreq];
        document.getElementById("sum-price").textContent = fmt(price);
      }

      function selectDevice(el, type) {
        document
          .querySelectorAll(".device-option")
          .forEach((d) => d.classList.remove("selected"));
        el.classList.add("selected");
        selectedDevice = type;
      }

      function selectPlan(plan) {
        selectedPlan = plan;
        document
          .querySelectorAll(".plan-card")
          .forEach((c) => c.classList.remove("selected"));
        document.getElementById("plan-" + plan).classList.add("selected");
        document.getElementById("sum-plan").textContent =
          plan === "full" ? "Full Cover" : "Damage Cover";
        updateSummaryPrice();
      }

      function setFreq(freq, el) {
        selectedFreq = freq;
        document
          .querySelectorAll(".freq-tab")
          .forEach((t) => t.classList.remove("active"));
        el.classList.add("active");
        refreshPrices();
        document.getElementById("pol-next").textContent =
          freq === "weekly"
            ? "In 7 days"
            : freq === "monthly"
              ? "In 30 days"
              : "In 365 days";
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
            photosUploaded[slot - 1] = true;
          };
          reader.readAsDataURL(input.files[0]);
        }
      }

      function triggerUpload(slot) {
        document.querySelector("#slot-" + slot + " .photo-input").click();
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
            ["fg-firstname", "firstname", (v) => v.trim().length > 1],
            ["fg-lastname", "lastname", (v) => v.trim().length > 1],
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
          fields.forEach(([gid, fid, fn]) => {
            const val = document.getElementById(fid).value;
            const grp = document.getElementById(gid);
            if (!fn(val)) {
              grp.classList.add("error");
              ok = false;
            } else grp.classList.remove("error");
          });
          return ok;
        }
        
        if (step === 2) {
          let ok = true;
          const brand = document.getElementById("brand").value;
          const val = parseFloat(document.getElementById("device-value").value);
          const imei = document.getElementById("imei").value;
          if (!brand.trim()) {
            document.getElementById("fg-brand").classList.add("error");
            ok = false;
          } else document.getElementById("fg-brand").classList.remove("error");
          if (!val || val < 50000) {
            document.getElementById("fg-value").classList.add("error");
            ok = false;
          } else document.getElementById("fg-value").classList.remove("error");
          if (imei && imei.length !== 15) {
            document.getElementById("fg-imei").classList.add("error");
            ok = false;
          } else document.getElementById("fg-imei").classList.remove("error");
          return ok;
        }
        if (step === 3) {
          const allUploaded = photosUploaded.every(Boolean);
          document.getElementById("photo-error").style.display = allUploaded
            ? "none"
            : "block";
          return allUploaded;
        }
        return true;
      }

      function nextStep(from) {
        if (!validateStep(from)) return;
        if (from === 1) { goToStep(2); return; }
        
        
        
        if (from === 2) {
          const fn = document.getElementById("firstname").value;
          const ln = document.getElementById("lastname").value;
          const brand = document.getElementById("brand").value;
          const val =
            parseFloat(document.getElementById("device-value").value) ||
            2000000;
          deviceValue = val;
          document.getElementById("sum-name").textContent = fn + " " + ln;
          document.getElementById("sum-device").textContent = brand;
          document.getElementById("sum-value").textContent = fmt(val);
          document.getElementById("pol-device").textContent = brand;
          refreshPrices();
        }
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
        for (let i = 1; i <= 5; i++) {
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
          const dest = document.getElementById("phone").value;
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
          ref: "COVA-DEVICE-" + Date.now(),
          metadata: {
            custom_fields: [
              {
                display_name: "Product Type",
                variable_name: "product_type",
                value: "DEVICE",
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

      async function submitDevicePolicy() {
        // Get form data
        const deviceName = document.getElementById("device-name").value;
        const deviceValue = parseFloat(
          document.getElementById("device-value").value,
        );
        const coverType = document.getElementById("cover-type").value;
        const imei = document.getElementById("imei").value;

        // Validation
        if (!deviceName || !deviceValue || !coverType || !imei) {
          alert("Please fill in all fields");
          return;
        }

        // Prepare data for backend
        const policyData = {
          product_type: "device",
          cover_type: coverType,
          insurer: "AXA", // or dynamic based on form
          sum_insured: deviceValue,
          premium_amount: calculateDevicePremium(deviceValue, coverType),
          premium_frequency: "monthly",
          start_date: new Date().toISOString().split("T")[0],
          end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          metadata: {
            device_name: deviceName,
            imei: imei,
            device_value: deviceValue,
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

      function calculateDevicePremium(deviceValue, coverType) {
        if (coverType === "damage-only") {
          return deviceValue * 0.03; // 3% for damage only
        } else if (coverType === "full-cover") {
          return deviceValue * 0.06; // 6% for full cover
        }
        return 0;
      }
    