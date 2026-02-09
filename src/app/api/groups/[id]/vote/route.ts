import { NextRequest, NextResponse } from 'next/server';
import { db, collections } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

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
        const groupRef = db.collection(collections.groups).doc(id);
        const groupDoc = await groupRef.get();

        if (!groupDoc.exists) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        // Increment votes for 'up', decrement for 'down' (or use upvotes/downvotes fields)
        // Schema used 'votes' field for Prisma, so I'll stick to that.
        const incrementValue = type === 'up' ? 1 : -1;

        await groupRef.update({
            votes: FieldValue.increment(incrementValue),
        });

        const updatedDoc = await groupRef.get();
        return NextResponse.json({ id, ...updatedDoc.data() });
    } catch (error: any) {
        console.error('VOTE ERROR:', error);
        return NextResponse.json({ error: 'Vote failed', details: error.message }, { status: 500 });
    }
}
