import type { Language, MediPlainResult } from "./types";

export interface UIStrings {
  tagline: string;
  largeText: string;
  highContrast: string;
  languageLabel: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  trySampleButton: string;
  trySampleHint: string;
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
  analyzeAnother: string;
  sampleBadge: string;
  uploadedBadge: string;
  summaryHeading: string;
  scheduleHeading: string;
  warningsHeading: string;
  questionsHeading: string;
  questionsSubheading: string;
  checkedCount: (checked: number, total: number) => string;
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
    trySampleButton: "Try Sample Prescription",
    trySampleHint: "Instant 1-click demo using Amoxicillin 500mg",
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
    analyzeAnother: "Analyze Another Document",
    sampleBadge: "Sample Demo: Amoxicillin 500mg",
    uploadedBadge: "Analyzed Document",
    summaryHeading: "What This Is For",
    scheduleHeading: "When to Take It",
    warningsHeading: "Important Safety Warnings",
    questionsHeading: "Questions for Your Doctor",
    questionsSubheading: "Tap each question to check it off during your visit.",
    checkedCount: (checked, total) => `${checked} of ${total} checked`,
    loadingTitle: "Translating medical terms into plain language...",
    loadingSubtitle: "Building your daily schedule and safety checklist.",
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
    trySampleButton: "Coba Contoh Resep",
    trySampleHint: "Demo instan 1 klik dengan resep Amoxicillin 500mg",
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
    analyzeAnother: "Analisis Dokumen Lain",
    sampleBadge: "Contoh Demo: Amoxicillin 500mg",
    uploadedBadge: "Dokumen Dianalisis",
    summaryHeading: "Kegunaan Obat / Dokumen",
    scheduleHeading: "Jadwal Pemakaian Harian",
    warningsHeading: "Peringatan Keamanan Penting",
    questionsHeading: "Pertanyaan untuk Dokter Anda",
    questionsSubheading: "Ketuk setiap pertanyaan untuk menandai saat berkonsultasi.",
    checkedCount: (checked, total) => `${checked} dari ${total} ditandai`,
    loadingTitle: "Menerjemahkan istilah medis ke bahasa sederhana...",
    loadingSubtitle: "Menyusun jadwal harian dan daftar peringatan keamanan.",
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
    trySampleButton: "Probar Receta de Ejemplo",
    trySampleHint: "Demo instantánea de 1 clic con Amoxicilina 500mg",
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
    analyzeAnother: "Analizar Otro Documento",
    sampleBadge: "Demo de Ejemplo: Amoxicilina 500mg",
    uploadedBadge: "Documento Analizado",
    summaryHeading: "Para Qué Sirve",
    scheduleHeading: "Cuándo Tomarlo",
    warningsHeading: "Advertencias Importantes de Seguridad",
    questionsHeading: "Preguntas para Su Médico",
    questionsSubheading: "Toque cada pregunta para marcarla durante su consulta.",
    checkedCount: (checked, total) => `${checked} de ${total} marcadas`,
    loadingTitle: "Traduciendo términos médicos a palabras sencillas...",
    loadingSubtitle: "Preparando su horario diario y lista de seguridad.",
    ttsIntro: {
      schedule: "Su horario diario.",
      warnings: "Advertencias importantes de seguridad.",
    },
    disclaimer:
      "MediPlain es una herramienta de accesibilidad con IA solo con fines informativos y no reemplaza el consejo, diagnóstico ni tratamiento médico profesional.",
  },
};

export const SAMPLE_PRESCRIPTIONS: Record<Language, MediPlainResult> = {
  English: {
    title: "Amoxicillin 500 mg Capsules (7-Day Course)",
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
    warnings: [
      "Stop taking this and seek urgent care if you get hives, a skin rash, swelling of your face or throat, or trouble breathing.",
      "Mild stomach upset or loose stools can happen; taking capsules with food helps calm your stomach.",
      "Tell your pharmacist before taking this if you have ever had an allergic reaction to penicillin.",
      "Store capsules at room temperature away from bathroom moisture and out of reach of children.",
    ],
    questionsForDoctor: [
      "Should I take a probiotic or eat yogurt while on this antibiotic to protect my stomach?",
      "Does Amoxicillin interact with any of my regular blood pressure or daily medications?",
      "When should I follow up if my fever or symptoms do not improve after 3 days?",
    ],
  },
  Indonesian: {
    title: "Kapsul Amoxicillin 500 mg (Program 7 Hari)",
    simpleSummary:
      "Amoxicillin adalah obat antibiotik yang membunuh bakteri penyebab infeksi di tubuh Anda. Minum satu kapsul tiga kali sehari selama 7 hari penuh, meskipun Anda sudah merasa sembuh lebih cepat. Menghabiskan seluruh obat mencegah infeksi datang kembali.",
    schedule: [
      {
        timeOfDay: "Pagi",
        instruction: "Minum 1 kapsul setelah sarapan dengan segelas air putih penuh (sekitar pukul 07.00).",
      },
      {
        timeOfDay: "Siang",
        instruction: "Minum 1 kapsul sekitar pukul 15.00, boleh sebelum atau sesudah makan camilan ringan.",
      },
      {
        timeOfDay: "Malam",
        instruction: "Minum 1 kapsul sebelum tidur sekitar pukul 23.00 agar kadar obat tetap stabil.",
      },
      {
        timeOfDay: "Bila Perlu",
        instruction:
          "Jika lupa minum satu dosis, segera minum saat ingat. Lewati jika sudah dekat dengan jadwal berikutnya—jangan pernah minum dua kapsul sekaligus.",
      },
    ],
    warnings: [
      "Hentikan obat dan segera ke IGD jika muncul gatal-gatal, ruam kulit, bengkak di wajah atau tenggorokan, atau sesak napas.",
      "Mual ringan atau buang air besar lebih encer dapat terjadi; minum kapsul bersama makanan dapat membantu menenangkan lambung.",
      "Beri tahu apoteker atau dokter jika Anda pernah memiliki riwayat alergi terhadap obat golongan penisilin.",
      "Simpan kapsul di suhu ruangan yang kering, jauh dari tempat lembap dan jangkauan anak-anak.",
    ],
    questionsForDoctor: [
      "Apakah saya perlu mengonsumsi probiotik atau yogurt selama minum antibiotik ini untuk menjaga pencernaan?",
      "Apakah Amoxicillin berinteraksi dengan obat rutin yang saya konsumsi setiap hari?",
      "Kapan saya harus kontrol kembali jika demam atau gejala belum membaik setelah 3 hari?",
    ],
  },
  Spanish: {
    title: "Amoxicilina 500 mg Cápsulas (Tratamiento de 7 Días)",
    simpleSummary:
      "La amoxicilina es un antibiótico que elimina las bacterias dañinas que causan su infección. Tome una cápsula tres veces al día durante los 7 días completos, incluso si se siente mejor antes. Terminar todas las cápsulas evita que la infección regrese.",
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
    warnings: [
      "Deje de tomarlo y busque atención urgente si presenta ronchas, sarpullido, hinchazón en la cara o garganta, o dificultad para respirar.",
      "Puede causar malestar estomacal leve o diarrea ligera; tomar las cápsulas con comida ayuda a proteger el estómago.",
      "Avise a su médico o farmacéutico si alguna vez tuvo alergia a la penicilina.",
      "Guarde las cápsulas a temperatura ambiente, lejos de la humedad del baño y fuera del alcance de los niños.",
    ],
    questionsForDoctor: [
      "¿Debo tomar un probiótico o comer yogur mientras tomo este antibiótico para cuidar mi estómago?",
      "¿La amoxicilina tiene alguna interacción con mis medicinas diarias?",
      "¿Cuándo debo volver a consulta si la fiebre o los síntomas no mejoran después de 3 días?",
    ],
  },
};
