'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'الرئيسية' },
        { href: '/gpa', label: 'حاسبة المعدل' },
        { href: '/submit', label: 'إضافة شعبة' },
        { href: '/admin', label: 'الإدارة' },
    ];

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-6 left-0 right-0 z-[100] px-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white doodle-border-sm doodle-shadow-sm px-6 py-4 flex justify-between items-center -rotate-[0.5deg] relative">

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-2xl p-2 doodle-border-sm hover:bg-gray-100"
                        >
                            {isMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>

                    {/* Actions (Desktop) */}
                    <div className="hidden md:flex items-center gap-4">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="bg-black text-white doodle-border-sm px-4 py-2 font-black text-xs uppercase hover:scale-105 transition-transform rotate-[-1deg] mx-2">
                                    تسجيل الدخول 🔑
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <div className="mx-2 scale-125 doodle-border-sm rounded-full overflow-hidden">
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </SignedIn>
                        <Link
                            href="/submit"
                            className="bg-[#FF7A00] doodle-border-sm px-4 py-2 font-black text-xs uppercase doodle-clickable rotate-[1deg]"
                        >
                            سجل شعبتك!
                        </Link>
                    </div>


                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group rotate-[1deg]">
                        <div className="flex items-center gap-2 bg-[#FFD400] px-3 py-2 doodle-border-sm">
                            <img
                                src="/duck-logo.png"
                                alt="Duck Logo"
                                className="w-10 h-10 object-contain"
                            />
                            <span className="text-2xl font-black tracking-tighter">
                                دليل الشُعب
                            </span>
                        </div>
                    </Link>


                    {/* Links (Desktop) */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                                        font-black text-sm uppercase transition-all
                                        ${isActive
                                            ? 'underline decoration-[#FFD400] decoration-4 underline-offset-4'
                                            : 'hover:rotate-[2deg]'
                                        }
                                    `}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Actions (Right side on mobile) */}
                    <div className="md:hidden flex items-center gap-2">
                        <SignedIn>
                            <div className="mx-2 scale-125 doodle-border-sm rounded-full overflow-hidden">
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </SignedIn>
                        {!isMenuOpen && (
                            <Link
                                href="/submit"
                                className="bg-[#FF7A00] doodle-border-sm px-3 py-1 font-black text-[10px] uppercase rotate-[1deg]"
                            >
                                +
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-4 px-4 md:hidden">
                        <div className="bg-white doodle-border-sm doodle-shadow-sm p-4 flex flex-col gap-4 rotate-[1deg]">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="font-black text-lg text-center py-2 border-b-2 border-dashed border-gray-200 last:border-0 hover:bg-yellow-50"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="flex justify-center pt-2">
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="w-full bg-black text-white doodle-border-sm px-4 py-3 font-black text-sm uppercase">
                                            تسجيل الدخول 🔑
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
