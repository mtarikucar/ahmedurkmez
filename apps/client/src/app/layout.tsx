import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ahmed Ürkmez - Edebiyat ve Akademik Araştırmalar",
  description: "Ahmed Ürkmez'in kişisel web sitesi. Edebiyat, akademik araştırmalar ve kültürel çalışmalar.",
  keywords: "Ahmed Ürkmez, edebiyat, akademik, araştırma, makale, yazar",
  authors: [{ name: "Ahmed Ürkmez" }],
  openGraph: {
    title: "Ahmed Ürkmez - Edebiyat ve Akademik Araştırmalar",
    description: "Ahmed Ürkmez'in kişisel web sitesi. Edebiyat, akademik araştırmalar ve kültürel çalışmalar.",
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
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        <AuthProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
