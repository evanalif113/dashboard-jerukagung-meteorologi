import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/global.css"
import { ThemeProvider } from "@/components/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jerukagung Meteorologi",
  description: "Departemen Penelitian Sains Atmosfer Jerukagung Seismologi",
  icons: {
    icon: "/favicon.ico", // Corrected path
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
