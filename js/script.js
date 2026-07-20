/**
 * script.js - Controller Logic untuk Undangan Pernikahan
 * Menggunakan "use strict" untuk kepatuhan standar modern
 */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Validasi awal data undangan
    if (typeof window.invitationData === "undefined") {
        console.error("Warning: invitationData tidak ditemukan di window. Pastikan invitation-data.js dimuat sebelum script.js.");
        return;
    }

    const data = window.invitationData;

    // 2. Eksekusi inisialisasi seluruh komponen halaman
    initializeInvitation(data);
    renderCouple(data);
    renderOpening(data);
    renderEvents(data);
    renderLocation(data);
    renderGallery(data);
    initWishesSection(data);

    // Inisialisasi pengendali interaksi
    const audioController = initializeMusic(data);
    initializeLightbox();
    initializeRevealAnimations();
    initializeCoverButton(audioController);
    initializeNavigationMenu();
});

/**
 * Mengubah karakter input menjadi aman dari XSS
 */
function sanitizeText(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML.replace(/\n/g, "<br>");
}

/**
 * Mengisi SEO, judul halaman, dan meta tag dinamis
 */
function initializeInvitation(data) {
    const coupleNames = data.couple.displayName || "Capt. Edwar & dr. Icha";

    // Update Title
    document.title = `Undangan Pernikahan ${coupleNames}`;

    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute("content", `Undangan Pernikahan Digital ${coupleNames}. Hadiri hari bahagia kami pada ${data.wedding.dateText}.`);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", `Undangan Pernikahan ${coupleNames}`);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", data.opening.text || "Dengan memohon rahmat Allah SWT, kami mengundang Anda untuk menghadiri pernikahan kami.");

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && data.images.cover) ogImage.setAttribute("content", data.images.cover);

    // Render nama tamu kustom dari URL
    renderGuestName();
}

/**
 * Membaca nama tamu dari URL query (?saudara=... atau ?to=...)
 */
function renderGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    let guestName = urlParams.get("saudara") || urlParams.get("to");
    let locVal = urlParams.get("loc") || urlParams.get("u") || urlParams.get("di") || urlParams.get("place") || urlParams.get("location");

    // Parse custom format like to=Wahyu?=smd or to=Wahyu?smd
    if (guestName) {
        if (guestName.includes("?=")) {
            const parts = guestName.split("?=");
            guestName = parts[0];
            if (!locVal) {
                locVal = parts[1];
            }
        } else if (guestName.includes("?")) {
            const parts = guestName.split("?");
            guestName = parts[0];
            if (!locVal) {
                locVal = parts[1];
                if (locVal.startsWith("=")) {
                    locVal = locVal.substring(1);
                }
            }
        }
    }

    const guestDisplay = document.getElementById("guest-name-display");
    const locationDisplay = document.getElementById("guest-location-display");

    // Render guest name
    if (guestName) {
        guestName = guestName.replace(/\+/g, " ").trim();
        if (guestDisplay) {
            guestDisplay.textContent = guestName;
        }
    } else {
        if (guestDisplay) {
            guestDisplay.textContent = "Tamu Undangan";
        }
    }

    // Render guest location
    let locationText = "Di Tempat";
    if (locVal) {
        locVal = locVal.replace(/\+/g, " ").trim();
        const codeKey = locVal.toLowerCase();

        // Find mapped location
        const codes = (window.invitationData && window.invitationData.location && window.invitationData.location.codes) || {};
        let mappedLocation = codes[codeKey];

        if (mappedLocation) {
            locationText = "Di " + mappedLocation;
        } else {
            // Capitalize first letters of raw location
            const formattedLoc = locVal.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');

            if (formattedLoc.toLowerCase().startsWith("di ")) {
                locationText = formattedLoc;
            } else {
                locationText = "Di " + formattedLoc;
            }
        }
    }

    if (locationDisplay) {
        locationDisplay.textContent = locationText;
    }
}

/**
 * Mengisi data cover (Halaman 1)
 */
function initializeCoverButton(audioController) {
    const btnOpen = document.getElementById("btn-open-invitation");
    const openingSection = document.getElementById("opening");
    const musicContainer = document.getElementById("music-player-container");

    if (btnOpen && openingSection) {
        btnOpen.addEventListener("click", () => {
            // 1. Smooth scroll ke bagian isi undangan
            openingSection.scrollIntoView({ behavior: "smooth" });

            // 2. Putar musik secara otomatis jika diaktifkan
            if (audioController && audioController.enabled) {
                audioController.play();
            }

            // 3. Tampilkan floating music control
            if (musicContainer && audioController && audioController.enabled) {
                musicContainer.classList.add("visible");
                musicContainer.removeAttribute("aria-hidden");
            }
        });
    }
}

/**
 * Merender profil mempelai pria & wanita
 */
function renderCouple(data) {
    const groom = data.couple.groom;
    const bride = data.couple.bride;
    const initials = data.couple.initials || "E & I";

    // Isi nama cover
    const coverCouple = document.getElementById("cover-couple-display");
    if (coverCouple) {
        coverCouple.innerHTML = `
            <span class="name-groom">${sanitizeText(groom.fullName)}</span>
            <span class="ampersand">&</span>
            <span class="name-bride">${sanitizeText(bride.fullName)}</span>
        `;
    }

    const coverInitials = document.getElementById("cover-monogram-initials");
    if (coverInitials) coverInitials.textContent = initials;

    const coverDate = document.getElementById("cover-wedding-date");
    if (coverDate) coverDate.textContent = data.wedding.shortDate || data.wedding.dateText;

    // Mempelai Pria (Groom)
    const groomShortname = document.getElementById("groom-shortname");
    if (groomShortname) groomShortname.textContent = groom.shortName;

    const groomFullname = document.getElementById("groom-fullname");
    if (groomFullname) groomFullname.textContent = groom.fullName;

    const groomParentBox = document.getElementById("groom-parent-box");
    const groomFather = document.getElementById("groom-father");
    const groomMother = document.getElementById("groom-mother");
    const groomParentInfo = document.getElementById("groom-parent-info");

    // Validasi apabila nama orang tua pria belum tersedia
    if (!groom.fatherName && !groom.motherName) {
        if (groomParentBox) groomParentBox.style.display = "none";
    } else {
        if (groomParentBox) groomParentBox.style.display = "block";
        if (groomParentInfo) groomParentInfo.textContent = groom.parentInfo || "Putra dari";
        if (groomFather) groomFather.textContent = groom.fatherName || "";
        if (groomMother) groomMother.textContent = groom.motherName || "";
    }

    // Monogram tengah
    const centerInitials = document.getElementById("mempelai-initials");
    if (centerInitials) centerInitials.textContent = initials;

    // Mempelai Wanita (Bride)
    const brideShortname = document.getElementById("bride-shortname");
    if (brideShortname) brideShortname.textContent = bride.shortName;

    const brideFullname = document.getElementById("bride-fullname");
    if (brideFullname) brideFullname.textContent = bride.fullName;

    const brideParentBox = document.getElementById("bride-parent-box");
    const brideFather = document.getElementById("bride-father");
    const brideMother = document.getElementById("bride-mother");
    const brideParentInfo = document.getElementById("bride-parent-info");

    // Validasi apabila nama orang tua wanita belum tersedia
    if (!bride.fatherName && !bride.motherName) {
        if (brideParentBox) brideParentBox.style.display = "none";
    } else {
        if (brideParentBox) brideParentBox.style.display = "block";
        if (brideParentInfo) brideParentInfo.textContent = bride.parentInfo || "Putri dari";
        if (brideFather) brideFather.textContent = bride.fatherName || "";
        if (brideMother) brideMother.textContent = bride.motherName || "";
    }
}

/**
 * Merender salam pembuka dan quote
 */
function renderOpening(data) {
    const opening = data.opening;

    const greeting = document.getElementById("opening-greeting");
    if (greeting) greeting.textContent = opening.greeting;

    const text = document.getElementById("opening-text");
    if (text) text.textContent = opening.text;

    // Menangani quote box
    const quoteBox = document.getElementById("quote-box");
    const quoteContent = document.getElementById("quote-content");
    const quoteSource = document.getElementById("quote-source");

    if (!opening.quote) {
        if (quoteBox) quoteBox.style.display = "none";
    } else {
        if (quoteBox) quoteBox.style.display = "block";
        if (quoteContent) quoteContent.textContent = `“${opening.quote}”`;
        if (quoteSource) {
            if (opening.quoteSource) {
                quoteSource.textContent = opening.quoteSource;
                quoteSource.style.display = "block";
            } else {
                quoteSource.style.display = "none";
            }
        }
    }

    // Set horizontal image source
    const horizontalImg = document.getElementById("img-couple-horizontal");
    if (horizontalImg && data.images.coupleHorizontal) {
        horizontalImg.src = data.images.coupleHorizontal;
        horizontalImg.alt = `Foto Pasangan ${data.couple.displayName}`;
    }
}

/**
 * Menghasilkan link Google Calendar dinamis
 */
function buildGoogleCalendarUrl(event, dateISO) {
    if (!dateISO) return "#";
    const title = encodeURIComponent(event.calendarTitle || event.name);
    const details = encodeURIComponent(`Acara: ${event.name}\nWaktu: ${event.startTime} - ${event.endTime}\nLokasi: ${event.venue}\nAlamat: ${event.address}`);
    const locationStr = encodeURIComponent(event.venue ? `${event.venue}, ${event.address}` : event.address);

    // Format tanggal ISO ke format kalender Google: YYYYMMDD
    const dateClean = dateISO.replace(/-/g, "");

    // Ambil jam & menit dari startTime. Ex: "08.00 WITA" -> "08", "00"
    let startHour = "08";
    let startMin = "00";
    if (event.startTime) {
        const matches = event.startTime.match(/(\d{2})[.:](\d{2})/);
        if (matches) {
            startHour = matches[1];
            startMin = matches[2];
        }
    }

    // Ambil jam & menit dari endTime atau asumsikan 2 jam jika "Selesai"
    let endHour = (parseInt(startHour) + 2).toString().padStart(2, "0");
    let endMin = startMin;
    if (event.endTime && event.endTime !== "Selesai") {
        const matches = event.endTime.match(/(\d{2})[.:](\d{2})/);
        if (matches) {
            endHour = matches[1];
            endMin = matches[2];
        }
    }

    // Format: YYYYMMDDTHHMMSS/YYYYMMDDTHHMMSS (local time)
    const startStr = `${dateClean}T${startHour}${startMin}00`;
    const endStr = `${dateClean}T${endHour}${endMin}00`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${locationStr}`;
}

/**
 * Merender daftar acara pernikahan secara dinamis
 */
function renderEvents(data) {
    const container = document.getElementById("events-container");
    if (!container) return;

    container.innerHTML = "";
    const events = data.events || [];

    if (events.length === 0) {
        const noEventText = document.createElement("p");
        noEventText.style.textAlign = "center";
        noEventText.style.fontStyle = "italic";
        noEventText.textContent = "Informasi acara belum tersedia.";
        container.appendChild(noEventText);
        return;
    }

    events.forEach(event => {
        const card = document.createElement("div");
        card.className = "event-card";

        // Tentukan baris alamat & venue jika diisi
        const venueHTML = event.venue ? `<span class="event-venue">${sanitizeText(event.venue)}</span>` : "";
        const addressHTML = event.address ? `<span class="event-address">${sanitizeText(event.address)}</span>` : "";

        // Buat Google Calendar URL
        const calUrl = buildGoogleCalendarUrl(event, data.wedding.dateISO);

        // SVG icon definitions
        const calendarIcon = `
            <svg class="event-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
        `;

        const clockIcon = `
            <svg class="event-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
        `;

        const locationIcon = `
            <svg class="event-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                <circle cx="12" cy="10" r="3"></circle>
            </svg>
        `;

        // Render maps & calendar buttons conditional
        let buttonsHTML = "";

        // Google Calendar button
        if (data.wedding.dateISO) {
            buttonsHTML += `
                <a href="${calUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-gold" aria-label="Tambahkan ${event.name} ke Google Kalender">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                        <line x1="12" y1="14" x2="12" y2="18"></line>
                        <line x1="10" y1="16" x2="14" y2="16"></line>
                    </svg>
                    <span>Simpan ke Kalender</span>
                </a>
            `;
        }

        // Google Maps button
        if (event.mapUrl) {
            buttonsHTML += `
                <a href="${event.mapUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" aria-label="Buka lokasi ${event.name} di Google Maps">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                        <line x1="9" y1="3" x2="9" y2="18"></line>
                        <line x1="15" y1="6" x2="15" y2="21"></line>
                    </svg>
                    <span>Peta Lokasi</span>
                </a>
            `;
        }

        card.innerHTML = `
            <h3 class="event-name">${sanitizeText(event.name)}</h3>
            <div class="event-details">
                <div class="event-detail-item">
                    ${calendarIcon}
                    <div class="event-text">
                        <span>${sanitizeText(event.date || data.wedding.dateText)}</span>
                    </div>
                </div>
                <div class="event-detail-item">
                    ${clockIcon}
                    <div class="event-text">
                        <span>${sanitizeText(event.startTime)} - ${sanitizeText(event.endTime)}</span>
                    </div>
                </div>
                ${(venueHTML || addressHTML) ? `
                <div class="event-detail-item">
                    ${locationIcon}
                    <div class="event-text">
                        ${venueHTML}
                        ${addressHTML}
                    </div>
                </div>
                ` : ""}
            </div>
            ${buttonsHTML ? `<div class="event-actions">${buttonsHTML}</div>` : ""}
        `;

        container.appendChild(card);
    });
}

/**
 * Merender section lokasi utama & embed Google Maps
 */
function renderLocation(data) {
    const loc = data.location;

    const locVenue = document.getElementById("location-venue");
    if (locVenue) {
        if (loc.venue) {
            locVenue.textContent = loc.venue;
            locVenue.style.display = "block";
        } else {
            locVenue.style.display = "none";
        }
    }

    const locAddress = document.getElementById("location-address");
    if (locAddress) {
        if (loc.address) {
            locAddress.textContent = loc.address;
            locAddress.style.display = "block";
        } else {
            locAddress.style.display = "none";
        }
    }

    // Google Maps Redirect Button
    const btnMap = document.getElementById("btn-location-map");
    if (btnMap) {
        if (loc.mapUrl) {
            btnMap.href = loc.mapUrl;
            btnMap.parentNode.style.display = "flex";
        } else {
            btnMap.parentNode.style.display = "none";
        }
    }

    // Google Maps QR Code
    const qrContainer = document.getElementById("location-qrcode-container");
    const qrImg = document.getElementById("location-qrcode");
    if (qrContainer && qrImg) {
        if (loc.mapUrl) {
            // Generate QR Code dynamically matching the theme color
            qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0d1b2a&data=${encodeURIComponent(loc.mapUrl)}`;
            qrContainer.style.display = "flex";
        } else {
            qrContainer.style.display = "none";
        }
    }

    // Google Maps Embed Iframe
    const mapEmbedContainer = document.getElementById("map-embed-container");
    if (mapEmbedContainer) {
        if (loc.mapEmbedUrl) {
            mapEmbedContainer.innerHTML = `
                <iframe 
                    src="${loc.mapEmbedUrl}"
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade"
                    title="Peta Lokasi Pernikahan"
                    aria-label="Peta Google Maps interaktif lokasi acara"
                ></iframe>
            `;
            mapEmbedContainer.style.display = "block";
        } else {
            mapEmbedContainer.style.display = "none";
        }
    }
}

/**
 * Merender galeri foto horizontal scroll-snap beserta dots navigasi
 */
function renderGallery(data) {
    const slider = document.getElementById("gallery-slider-element");
    const dotsContainer = document.getElementById("gallery-dots");
    const gallerySection = document.getElementById("galeri");

    if (!slider || !dotsContainer) return;

    slider.innerHTML = "";
    dotsContainer.innerHTML = "";

    const images = data.images.gallery || [];

    // Jika tidak ada gambar galeri, sembunyikan seluruh section
    if (images.length === 0) {
        if (gallerySection) gallerySection.style.display = "none";
        return;
    } else {
        if (gallerySection) gallerySection.style.display = "block";
    }

    images.forEach((imgObj, idx) => {
        // Create Gallery Item
        const item = document.createElement("div");
        item.className = "gallery-item";
        item.setAttribute("role", "button");
        item.setAttribute("tabindex", "0");
        item.setAttribute("aria-label", `Buka foto galeri ${idx + 1}`);

        // Image Element
        const img = document.createElement("img");
        img.src = imgObj.src;
        img.alt = imgObj.alt || `Foto Galeri Pernikahan ${idx + 1}`;
        img.loading = "lazy";
        img.decoding = "async";
        if (imgObj.src && imgObj.src.includes("gallery-1")) {
            img.classList.add("crop-top");
        }

        const overlay = document.createElement("div");
        overlay.className = "gallery-overlay-hint";
        overlay.innerHTML = `<span>Detail foto ${idx + 1}</span>`;

        item.appendChild(img);
        item.appendChild(overlay);
        slider.appendChild(item);

        // Create Navigation Dot
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `indicator-dot ${idx === 0 ? "active" : ""}`;
        dot.setAttribute("aria-label", `Lihat foto galeri ${idx + 1}`);
        dot.addEventListener("click", () => {
            const itemWidth = item.clientWidth;
            const gap = 16;
            slider.scrollTo({
                left: idx * (itemWidth + gap),
                behavior: "smooth"
            });
        });
        dotsContainer.appendChild(dot);
    });

    // Menghubungkan Event Scroll Slider untuk memperbarui status dot indicator
    let isScrolling;
    slider.addEventListener("scroll", () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            const items = slider.querySelectorAll(".gallery-item");
            if (items.length === 0) return;

            const scrollLeft = slider.scrollLeft;
            const itemWidth = items[0].clientWidth;
            const gap = 16; // sesuai CSS gap

            // Hitung slide terdekat saat ini
            const activeIndex = Math.round(scrollLeft / (itemWidth + gap));

            const dots = dotsContainer.querySelectorAll(".indicator-dot");
            dots.forEach((dot, dotIdx) => {
                if (dotIdx === activeIndex) {
                    dot.classList.add("active");
                } else {
                    dot.classList.remove("active");
                }
            });
        }, 100);
    });

    // Keyboard support untuk mempermudah navigasi slider
    slider.addEventListener("keydown", (e) => {
        const items = slider.querySelectorAll(".gallery-item");
        if (items.length === 0) return;

        const itemWidth = items[0].clientWidth;
        const gap = 16;

        if (e.key === "ArrowRight") {
            slider.scrollBy({ left: itemWidth + gap, behavior: "smooth" });
            e.preventDefault();
        } else if (e.key === "ArrowLeft") {
            slider.scrollBy({ left: -(itemWidth + gap), behavior: "smooth" });
            e.preventDefault();
        }
    });

    // Auto Slide Logic (Mewah & Lembut)
    let autoSlideInterval;
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(() => {
            const items = slider.querySelectorAll(".gallery-item");
            if (items.length <= 1) return;

            const scrollLeft = slider.scrollLeft;
            const itemWidth = items[0].clientWidth;
            const gap = 16;
            const totalSlides = items.length;

            let nextIndex = Math.round(scrollLeft / (itemWidth + gap)) + 1;
            if (nextIndex >= totalSlides) {
                nextIndex = 0;
            }

            slider.scrollTo({
                left: nextIndex * (itemWidth + gap),
                behavior: "smooth"
            });
        }, 3000); // Bergeser otomatis setiap 3 detik
    };

    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };

    // Mulai auto slide
    startAutoSlide();

    // Hentikan geser otomatis jika tamu menyentuh/menggeser manual
    slider.addEventListener("touchstart", stopAutoSlide, { passive: true });
    slider.addEventListener("mousedown", stopAutoSlide);

    // Mengisi penutup
    const footerInitials = document.getElementById("footer-initials");
    if (footerInitials) footerInitials.textContent = data.couple.initials || "E & I";

    const closingText = document.getElementById("closing-text");
    if (closingText) closingText.textContent = data.closing.text;

    const closingThankyou = document.getElementById("closing-thankyou");
    if (closingThankyou) closingThankyou.textContent = data.closing.thankYou;

    const closingSignature = document.getElementById("closing-signature");
    if (closingSignature) closingSignature.textContent = data.closing.signature;
}

/**
 * Pengendali audio loop berlatar belakang musik undangan
 */
function initializeMusic(data) {
    const audio = document.getElementById("wedding-audio");
    const musicBtn = document.getElementById("btn-toggle-music");
    const musicContainer = document.getElementById("music-player-container");
    const tooltip = document.getElementById("music-tooltip");

    const controller = {
        enabled: false,
        playing: false,
        play: function () { },
        pause: function () { }
    };

    if (!audio || !musicBtn) return controller;

    // Jika musik dinonaktifkan dalam data, sembunyikan player
    if (!data.music || !data.music.enabled) {
        if (musicContainer) musicContainer.style.display = "none";
        return controller;
    }

    controller.enabled = true;

    // Tampilkan player secara langsung jika aktif
    if (musicContainer) {
        musicContainer.classList.add("visible");
        musicContainer.removeAttribute("aria-hidden");
    }

    // Set file path lagu secara dinamis
    audio.src = data.music.file;
    audio.loop = true;
    audio.preload = "metadata";

    // Set volume default
    const volume = parseFloat(data.music.defaultVolume);
    audio.volume = isNaN(volume) ? 0.45 : Math.max(0, Math.min(1, volume));

    // Helper update UI status tombol musik
    function updateMusicUI(isPlaying) {
        controller.playing = isPlaying;
        if (isPlaying) {
            musicBtn.classList.add("playing");
            musicBtn.classList.remove("paused");
            musicBtn.setAttribute("aria-label", "Jeda Musik");
            if (tooltip) tooltip.textContent = "Jeda Musik";
        } else {
            musicBtn.classList.remove("playing");
            musicBtn.classList.add("paused");
            musicBtn.setAttribute("aria-label", "Putar Musik");
            if (tooltip) tooltip.textContent = "Putar Musik";
        }
    }

    // Hubungkan fungsi aksi pemutaran musik
    controller.play = function () {
        audio.play()
            .then(() => {
                updateMusicUI(true);
            })
            .catch(err => {
                console.warn("Browser memblokir autoplay musik sebelum interaksi terdeteksi:", err);
                updateMusicUI(false);
            });
    };

    controller.pause = function () {
        audio.pause();
        updateMusicUI(false);
    };

    // Tombol click toggler
    musicBtn.addEventListener("click", () => {
        if (controller.playing) {
            controller.pause();
        } else {
            controller.play();
        }
    });

    // Menangani error loading audio
    audio.addEventListener("error", (e) => {
        console.warn("Gagal memuat file lagu. Mematikan kontroler musik.", e);
        if (musicContainer) {
            musicContainer.style.display = "none";
        }
        controller.enabled = false;
    });

    // Pemicu putar musik otomatis pada interaksi pertama tamu dengan halaman (klik, sentuh, scroll)
    // demi melewati pembatasan autoplay ketat dari browser modern.
    const startAutoplayOnInteraction = () => {
        if (!controller.playing && data.music.autoplayAfterOpen) {
            controller.play();

            // Periksa kembali jika sudah sukses berjalan, matikan pendengar event
            if (controller.playing || !audio.paused) {
                removeAutoplayListeners();
            }
        }
    };

    const removeAutoplayListeners = () => {
        document.removeEventListener("click", startAutoplayOnInteraction);
        document.removeEventListener("touchstart", startAutoplayOnInteraction);
        document.removeEventListener("scroll", startAutoplayOnInteraction);
    };

    if (data.music.autoplayAfterOpen) {
        document.addEventListener("click", startAutoplayOnInteraction);
        document.addEventListener("touchstart", startAutoplayOnInteraction, { passive: true });
        document.addEventListener("scroll", startAutoplayOnInteraction, { passive: true });
    }

    return controller;
}

/**
 * Pengendali Lightbox untuk pembesaran gambar galeri yang aksesibel
 */
function initializeLightbox() {
    const slider = document.getElementById("gallery-slider-element");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.getElementById("lightbox-close");

    if (!slider || !lightbox || !lightboxImg || !lightboxClose) return;

    let triggerElement = null; // Menyimpan elemen gambar yang diklik untuk pemulihan fokus

    // Fungsi membuka lightbox
    function openLightbox(imgSrc, imgAlt, triggerEl) {
        triggerElement = triggerEl;
        lightboxImg.src = imgSrc;
        lightboxImg.alt = imgAlt || "Foto Galeri Pernikahan";

        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        // Memindahkan fokus ke tombol close demi aksesibilitas
        setTimeout(() => {
            lightboxClose.focus();
        }, 100);

        // Menambahkan listener penutup
        document.addEventListener("keydown", handleLightboxKeydown);
    }

    // Fungsi menutup lightbox
    function closeLightbox() {
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");

        // Mengembalikan fokus ke elemen asal
        if (triggerElement) {
            triggerElement.focus();
        }

        document.removeEventListener("keydown", handleLightboxKeydown);
    }

    // Keyboard accessibility inside lightbox
    function handleLightboxKeydown(e) {
        if (e.key === "Escape") {
            closeLightbox();
        }

        // Trap focus (hanya bersirkulasi di antara close button dan image)
        if (e.key === "Tab") {
            e.preventDefault();
            lightboxClose.focus();
        }
    }

    // Tambah click listener ke semua item galeri yang di-render
    slider.addEventListener("click", (e) => {
        const item = e.target.closest(".gallery-item");
        if (!item) return;

        const img = item.querySelector("img");
        if (img) {
            openLightbox(img.src, img.alt, item);
        }
    });

    // Menangani klik tombol tutup
    lightboxClose.addEventListener("click", closeLightbox);

    // Menangani klik area luar gambar untuk menutup
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox || e.target.classList.contains("lightbox-content")) {
            closeLightbox();
        }
    });
}

/**
 * Memicu animasi reveal saat elemen masuk ke viewport dengan IntersectionObserver
 */
function initializeRevealAnimations() {
    // Mengecek preferensi reduced motion pengguna
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
        // Tampilkan seluruh konten langsung tanpa animasi jika reduced-motion disukai
        const revealElements = document.querySelectorAll(".reveal");
        revealElements.forEach(el => el.classList.add("active"));
        return;
    }

    // Validasi support IntersectionObserver
    if (!("IntersectionObserver" in window)) {
        const revealElements = document.querySelectorAll(".reveal");
        revealElements.forEach(el => el.classList.add("active"));
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: "0px 0px -60px 0px", // Memicu sesaat sebelum masuk layar penuh
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Berhenti mengamati setelah elemen muncul di layar
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Pengendali menu navigasi hamburger overlay
 */
function initializeNavigationMenu() {
    const btnToggle = document.getElementById("btn-toggle-menu");
    const btnClose = document.getElementById("btn-close-menu");
    const navOverlay = document.getElementById("nav-overlay");
    const navLinks = document.querySelectorAll(".nav-link-item");

    if (!btnToggle || !navOverlay || !btnClose) return;

    function openMenu() {
        navOverlay.classList.add("open");
        navOverlay.setAttribute("aria-hidden", "false");
        btnToggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("modal-open");

        // Trap focus to close button
        setTimeout(() => {
            btnClose.focus();
        }, 100);

        document.addEventListener("keydown", handleMenuKeydown);
    }

    function closeMenu() {
        navOverlay.classList.remove("open");
        navOverlay.setAttribute("aria-hidden", "true");
        btnToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("modal-open");

        btnToggle.focus();
        document.removeEventListener("keydown", handleMenuKeydown);
    }

    function handleMenuKeydown(e) {
        if (e.key === "Escape") {
            closeMenu();
        }

        // simple focus trap
        if (e.key === "Tab") {
            const focusables = navOverlay.querySelectorAll("a, button");
            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        }
    }

    btnToggle.addEventListener("click", openMenu);
    btnClose.addEventListener("click", closeMenu);

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            closeMenu();

            const targetId = link.getAttribute("href");
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}

/**
 * Mengelola inisialisasi, pemuatan, pengiriman, dan perenderan kartu ucapan & RSVP
 */
function initWishesSection(data) {
    const wishesForm = document.getElementById("wishes-form");
    const wishesList = document.getElementById("wishes-list");
    const wishesLoader = document.getElementById("wishes-loader");
    const wishNameInput = document.getElementById("wish-name");
    const wishesConfig = data.wishesConfig || { enabled: true, sheetUrl: "" };

    // Modal Elements
    const wishesModal = document.getElementById("wishes-modal");
    const wishesModalCloseBtn = document.getElementById("btn-close-wishes-modal");

    if (!wishesForm || !wishesList) return;

    // Autofill nama tamu dari parameter URL
    const urlParams = new URLSearchParams(window.location.search);
    let guestName = urlParams.get("saudara") || urlParams.get("to");
    if (guestName) {
        if (guestName.includes("?=")) {
            guestName = guestName.split("?=")[0];
        } else if (guestName.includes("?")) {
            guestName = guestName.split("?")[0];
        }
        if (wishNameInput) {
            wishNameInput.value = guestName.replace(/\+/g, " ").trim();
        }
    }

    // Modal Control Functions
    function showWishesSuccessModal() {
        if (wishesModal) {
            wishesModal.classList.add("visible");
            wishesModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
            if (wishesModalCloseBtn) {
                setTimeout(() => wishesModalCloseBtn.focus(), 100);
            }
        }
    }

    function closeWishesSuccessModal() {
        if (wishesModal) {
            wishesModal.classList.remove("visible");
            wishesModal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");
            const btnSubmit = document.getElementById("wish-submit-btn");
            if (btnSubmit) btnSubmit.focus();
        }
    }

    if (wishesModalCloseBtn) {
        wishesModalCloseBtn.addEventListener("click", closeWishesSuccessModal);
    }

    if (wishesModal) {
        wishesModal.addEventListener("click", (e) => {
            if (e.target === wishesModal) {
                closeWishesSuccessModal();
            }
        });
    }

    // Array internal untuk menyimpan ucapan saat ini
    let currentWishes = [];

    // Memuat ucapan
    loadWishes();

    // Event Listener Form Submission
    wishesForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btnSubmit = document.getElementById("wish-submit-btn");
        const btnText = document.getElementById("btn-text");
        const iconSend = btnSubmit.querySelector(".icon-send");
        const iconSpinner = btnSubmit.querySelector(".icon-loading-spinner");

        const name = wishNameInput.value.trim();
        const attendance = document.getElementById("wish-attendance").value;
        const message = document.getElementById("wish-message").value.trim();

        if (!name || !message) return;

        // Set status loading di tombol submit
        if (btnSubmit) btnSubmit.disabled = true;
        if (btnText) btnText.textContent = "Mengirim...";
        if (iconSend) iconSend.style.display = "none";
        if (iconSpinner) iconSpinner.style.display = "inline-block";

        const newWish = {
            name: name,
            message: message,
            attendance: attendance,
            timestamp: new Date().toISOString()
        };

        try {
            if (wishesConfig.enabled && wishesConfig.sheetUrl) {
                // Kirim ke Google Sheets API via GET (action=add)
                const queryParams = new URLSearchParams({
                    action: "add",
                    name: name,
                    message: message,
                    attendance: attendance
                });

                const response = await fetch(`${wishesConfig.sheetUrl}?${queryParams.toString()}`, {
                    method: "GET",
                    mode: "cors"
                });

                const result = await response.json();
                if (result.status !== "success") {
                    throw new Error(result.message || "Gagal menyimpan ke Google Sheets");
                }

                // Optimistic/Instant UI Update: Tambahkan ucapan baru ke array internal paling atas
                currentWishes.unshift(newWish);
                renderWishes(currentWishes);

                // Reset input pesan saja, biarkan nama terisi
                document.getElementById("wish-message").value = "";

                // Scroll daftar ucapan ke bagian teratas agar pengirim melihat ucapannya langsung
                wishesList.scrollTo({ top: 0, behavior: "smooth" });

                // Tampilkan modal sukses
                showWishesSuccessModal();
            } else {
                alert("Sistem penerimaan ucapan belum dikonfigurasi (sheetUrl kosong).");
            }
        } catch (error) {
            console.error("Error submitting wish:", error);
            alert("Gagal mengirim ucapan. Silakan periksa koneksi internet Anda.");
        } finally {
            // Kembalikan tombol submit ke keadaan semula
            if (btnSubmit) btnSubmit.disabled = false;
            if (btnText) btnText.textContent = "Kirim Ucapan";
            if (iconSend) iconSend.style.display = "inline-block";
            if (iconSpinner) iconSpinner.style.display = "none";
        }
    });

    /**
     * Memuat daftar ucapan dari Google Sheets (jika dikonfigurasi) atau Default Wishes
     */
    async function loadWishes() {
        try {
            if (wishesConfig.enabled && wishesConfig.sheetUrl) {
                const response = await fetch(wishesConfig.sheetUrl, {
                    method: "GET",
                    mode: "cors"
                });
                const result = await response.json();

                if (result.status === "success" && result.data) {
                    currentWishes = result.data;
                } else {
                    throw new Error("Response database gagal");
                }
            } else {
                currentWishes = data.defaultWishes || [];
            }
        } catch (error) {
            console.warn("Gagal memuat ucapan dari Google Sheets. Menggunakan data default:", error);
            currentWishes = data.defaultWishes || [];
        } finally {
            // Sembunyikan loader dan render
            if (wishesLoader) wishesLoader.style.display = "none";
            renderWishes(currentWishes);
        }
    }

    /**
     * Merender data ucapan ke elemen DOM list ucapan dan memperbarui statistik
     */
    function renderWishes(wishes) {
        wishesList.innerHTML = "";

        // Hapus loader jika masih ada
        if (wishesLoader) wishesLoader.style.display = "none";

        if (!wishes || wishes.length === 0) {
            wishesList.innerHTML = `<div class="wishes-empty">Belum ada ucapan. Jadilah yang pertama memberikan doa restu!</div>`;
            updateStats(0, 0, 0);
            return;
        }

        let totalCount = wishes.length;
        let hadirCount = 0;
        let tidakHadirCount = 0;

        wishes.forEach(wish => {
            // Hitung status kehadiran
            const att = (wish.attendance || "").toLowerCase();
            if (att === "hadir") {
                hadirCount++;
            } else if (att === "tidak_hadir" || att === "tidak") {
                tidakHadirCount++;
            }

            // Format Waktu
            const timeFormatted = formatWishDate(wish.timestamp);

            // Format Badge Kehadiran
            let badgeClass = "wish-badge-hadir";
            let badgeText = "Hadir";
            if (att === "tidak_hadir" || att === "tidak") {
                badgeClass = "wish-badge-tidak_hadir";
                badgeText = "Tidak Hadir";
            } else if (att === "ragu") {
                badgeClass = "wish-badge-ragu";
                badgeText = "Ragu-ragu";
            }

            const wishItem = document.createElement("div");
            wishItem.className = "wish-item";
            wishItem.innerHTML = `
                <div class="wish-content-wrapper">
                    <div class="wish-header">
                        <h4 class="wish-name">${sanitizeText(wish.name)}</h4>
                        <span class="wish-badge ${badgeClass}">${badgeText}</span>
                    </div>
                    <span class="wish-time">${timeFormatted}</span>
                    <p class="wish-message">${sanitizeText(wish.message)}</p>
                </div>
            `;
            wishesList.appendChild(wishItem);
        });

        // Update Statistik Kehadiran
        updateStats(totalCount, hadirCount, tidakHadirCount);
    }

    /**
     * Memperbarui visual statistik jumlah ucapan & kehadiran di UI
     */
    function updateStats(total, hadir, tidak) {
        const totalEl = document.getElementById("stat-count-total");
        const hadirEl = document.getElementById("stat-count-hadir");
        const tidakEl = document.getElementById("stat-count-tidak");

        if (totalEl) totalEl.textContent = total;
        if (hadirEl) hadirEl.textContent = hadir;
        if (tidakEl) tidakEl.textContent = tidak;
    }

    /**
     * Memformat tanggal ISO menjadi teks deskriptif yang rapi
     */
    function formatWishDate(dateStr) {
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return "";

            // Format relatif singkat untuk waktu yang sangat baru
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);

            if (diffMins < 1) return "Baru saja";
            if (diffMins < 60) return `${diffMins} menit lalu`;
            if (diffHours < 24) return `${diffHours} jam lalu`;

            // Format tanggal lengkap Bahasa Indonesia
            const options = {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return date.toLocaleDateString('id-ID', options).replace('pukul', '').trim();
        } catch (e) {
            return "";
        }
    }
}
