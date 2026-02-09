import { NextRequest, NextResponse } from 'next/server';
import { db, collections } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const subjectId = searchParams.get('subjectId');

    if (!subjectId) {
        return NextResponse.json({ error: 'Subject ID (Name) is required' }, { status: 400 });
    }

    try {
        const snapshot = await db
            .collection(collections.groups)
            .where('subject', '==', subjectId)
            .get();

        const groups = snapshot.docs.map(doc => doc.data());

        // Get unique section numbers
        const uniqueSections = Array.from(new Set(groups.map(g => g.sectionNumber)))
            .sort((a, b) => a.localeCompare(b, 'ar', { numeric: true }));

        const sections = uniqueSections.map(sectionNumber => ({
            id: sectionNumber,
            sectionNumber: sectionNumber,
            subjectId: subjectId
        }));

        return NextResponse.json(sections);
    } catch (error: any) {
        console.error('FETCH SECTIONS ERROR:', error);
        return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
    }
}
