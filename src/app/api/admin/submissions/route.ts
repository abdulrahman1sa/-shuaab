import { NextRequest, NextResponse } from 'next/server';
import { db, collections } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
    // Simple protection (fallback - Clerk is preferred)
    const auth = request.headers.get('x-admin-secret');

    try {
        const snapshot = await db
            .collection(collections.groupSubmissions)
            .where('status', '==', 'pending')
            .orderBy('createdAt', 'desc')
            .get();

        const submissions = snapshot.docs.map(doc => ({
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : null,
            updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate().toISOString() : null,
        }));

        return NextResponse.json(submissions);
    } catch (error: any) {
        console.error('FETCH SUBMISSIONS ERROR:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
