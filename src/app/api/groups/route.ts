import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const sectionNumber = searchParams.get('sectionId'); // frontend sends sectionNumber as sectionId

    if (!sectionNumber) {
        return NextResponse.json({ error: 'Section Number is required' }, { status: 400 });
    }

    try {
        const groups = await prisma.group.findMany({
            where: {
                sectionNumber: sectionNumber,
                isActive: true
            },
            orderBy: { votes: 'desc' },
        });
        return NextResponse.json(groups);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
    }
}
