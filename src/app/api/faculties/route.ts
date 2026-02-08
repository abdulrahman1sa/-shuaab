import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Get unique colleges from existing Groups
        const groups = await prisma.group.findMany({
            select: { college: true },
            distinct: ['college'],
            orderBy: { college: 'asc' }
        });

        const faculties = groups.map((g: { college: string }, index: number) => ({
            id: g.college, // use name as ID for simplicity in frontend
            name: g.college
        }));

        return NextResponse.json(faculties);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch faculties' }, { status: 500 });
    }
}
