import { NextRequest, NextResponse } from 'next/server';
import { db, collections } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const sectionNumber = searchParams.get('sectionId'); // frontend sends sectionNumber as sectionId

    if (!sectionNumber) {
        return NextResponse.json({ error: 'Section Number is required' }, { status: 400 });
    }

    try {
        const snapshot = await db
            .collection(collections.groups)
            .where('sectionNumber', '==', sectionNumber)
            .where('isActive', '==', true)
            .get();

        const groups = snapshot.docs.map(doc => ({
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : null,
            updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate().toISOString() : null,
        }));

        // Sort by votes
        groups.sort((a: any, b: any) => (b.votes || 0) - (a.votes || 0));

        return NextResponse.json(groups);
    } catch (error: any) {
        console.error('FETCH GROUPS ERROR:', error);
        return NextResponse.json({ error: 'Failed to fetch groups', details: error.message }, { status: 500 });
    }
}
