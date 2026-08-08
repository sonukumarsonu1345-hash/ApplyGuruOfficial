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

export function generateViewport() {
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#F6F5F0" },
      { media: "(prefers-color-scheme: dark)", color: "#0A1121" },
    ],
  };
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ApplyGuruOfficial",
  url: "https://applyguruofficial.com",
  description:
    "Independent information portal tracking government jobs, results, admit cards, scholarships and Yojana welfare schemes across India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} font-body`}>
        {/* Visible only on keyboard focus; lets keyboard/screen-reader users
            jump straight past the header, ticker and nav to the page content. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink-800 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-paper dark:focus:bg-saffron-400 dark:focus:text-ink-900"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
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
