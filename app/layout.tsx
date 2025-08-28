import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/global.css"
import { ThemeProvider } from "@/components/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://cuaca.jerukagunglabs.web.id"),
  title: {
    default: "Informasi Cuaca Jerukagung",
    template: "%s | Jerukagung Meteorologi",
  },
  description: "Penelitian Meteorologi oleh Departemen Penelitian Sains Atmosfer Jerukagung Seismologi",
  keywords: [
    "Jerukagung",
    "Meteorologi",
    "Sains Atmosfer",
    "Cuaca",
    "Iklim",
    "Seismologi",
    "Dashboard",
    "Analisis",
    "Data Cuaca",
    "Data Iklim",
    "Penelitian Cuaca",
    "Penelitian Iklim",
    "Stasiun Cuaca",
    "Stasiun Iklim",
    "Prakiraan Cuaca",
    "Prakiraan Iklim",
    "Visualisasi Data",
    "Grafik Cuaca",
  ],
  applicationName: "Jerukagung Meteorologi",
  authors: [{ name: "Departemen Penelitian Sains Atmosfer Jerukagung Seismologi" }],
  creator: "Departemen Penelitian Sains Atmosfer Jerukagung Seismologi",
  publisher: "Jerukagung Seismologi",
  category: "Science",
  referrer: "origin-when-cross-origin",
  manifest: "/site.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Jerukagung Meteorologi",
    description: "Departemen Penelitian Sains Atmosfer Jerukagung Seismologi",
    siteName: "Jerukagung Meteorologi",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jerukagung Meteorologi",
      },
    ],
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jerukagung Meteorologi",
    description: "Departemen Penelitian Sains Atmosfer Jerukagung Seismologi",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="Sfw4AJux-0gq0e5K8YlW5k8F9dK_WbmGEjKsWD-3hXM" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
