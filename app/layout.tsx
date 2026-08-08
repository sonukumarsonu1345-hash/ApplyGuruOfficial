import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NoticeTicker } from "@/components/NoticeTicker";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://applyguruofficial.com"),
  title: {
    default: "ApplyGuruOfficial — Govt Jobs, Results, Admit Card, Scholarship & Yojana",
    template: "%s | ApplyGuruOfficial",
  },
  description:
    "ApplyGuruOfficial is a fast, reliable portal for the latest government job notifications, exam results, admit cards, scholarships and Yojana welfare schemes across India.",
  keywords: [
    "government jobs",
    "sarkari naukri",
    "exam results",
    "admit card",
    "scholarship",
    "yojana",
    "ApplyGuru",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "ApplyGuruOfficial — Govt Jobs, Results, Admit Card, Scholarship & Yojana",
    description:
      "One dependable portal for government job alerts, results, admit cards, scholarships and welfare schemes.",
    siteName: "ApplyGuruOfficial",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApplyGuruOfficial",
    description:
      "Government jobs, results, admit cards, scholarships and Yojana updates in one premium portal.",
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ApplyGuruOfficial",
  url: "https://applyguruofficial.com",
  description:
    "Independent information portal tracking government jobs, results, admit cards, scholarships and Yojana welfare schemes across India.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} font-body`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <NoticeTicker />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
