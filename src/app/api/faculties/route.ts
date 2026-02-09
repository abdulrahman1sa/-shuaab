import { NextResponse } from 'next/server';
import { db, collections } from '@/lib/firebase-admin';

export async function GET() {
    try {
        const snapshot = await db.collection(collections.groups).get();
        const groups = snapshot.docs.map(doc => doc.data());

        // Get unique colleges
        const uniqueColleges = Array.from(new Set(groups.map(g => g.college)))
            .sort((a, b) => a.localeCompare(b, 'ar'));

        const faculties = uniqueColleges.map(collegeName => ({
            id: collegeName,
            name: collegeName
        }));

        return NextResponse.json(faculties);
    } catch (error: any) {
        console.error('FETCH FACULTIES ERROR:', error);
        return NextResponse.json({ error: 'Failed to fetch faculties', details: error.message }, { status: 500 });
    }
}
