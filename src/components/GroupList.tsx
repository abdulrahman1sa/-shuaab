'use client';

import { useState } from 'react';
import { Group } from '@/types';
import { HiUserGroup, HiCheckBadge, HiClock, HiHandThumbUp, HiHandThumbDown } from 'react-icons/hi2';
import clsx from 'clsx';
import Link from 'next/link';

interface GroupListProps {
    initialGroups: Group[];
    sectionId: string;
}

export default function GroupList({ initialGroups, sectionId }: GroupListProps) {
    const [groups, setGroups] = useState<Group[]>(initialGroups);
    const [votedGroups, setVotedGroups] = useState<string[]>([]); // simplified local state for session

    const handleVote = async (groupId: string, type: 'up' | 'down') => {
        if (votedGroups.includes(groupId)) return;

        // Optimistic update
        setGroups(prev => prev.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    upvotes: type === 'up' ? g.upvotes + 1 : g.upvotes,
                    downvotes: type === 'down' ? (g.downvotes || 0) + 1 : (g.downvotes || 0),
                };
            }
            return g;
        }));
        setVotedGroups(prev => [...prev, groupId]);

        try {
            await fetch(`/api/groups/${groupId}/vote`, {
                method: 'POST',
                body: JSON.stringify({ type }),
            });
        } catch (e) {
            console.error('Vote failed');
            // Revert if needed (skipped for MVP brevity)
        }
    };

    if (groups.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-medium text-gray-900 mb-2">للأسف ما لقينا قروب لهالشعبة... 😔</h3>
                <p className="text-gray-500 mb-8">بس تقدر تكون البطل وتضيفه الحين!</p>
                <Link
                    href={`/submit?sectionId=${sectionId}`} // Pass sectionId to pre-fill
                    className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-lg hover:bg-primary-700 transition w-full sm:w-auto"
                >
                    أضف قروب +
                </Link>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
                <div key={group.id} className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                                <HiUserGroup className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{group.groupName || 'قروب الشعبة'}</h3>
                                <div className="flex items-center gap-1 text-xs mt-1">
                                    {group.status === 'approved' ? (
                                        <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                                            <HiCheckBadge className="h-3.5 w-3.5" /> معتمد
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                                            <HiClock className="h-3.5 w-3.5" /> مراجعة
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <a
                        href={group.groupLink} // Fixed: groupLink instead of telegramLink
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl mb-4 transition-colors"
                    >
                        ادخل قروب التليجرام
                    </a>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <div className="text-xs text-gray-400">هل الرابط صحيح؟</div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleVote(group.id, 'up')}
                                disabled={votedGroups.includes(group.id)}
                                className={clsx("flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-50", votedGroups.includes(group.id) && "opacity-50")}
                            >
                                <HiHandThumbUp className="h-5 w-5 text-emerald-500" />
                                <span className="font-medium text-gray-700">{group.upvotes}</span>
                            </button>
                            <div className="h-4 w-px bg-gray-200"></div>
                            <button
                                onClick={() => handleVote(group.id, 'down')}
                                disabled={votedGroups.includes(group.id)}
                                className={clsx("flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-50", votedGroups.includes(group.id) && "opacity-50")}
                            >
                                <HiHandThumbDown className="h-5 w-5 text-rose-500" />
                                {/* Optional: Show downvotes if needed, or keep hidden to reduce negativity */}
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Quick Add Button */}
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 p-6 hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer group"
            >
                <Link href={`/submit?sectionId=${sectionId}`} className="flex flex-col items-center w-full h-full justify-center">
                    <div className="h-12 w-12 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center mb-3 text-gray-400 group-hover:text-primary-500 transition-colors">
                        <span className="text-2xl font-light">+</span>
                    </div>
                    <span className="text-gray-500 font-medium group-hover:text-primary-600">أضف قروب آخر</span>
                </Link>
            </div>
        </div>
    );
}
