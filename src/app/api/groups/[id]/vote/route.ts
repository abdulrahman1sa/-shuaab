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
    const { type } = await request.json(); // 'up' or 'down'

    if (!['up', 'down'].includes(type)) {
        return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 });
    }

    try {
        const updateData = type === 'up'
            ? { upvotes: { increment: 1 } }
            : { downvotes: { increment: 1 } };

        // Check if downvotes exceed limit to auto-hide/review (simple logic)
        // If downvotes > 10, maybe change status to 'pending' or 'hidden'
        // I won't implement that complex logic inside the vote query for now, but good to keep in mind.

        const group = await prisma.group.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(group);
    } catch (error) {
        return NextResponse.json({ error: 'Vote failed' }, { status: 500 });
    }
}
