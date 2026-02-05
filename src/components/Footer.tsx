'use client';

import Link from 'next/link';

export default function Footer() {
    const telegramHandle = 'DVVLLP';

    return (
        <footer className="bg-[var(--background)] text-[var(--foreground)] py-16 mt-20 border-t-8 border-double border-[var(--foreground)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--foreground)] opacity-20 bg-[linear-gradient(90deg,transparent_50%,var(--foreground)_50%)] bg-[length:10px_100%]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-right">

                    {/* Mission Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-end gap-3">
                            <h3 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-[var(--foreground)] pb-2 inline-block">تذييل_النظام</h3>
                        </div>
                        <p className="text-[var(--foreground)] leading-relaxed text-sm font-bold font-mono border-r-4 border-[var(--foreground)] pr-4 ml-auto max-w-xs">
                            // رسالة_النظام:<br />
                            تسهيل_الوصول_للشعب_الجامعية_السعودية.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-black uppercase tracking-widest bg-[var(--foreground)] text-[var(--background)] inline-block px-3 py-1">خريطة_الموقع</h3>
                        <ul className="space-y-4 font-black text-sm uppercase">
                            <li>
                                <Link href="/" className="group flex items-center justify-end gap-2 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-none px-2 py-1 w-fit mr-0 ml-auto">
                                    <span>الرئيسية</span>
                                    <span>[01]</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/groups" className="group flex items-center justify-end gap-2 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-none px-2 py-1 w-fit mr-0 ml-auto">
                                    <span>المجموعات</span>
                                    <span>[02]</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/submit" className="group flex items-center justify-end gap-2 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-none px-2 py-1 w-fit mr-0 ml-auto">
                                    <span>إضافة_شعبة</span>
                                    <span>[03]</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin" className="group flex items-center justify-end gap-2 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-none px-2 py-1 w-fit mr-0 ml-auto">
                                    <span>الإدارة</span>
                                    <span>[04]</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support Section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-black uppercase tracking-widest bg-[var(--foreground)] text-[var(--background)] inline-block px-3 py-1">قناة_الدعم</h3>
                        <p className="text-[var(--foreground)] font-black text-xs">
                            // للإبلاغ_عن_الأخطاء_أو_الاقتراحات:
                        </p>
                        <a
                            href={`https://t.me/${telegramHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-4 bg-[var(--background)] text-[var(--foreground)] px-8 py-4 border-4 border-[var(--foreground)] font-black hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-none shadow-[6px_6px_0_0_var(--foreground)] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase"
                        >
                            <span className="text-xl">@</span>
                            <span>{telegramHandle}</span>
                        </a>
                    </div>

                </div>

                <div className="border-t-4 border-dotted border-[var(--foreground)] mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[var(--foreground)] text-[10px] font-black uppercase tracking-[0.2em]">
                    <p>حقوق النشر (ج) {new Date().getFullYear()} نظام_دليل_الشعب.</p>
                    <p>تم_التطوير_بواسطة: @{telegramHandle}</p>
                </div>
            </div>
        </footer>
    );
}
