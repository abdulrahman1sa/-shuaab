import type { Metadata } from "next";
import { Changa } from "next/font/google"; // Pixel-style Arabic font
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import { ThemeProvider } from "@/components/ThemeProvider";

const changa = Changa({
    variable: "--font-changa",
    subsets: ["arabic"],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
    title: "دليل الشعب | مجتمع طلاب الجامعة",
    description: "المنصة الأولى والوحيدة المتكاملة للبحث عن مجموعات الواتساب والتليجرام الخاصة بشعبك الجامعية.",
    keywords: "دليل الشعب, جامعة, مجموعات واتس, مجموعات تليجرام, دراسة, شعب جامعية",
};

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'lottie-player': any;
        }
    }
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl" className={`${changa.variable}`}>
            <head>
                <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" async></script>
            </head>
            <body
                className="antialiased min-h-screen flex flex-col"
            >
                <ThemeProvider>
                    <Navbar />
                    <main className="flex-grow">
                        {children}
                    </main>
                    <FloatingContact />
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
