import { NextRequest, NextResponse } from 'next/server';
import { db, collections } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function POST(
    request: NextRequest,
    { params }: RouteContext
) {
    const { id } = await params;

    try {
        await db.collection(collections.groupSubmissions).doc(id).update({
            status: 'rejected',
            updatedAt: Timestamp.now()
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('ADMIN REJECT ERROR:', error);
        return NextResponse.json({ error: 'Failed', details: error.message }, { status: 500 });
    }
}
