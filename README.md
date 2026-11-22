# MediPlain

Plain-language medical accessibility web application built for **EvoHacks 2.0** (*Projects for Social Good*).

## Problem
Prescriptions, medicine bottle labels, and lab reports are packed with clinical abbreviations, dense dosing instructions, and tiny print. For elderly patients, low-vision individuals, caregivers, and non-native speakers, misunderstanding a single instruction—such as timing, food requirements, or drug warnings—can lead to missed doses or preventable adverse events.

## Solution
**MediPlain** transforms photos of prescriptions, pill labels, and medical documents into calm, 5th-grade reading level explanations, visual daily medication schedules, prominent safety warnings, doctor visit checklists, and native audio readouts.

## Features
- **Structured AI Medical Translation (`gemini-2.5-flash`)**: Uses `@google/genai` with strict JSON `responseSchema` output to extract the medication/document name, plain-language summary, structured daily schedule, safety warnings, and questions for a doctor.
- **Accessibility-First Sticky Controls**:
  - **Large Text Toggle**: Scales typography cleanly across the entire app for low-vision users.
  - **High Contrast Mode**: Switches the interface to WCAG AAA high-contrast styling (`#000000` background, `#FFFFFF` text, `#FFD700` borders and accents).
  - **Multilingual Support**: Instant switching between **English**, **Indonesian**, and **Spanish** across UI copy, Gemini analysis output, and Text-to-Speech.
- **Read Aloud (Web Speech API)**: One-click Play/Stop audio readout of the title, plain summary, schedule, and safety warnings in `en-US`, `id-ID`, or `es-ES`.
- **Visual Medication Schedule**: Maps dosing windows (`Morning`, `Afternoon`, `Night`, `As Needed`) to clear visual icons and readable cards.
- **Interactive Doctor Checklist**: Patients and caregivers can tap to check off practical questions during their appointment.
- **Instant Judge Demo**: 1-click **"Try Sample Prescription"** loads a complete Amoxicillin 500 mg walkthrough in the active language without requiring an image upload or API key.

## Tech Stack
- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4 with Atkinson Hyperlegible Next & Mono
- **AI**: Google Gemini API (`@google/genai`, `gemini-2.5-flash`)
- **Icons**: `lucide-react`
- **Voice**: Browser `window.speechSynthesis` (Web Speech API)

## Local Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/steavengalang/mediplain.git
   cd mediplain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and set your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   *(Note: You can still test the 1-click "Try Sample Prescription" demo without setting an API key.)*

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Production build check**
   ```bash
   npm run lint
   npm run build
   ```

## AI Usage Transparency
- MediPlain sends uploaded prescription/label images exclusively on demand from the Next.js server route (`app/api/analyze/route.ts`) to Google's `gemini-2.5-flash` model using structured JSON output (`responseSchema`).
- Uploaded images are held transiently in memory for analysis and are not stored in a database.
- All outputs include a permanent medical disclaimer noting that MediPlain is an informational accessibility tool and does not replace professional medical advice, diagnosis, or treatment.
