'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    DoodleCard,
    DoodleButton,
    DoodleBadge,
    VotePill
} from '@/components/DoodleComponents';

interface Group {
    id: string;
    platform: string;
    college: string;
    subject: string;
    sectionNumber: string;
    groupLink: string;
    groupName: string;
    description?: string;
    votes: number;
}

import { Suspense } from 'react';

// Extract the logic to a client component
function SectionContent() {
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

    const handleVote = async (groupId: string, type: 'up' | 'down') => {
        // Logic for voting (existing logic placeholder)
        console.log(`Voting ${type} for ${groupId}`);
        // Refresh groups or update state locally
    };

    return (
        <div className="pt-32 pb-20 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Search Header Info */}
                <div className="bg-[#FFD400] doodle-border doodle-shadow p-8 mb-16 rotate-[0.5deg]">
                    <h1 className="text-4xl font-black mb-6 underline decoration-black/20 decoration-8 underline-offset-8">
                        نتائج البحث 🔍
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-bold">
                        <div className="rotate-[1deg]">
                            <span className="text-xs uppercase opacity-50 block">الكلية</span>
                            <span className="text-xl">{college}</span>
                        </div>
                        <div className="-rotate-[1deg]">
                            <span className="text-xs uppercase opacity-50 block">المادة</span>
                            <span className="text-xl">{subject}</span>
                        </div>
                        <div className="rotate-[0.5deg]">
                            <span className="text-xs uppercase opacity-50 block">الشعبة</span>
                            <span className="text-3xl font-black">{section}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="text-center py-32 font-black text-3xl animate-bounce">
                        جاري البحث بين الدفاتر... 📖✏️
                    </div>
                ) : groups.length === 0 ? (
                    <DoodleCard className="text-center py-20 border-dashed" rotate="-rotate-[1deg]">
                        <div className="text-6xl mb-6">🤷‍♂️</div>
                        <h2 className="text-3xl font-black mb-4 text-red-600">للاسف ما لقيت شيء!</h2>
                        <p className="font-bold opacity-70 mb-10">تبغى تكون أول واحد يضيف هذي الشعبة؟</p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <Link href="/submit">
                                <DoodleButton variant="primary">إضافة المجموعة الآن ✍️</DoodleButton>
                            </Link>
                            <Link href="/">
                                <DoodleButton variant="outline">رجوع للرئيسية</DoodleButton>
                            </Link>
                        </div>
                    </DoodleCard>
                ) : (
                    <div className="space-y-10">
                        <div className="flex justify-between items-center rotate-[1deg]">
                            <DoodleBadge className="text-lg px-4 py-2">وجدنا {groups.length} روابط 🚀</DoodleBadge>
                        </div>

                        {groups.map((group, i) => (
                            <DoodleCard
                                key={group.id}
                                rotate={i % 2 === 0 ? "rotate-[0.5deg]" : "-rotate-[0.5deg]"}
                                className="group"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                                    <div className="flex-1 text-right space-y-4">
                                        <div className="flex gap-2">
                                            <DoodleBadge className={group.platform === 'telegram' ? 'bg-[#FF7A00]/20' : 'bg-green-400/20'}>
                                                {group.platform === 'telegram' ? 'تيليجرام ✈️' : 'واتساب 💬'}
                                            </DoodleBadge>
                                            {group.sectionNumber === 'عام' ? (
                                                <DoodleBadge className="bg-blue-400/20 border-blue-400">قروب المادة (العام) 📚</DoodleBadge>
                                            ) : (
                                                <DoodleBadge className="bg-[#FFD400]/20">قروب الشعبة #{group.sectionNumber} 🔢</DoodleBadge>
                                            )}
                                        </div>
                                        <h3 className="text-3xl font-black group-hover:underline transition-all">
                                            {group.groupName}
                                        </h3>
                                        {group.description && (
                                            <p className="font-bold text-sm bg-black/5 p-3 doodle-border-sm border-dashed">
                                                {group.description}
                                            </p>
                                        )}
                                        <p className="font-bold opacity-40 text-xs">معرف المجموعة: {group.id.slice(0, 8)}</p>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <VotePill
                                            count={group.votes || 0}
                                            onUpvote={() => handleVote(group.id, 'up')}
                                            onDownvote={() => handleVote(group.id, 'down')}
                                        />
                                        <a
                                            href={group.groupLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <DoodleButton className="px-10 py-4 text-xl" variant="primary">
                                                دخول المجموعة 🔗
                                            </DoodleButton>
                                        </a>
                                    </div>
                                </div>
                            </DoodleCard>
                        ))}

                        <div className="pt-20 text-center">
                            <p className="font-black opacity-30 mb-8">— نهاية القائمة 📓 —</p>
                            <Link href="/submit">
                                <DoodleButton variant="outline" className="text-sm">المساهمة برابط إضافي</DoodleButton>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SectionPage() {
    return (
        <Suspense fallback={<div className="text-center py-32 font-black text-3xl animate-bounce">جاري التحميل... ✏️</div>}>
            <SectionContent />
        </Suspense>
    );
}
