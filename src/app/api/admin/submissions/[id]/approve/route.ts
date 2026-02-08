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

    try {
        // 1. Get submission
        const submission = await prisma.groupSubmission.findUnique({
            where: { id }
        });

        if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // 2. Create Group directly using data from submission
        // The schema uses simple strings for college, subject, sectionNumber
        await prisma.group.create({
            data: {
                platform: submission.platform,
                groupType: submission.groupType,
                college: submission.college,
                subject: submission.subject,
                sectionNumber: submission.sectionNumber,
                groupLink: submission.groupLink,
                groupName: submission.groupName || 'مجموعة جديدة',
                description: submission.description,
                isActive: true,
                votes: 0,
                memberCount: 0
            }
        });

        // 4. Update Submission status
        await prisma.groupSubmission.update({
            where: { id },
            data: { status: 'approved' }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
