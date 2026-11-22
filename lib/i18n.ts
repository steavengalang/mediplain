import type { ConfidenceLevel, Language, MediPlainResult, PresetKey } from "./types";

export interface UIStrings {
  tagline: string;
  largeText: string;
  highContrast: string;
  languageLabel: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  presetsHeading: string;
  presets: Record<PresetKey, { label: string; sublabel: string }>;
  recentScansHeading: string;
  clearHistory: string;
  uploadTitle: string;
  uploadSubtitle: string;
  uploadFormats: string;
  chooseFile: string;
  analyzeButton: string;
  analyzingButton: string;
  removeImage: string;
  invalidFileType: string;
  fileTooLarge: string;
  genericError: string;
  ttsUnsupported: string;
  readAloud: string;
  stopReading: string;
  printCareSheet: string;
  analyzeAnother: string;
  sampleBadge: string;
  uploadedBadge: string;
  confidenceLabel: string;
  confidenceLevels: Record<ConfidenceLevel, string>;
  summaryHeading: string;
  scheduleHeading: string;
  missingScheduleNotice: string;
  jargonHeading: string;
  jargonTermColumn: string;
  jargonMeaningColumn: string;
  warningsHeading: string;
  questionsHeading: string;
  questionsSubheading: string;
  checkedCount: (checked: number, total: number) => string;
  askHeading: string;
  askSubheading: string;
  askQuickChips: string[];
  askPlaceholder: string;
  askSend: string;
  askSending: string;
  askError: string;
  loadingTitle: string;
  loadingSubtitle: string;
  ttsIntro: {
    schedule: string;
    warnings: string;
  };
  disclaimer: string;
}

export const TTS_LOCALES: Record<Language, string> = {
  English: "en-US",
  Indonesian: "id-ID",
  Spanish: "es-ES",
};

export const UI_COPY: Record<Language, UIStrings> = {
  English: {
    tagline: "Plain-language medical clarity",
    largeText: "Large Text",
    highContrast: "High Contrast",
    languageLabel: "Language",
    heroEyebrow: "Medical Accessibility",
    heroTitle: "Understand your prescription in plain words.",
    heroSubtitle:
      "Upload a photo of a prescription, pill bottle label, or lab report. MediPlain turns confusing medical terms into clear steps, daily schedules, and audio readouts.",
    presetsHeading: "Instant Sample Demos",
    presets: {
      antibiotic: {
        label: "Antibiotic Prescription",
        sublabel: "Amoxicillin 500mg — full daily schedule",
      },
      labReport: {
        label: "Blood Test Lab Report",
        sublabel: "HbA1c & Cholesterol in plain English",
      },
      otcSyrup: {
        label: "OTC Syrup Label",
        sublabel: "Missing dosage — safety anti-hallucination demo",
      },
    },
    recentScansHeading: "Recent Care Sheets",
    clearHistory: "Clear",
    uploadTitle: "Drop your medical document here",
    uploadSubtitle: "or select a clear photo from your device",
    uploadFormats: "Supports JPG, PNG, and WebP up to 10 MB",
    chooseFile: "Choose Photo",
    analyzeButton: "Explain This Document",
    analyzingButton: "Reading Document...",
    removeImage: "Remove Photo",
    invalidFileType: "Please upload a JPG, PNG, or WebP image file.",
    fileTooLarge: "This image is over 10 MB. Please choose a smaller photo.",
    genericError: "We could not analyze this document right now. Please try again.",
    ttsUnsupported: "Read Aloud is not supported in this browser.",
    readAloud: "Read Aloud",
    stopReading: "Stop Reading",
    printCareSheet: "Print / Save Care Sheet",
    analyzeAnother: "Analyze Another Document",
    sampleBadge: "Sample Demo",
    uploadedBadge: "Analyzed Document",
    confidenceLabel: "Readability",
    confidenceLevels: {
      High: "High Confidence",
      Medium: "Medium Confidence",
      Low: "Low Confidence",
    },
    summaryHeading: "What This Is For",
    scheduleHeading: "When to Take It",
    missingScheduleNotice:
      "No dosage schedule found on this label. To prevent errors, MediPlain never guesses dosages—please confirm the exact amount with your doctor or pharmacist.",
    jargonHeading: "Medical Terms Decoded",
    jargonTermColumn: "On the Label",
    jargonMeaningColumn: "Plain Meaning",
    warningsHeading: "Important Safety Warnings",
    questionsHeading: "Questions for Your Doctor",
    questionsSubheading: "Tap each question to check it off during your visit.",
    checkedCount: (checked, total) => `${checked} of ${total} checked`,
    askHeading: "Ask a Follow-Up Question",
    askSubheading: "Answers are grounded strictly in this document.",
    askQuickChips: [
      "Can I take this with food?",
      "What if I miss a dose?",
      "What should I watch out for?",
    ],
    askPlaceholder: "Ask a plain-language question about this document...",
    askSend: "Ask",
    askSending: "Checking...",
    askError: "Could not answer right now. Please try again.",
    loadingTitle: "Translating medical terms into plain language...",
    loadingSubtitle: "Checking readability, decoding jargon, and building your care sheet.",
    ttsIntro: {
      schedule: "Your daily schedule.",
      warnings: "Important safety warnings.",
    },
    disclaimer:
      "MediPlain is an AI accessibility tool for informational purposes only and does not replace professional medical advice, diagnosis, or treatment.",
  },
  Indonesian: {
    tagline: "Penjelasan medis dalam bahasa sederhana",
    largeText: "Teks Besar",
    highContrast: "Kontras Tinggi",
    languageLabel: "Bahasa",
    heroEyebrow: "Aksesibilitas Medis",
    heroTitle: "Pahami resep obat Anda dengan bahasa yang mudah.",
    heroSubtitle:
      "Unggah foto resep dokter, label botol obat, atau hasil lab. MediPlain mengubah istilah medis yang rumit menjadi langkah jelas, jadwal minum obat, dan panduan suara.",
    presetsHeading: "Contoh Demo Instan",
    presets: {
      antibiotic: {
        label: "Resep Antibiotik",
        sublabel: "Amoxicillin 500mg — jadwal lengkap",
      },
      labReport: {
        label: "Hasil Tes Darah Lab",
        sublabel: "HbA1c & Kolesterol dalam bahasa mudah",
      },
      otcSyrup: {
        label: "Label Sirup Bebas",
        sublabel: "Dosis tidak terlihat — demo keamanan anti-halusinasi",
      },
    },
    recentScansHeading: "Riwayat Lembar Perawatan",
    clearHistory: "Hapus",
    uploadTitle: "Letakkan foto dokumen medis di sini",
    uploadSubtitle: "atau pilih foto yang jelas dari perangkat Anda",
    uploadFormats: "Mendukung JPG, PNG, dan WebP maksimal 10 MB",
    chooseFile: "Pilih Foto",
    analyzeButton: "Jelaskan Dokumen Ini",
    analyzingButton: "Membaca Dokumen...",
    removeImage: "Hapus Foto",
    invalidFileType: "Harap unggah file gambar berformat JPG, PNG, atau WebP.",
    fileTooLarge: "Ukuran gambar melebihi 10 MB. Harap pilih foto yang lebih kecil.",
    genericError: "Dokumen belum dapat dianalisis saat ini. Silakan coba lagi.",
    ttsUnsupported: "Fitur baca suara tidak didukung di browser ini.",
    readAloud: "Bacakan",
    stopReading: "Hentikan Suara",
    printCareSheet: "Cetak / Simpan Lembar",
    analyzeAnother: "Analisis Dokumen Lain",
    sampleBadge: "Contoh Demo",
    uploadedBadge: "Dokumen Dianalisis",
    confidenceLabel: "Keterbacaan",
    confidenceLevels: {
      High: "Keyakinan Tinggi",
      Medium: "Keyakinan Sedang",
      Low: "Keyakinan Rendah",
    },
    summaryHeading: "Kegunaan Obat / Dokumen",
    scheduleHeading: "Jadwal Pemakaian Harian",
    missingScheduleNotice:
      "Jadwal dosis tidak ditemukan pada label ini. Untuk mencegah kesalahan, MediPlain tidak pernah menebak dosis—harap pastikan jumlah pastinya dengan dokter atau apoteker Anda.",
    jargonHeading: "Arti Istilah Medis",
    jargonTermColumn: "Di Dokumen",
    jargonMeaningColumn: "Arti Sederhana",
    warningsHeading: "Peringatan Keamanan Penting",
    questionsHeading: "Pertanyaan untuk Dokter Anda",
    questionsSubheading: "Ketuk setiap pertanyaan untuk menandai saat berkonsultasi.",
    checkedCount: (checked, total) => `${checked} dari ${total} ditandai`,
    askHeading: "Tanyakan Pertanyaan Lanjutan",
    askSubheading: "Jawaban berdasar langsung pada isi dokumen ini.",
    askQuickChips: [
      "Apakah boleh diminum bersama makanan?",
      "Bagaimana jika lupa satu dosis?",
      "Efek samping apa yang harus diwaspadai?",
    ],
    askPlaceholder: "Tulis pertanyaan sederhana tentang dokumen ini...",
    askSend: "Tanya",
    askSending: "Memeriksa...",
    askError: "Belum dapat menjawab saat ini. Silakan coba lagi.",
    loadingTitle: "Menerjemahkan istilah medis ke bahasa sederhana...",
    loadingSubtitle: "Memeriksa kejelasan teks, mengartikan istilah, dan menyusun lembar perawatan.",
    ttsIntro: {
      schedule: "Jadwal pemakaian Anda.",
      warnings: "Peringatan keamanan penting.",
    },
    disclaimer:
      "MediPlain adalah alat bantu aksesibilitas AI hanya untuk tujuan informasi dan tidak menggantikan nasihat, diagnosis, atau perawatan medis profesional.",
  },
  Spanish: {
    tagline: "Claridad médica en lenguaje sencillo",
    largeText: "Texto Grande",
    highContrast: "Alto Contraste",
    languageLabel: "Idioma",
    heroEyebrow: "Accesibilidad Médica",
    heroTitle: "Entienda su receta médica con palabras sencillas.",
    heroSubtitle:
      "Suba una foto de su receta, etiqueta de medicamento o resultado de laboratorio. MediPlain convierte términos difíciles en pasos claros, horarios diarios y lectura en voz alta.",
    presetsHeading: "Demos Instantáneas",
    presets: {
      antibiotic: {
        label: "Receta de Antibiótico",
        sublabel: "Amoxicilina 500mg — horario completo",
      },
      labReport: {
        label: "Análisis de Sangre",
        sublabel: "HbA1c y Colesterol explicados fácil",
      },
      otcSyrup: {
        label: "Jarabe de Venta Libre",
        sublabel: "Dosis no visible — demo de seguridad",
      },
    },
    recentScansHeading: "Hojas Recientes",
    clearHistory: "Borrar",
    uploadTitle: "Arrastre su documento médico aquí",
    uploadSubtitle: "o seleccione una foto clara desde su dispositivo",
    uploadFormats: "Compatible con JPG, PNG y WebP hasta 10 MB",
    chooseFile: "Elegir Foto",
    analyzeButton: "Explicar Este Documento",
    analyzingButton: "Leyendo Documento...",
    removeImage: "Quitar Foto",
    invalidFileType: "Por favor suba una imagen en formato JPG, PNG o WebP.",
    fileTooLarge: "Esta imagen supera los 10 MB. Elija una foto más pequeña.",
    genericError: "No pudimos analizar este documento ahora. Por favor intente de nuevo.",
    ttsUnsupported: "La lectura en voz alta no es compatible con este navegador.",
    readAloud: "Leer en Voz Alta",
    stopReading: "Detener Lectura",
    printCareSheet: "Imprimir / Guardar Hoja",
    analyzeAnother: "Analizar Otro Documento",
    sampleBadge: "Demo de Ejemplo",
    uploadedBadge: "Documento Analizado",
    confidenceLabel: "Legibilidad",
    confidenceLevels: {
      High: "Confianza Alta",
      Medium: "Confianza Media",
      Low: "Confianza Baja",
    },
    summaryHeading: "Para Qué Sirve",
    scheduleHeading: "Cuándo Tomarlo",
    missingScheduleNotice:
      "No se encontró un horario de dosis en esta etiqueta. Para evitar errores, MediPlain nunca adivina dosis; confirme la cantidad exacta con su médico o farmacéutico.",
    jargonHeading: "Términos Médicos Explicados",
    jargonTermColumn: "En la Etiqueta",
    jargonMeaningColumn: "Significado Simple",
    warningsHeading: "Advertencias Importantes de Seguridad",
    questionsHeading: "Preguntas para Su Médico",
    questionsSubheading: "Toque cada pregunta para marcarla durante su consulta.",
    checkedCount: (checked, total) => `${checked} de ${total} marcadas`,
    askHeading: "Hacer una Pregunta de Seguimiento",
    askSubheading: "Las respuestas se basan únicamente en este documento.",
    askQuickChips: [
      "¿Puedo tomarlo con comida?",
      "¿Qué hago si olvido una dosis?",
      "¿Qué efectos debo vigilar?",
    ],
    askPlaceholder: "Escriba una pregunta sencilla sobre este documento...",
    askSend: "Enviar",
    askSending: "Revisando...",
    askError: "No se pudo responder ahora. Inténtelo de nuevo.",
    loadingTitle: "Traduciendo términos médicos a palabras sencillas...",
    loadingSubtitle: "Verificando legibilidad y preparando su hoja de cuidado.",
    ttsIntro: {
      schedule: "Su horario diario.",
      warnings: "Advertencias importantes de seguridad.",
    },
    disclaimer:
      "MediPlain es una herramienta de accesibilidad con IA solo con fines informativos y no reemplaza el consejo, diagnóstico ni tratamiento médico profesional.",
  },
};

export const SAMPLE_PRESETS: Record<Language, Record<PresetKey, MediPlainResult>> = {
  English: {
    antibiotic: {
      title: "Amoxicillin 500 mg Capsules (7-Day Course)",
      documentType: "Prescription",
      confidenceLevel: "High",
      confidenceNote: "All drug names, capsule strengths, and dosing frequencies were clearly legible.",
      simpleSummary:
        "Amoxicillin is an antibiotic that kills harmful bacteria causing your infection. Take one capsule three times a day for all 7 days, even if you start feeling better earlier. Finishing the full bottle stops the infection from coming back.",
      schedule: [
        {
          timeOfDay: "Morning",
          instruction: "Take 1 capsule with breakfast and a full glass of water (around 7:00 AM).",
        },
        {
          timeOfDay: "Afternoon",
          instruction: "Take 1 capsule around 3:00 PM, with or without a light snack.",
        },
        {
          timeOfDay: "Night",
          instruction: "Take 1 capsule before bedtime around 11:00 PM to keep steady levels.",
        },
        {
          timeOfDay: "As Needed",
          instruction:
            "If you miss a dose, take it as soon as you remember. Skip it if it is almost time for your next dose—never take two at once.",
        },
      ],
      jargonTranslations: [
        { term: "PO (By Mouth)", plainMeaning: "Swallow the capsule with water; do not chew or open it." },
        { term: "TID (Three Times Daily)", plainMeaning: "Take once every 8 hours (morning, afternoon, night)." },
        { term: "Disp #21", plainMeaning: "There are 21 capsules in the bottle—enough for 7 full days." },
      ],
      warnings: [
        "Stop taking this and seek urgent care if you get hives, a skin rash, swelling of your face or throat, or trouble breathing.",
        "Mild stomach upset or loose stools can happen; taking capsules with food helps calm your stomach.",
        "Tell your pharmacist before taking this if you have ever had an allergic reaction to penicillin.",
      ],
      questionsForDoctor: [
        "Should I take a probiotic or eat yogurt while on this antibiotic to protect my stomach?",
        "Does Amoxicillin interact with any of my regular daily medications?",
        "When should I follow up if my fever or symptoms do not improve after 3 days?",
      ],
    },
    labReport: {
      title: "Blood Test Panel: HbA1c 6.8% & LDL 148 mg/dL",
      documentType: "Lab Report",
      confidenceLevel: "High",
      confidenceNote: "All test values and reference ranges were clearly printed on the lab sheet.",
      simpleSummary:
        "This blood test checks your average blood sugar over the last 3 months and the fats in your blood. Your average sugar (HbA1c) is slightly above the normal range, and your 'bad' cholesterol (LDL) is mildly high. These numbers help your doctor guide healthy food, exercise, or medication choices.",
      schedule: [],
      jargonTranslations: [
        { term: "HbA1c (6.8%)", plainMeaning: "3-month average blood sugar; normal is below 5.7%, and 6.5% or higher points to diabetes." },
        { term: "LDL Cholesterol (148 mg/dL)", plainMeaning: "Often called 'bad' cholesterol that can slowly build up inside blood vessels; goal is usually under 100 mg/dL." },
        { term: "HDL Cholesterol (52 mg/dL)", plainMeaning: "Often called 'good' cholesterol that helps clear excess fats from your blood." },
        { term: "Fasting Lipid Panel", plainMeaning: "A blood test taken after not eating for 8–12 hours to measure cholesterol and fats." },
      ],
      warnings: [
        "Do not change or stop any current blood sugar or cholesterol pills without talking to your doctor first.",
        "Lab numbers alone are not a full diagnosis—your doctor looks at these together with your symptoms and health history.",
      ],
      questionsForDoctor: [
        "What target HbA1c and LDL cholesterol numbers are safest for my age and health?",
        "Can small daily diet or walking changes lower these numbers before adding new medicine?",
        "When should we repeat this fasting blood test to check my progress?",
      ],
    },
    otcSyrup: {
      title: "Children's Cough & Cold Liquid (Guaifenesin / Dextromethorphan)",
      documentType: "Medicine Label",
      confidenceLevel: "Medium",
      confidenceNote: "The front ingredients are clear, but the age-based dosing chart on the back panel is not visible.",
      simpleSummary:
        "This over-the-counter syrup helps loosen thick chest mucus and calm a dry cough. Because the exact dosing chart is cut off in this photo, no schedule is shown here. Check the back Drug Facts box or ask a pharmacist before measuring a dose.",
      schedule: [],
      jargonTranslations: [
        { term: "Expectorant (Guaifenesin)", plainMeaning: "Thins sticky mucus in your chest so coughs clear it out easier." },
        { term: "Cough Suppressant (Dextromethorphan)", plainMeaning: "Calms the brain's cough reflex so you cough less at rest." },
        { term: "OTC (Over-the-Counter)", plainMeaning: "Medicine sold without a doctor's prescription." },
      ],
      warnings: [
        "Never use a kitchen spoon to measure liquid medicine—always use the dosing cup or oral syringe from the box.",
        "Do not give cough and cold syrups to children under 4 years old unless a doctor specifically instructs you.",
        "Avoid combining with other cold medicines that contain the same active ingredients.",
      ],
      questionsForDoctor: [
        "What exact milliliter (mL) dose is safe for my child's weight and age?",
        "How many hours should pass between doses, and what is the daily maximum?",
      ],
    },
  },
  Indonesian: {
    antibiotic: {
      title: "Kapsul Amoxicillin 500 mg (Program 7 Hari)",
      documentType: "Resep Dokter",
      confidenceLevel: "High",
      confidenceNote: "Nama obat, kekuatan kapsul, dan aturan pakai terbaca dengan jelas.",
      simpleSummary:
        "Amoxicillin adalah obat antibiotik yang membunuh bakteri penyebab infeksi di tubuh Anda. Minum satu kapsul tiga kali sehari selama 7 hari penuh, meskipun Anda sudah merasa sembuh lebih cepat. Menghabiskan seluruh obat mencegah infeksi datang kembali.",
      schedule: [
        {
          timeOfDay: "Pagi",
          instruction: "Minum 1 kapsul setelah sarapan dengan segelas air putih penuh (sekitar pukul 07.00).",
        },
        {
          timeOfDay: "Siang",
          instruction: "Minum 1 kapsul sekitar pukul 15.00, boleh sebelum atau sesudah camilan ringan.",
        },
        {
          timeOfDay: "Malam",
          instruction: "Minum 1 kapsul sebelum tidur sekitar pukul 23.00 agar kadar obat tetap stabil.",
        },
        {
          timeOfDay: "Bila Perlu",
          instruction:
            "Jika lupa minum satu dosis, segera minum saat ingat. Lewati jika sudah dekat jadwal berikutnya—jangan minum dua kapsul sekaligus.",
        },
      ],
      jargonTranslations: [
        { term: "3 dd 1 (Ter in Die)", plainMeaning: "Minum 3 kali sehari, tiap 8 jam sekali (pagi, siang, malam)." },
        { term: "PC (Post Coenam)", plainMeaning: "Diminum sesudah makan agar lambung lebih nyaman." },
        { term: "Habiskan", plainMeaning: "Tetap minum sampai semua kapsul selesai walau gejala sudah membaik." },
      ],
      warnings: [
        "Hentikan obat dan segera ke IGD jika muncul biduran, ruam kulit, bengkak di wajah/tenggorokan, atau sesak napas.",
        "Mual ringan atau BAB lebih encer bisa terjadi; minum bersama makanan membantu menenangkan lambung.",
        "Beri tahu apoteker jika Anda pernah alergi terhadap obat golongan penisilin.",
      ],
      questionsForDoctor: [
        "Apakah saya perlu mengonsumsi probiotik atau yogurt selama minum antibiotik ini?",
        "Apakah Amoxicillin berinteraksi dengan obat rutin saya setiap hari?",
        "Kapan saya harus kontrol kembali jika demam belum membaik setelah 3 hari?",
      ],
    },
    labReport: {
      title: "Hasil Tes Darah: HbA1c 6,8% & Kolesterol LDL 148 mg/dL",
      documentType: "Hasil Lab",
      confidenceLevel: "High",
      confidenceNote: "Seluruh angka hasil tes dan nilai rujukan normal tercetak dengan jelas.",
      simpleSummary:
        "Tes darah ini memeriksa rata-rata gula darah Anda selama 3 bulan terakhir dan kadar lemak dalam darah. Angka rata-rata gula darah (HbA1c) sedikit di atas batas normal, dan kolesterol 'jahat' (LDL) agak tinggi. Dokter akan menggunakan hasil ini untuk mengatur pola makan, olahraga, atau obat.",
      schedule: [],
      jargonTranslations: [
        { term: "HbA1c (6,8%)", plainMeaning: "Rata-rata gula darah 3 bulan terakhir; batas normal di bawah 5,7%." },
        { term: "Kolesterol LDL (148 mg/dL)", plainMeaning: "Sering disebut kolesterol 'jahat' yang bisa menumpuk di pembuluh darah; target umumnya di bawah 100 mg/dL." },
        { term: "Kolesterol HDL (52 mg/dL)", plainMeaning: "Sering disebut kolesterol 'baik' yang membantu membersihkan lemak berlebih." },
      ],
      warnings: [
        "Jangan mengubah atau menghentikan obat gula maupun kolesterol yang sedang Anda minum tanpa saran dokter.",
        "Hasil lab harus dibaca bersama kondisi klinis dan riwayat kesehatan Anda oleh dokter.",
      ],
      questionsForDoctor: [
        "Berapa target angka HbA1c dan LDL yang paling aman untuk usia dan kondisi saya?",
        "Perubahan pola makan atau aktivitas apa yang bisa saya mulai minggu ini?",
        "Kapan saya perlu mengulang tes darah puasa ini?",
      ],
    },
    otcSyrup: {
      title: "Sirup Batuk & Pilek Anak (Guaifenesin / Dextromethorphan)",
      documentType: "Label Obat",
      confidenceLevel: "Medium",
      confidenceNote: "Komposisi depan terlihat jelas, namun tabel takaran dosis berdasarkan usia di sisi kemasan tidak tampak.",
      simpleSummary:
        "Sirup obat bebas ini membantu mengencerkan dahak di dada dan meredakan batuk kering. Karena tabel aturan dosis tidak terlihat pada foto ini, jadwal pemakaian tidak ditampilkan. Periksa kotak informasi dosis di belakang botol atau tanyakan kepada apoteker sebelum memberikan obat.",
      schedule: [],
      jargonTranslations: [
        { term: "Ekspektoran (Guaifenesin)", plainMeaning: "Mengencerkan dahak kental agar lebih mudah keluar saat batuk." },
        { term: "Antitusif (Dextromethorphan)", plainMeaning: "Meredakan refleks batuk kering agar anak bisa beristirahat." },
      ],
      warnings: [
        "Jangan gunakan sendok makan rumah untuk menakar obat cair—selalu pakai sendok takar atau pipet bawaan kemasan.",
        "Jangan berikan obat batuk pilek bebas kepada anak di bawah usia 4 tahun tanpa petunjuk dokter.",
      ],
      questionsForDoctor: [
        "Berapa takaran mililiter (mL) yang tepat sesuai berat badan dan usia anak saya?",
        "Berapa jam jarak antar dosis yang aman dalam sehari?",
      ],
    },
  },
  Spanish: {
    antibiotic: {
      title: "Amoxicilina 500 mg Cápsulas (Tratamiento de 7 Días)",
      documentType: "Receta Médica",
      confidenceLevel: "High",
      confidenceNote: "El nombre del medicamento, la dosis por cápsula y la frecuencia son totalmente legibles.",
      simpleSummary:
        "La amoxicilina es un antibiótico que elimina las bacterias dañinas que causan su infección. Tome una cápsula tres veces al día durante los 7 días completos, incluso si se siente mejor antes. Terminar todo el frasco evita que la infección regrese.",
      schedule: [
        {
          timeOfDay: "Mañana",
          instruction: "Tome 1 cápsula con el desayuno y un vaso lleno de agua (alrededor de las 7:00 AM).",
        },
        {
          timeOfDay: "Tarde",
          instruction: "Tome 1 cápsula alrededor de las 3:00 PM, con o sin un bocadillo ligero.",
        },
        {
          timeOfDay: "Noche",
          instruction: "Tome 1 cápsula antes de acostarse alrededor de las 11:00 PM para mantener el efecto constante.",
        },
        {
          timeOfDay: "Según Sea Necesario",
          instruction:
            "Si olvida una dosis, tómela en cuanto lo recuerde. Sáltela si ya casi es hora de la siguiente—nunca tome dos cápsulas juntas.",
        },
      ],
      jargonTranslations: [
        { term: "Vía Oral (VO)", plainMeaning: "Trague la cápsula entera con agua; no la mastique ni la abra." },
        { term: "Cada 8 horas", plainMeaning: "Tome 3 dosis repartidas en el día (mañana, tarde y noche)." },
        { term: "Completar tratamiento", plainMeaning: "Tome todas las cápsulas hasta terminar los 7 días." },
      ],
      warnings: [
        "Deje de tomarlo y busque atención urgente si presenta ronchas, sarpullido, hinchazón en la cara o garganta, o dificultad para respirar.",
        "Puede causar malestar estomacal leve; tomar las cápsulas con comida ayuda a proteger el estómago.",
        "Avise a su médico o farmacéutico si alguna vez tuvo alergia a la penicilina.",
      ],
      questionsForDoctor: [
        "¿Debo tomar un probiótico o comer yogur mientras tomo este antibiótico?",
        "¿La amoxicilina tiene alguna interacción con mis medicinas diarias?",
        "¿Cuándo debo volver a consulta si los síntomas no mejoran después de 3 días?",
      ],
    },
    labReport: {
      title: "Análisis de Sangre: HbA1c 6.8% y Colesterol LDL 148 mg/dL",
      documentType: "Informe de Laboratorio",
      confidenceLevel: "High",
      confidenceNote: "Todos los valores de laboratorio y rangos de referencia son claramente visibles.",
      simpleSummary:
        "Este análisis mide el promedio de azúcar en su sangre durante los últimos 3 meses y las grasas en su sangre. Su promedio de azúcar (HbA1c) está un poco por encima de lo normal y el colesterol 'malo' (LDL) está ligeramente alto. Su médico usará estos datos para ajustar su alimentación o tratamiento.",
      schedule: [],
      jargonTranslations: [
        { term: "HbA1c (6.8%)", plainMeaning: "Promedio de azúcar en sangre de los últimos 3 meses; lo normal es menor a 5.7%." },
        { term: "Colesterol LDL (148 mg/dL)", plainMeaning: "Llamado colesterol 'malo' porque puede acumularse en las arterias; la meta suele ser menor a 100 mg/dL." },
        { term: "Colesterol HDL (52 mg/dL)", plainMeaning: "Llamado colesterol 'bueno' porque ayuda a limpiar la sangre." },
      ],
      warnings: [
        "No cambie ni suspenda sus medicinas actuales para el azúcar o el colesterol sin hablar primero con su médico.",
        "Los resultados de laboratorio siempre deben interpretarse junto con su historial médico.",
      ],
      questionsForDoctor: [
        "¿Cuál es la meta más segura de HbA1c y LDL para mi edad y salud?",
        "¿Qué cambios diarios en comida o caminata me recomienda antes de añadir medicinas?",
        "¿Cuándo debemos repetir este análisis en ayunas?",
      ],
    },
    otcSyrup: {
      title: "Jarabe Infantil para Tos y Resfriado (Guaifenesina / Dextrometorfano)",
      documentType: "Etiqueta de Medicamento",
      confidenceLevel: "Medium",
      confidenceNote: "Los ingredientes frontales son claros, pero la tabla de dosis por edad en el reverso no aparece en la imagen.",
      simpleSummary:
        "Este jarabe de venta libre ayuda a aflojar la flema del pecho y calmar la tos seca. Como la tabla de dosis exacta no es visible en esta foto, no se muestra ningún horario aquí. Revise la etiqueta posterior o consulte a un farmacéutico antes de medir la dosis.",
      schedule: [],
      jargonTranslations: [
        { term: "Expectorante (Guaifenesina)", plainMeaning: "Hace que la flema espesa sea más líquida y fácil de expulsar." },
        { term: "Supresor de la Tos (Dextrometorfano)", plainMeaning: "Calma el reflejo de la tos para ayudar a descansar." },
      ],
      warnings: [
        "Nunca use cucharas de cocina para medir jarabes; use siempre el vaso medidor o jeringa del empaque.",
        "No dé jarabes para la tos a menores de 4 años sin indicación expresa de un médico.",
      ],
      questionsForDoctor: [
        "¿Cuál es la dosis exacta en mililitros (mL) según el peso y la edad?",
        "¿Cuántas horas deben pasar entre cada dosis?",
      ],
    },
  },
};
