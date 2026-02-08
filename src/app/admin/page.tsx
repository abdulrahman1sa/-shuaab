'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    DoodleCard,
    DoodleButton,
    DoodleBadge,
    DoodleInput
} from '@/components/DoodleComponents';

interface Submission {
    id: string;
    platform: string;
    college: string;
    subject: string;
    sectionNumber: string;
    groupLink: string;
    groupName: string;
    description?: string;
    submitterName: string;
    status: string;
    createdAt: string;
}

import { useUser } from '@clerk/nextjs';

export default function AdminDashboard() {
    const { user, isLoaded } = useUser();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

    const ADMIN_PASSWORD = 'JUSTMEANDSOMEPEPOLR><';

    useEffect(() => {
        // Method 1: Session Storage (Legacy Password)
        const auth = sessionStorage.getItem('adminAuth');
        if (auth === 'true') {
            setIsAuthenticated(true);
            return;
        }

        // Method 2: Clerk Authentication (Email Check)
        if (isLoaded && user) {
            const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',');
            const userEmail = user.primaryEmailAddress?.emailAddress;

            if (userEmail && adminEmails.includes(userEmail)) {
                setIsAuthenticated(true);
            }
        }
    }, [user, isLoaded]);

    // Fetch data when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchSubmissions();
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminAuth', 'true');
            setIsAuthenticated(true);
            fetchSubmissions();
        } else {
            alert('تم رفض الدخول: كلمة المرور خاطئة (INVALID_KEY)');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adminAuth');
        setIsAuthenticated(false);
        setPassword('');
    };

    const fetchSubmissions = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/groups/submit');
            const data = await response.json();
            setSubmissions(data.submissions || []);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            const response = await fetch('/api/admin/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                fetchSubmissions();
            } else {
                const errorData = await response.json();
                alert(`فشل القبول: ${errorData.message || errorData.error || 'خطأ غير معروف'}`);
            }
        } catch (error: any) {
            console.error('Error approving:', error);
            alert('حدث خطأ في الاتصال بالسيرفر');
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt('سبب الرفض (اختياري):');
        try {
            const response = await fetch('/api/admin/reject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, reason }),
            });

            if (response.ok) {
                fetchSubmissions();
            }
        } catch (error) {
            console.error('Error rejecting:', error);
        }
    };

    const filteredSubmissions = submissions.filter(sub => sub.status === filter);

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
                <DoodleCard className="max-w-md w-full p-10 rotate-[1deg] bg-white">
                    <div className="text-center mb-10">
                        <DoodleBadge className="mb-4 text-sm rotate-[5deg]">دخول المسؤولين فقط 🔒</DoodleBadge>
                        <h1 className="text-4xl font-black">نظام الإدارة</h1>
                        <p className="mt-4 text-sm opacity-50">أدخل الرمز السري للمتابعة</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-3">
                            <label className="font-black text-sm uppercase opacity-40">كلمة المرور السرية</label>
                            <DoodleInput
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="أدخل الرمز هنا..."
                                required
                            />
                        </div>
                        <DoodleButton type="submit" className="w-full py-4" variant="primary">
                            تفعيل الدخول 🔐
                        </DoodleButton>
                    </form>
                </DoodleCard>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">

            {/* Admin Header */}
            <div className="flex justify-between items-center mb-16 rotate-[0.5deg]">
                <div className="text-right">
                    <h1 className="text-4xl font-black underline decoration-[#FF7A00] decoration-8 underline-offset-8">
                        لوحة التحكم 🛠️
                    </h1>
                    <p className="font-bold opacity-40 mt-2">إدارة الطلبات والمحتوى</p>
                </div>
                <DoodleButton onClick={handleLogout} variant="outline" className="text-sm">
                    خروج 🚪
                </DoodleButton>
            </div>

            {/* Stats Ticker */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-2">
                <div className="bg-[#FFD400]/10 doodle-border-sm p-6 text-center rotate-[1deg]">
                    <span className="block text-4xl font-black">{submissions.filter(s => s.status === 'pending').length}</span>
                    <span className="font-bold opacity-50 uppercase text-xs">قيد المراجعة</span>
                </div>
                <div className="bg-green-400/10 doodle-border-sm p-6 text-center -rotate-[1deg]">
                    <span className="block text-4xl font-black">{submissions.filter(s => s.status === 'approved').length}</span>
                    <span className="font-bold opacity-50 uppercase text-xs">تمت الموافقة</span>
                </div>
                <div className="bg-red-400/10 doodle-border-sm p-6 text-center rotate-[0.5deg]">
                    <span className="block text-4xl font-black">{submissions.filter(s => s.status === 'rejected').length}</span>
                    <span className="font-bold opacity-50 uppercase text-xs">مرفوضة</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex bg-white doodle-border-sm p-2 gap-2 mb-12 -rotate-[0.5deg]">
                <button
                    onClick={() => setFilter('pending')}
                    className={`flex-1 py-3 font-black transition-all ${filter === 'pending' ? 'bg-[#FFD400] doodle-border-sm shadow-[3px_3px_0_0_black]' : 'opacity-40'}`}
                >
                    الطلبات الجديدة
                </button>
                <button
                    onClick={() => setFilter('approved')}
                    className={`flex-1 py-3 font-black transition-all ${filter === 'approved' ? 'bg-[#FFD400] doodle-border-sm shadow-[3px_3px_0_0_black]' : 'opacity-40'}`}
                >
                    المعتمدة
                </button>
                <button
                    onClick={() => setFilter('rejected')}
                    className={`flex-1 py-3 font-black transition-all ${filter === 'rejected' ? 'bg-[#FFD400] doodle-border-sm shadow-[3px_3px_0_0_black]' : 'opacity-40'}`}
                >
                    المرفوضة
                </button>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="text-center py-20 font-black animate-pulse">جاري سحب البيانات... 📂</div>
            ) : filteredSubmissions.length === 0 ? (
                <DoodleCard className="text-center py-20 border-dashed" rotate="rotate-0">
                    <p className="font-black opacity-30 text-2xl">لا يوجد سجلات حالياً 💨</p>
                </DoodleCard>
            ) : (
                <div className="space-y-10">
                    {filteredSubmissions.map((sub, i) => (
                        <DoodleCard key={sub.id} rotate={i % 2 === 0 ? "rotate-[0.5deg]" : "-rotate-[0.5deg]"}>
                            <div className="flex flex-col lg:flex-row gap-10">
                                <div className="flex-1 text-right space-y-6">
                                    <div className="flex items-center justify-between border-b-2 border-dashed border-black pb-4">
                                        <h3 className="text-2xl font-black">{sub.groupName}</h3>
                                        <DoodleBadge>{sub.platform}</DoodleBadge>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm font-bold">
                                        <div>
                                            <span className="opacity-40 block text-xs">الكلية</span>
                                            {sub.college}
                                        </div>
                                        <div>
                                            <span className="opacity-40 block text-xs">المادة</span>
                                            {sub.subject}
                                        </div>
                                        <div>
                                            <span className="opacity-40 block text-xs">الشعبة / النوع</span>
                                            {sub.sectionNumber === 'عام' ? '📚 قروب مادة' : `#${sub.sectionNumber}`}
                                        </div>
                                        <div>
                                            <span className="opacity-40 block text-xs">المُرسل</span>
                                            {sub.submitterName || 'مجهول'}
                                        </div>
                                    </div>
                                    <div className="pt-4 overflow-hidden space-y-4">
                                        {sub.description && (
                                            <div>
                                                <span className="opacity-40 block text-xs uppercase mb-1">الوصف:</span>
                                                <p className="text-sm font-bold bg-gray-50 p-3 doodle-border-sm border-dashed">{sub.description}</p>
                                            </div>
                                        )}
                                        <div>
                                            <span className="opacity-40 block text-xs uppercase mb-1">الرابط المباشر:</span>
                                            <a href={sub.groupLink} target="_blank" className="font-mono text-xs text-blue-600 truncate block bg-black/5 p-2 doodle-border-sm">
                                                {sub.groupLink}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {sub.status === 'pending' && (
                                    <div className="flex lg:flex-col justify-center gap-4 lg:w-48 lg:border-r-2 lg:border-dashed lg:border-black lg:pr-8">
                                        <DoodleButton onClick={() => handleApprove(sub.id)} className="flex-1 py-4" variant="primary">
                                            موافقة ✅
                                        </DoodleButton>
                                        <DoodleButton onClick={() => handleReject(sub.id)} className="flex-1 py-4" variant="outline">
                                            رفض ❌
                                        </DoodleButton>
                                    </div>
                                )}
                            </div>
                        </DoodleCard>
                    ))}
                </div>
            )}

        </div>
    );
}
