'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Faculty, Subject, Section } from '@/types';
import { HiSearch, HiChevronDown } from 'react-icons/hi';
import clsx from 'clsx';

export default function SearchHero() {
    const router = useRouter();
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [sections, setSections] = useState<Section[]>([]); // sections for the subject

    const [selectedFaculty, setSelectedFaculty] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');

    const [loading, setLoading] = useState(false);

    // Fetch faculties on mount
    useEffect(() => {
        const fetchFaculties = async () => {
            const res = await fetch('/api/faculties');
            if (res.ok) setFaculties(await res.json());
        };
        fetchFaculties();
    }, []);

    // Fetch subjects when faculty changes
    useEffect(() => {
        if (selectedFaculty) {
            const fetchSubjects = async () => {
                const res = await fetch(`/api/subjects?facultyId=${encodeURIComponent(selectedFaculty)}`);
                if (res.ok) setSubjects(await res.json());
            };
            fetchSubjects();
            setSelectedSubject('');
            setSelectedSection('');
            setSections([]);
        } else {
            setSubjects([]);
        }
    }, [selectedFaculty]);

    // Fetch sections when subject changes
    useEffect(() => {
        if (selectedSubject) {
            const fetchSections = async () => {
                const res = await fetch(`/api/sections?subjectId=${encodeURIComponent(selectedSubject)}`);
                if (res.ok) setSections(await res.json());
            };
            fetchSections();
            setSelectedSection('');
        } else {
            setSections([]);
        }
    }, [selectedSubject]);

    const handleSearch = () => {
        if (selectedSection) {
            setLoading(true);
            // Navigate to details page (we'll implement this route next)
            // Actually the user wants to go to: Select Faculty > Subject > Section -> Show Link
            // But we might have multiple groups for a section.
            // So we go to /section/[id]
            router.push(`/section/${encodeURIComponent(selectedSection)}`);
        }
    };

    return (
        <div className="relative overflow-hidden bg-white py-16 sm:py-24">
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
                <div className="flex justify-center mb-8">
                    <img src="/logo.png" alt="دليل الشعب" className="h-32 w-auto object-contain animate-float" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-primary-900 sm:text-5xl mb-4 sr-only">
                    دليل الشعب
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500 mb-10">
                    بدل ما تسأل في القروب العام، اختار شعبتك وخذ رابط القروب على طول.
                </p>

                <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-100">
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Faculty Dropdown */}
                        <div className="relative">
                            <select
                                className="block w-full rounded-lg border-gray-200 py-3 pr-4 pl-8 text-gray-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm appearance-none bg-gray-50"
                                value={selectedFaculty}
                                onChange={(e) => setSelectedFaculty(e.target.value)}
                            >
                                <option value="">اختر الكلية</option>
                                {faculties.map((f) => (
                                    <option key={f.id} value={f.id}>{f.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-400">
                                <HiChevronDown className="h-5 w-5" />
                            </div>
                        </div>

                        {/* Subject Dropdown */}
                        <div className="relative">
                            <select
                                className="block w-full rounded-lg border-gray-200 py-3 pr-4 pl-8 text-gray-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm appearance-none bg-gray-50 disabled:opacity-50"
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                disabled={!selectedFaculty}
                            >
                                <option value="">اختر المادة</option>
                                {subjects.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-400">
                                <HiChevronDown className="h-5 w-5" />
                            </div>
                        </div>

                        {/* Section Dropdown */}
                        <div className="relative">
                            <select
                                className="block w-full rounded-lg border-gray-200 py-3 pr-4 pl-8 text-gray-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm appearance-none bg-gray-50 disabled:opacity-50"
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                disabled={!selectedSubject}
                            >
                                <option value="">اختر رقم الشعبة</option>
                                {sections.map((s) => (
                                    <option key={s.id} value={s.id}>{s.sectionNumber}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-400">
                                <HiChevronDown className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSearch}
                        disabled={!selectedSection || loading}
                        className={clsx(
                            "mt-8 w-full rounded-xl py-4 text-center font-bold text-white shadow-lg transition-all",
                            !selectedSection ? "bg-gray-300 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-700 hover:shadow-primary-500/30 active:scale-[0.98]"
                        )}
                    >
                        {loading ? 'جاري البحث...' : 'اعرض قروب الشعبة'}
                    </button>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -ml-[40rem] -mt-[10rem] w-[80rem] h-[40rem] opacity-20 bg-gradient-to-tr from-primary-200 to-purple-200 blur-3xl -z-10 rounded-full" />
        </div>
    );
}
