'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import FloatingContact from '@/components/FloatingContact';

interface Group {
    id: string;
    platform: string;
    college: string;
    subject: string;
    sectionNumber: string;
    groupLink: string;
    groupName: string;
}

export default function SectionPage() {
    const searchParams = useSearchParams();
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const college = searchParams.get('college');
    const subject = searchParams.get('subject');
    const section = searchParams.get('section');

    useEffect(() => {
        if (college && subject && section) {
            fetchGroups();
        }
    }, [college, subject, section]);

    const fetchGroups = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                college: college || '',
                subject: subject || '',
                section: section || '',
            });
            const response = await fetch(`/api/groups/approved?${params}`);
            const data = await response.json();
            setGroups(data.groups || []);
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[var(--background)] min-h-screen pt-32 pb-20 relative overflow-hidden">
            <div className="fixed inset-0 dither-bg pointer-events-none opacity-5 z-0"></div>
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Search Parameter Context Box */}
                <div className="bg-[var(--foreground)] text-[var(--background)] p-10 mb-16 shadow-[12px_12px_0_0_rgba(0,0,0,0.3)] border-4 border-[var(--background)] outline outline-8 outline-[var(--foreground)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[var(--background)] opacity-20 bg-[linear-gradient(90deg,transparent_50%,var(--background)_50%)] bg-[length:10px_100%]"></div>

                    <h1 className="text-4xl md:text-6xl font-black mb-10 border-b-8 border-double border-[var(--background)] pb-6 tracking-tighter uppercase relative">
                        نتائج_البحث_🔍
                        <span className="absolute bottom-0 right-0 text-xs font-black bg-[var(--background)] text-[var(--foreground)] px-3 py-1 uppercase">QUERY_SUCCESS_200</span>
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-right font-mono">
                        <div className="space-y-2 border-r-4 border-[var(--background)]/20 pr-6">
                            <p className="opacity-60 text-xs font-black uppercase tracking-widest">&gt; الكلية (COLLEGE)</p>
                            <p className="text-2xl font-black truncate">{college || 'NULL'}</p>
                        </div>
                        <div className="space-y-2 border-r-4 border-[var(--background)]/20 pr-6">
                            <p className="opacity-60 text-xs font-black uppercase tracking-widest">&gt; المادة (SUBJECT)</p>
                            <p className="text-2xl font-black truncate">{subject || 'NULL'}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="opacity-60 text-xs font-black uppercase tracking-widest">&gt; الشعبة (SECTION)</p>
                            <p className="text-5xl font-black leading-none">{section || 'NULL'}</p>
                        </div>
                    </div>
                </div>

                {/* State Management */}
                {isLoading ? (
                    <div className="text-center py-40 border-8 border-dotted border-[var(--foreground)] bg-[var(--background)]">
                        <div className="text-3xl font-black animate-pulse uppercase tracking-[0.2em]">
                            جاري_استخراج_النتائج_
                            <span className="block text-sm opacity-50 mt-4">[FETCHING_FROM_DATABASE_V1]</span>
                        </div>
                    </div>
                ) : groups.length === 0 ? (
                    <div className="text-center py-32 bg-[var(--background)] border-8 border-dashed border-[var(--foreground)] px-8">
                        <div className="text-9xl mb-10 font-black text-[var(--foreground)] opacity-10">[!]</div>
                        <h2 className="text-4xl font-black text-[var(--foreground)] mb-6 uppercase tracking-tighter">404_السجل_غير_موجود</h2>
                        <p className="text-[var(--foreground)] mb-12 max-w-lg mx-auto font-bold text-lg leading-relaxed border-y-2 border-[var(--foreground)] py-6">
                            // النظام لم يعثر على روابط مطابقة لهذه الشعبة.<br />
                            // هل ترغب في المساهمة وإضافة رابط؟
                        </p>
                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <Link
                                href="/submit"
                                className="bg-[var(--foreground)] text-[var(--background)] px-12 py-6 font-black text-2xl hover:bg-[var(--background)] hover:text-[var(--foreground)] border-4 border-[var(--foreground)] transition-none shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] active:translate-y-2 active:shadow-none uppercase tracking-widest"
                            >
                                &gt; إضافة_مجموعة_الآن
                            </Link>
                            <Link
                                href="/"
                                className="bg-[var(--background)] text-[var(--foreground)] border-4 border-[var(--foreground)] px-12 py-6 font-black text-2xl hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-none shadow-[8px_8px_0_0_var(--foreground)] active:translate-y-2 active:shadow-none uppercase tracking-widest"
                            >
                                [ عودة_للرئيسية ]
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12 animate-fade-in">
                        <div className="flex items-center justify-between border-b-4 border-[var(--foreground)] pb-4 px-2">
                            <p className="text-right text-[var(--foreground)] font-black text-sm uppercase tracking-widest">
                                &gt; التطابقات_الموجودة: {groups.length} (ENTRIES_FOUND)
                            </p>
                            <div className="flex gap-2">
                                <span className="w-3 h-3 bg-[var(--foreground)]"></span>
                                <span className="w-3 h-3 bg-[var(--foreground)] opacity-50"></span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-10">
                            {groups.map((group) => (
                                <div
                                    key={group.id}
                                    className="pixel-card bg-[var(--background)] border-4 border-[var(--foreground)] p-10 hover:shadow-[16px_16px_0_0_var(--foreground)] transition-none shadow-[10px_10px_0_0_rgba(0,0,0,0.2)] relative group overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-2 h-full bg-[var(--foreground)] opacity-10"></div>

                                    <div className="flex flex-col md:flex-row justify-between items-center gap-10 text-right">
                                        <div className="flex-1 space-y-6">
                                            <div className="flex items-center justify-end gap-3">
                                                <span className={`inline-block px-4 py-1 font-black text-xs uppercase border-2 border-[var(--foreground)] ${group.platform === 'telegram' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'bg-[var(--background)] text-[var(--foreground)]'}`}>
                                                    {group.platform === 'telegram' ? 'PROTO: T_GRAM' : 'PROTO: W_APP'}
                                                </span>
                                            </div>
                                            <h3 className="text-4xl font-black text-[var(--foreground)] tracking-tight uppercase leading-none">
                                                {group.groupName}
                                            </h3>
                                            <p className="text-xs font-black opacity-30 mt-2 uppercase tracking-widest">NODE_ID: {group.id.substring(0, 8).toUpperCase()}</p>
                                        </div>

                                        <a
                                            href={group.groupLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full md:w-auto bg-[var(--foreground)] text-[var(--background)] px-12 py-6 font-black text-2xl border-2 border-[var(--foreground)] hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-none shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] active:translate-y-2 active:shadow-none text-center uppercase tracking-[0.2em]"
                                        >
                                            دخول_المجموعة &gt;&gt;
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center pt-24 border-t-8 border-double border-[var(--foreground)] mt-20">
                            <p className="text-[var(--foreground)] mb-6 font-black uppercase text-sm tracking-[0.5em] opacity-40">// EOF: END_OF_DATA_STREAM //</p>
                            <Link href="/submit" className="inline-block bg-[var(--foreground)] text-[var(--background)] px-10 py-5 font-black text-lg hover:shadow-[8px_8px_0_0_var(--foreground)] hover:bg-[var(--background)] hover:text-[var(--foreground)] border-4 border-[var(--foreground)] transition-none uppercase">
                                [ المساهمة_ببيانات_إضافية ]
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <FloatingContact />
        </div>
    );
}
