import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClerkProvider } from '@clerk/nextjs';

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "دليل الشعب | مجتمع طلاب الجامعة",
  description: "المنصة الأولى والوحيدة المتكاملة للبحث عن مجموعات الواتساب والتليجرام الخاصة بشعبك الجامعية.",
  keywords: "دليل الشعب, جامعة, مجموعات واتس, مجموعات تليجرام, دراسة, شعب جامعية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ar" dir="rtl" className={`${tajawal.variable}`}>
        <body className={`${tajawal.className} antialiased min-h-screen flex flex-col`}>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
