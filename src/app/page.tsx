'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DoodleCard,
  DoodleButton,
  DoodleInput,
  DoodleSelect,
  DoodleBadge
} from '@/components/DoodleComponents';

const universities = [
  'جامعة أم القرى', 'الجامعة الإسلامية', 'جامعة الإمام محمد بن سعود الإسلامية', 'جامعة الملك سعود',
  'جامعة الملك عبدالعزيز', 'جامعة الملك فهد للبترول والمعادن', 'جامعة الملك فيصل', 'جامعة الملك خالد',
  'جامعة القصيم', 'جامعة طيبة', 'جامعة الطائف', 'جامعة حائل', 'جامعة جازان', 'جامعة الجوف',
  'جامعة تبوك', 'جامعة الباحة', 'جامعة نجران', 'جامعة الحدود الشمالية', 'جامعة الأميرة نورة بنت عبدالرحمن',
  'جامعة الملك سعود بن عبدالعزيز للعلوم الصحية', 'جامعة شقراء', 'جامعة المجمعة', 'جامعة حفر الباطن',
  'جامعة بيشة', 'جامعة جدة', 'جامعة الملك عبدالله للعلوم والتقنية', 'جامعة الإمام عبدالرحمن بن فيصل',
  'جامعة الأمير سطام بن عبدالعزيز', 'جامعة الملك سلمان', 'جامعة الجبيل', 'جامعة الفيصل',
  'جامعة الأمير سلطان', 'جامعة عفت', 'جامعة دار العلوم', 'جامعة المعرفة', 'جامعة رياض العلم',
  'جامعة المستقبل', 'جامعة اليمامة', 'جامعة الأعمال والتكنولوجيا', 'جامعة عناية', 'جامعة الفارابي',
  'جامعة الشرق الأوسط', 'جامعة الأصالة', 'جامعة ابن رشد', 'جامعة جدة الأهلية', 'أخرى'
];

interface Group {
  id: string;
  platform: string;
  college: string;
  groupName: string;
  subject: string;
  sectionNumber: string;
  groupLink: string;
}

export default function Home() {
  const router = useRouter();
  const [selectedCollege, setSelectedCollege] = useState('');
  const [customCollege, setCustomCollege] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [sectionNumber, setSectionNumber] = useState('');
  const [recentGroups, setRecentGroups] = useState<Group[]>([]);

  useEffect(() => {
    fetch('/api/groups/approved')
      .then(res => res.json())
      .then(data => {
        console.log('Approved Groups Data:', data);
        if (data.groups) {
          setRecentGroups(data.groups.slice(0, 3));
        }
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const college = selectedCollege === 'أخرى' ? customCollege : selectedCollege;

    if (college && subjectInput && sectionNumber) {
      const params = new URLSearchParams({
        college: college,
        subject: subjectInput,
        section: sectionNumber,
      });
      router.push(`/section?${params.toString()}`);
    }
  };

  return (
    <div className="pt-32 pb-20 px-4">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto text-center mb-20">
        <div className="relative inline-block mb-8">
          <DoodleBadge className="absolute -top-6 -right-10 text-lg py-2 px-6 rotate-[15deg]">جديد وحصري! ✨</DoodleBadge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 -rotate-[1deg]">
            دليـل <span className="bg-[#FFD400] px-4 doodle-border-sm rotate-[2deg] inline-block">الشُعب</span>
          </h1>
        </div>
        <p className="text-xl md:text-2xl font-bold max-w-2xl mx-auto opacity-80 rotate-[0.5deg]">
          كل مجموعات جامعتك في مكان واحد، مرتبة، موثقة، وجاهزة للمذاكرة! 🎓📝
        </p>
      </section>

      {/* Search Form */}
      <section className="max-w-4xl mx-auto mb-32">
        <DoodleCard className="bg-[#FFD400]/5" rotate="-rotate-[0.5deg]">
          <form onSubmit={handleSearch} className="space-y-8 p-4">
            <h2 className="text-3xl font-black mb-10 border-b-4 border-black inline-block pb-2 -rotate-[1deg]">
              ابحث عن شعبتك الآن! 👇
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 rotate-[0.5deg]">
                <label className="font-black text-sm uppercase mr-2">اختار الجامعة</label>
                <DoodleSelect
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  required
                >
                  <option value="">ما هي جامعتك؟</option>
                  {universities.map(c => <option key={c} value={c}>{c}</option>)}
                </DoodleSelect>
              </div>

              {selectedCollege === 'أخرى' && (
                <div className="space-y-3 md:col-span-2 animate-bounce rotate-[-1deg]">
                  <label className="font-black text-sm uppercase mr-2 text-[#FF7A00]">أنت من أي كوكب؟ (أقصد أي جامعة 😅)</label>
                  <DoodleInput
                    placeholder="اكتب اسم جامعتك هنا..."
                    value={customCollege}
                    onChange={(e) => setCustomCollege(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-3 -rotate-[0.5deg]">
                <label className="font-black text-sm uppercase mr-2">رمز المادة</label>
                <DoodleInput
                  placeholder="مثال: MATH 101"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-3 rotate-[1deg]">
              <label className="font-black text-sm uppercase mr-2">رقم الشعبة</label>
              <DoodleInput
                placeholder="أدخل الرقم هنا (مثلاً: 1234)"
                className="text-center text-3xl py-6"
                value={sectionNumber}
                onChange={(e) => setSectionNumber(e.target.value)}
                required
              />
            </div>

            <DoodleButton className="w-full text-2xl py-6" variant="primary">
              ابحث عن المجموعة! 🔍
            </DoodleButton>
          </form>
        </DoodleCard>
      </section>

      {/* Latest Groups */}
      <section className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12 px-4 rotate-[1deg]">
          <h2 className="text-4xl font-black underline decoration-[#FFD400] decoration-8 underline-offset-8">
            آخر الشعب المضافة 🌟
          </h2>
          <Link href="/groups" className="font-black text-sm hover:translate-x-[-5px] transition-transform">
            مشاهدة الكل ←
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {recentGroups.map((group, i) => (
            <DoodleCard
              key={group.id}
              rotate={i % 2 === 0 ? "rotate-[1deg]" : "-rotate-[1deg]"}
              className="hover:translate-y-[-10px] transition-transform cursor-pointer"
            >
              <div className="space-y-4">
                <DoodleBadge className="mb-2">
                  {group.platform === 'telegram' ? 'تيليجرام ✈️' : 'واتساب 💬'}
                </DoodleBadge>
                <h3 className="text-2xl font-black leading-tight">
                  {group.groupName || group.subject || 'بدون عنوان'}
                  {group.sectionNumber && group.sectionNumber !== 'عام' && ` - شعبة ${group.sectionNumber}`}
                </h3>
                <p className="font-bold opacity-60 text-sm">
                  {group.college}
                </p>
                <div className="pt-4 border-t-2 border-dashed border-black">
                  <a href={group.groupLink} target="_blank" rel="noopener noreferrer">
                    <DoodleButton className="w-full py-2 text-sm" variant="outline">
                      دخول المجموعة
                    </DoodleButton>
                  </a>
                </div>
              </div>
            </DoodleCard>
          ))}
          {recentGroups.length === 0 && (
            <div className="col-span-full py-20 text-center font-black animate-pulse opacity-20 text-4xl">
              جاري التحميل... ✏️
            </div>
          )}
        </div>
      </section>

      {/* Floating Doodle Decorations */}
      <div className="fixed bottom-10 left-10 opacity-30 pointer-events-none -rotate-[15deg] hidden lg:block">
        <div className="w-32 h-32 doodle-border-sm bg-[#FFD400] rounded-full flex items-center justify-center text-4xl">📖</div>
      </div>
      <div className="fixed top-40 right-10 opacity-30 pointer-events-none rotate-[20deg] hidden lg:block">
        <div className="w-24 h-24 doodle-border-sm bg-[#FF7A00] flex items-center justify-center text-4xl">✏️</div>
      </div>

    </div>
  );
}
