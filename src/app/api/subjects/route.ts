import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const facultyId = searchParams.get('facultyId');

    if (!facultyId) {
        return NextResponse.json({ error: 'Faculty ID is required' }, { status: 400 });
    }

    // facultyId here comes as a string which is the college name (e.g. "Computer Science")
    // because we changed faculties API to return college name as ID.

    try {
        const groups = await prisma.group.findMany({
            where: { college: facultyId },
            select: { subject: true },
            distinct: ['subject'],
            orderBy: { subject: 'asc' }
        });

        const subjects = groups.map((g: { subject: string }, index: number) => ({
            id: g.subject, // use name as ID
            name: g.subject,
            facultyId: facultyId // just echo back
        }));

        return NextResponse.json(subjects);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
    }
}
