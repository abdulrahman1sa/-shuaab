import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function POST(
    request: NextRequest,
    { params }: RouteContext
) {
    const { id } = await params;
    const auth = request.headers.get('x-admin-secret');
    if (auth !== 'admin123') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submissionId = parseInt(id);

    try {
        // 1. Get submission
        const submission = await prisma.submission.findUnique({
            where: { id: submissionId }
        });

        if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // 2. Find Section ID logic
        // We have facultyName, subjectName, sectionNumber.
        // We must find the corresponding IDs or fail.
        // This assumes names are exact or we need loose matching.
        // For MVP, since we used dropdowns, names should match exactly.

        const faculty = await prisma.faculty.findFirst({ where: { name: submission.facultyName } });
        if (!faculty) return NextResponse.json({ error: 'Faculty not found' }, { status: 400 });

        const subject = await prisma.subject.findFirst({ where: { name: submission.subjectName, facultyId: faculty.id } });
        if (!subject) return NextResponse.json({ error: 'Subject not found' }, { status: 400 });

        const section = await prisma.section.findFirst({ where: { sectionNumber: submission.sectionNumber, subjectId: subject.id } });
        if (!section) return NextResponse.json({ error: 'Section not found' }, { status: 400 });

        // 3. Create Group
        await prisma.group.create({
            data: {
                sectionId: section.id,
                telegramLink: submission.telegramLink,
                groupName: submission.groupName || 'قروب بدون اسم',
                status: 'approved',
                upvotes: 0
            }
        });

        // 4. Update Submission status
        await prisma.submission.update({
            where: { id: submissionId },
            data: { status: 'approved' }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
