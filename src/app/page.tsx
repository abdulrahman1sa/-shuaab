'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const colleges = [
    'كلية الهندسة', 'كلية الطب', 'كلية العلوم', 'كلية الآداب',
    'كلية التجارة', 'كلية الحقوق', 'كلية الصيدلة', 'كلية طب الأسنان',
    'كلية علوم الحاسب والمعلومات', 'كلية العلوم الطبية التطبيقية',
    'كلية التمريض', 'كلية العمارة والتخطيط', 'كلية اللغات والترجمة',
    'كلية التربية', 'كلية الشريعة', 'كلية الإعلام', 'أخرى (كتابة يدوية)'
];

interface Group {
    id: string;
    platform: string;
    college: string;
    group_name: string;
}

export default function Home() {
    const router = useRouter();
    const [selectedCollege, setSelectedCollege] = useState('');
    const [customCollege, setCustomCollege] = useState('');
    const [subjectInput, setSubjectInput] = useState('');
    const [sectionNumber, setSectionNumber] = useState('');
    const [recentGroups, setRecentGroups] = useState<Group[]>([]);
    const [allGroups, setAllGroups] = useState<Group[]>([]);

    useEffect(() => {
        fetch('/api/groups/approved')
            .then(res => res.json())
            .then(data => {
                if (data.groups) {
                    setAllGroups(data.groups);
                    setRecentGroups(data.groups.slice(0, 3));
                }
            });
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const finalCollege = selectedCollege === 'أخرى (كتابة يدوية)' ? customCollege : selectedCollege;

        if (finalCollege && subjectInput && sectionNumber) {
            const params = new URLSearchParams({
                college: finalCollege,
                subject: subjectInput,
                section: sectionNumber,
            });
            router.push(`/section?${params.toString()}`);
        }
    };

    return (
        <div className="bg-[var(--background)] min-h-screen pt-24 relative overflow-hidden">

            {/* Background Dither Pattern */}
            <div className="fixed inset-0 dither-bg pointer-events-none z-0"></div>

            {/* Hero Section */}
            <section className="relative z-10 py-10 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="space-y-6 animate-fade-in mb-12">

                            {/* KSA Badge */}
                            <div className="flex justify-center mb-4">
                                <div className="ksa-badge flex items-center gap-2">
                                    <span>🇸🇦</span>
                                    <span>شبكة_الأكاديمية_السعودية_V1.0</span>
                                </div>
                            </div>

                            <div className="flex justify-center transition-all duration-500 hover:scale-105">
                                <div className="relative p-8 border-8 border-double border-[var(--foreground)] bg-[var(--background)] shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(255,255,255,0.05)] group">
                                    <div className="absolute inset-0 border-2 border-[var(--foreground)] opacity-10 pointer-events-none -m-3"></div>
                                    <img
                                        src="/pixel-logo.png"
                                        alt="دليل الشعب"
                                        className="h-32 md:h-44 lg:h-56 w-auto object-contain pixelated relative z-10"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/pixel-logo.png.svg';
                                        }}
                                    />
                                    {/* Decorative Corner Brackets */}
                                    <div className="absolute -top-4 -left-4 w-10 h-10 border-t-4 border-l-4 border-[var(--foreground)] group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-300"></div>
                                    <div className="absolute -top-4 -right-4 w-10 h-10 border-t-4 border-r-4 border-[var(--foreground)] group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300"></div>
                                    <div className="absolute -bottom-4 -left-4 w-10 h-10 border-b-4 border-l-4 border-[var(--foreground)] group-hover:-translate-x-2 group-hover:translate-y-2 transition-transform duration-300"></div>
                                    <div className="absolute -bottom-4 -right-4 w-10 h-10 border-b-4 border-r-4 border-[var(--foreground)] group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300"></div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h1 className="text-4xl md:text-6xl font-black text-[var(--foreground)] uppercase tracking-tighter leading-none mb-4">
                                    دليل الشعب الجامعي_
                                </h1>
                                <p className="text-lg md:text-xl text-[var(--foreground)] max-w-2xl mx-auto font-black leading-relaxed px-6 py-3 border-4 border-[var(--foreground)] bg-[var(--background)] inline-block shadow-[6px_6px_0_0_var(--foreground)]">
                                    <span className="cursor-blink">// جاري_توجيه_البحث: استعد_</span>
                                </p>
                            </div>
                        </div>

                        {/* Search Form Card */}
                        <div className="max-w-4xl mx-auto mt-16 animate-slide-up px-4">
                            <div className="pixel-card bg-[var(--background)] p-8 md:p-14 text-right">
                                <div className="mb-12 text-center border-b-8 border-[var(--foreground)] pb-8 border-double">
                                    <h2 className="text-4xl font-black text-[var(--foreground)] mb-3 tracking-tighter">قاعدة_البيانات_</h2>
                                    <div className="flex justify-center items-center gap-2 text-xs font-black uppercase tracking-widest">
                                        <span className="text-[var(--foreground)]">الحالة:</span>
                                        <span className="text-green-600 dark:text-green-400 animate-pulse">متصل (ONLINE)</span>
                                    </div>
                                </div>

                                <form onSubmit={handleSearch} className="space-y-12 text-right">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-4">
                                            <label className="block text-xs font-black text-[var(--foreground)] pr-2 uppercase bg-[var(--background)] w-fit px-3 border-2 border-[var(--foreground)] -mb-5 z-10 relative ml-auto mr-4"> رمز_الكلية </label>
                                            <div className="relative">
                                                <select
                                                    value={selectedCollege}
                                                    onChange={(e) => setSelectedCollege(e.target.value)}
                                                    className="w-full px-6 py-6 bg-[var(--background)] border-4 border-[var(--foreground)] focus:shadow-[10px_10px_0_0_var(--foreground)] transition-none outline-none font-black text-xl appearance-none cursor-pointer rounded-none"
                                                    required
                                                    title="اختر الكلية"
                                                >
                                                    <option value="">[ اختر_من_القائمة ]</option>
                                                    {colleges.map((college) => (
                                                        <option key={college} value={college}>{college}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none font-black text-2xl">▼</div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-xs font-black text-[var(--foreground)] pr-2 uppercase bg-[var(--background)] w-fit px-3 border-2 border-[var(--foreground)] -mb-5 z-10 relative ml-auto mr-4"> رمز_المادة </label>
                                            <input
                                                type="text"
                                                value={subjectInput}
                                                onChange={(e) => setSubjectInput(e.target.value)}
                                                placeholder="مثال: ARAB_101"
                                                className="w-full px-6 py-6 bg-[var(--background)] border-4 border-[var(--foreground)] focus:shadow-[10px_10px_0_0_var(--foreground)] transition-none outline-none font-black text-xl rounded-none placeholder:[var(--foreground)]/20"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-[var(--foreground)] pr-2 text-center uppercase bg-[var(--background)] w-fit mx-auto px-5 border-2 border-[var(--foreground)] -mb-5 z-10 relative"> رقم_الشعبة </label>
                                        <input
                                            type="text"
                                            value={sectionNumber}
                                            onChange={(e) => setSectionNumber(e.target.value)}
                                            placeholder="000"
                                            className="w-full px-8 py-8 bg-[var(--background)] border-4 border-[var(--foreground)] focus:shadow-[12px_12px_0_0_var(--foreground)] transition-none outline-none font-black text-6xl text-center placeholder:[var(--foreground)]/10 rounded-none tracking-[0.2em]"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-[var(--foreground)] text-[var(--background)] py-8 font-black text-3xl hover:bg-[var(--background)] hover:text-[var(--foreground)] border-4 border-[var(--foreground)] transition-none flex items-center justify-center gap-8 group mt-10 shadow-[14px_14px_0_0_rgba(0,0,0,0.4)] active:translate-y-2 active:shadow-none hover:-translate-y-1 hover:shadow-[18px_18px_0_0_rgba(0,0,0,0.2)] rounded-none"
                                    >
                                        <span>&gt; تنفيذ_عملية_البحث (EXECUTE)</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Ticker */}
            <div className="bg-[var(--foreground)] text-[var(--background)] py-5 overflow-hidden whitespace-nowrap border-y-8 border-double border-[var(--foreground)] relative z-10 mt-24">
                <div className="animate-marquee inline-block font-black text-xs uppercase tracking-[0.2em]">
                    دليل_الشعب_الجامعي // إجمالي_المجموعات: {allGroups.length} // إصدار: 1.0.32-BIT // الحالة: مستقر // كود_الجلسة: {Math.random().toString(36).substring(7).toUpperCase()} //
                    دليل_الشعب_الجامعي // إجمالي_المجموعات: {allGroups.length} // إصدار: 1.0.32-BIT // الحالة: مستقر // كود_الجلسة: {Math.random().toString(36).substring(7).toUpperCase()} //
                </div>
            </div>

            {/* Latest Entries Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 mb-24">
                <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-10 border-b-8 border-double border-[var(--foreground)] pb-10">
                    <div className="text-right flex-1">
                        <h2 className="text-5xl font-black text-[var(--foreground)] tracking-tighter uppercase">&gt; آخر_الإضافات_ (LATEST_NODES)</h2>
                        <p className="text-[var(--foreground)] font-black text-lg mt-3 opacity-50 underline decoration-double decoration-4">// عرض البيانات المصادق عليها حديثاً.</p>
                    </div>
                    <Link href="/groups" className="px-12 py-6 bg-[var(--background)] border-4 border-[var(--foreground)] font-black hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-none text-[var(--foreground)] shadow-[10px_10px_0_0_var(--foreground)] uppercase text-xl">
                        [ فتح_الدليل ]
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
                    {recentGroups.length > 0 ? recentGroups.map((group, idx) => (
                        <div key={group.id} className="pixel-card p-10 flex flex-col h-full bg-[var(--background)] border-4 border-[var(--foreground)] group relative shadow-[10px_10px_0_0_var(--foreground)]">

                            {/* Card Header Decoration */}
                            <div className="flex justify-between items-start mb-12 border-b-4 border-dashed border-[var(--foreground)] pb-6">
                                <div className="px-4 py-1 bg-[var(--foreground)] text-[var(--background)] font-black text-[10px] uppercase tracking-widest">
                                    {group.platform === 'telegram' ? 'T_GRAM' : 'W_APP'}
                                </div>
                                <div className="text-[var(--foreground)] font-black text-xs">
                                    كود_معرف_{idx + 1}
                                </div>
                            </div>

                            <div className="flex-grow text-right mb-12 space-y-8">
                                <h3 className="text-3xl font-black text-[var(--foreground)] leading-none tracking-tight uppercase">{group.group_name}</h3>
                                <div className="space-y-3 border-r-8 border-[var(--foreground)] pr-6 ml-auto w-fit">
                                    <p className="opacity-40 text-[10px] uppercase font-black">رمز_الكلية:</p>
                                    <p className="text-[var(--foreground)] font-black text-lg">{group.college}</p>
                                </div>
                            </div>

                            <Link
                                href="/groups"
                                className="w-full text-center py-6 bg-[var(--background)] border-4 border-[var(--foreground)] font-black text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-none shadow-[6px_6px_0_0_var(--foreground)] active:translate-y-1 active:shadow-none text-xl"
                            >
                                الدخول &gt;&gt;
                            </Link>
                        </div>
                    )) : (
                        <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-14">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-96 bg-[var(--background)] border-4 border-[var(--foreground)] relative overflow-hidden">
                                    <div className="absolute inset-0 dither-bg opacity-30"></div>
                                    <div className="absolute inset-0 flex items-center justify-center font-black animate-pulse text-xl uppercase tracking-widest">جاري_الاتصال_{i}...</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>

        </div>
    );
}
