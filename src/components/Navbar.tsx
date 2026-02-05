'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const navLinks = [
        { href: '/', label: 'البداية' },
        { href: '/groups', label: 'المكتبة' },
        { href: '/submit', label: 'إضافة_رابط' },
        { href: '/admin', label: 'الإشراف' },
    ];

    if (!mounted) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-[var(--background)] border-b-8 border-double border-[var(--foreground)] h-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">

                    {/* Actions & Theme Button - Placed Left in RTL */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={toggleTheme}
                            className="w-14 h-14 bg-[var(--background)] border-4 border-[var(--foreground)] flex items-center justify-center hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-none shadow-[6px_6px_0_0_var(--foreground)] active:translate-y-1 active:shadow-none"
                            title="تبديل_الوضع"
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>

                        <Link
                            href="/login"
                            className="hidden sm:inline-flex items-center justify-center px-8 py-4 bg-[var(--background)] text-[var(--foreground)] border-4 border-[var(--foreground)] font-black uppercase text-xs tracking-widest hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-none shadow-[6px_6px_0_0_var(--foreground)] active:translate-y-1 active:shadow-none"
                        >
                            تسجيل_الدخول
                        </Link>

                        <Link
                            href="/admin"
                            className="hidden sm:inline-flex items-center justify-center px-8 py-4 bg-[var(--foreground)] text-[var(--background)] border-4 border-[var(--foreground)] font-black uppercase text-xs tracking-widest hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-none shadow-[6px_6px_0_0_var(--foreground)] active:translate-y-1 active:shadow-none"
                        >
                            دخول_المسؤول
                        </Link>
                    </div>

                    {/* Desktop Navigation Links - Middle */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.filter(l => l.href !== '/admin').map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                                        px-6 py-2 font-black text-sm uppercase transition-none border-b-4 
                                        ${isActive
                                            ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]'
                                            : 'text-[var(--foreground)] border-transparent hover:border-[var(--foreground)]'
                                        }
                                    `}
                                >
                                    [{link.label}]
                                </Link>
                            );
                        })}
                    </div>

                    {/* Logo Section - Placed Right in RTL */}
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="text-right hidden sm:block">
                            <span className="block text-xl font-black leading-none uppercase tracking-tighter">دليل_الشعب_</span>
                            <span className="text-[10px] font-black opacity-50 uppercase tracking-widest">SAUDI_ACADEMIC_SYS</span>
                        </div>
                        <div className="relative">
                            <img
                                src="/pixel-logo.png"
                                alt="دليل الشعب"
                                className="h-16 w-auto object-contain pixelated group-hover:-rotate-2 transition-transform"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/pixel-logo.png.svg';
                                }}
                            />
                            <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-600 border border-[var(--foreground)] animate-pulse"></div>
                        </div>
                    </Link>

                </div>
            </div>
        </nav>
    );
}
