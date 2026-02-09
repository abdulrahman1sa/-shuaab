'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DoodleCard, DoodleButton, DoodleInput } from '@/components/DoodleComponents';

interface Course {
    name: string;
    hours: number;
    grade: string;
}

export default function GPACalculator() {
    const [scale, setScale] = useState<4 | 5>(5);
    const [courses, setCourses] = useState<Course[]>([
        { name: '', hours: 3, grade: '' }
    ]);
    const [result, setResult] = useState<{ gpa: number; totalHours: number } | null>(null);

    const gradePoints: { [key: string]: { 4: number; 5: number } } = {
        'A+': { 4: 4.0, 5: 5.0 },
        'A': { 4: 3.75, 5: 4.75 },
        'B+': { 4: 3.5, 5: 4.5 },
        'B': { 4: 3.0, 5: 4.0 },
        'C+': { 4: 2.5, 5: 3.5 },
        'C': { 4: 2.0, 5: 3.0 },
        'D+': { 4: 1.5, 5: 2.5 },
        'D': { 4: 1.0, 5: 2.0 },
        'F': { 4: 0, 5: 1.0 }
    };

    const addCourse = () => {
        setCourses([...courses, { name: '', hours: 3, grade: '' }]);
    };

    const removeCourse = (index: number) => {
        setCourses(courses.filter((_, i) => i !== index));
    };

    const updateCourse = (index: number, field: keyof Course, value: any) => {
        const newCourses = [...courses];
        newCourses[index] = { ...newCourses[index], [field]: value };
        setCourses(newCourses);
    };

    const calculateGPA = () => {
        let totalPoints = 0;
        let totalHours = 0;

        courses.forEach(course => {
            if (course.grade && course.hours > 0) {
                const points = gradePoints[course.grade]?.[scale] || 0;
                totalPoints += points * course.hours;
                totalHours += course.hours;
            }
        });

        const gpa = totalHours > 0 ? totalPoints / totalHours : 0;
        setResult({ gpa: parseFloat(gpa.toFixed(2)), totalHours });
    };

    return (
        <>
            <Navbar />
            <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-black mb-4 -rotate-[1deg]">
                            حاسبة <span className="bg-[#FFD400] px-4 doodle-border-sm rotate-[2deg] inline-block">المعدل</span> 📊
                        </h1>
                        <p className="text-xl text-gray-600 font-bold">احسب معدلك التراكمي بدقة عالية</p>
                    </div>

                    {/* Scale Selector */}
                    <DoodleCard className="mb-8">
                        <h2 className="text-2xl font-black mb-4">اختر نظام التقييم</h2>
                        <div className="flex gap-4">
                            <DoodleButton
                                onClick={() => setScale(5)}
                                variant={scale === 5 ? 'primary' : 'outline'}
                                className="flex-1 py-4"
                            >
                                من 5.0
                            </DoodleButton>
                            <DoodleButton
                                onClick={() => setScale(4)}
                                variant={scale === 4 ? 'primary' : 'outline'}
                                className="flex-1 py-4"
                            >
                                من 4.0
                            </DoodleButton>
                        </div>
                    </DoodleCard>

                    {/* Courses */}
                    <DoodleCard className="mb-8">
                        <h2 className="text-2xl font-black mb-6">المواد الدراسية</h2>

                        <div className="space-y-4">
                            {courses.map((course, index) => (
                                <div key={index} className="border-2 border-black p-4 bg-white">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold mb-2">اسم المادة (اختياري)</label>
                                            <DoodleInput
                                                type="text"
                                                value={course.name}
                                                onChange={(e) => updateCourse(index, 'name', e.target.value)}
                                                placeholder="مثال: الرياضيات"
                                                aria-label="اسم المادة"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold mb-2">عدد الساعات</label>
                                            <DoodleInput
                                                type="number"
                                                min="1"
                                                max="6"
                                                value={course.hours}
                                                onChange={(e) => updateCourse(index, 'hours', parseInt(e.target.value) || 0)}
                                                aria-label="عدد الساعات"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold mb-2">التقدير</label>
                                            <select
                                                aria-label="التقدير"
                                                value={course.grade}
                                                onChange={(e) => updateCourse(index, 'grade', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-black font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                                            >
                                                <option value="">اختر</option>
                                                {Object.keys(gradePoints).map(grade => (
                                                    <option key={grade} value={grade}>
                                                        {grade} ({gradePoints[grade][scale].toFixed(2)})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {courses.length > 1 && (
                                        <button
                                            onClick={() => removeCourse(index)}
                                            className="mt-3 text-red-600 font-bold hover:underline"
                                        >
                                            ❌ حذف المادة
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <DoodleButton
                            onClick={addCourse}
                            variant="outline"
                            className="w-full mt-6 py-4"
                        >
                            ➕ إضافة مادة
                        </DoodleButton>
                    </DoodleCard>

                    {/* Calculate Button */}
                    <DoodleButton
                        onClick={calculateGPA}
                        variant="primary"
                        className="w-full py-6 text-2xl mb-8"
                    >
                        🧮 احسب المعدل
                    </DoodleButton>

                    {/* Result */}
                    {result && (
                        <DoodleCard className="bg-gradient-to-br from-[#FFD400] to-[#FF7A00] text-center">
                            <h2 className="text-3xl font-black mb-4">النتيجة 🎯</h2>
                            <div className="text-6xl font-black mb-4">
                                {result.gpa.toFixed(2)} / {scale}.00
                            </div>
                            <p className="text-xl font-bold">
                                إجمالي الساعات: {result.totalHours} ساعة
                            </p>
                            <div className="mt-6 text-lg font-bold">
                                {result.gpa >= scale * 0.9 && '🏆 ممتاز مع مرتبة الشرف!'}
                                {result.gpa >= scale * 0.75 && result.gpa < scale * 0.9 && '⭐ ممتاز!'}
                                {result.gpa >= scale * 0.6 && result.gpa < scale * 0.75 && '👍 جيد جداً!'}
                                {result.gpa >= scale * 0.5 && result.gpa < scale * 0.6 && '✅ جيد'}
                                {result.gpa < scale * 0.5 && '📚 واصل الاجتهاد!'}
                            </div>
                        </DoodleCard>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
