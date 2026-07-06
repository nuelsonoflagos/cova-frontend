
      let currentStep = 1;
      const productState = {
        fire: true,
        burglary: false,
        consequential: false,
        money: false,
        fidelity: false,
        liability: false,
      };
      let suppression = "sprinklers";
      let hasClaims = false;
      function goBack() {
        if (currentStep === 'otp') { prevStep('otp'); return; }
        if (currentStep === 'otp') { prevStep('otp'); return; }
        
        
        if (currentStep > 1) prevStep(currentStep);
        else window.history.back();
      }
      function toggleProduct(key) {
        productState[key] = !productState[key];
        const card = document.getElementById("prod-" + key);
        card.classList.toggle("selected", productState[key]);
        updateBundleBadge();
        updateAssetPanels();
      }
      function updateBundleBadge() {
        const count = Object.values(productState).filter(Boolean).length;
        document.getElementById("bundle-badge").style.display =
          count >= 3 ? "flex" : "none";
      }
      function updateAssetPanels() {
        Object.entries(productState).forEach(([key, sel]) => {
          const panel = document.getElementById("asset-" + key);
          if (panel) panel.style.display = sel ? "block" : "none";
        });
      }
      function selectSuppression(value) {
        suppression = value;
        ["supp-sprinklers", "supp-extinguishers", "supp-none"].forEach((id) =>
          document
            .getElementById(id)
            .classList.toggle("selected", id === "supp-" + value),
        );
      }
      function selectClaims(yes) {
        hasClaims = yes;
        document.getElementById("claims-yes").classList.toggle("selected", yes);
        document.getElementById("claims-no").classList.toggle("selected", !yes);
      }
      function parseNumber(id) {
        return Math.max(0, parseFloat(document.getElementById(id).value) || 0);
      }
      function calcPremium() {
        let fire = 0,
          burglary = 0,
          consequential = 0,
          money = 0,
          fidelity = 0,
          liability = 0;
        if (productState.fire) {
          const building = parseNumber("fire-building");
          const contents = parseNumber("fire-contents");
          const stock = parseNumber("fire-stock");
          fire = (building + contents + stock) * 0.0005;
        }
        if (productState.burglary) {
          const stock = parseNumber("burg-stock");
          const contents = parseNumber("burg-contents");
          burglary = (stock + contents) * 0.0012;
        }
        if (productState.consequential) {
          const gp = parseNumber("cl-gp");
          const period =
            Number(document.getElementById("cl-period").value) || 12;
          consequential = gp * period * 0.004;
        }
        if (productState.money) {
          const premises = parseNumber("money-premises");
          const transit = parseNumber("money-transit");
          money = (premises + transit) * 0.001;
        }
        if (productState.fidelity) {
          const salary = parseNumber("fidelity-salary");
          fidelity = salary * 0.003;
        }
        if (productState.liability) {
          const visitors = parseNumber("liab-visitors");
          liability = Math.max(250000, visitors * 5);
        }
        const total =
          fire + burglary + consequential + money + fidelity + liability;
        const count = Object.values(productState).filter(Boolean).length;
        const discount = count >= 3 ? total * 0.1 : 0;
        document.getElementById("premium-fire").textContent =
          "₦" + Math.round(fire).toLocaleString("en-NG");
        document.getElementById("premium-burglary").textContent =
          "₦" + Math.round(burglary).toLocaleString("en-NG");
        document.getElementById("premium-consequential").textContent =
          "₦" + Math.round(consequential).toLocaleString("en-NG");
        document.getElementById("premium-money").textContent =
          "₦" + Math.round(money).toLocaleString("en-NG");
        document.getElementById("premium-fidelity").textContent =
          "₦" + Math.round(fidelity).toLocaleString("en-NG");
        document.getElementById("premium-liability").textContent =
          "₦" + Math.round(liability).toLocaleString("en-NG");
        document.getElementById("row-bundle").style.display =
          discount > 0 ? "flex" : "none";
        document.getElementById("premium-discount").textContent =
          "-₦" + Math.round(discount).toLocaleString("en-NG");
        document.getElementById("premium-total").textContent =
          "₦" + Math.round(total - discount).toLocaleString("en-NG");
        return total - discount;
      }
      function togglePill(id) {
        const el = document.getElementById(id);
        el.classList.toggle("selected", el.querySelector("input").checked);
      }
      ["check-cctv", "check-guards", "check-alarm", "check-fence"].forEach(
        (id, i) => {
          document
            .getElementById(id)
            .addEventListener("change", () =>
              togglePill(
                ["sec-cctv", "sec-guards", "sec-alarm", "sec-fence"][i],
              ),
            );
        },
      );
      function validateStep(step) {
        if (step === 1) {
          const ok = Object.values(productState).some(Boolean);
          if (!ok) {
            alert("Select at least one product.");
          }
          return ok;
        }
        if (step === 2) {
          let ok = true;
          [
            ["company-name", "Enter company name"],
            ["company-rc", "Enter RC number"],
            ["company-state", "Select state"],
            ["annual-turnover", "Enter turnover"],
          ].forEach(([id, msg]) => {
            const el = document.getElementById(id);
            const grp = document.getElementById("fg-" + id.replace(/-/g, ""));
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
        if (from === 1) { goToStep(2); return; }
        if (from === 4) calcPremium();
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
          ref: "COVA-FIRE-" + Date.now(),
          metadata: {
            custom_fields: [
              {
                display_name: "Product Type",
                variable_name: "product_type",
                value: "FIRE",
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
    