'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'الرئيسية' },
        { href: '/submit', label: 'إضافة شعبة' },
        { href: '/admin', label: 'الإدارة' },
    ];

    return (
        <nav className="fixed top-6 left-0 right-0 z-[100] px-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white doodle-border-sm doodle-shadow-sm px-6 py-4 flex justify-between items-center -rotate-[0.5deg]">

                    {/* Actions */}
                    <div className="flex items-center gap-4">
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
                        <span className="text-2xl font-black tracking-tighter bg-[#FFD400] px-3 py-1 doodle-border-sm">
                            دليل_الشعب
                        </span>
                    </Link>

                    {/* Links */}
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
                </div>
            </div>
        </nav>
    );
}
