import type { Metadata } from "next";
import { Crimson_Text, Libre_Baskerville, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

// Primary font - Crimson Text (similar to Bookmania characteristics)
const crimsonText = Crimson_Text({
  variable: "--font-bookmania",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Secondary serif font - Libre Baskerville
const libreBaskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Accent font - Playfair Display for headings
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ahmed Ürkmez - Modern Selçuklu Sanatı ve Edebiyat",
  description: "Ahmed Ürkmez'in modern Selçuklu sanatı esinlenmesi ile tasarlanmış kişisel web sitesi. Edebiyat, akademik araştırmalar ve kültürel çalışmalar.",
  keywords: "Ahmed Ürkmez, edebiyat, akademik, araştırma, makale, yazar, Selçuklu sanatı, modern tasarım",
  authors: [{ name: "Ahmed Ürkmez" }],
  openGraph: {
    title: "Ahmed Ürkmez - Modern Selçuklu Sanatı ve Edebiyat",
    description: "Ahmed Ürkmez'in modern Selçuklu sanatı esinlenmesi ile tasarlanmış kişisel web sitesi. Edebiyat, akademik araştırmalar ve kültürel çalışmalar.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body
        className={`${crimsonText.variable} ${libreBaskerville.variable} ${playfairDisplay.variable} antialiased min-h-screen font-bookmania bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]`}
        style={{
          color: 'var(--text-primary)',
          fontFeatureSettings: '"liga" 1, "kern" 1',
          textRendering: 'optimizeLegibility'
        }}
      >
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 relative">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
