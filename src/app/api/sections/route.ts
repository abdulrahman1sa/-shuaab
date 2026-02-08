import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const subjectId = searchParams.get('subjectId');

    if (!subjectId) {
        return NextResponse.json({ error: 'Subject ID is required' }, { status: 400 });
    }

    // subjectId is actually the subject name now, so treat it as string.

    try {
        const groups = await prisma.group.findMany({
            where: { subject: subjectId },
            select: { sectionNumber: true, id: true, groupLink: true }, // we can return actual groups now or just section numbers
            // If the goal is just listing sections:
            distinct: ['sectionNumber'],
            orderBy: { sectionNumber: 'asc' }
        });

        const sections = groups.map((g: { sectionNumber: string }, index: number) => ({
            id: g.sectionNumber, // use number as ID
            sectionNumber: g.sectionNumber,
            subjectId: subjectId
        }));

        return NextResponse.json(sections);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
    }
}
