// ==========================================
// EDIT DATA UNDANGAN DI FILE INI
// Ganti teks di dalam tanda kutip tanpa menghapus tanda koma
// Pastikan tidak ada data undefined atau null jika dikosongkan
// ==========================================

const invitationData = {
    couple: {
        groom: {
            shortName: "Captain Edwar", // Nama panggilan cover
            fullName: "Capt. Muhammad Edwar, S.E., M.M., M.Mar.",
            title: "Capt.",
            parentInfo: "Putra dari",
            fatherName: "", // Kosongkan jika belum tersedia
            motherName: ""  // Kosongkan jika belum tersedia
        },

        bride: {
            shortName: "Dokter Icha", // Nama panggilan cover
            fullName: "dr. Mustika Hany Tristanti, S.Ked.",
            title: "dr.",
            parentInfo: "Putri dari",
            fatherName: "Bapak Mustaqim",
            motherName: "Ibu Ratnawati (Almh.)" // Menggunakan Almh. karena wafat perempuan
        },

        displayName: "Captain Edwar & Dokter Icha",
        initials: "E & I"
    },

    wedding: {
        label: "The Wedding Of",
        dateText: "Minggu, 09 Agustus 2026", // Tanggal resepsi/akad utama
        dateISO: "2026-08-09", // Format standard YYYY-MM-DD untuk hitungan mundur / kalender
        shortDate: "09.08.2026" // Teks tanggal cover
    },

    opening: {
        greeting: "Assalamu’alaikum Warahmatullahi Wabarakatuh",
        text: "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.",
        quote: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.",
        quoteSource: "Q.S. Ar-Rum: 21"
    },

    events: [
        {
            name: "Akad Nikah",
            date: "Minggu, 09 Agustus 2026", // Boleh dikosongkan/diisi
            startTime: "08.00 WITA",
            endTime: "Selesai",
            venue: "Gedung/Aula Jamhuri Aisyah", 
            address: "Jl. Trans Kalimantan, Handil Bakti, Kec. Alalak, Kabupaten Barito Kuala, Kalimantan Selatan 70581", 
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Gedung%2FAula+Jamhuri+Aisyah", 
            calendarTitle: "Akad Nikah Captain Edwar & Dokter Icha"
        },
        {
            name: "Resepsi",
            date: "Minggu, 09 Agustus 2026", // Boleh dikosongkan/diisi
            startTime: "10.00 WITA",
            endTime: "Selesai",
            venue: "Gedung/Aula Jamhuri Aisyah", 
            address: "Jl. Trans Kalimantan, Handil Bakti, Kec. Alalak, Kabupaten Barito Kuala, Kalimantan Selatan 70581", 
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Gedung%2FAula+Jamhuri+Aisyah", 
            calendarTitle: "Resepsi Captain Edwar & Dokter Icha"
        }
    ],

    location: {
        venue: "Gedung/Aula Jamhuri Aisyah", 
        address: "Jl. Trans Kalimantan, Handil Bakti, Kec. Alalak, Kabupaten Barito Kuala, Kalimantan Selatan 70581", 
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Gedung%2FAula+Jamhuri+Aisyah", 
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.43870960813!2d114.6101680749716!3d-3.240529996734545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2de43db4c64aa2c3%3A0xd3a9a6bb83f027e3!2sGedung%2FAula%20Jamhuri%20Aisyah!5e0!3m2!1sid!2sid!4v1784388477521!5m2!1sid!2sid" 
    },

    images: {
        cover: "assets/images/cover.jpg",
        coupleHorizontal: "assets/images/couple-horizontal.jpg",
        gallery: [
            {
                src: "assets/images/gallery-1.jpg",
                alt: "Foto Capt. Edwar dan dr. Icha - Galeri 1"
            },
            {
                src: "assets/images/gallery-2.jpg",
                alt: "Foto Capt. Edwar dan dr. Icha - Galeri 2"
            }
        ]
    },

    music: {
        enabled: true, // Ubah ke false untuk mematikan fitur musik sepenuhnya
        file: "assets/music/wedding-song.m4a", // Path ke file lagu (M4A / MP3)
        title: "Wedding Song",
        autoplayAfterOpen: true, // Mulai putar otomatis setelah tombol "Buka Undangan" ditekan
        defaultVolume: 0.45 // Volume default (0.0 sampai 1.0)
    },

    closing: {
        text: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak, Ibu, Saudara, dan Saudari berkenan hadir untuk memberikan doa restu.",
        thankYou: "Terima kasih",
        signature: "Captain Edwar & Dokter Icha"
    }
};

// Pastikan data ini terekspos di browser secara global
window.invitationData = invitationData;
