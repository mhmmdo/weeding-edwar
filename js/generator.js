document.addEventListener("DOMContentLoaded", () => {
    // 1. Detect and set Base URL default
    const baseUrlInput = document.getElementById("base-url");
    if (baseUrlInput) {
        // Detect current origin + pathname, strip 'generator.html'
        let currentUrl = window.location.origin + window.location.pathname;
        if (currentUrl.endsWith("generator.html")) {
            currentUrl = currentUrl.replace("generator.html", "");
        }
        if (!currentUrl.endsWith("/")) {
            currentUrl += "/";
        }
        baseUrlInput.value = currentUrl;
    }

    // 2. Load location codes from invitation-data.js
    const selectEl = document.getElementById("loc-select");
    const customLocGroup = document.getElementById("custom-loc-group");
    const customLocInput = document.getElementById("custom-loc");

    if (selectEl) {
        const codes = (window.invitationData && window.invitationData.location && window.invitationData.location.codes) || {};
        const kustomOption = selectEl.querySelector('option[value="kustom"]');
        
        for (const [code, name] of Object.entries(codes)) {
            const option = document.createElement("option");
            option.value = code;
            option.textContent = name;
            if (kustomOption) {
                selectEl.insertBefore(option, kustomOption);
            } else {
                selectEl.appendChild(option);
            }
        }

        // Toggle custom location input display
        selectEl.addEventListener("change", () => {
            if (selectEl.value === "kustom") {
                customLocGroup.style.display = "block";
                customLocInput.setAttribute("required", "required");
                customLocInput.focus();
            } else {
                customLocGroup.style.display = "none";
                customLocInput.removeAttribute("required");
                customLocInput.value = "";
            }
            updateResult();
        });
    }

    // 3. Dynamic Link Generation Logic
    const form = document.getElementById("generator-form");
    const guestNameInput = document.getElementById("guest-name");
    const guestTitleInput = document.getElementById("guest-title");
    const resultInput = document.getElementById("result-link");

    function getSelectedLocationText() {
        if (!selectEl) return "Tempat";
        const val = selectEl.value;
        if (val === "tempat") {
            return "Tempat";
        } else if (val === "kustom") {
            return customLocInput ? customLocInput.value.trim() : "";
        } else {
            // Find option text
            const opt = selectEl.querySelector(`option[value="${val}"]`);
            return opt ? opt.textContent : "";
        }
    }

    function updateResult() {
        if (!guestNameInput || !resultInput || !baseUrlInput) return;

        const base = baseUrlInput.value.trim();
        const name = guestNameInput.value.trim();
        const title = guestTitleInput ? guestTitleInput.value.trim() : "";
        const loc = selectEl ? selectEl.value : "tempat";

        if (!name) {
            resultInput.value = "";
            return;
        }

        // Build path
        let url = base;
        if (!url.endsWith("/")) {
            url += "/";
        }

        // Add guest name
        url += "?to=" + encodeURIComponent(name).replace(/%20/g, "+");

        // Add title if present
        if (title) {
            url += "&j=" + encodeURIComponent(title).replace(/%20/g, "+");
        }

        // Add location code suffix
        if (loc !== "tempat") {
            let locSuffix = "";
            if (loc === "kustom" && customLocInput) {
                locSuffix = customLocInput.value.trim();
            } else {
                locSuffix = loc;
            }

            if (locSuffix) {
                // Append shortcode or location text as suffix '?=loc'
                url += "?=" + encodeURIComponent(locSuffix).replace(/%20/g, "+");
            }
        }

        resultInput.value = url;
    }

    // Bind event listeners for auto updates
    [baseUrlInput, guestNameInput, guestTitleInput, customLocInput].forEach(el => {
        if (el) {
            el.addEventListener("input", updateResult);
        }
    });

    // 4. Copy to Clipboard Action
    const copyBtn = document.getElementById("btn-copy");
    const toast = document.getElementById("copy-toast");

    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            if (!resultInput || !resultInput.value) {
                alert("Silakan masukkan nama tamu terlebih dahulu untuk membuat link.");
                return;
            }

            resultInput.select();
            resultInput.setSelectionRange(0, 99999); // For mobile devices

            navigator.clipboard.writeText(resultInput.value)
                .then(() => {
                    if (toast) {
                        toast.classList.add("show");
                        setTimeout(() => {
                            toast.classList.remove("show");
                        }, 2000);
                    }
                })
                .catch(err => {
                    console.error("Gagal menyalin teks: ", err);
                    alert("Gagal menyalin link. Silakan salin secara manual.");
                });
        });
    }

    // 5. Send via WhatsApp Action
    const waBtn = document.getElementById("btn-whatsapp");
    const waTemplateArea = document.getElementById("wa-template");

    if (waBtn) {
        waBtn.addEventListener("click", () => {
            if (!resultInput || !resultInput.value) {
                alert("Silakan masukkan nama tamu terlebih dahulu untuk membuat link.");
                return;
            }

            const name = guestNameInput.value.trim();
            const title = guestTitleInput ? guestTitleInput.value.trim() : "";
            const locationName = getSelectedLocationText();
            const link = resultInput.value;

            let message = waTemplateArea ? waTemplateArea.value : "";

            // Replace placeholders
            message = message.replace(/\[Nama\]/g, name);
            message = message.replace(/\[Link\]/g, link);
            message = message.replace(/\[Lokasi\]/g, locationName);

            // Clean or replace position/title lines if empty
            if (title) {
                message = message.replace(/\[Jabatan\]/g, title);
            } else {
                // If title is empty, delete the line containing [Jabatan] entirely, including the asterisk wrapper
                message = message.replace(/\n\*\[Jabatan\]\*/g, "");
                message = message.replace(/\*\[Jabatan\]\*/g, "");
                message = message.replace(/\n\[Jabatan\]/g, "");
                message = message.replace(/\[Jabatan\]/g, "");
            }

            // Clean up double newlines that might arise from empty titles
            message = message.replace(/\n{3,}/g, "\n\n");

            // Open WhatsApp Web/App
            const waUrl = "https://api.whatsapp.com/send?text=" + encodeURIComponent(message);
            window.open(waUrl, "_blank");
        });
    }
});
