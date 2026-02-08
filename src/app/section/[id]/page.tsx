import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingTelegram from '@/components/FloatingTelegram';
import GroupList from '@/components/GroupList';
import { notFound } from 'next/navigation';
import { HiHome, HiChevronLeft } from 'react-icons/hi';
import Link from 'next/link';
import { Group } from '@prisma/client';

export default async function SectionDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // The ID in the URL is now treated as the sectionNumber string
    const sectionNumber = decodeURIComponent(id);

    // Fetch all active groups for this section
    const groups = await prisma.group.findMany({
        where: {
            sectionNumber: sectionNumber,
            isActive: true
        },
        orderBy: { votes: 'desc' }
    });

    if (groups.length === 0) {
        return notFound();
    }

    // Extract metadata from the first group found
    // (In this flat schema, we assume all groups with same sectionNumber belong to same subject/college, 
    // or at least we pick the first one to display context)
    const firstGroup = groups[0];
    const subjectName = firstGroup.subject;
    const collegeName = firstGroup.college;

    // Convert keys to be serializable if needed, specifically Dates
    const serializedGroups = groups.map(g => ({
        ...g,
        upvotes: g.votes, // Map schema 'votes' to UI 'upvotes'
        downvotes: 0,
        status: g.isActive ? 'approved' : 'hidden',
        createdAt: g.createdAt.toISOString(),
        updatedAt: g.updatedAt.toISOString(),
    }));

    return (
        <>
            <Navbar />
            <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
                    <Link href="/" className="hover:text-primary-600 transition-colors">
                        <HiHome className="h-5 w-5" />
                    </Link>
                    <HiChevronLeft className="h-4 w-4 mx-2 rtl:rotate-180" />
                    <span className="font-medium text-gray-700">{collegeName}</span>
                    <HiChevronLeft className="h-4 w-4 mx-2 rtl:rotate-180" />
                    <span className="font-medium text-gray-700">{subjectName}</span>
                </nav>

                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        مادة: {subjectName} <span className="text-primary-600">— شعبة: {sectionNumber}</span>
                    </h1>
                    <p className="text-gray-500">
                        هنا تلقى روابط قروبات التليجرام الخاصة بهالشعبة.
                    </p>
                </div>

                <GroupList
                    initialGroups={serializedGroups as any}
                    sectionId={sectionNumber} // passing sectionNumber as ID
                />

            </main>
            <Footer />
            <FloatingTelegram />
        </>
    );
}
