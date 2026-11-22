import type { Metadata } from "next";
import {
  Atkinson_Hyperlegible_Mono,
  Atkinson_Hyperlegible_Next,
} from "next/font/google";
import "./globals.css";

const atkinsonSans = Atkinson_Hyperlegible_Next({
  variable: "--font-atkinson-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const atkinsonMono = Atkinson_Hyperlegible_Mono({
  variable: "--font-atkinson-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MediPlain — Plain-Language Medical Accessibility",
  description:
    "Turn confusing prescriptions, medicine labels, and lab reports into plain 5th-grade explanations, visual schedules, safety warnings, and audio readouts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${atkinsonSans.variable} ${atkinsonMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink font-sans">
        {children}
      </body>
    </html>
  );
}
