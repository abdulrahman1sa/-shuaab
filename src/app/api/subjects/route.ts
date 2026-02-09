import { NextRequest, NextResponse } from 'next/server';
import { db, collections } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const facultyId = searchParams.get('facultyId');

    if (!facultyId) {
        return NextResponse.json({ error: 'Faculty ID (College Name) is required' }, { status: 400 });
    }

    try {
        const snapshot = await db
            .collection(collections.groups)
            .where('college', '==', facultyId)
            .get();

        const groups = snapshot.docs.map(doc => doc.data());

        // Get unique subjects
        const uniqueSubjects = Array.from(new Set(groups.map(g => g.subject)))
            .sort((a, b) => a.localeCompare(b, 'ar'));

        const subjects = uniqueSubjects.map(subjectName => ({
            id: subjectName,
            name: subjectName,
            facultyId: facultyId
        }));

        return NextResponse.json(subjects);
    } catch (error: any) {
        console.error('FETCH SUBJECTS ERROR:', error);
        return NextResponse.json({ error: 'Failed to fetch subjects', details: error.message }, { status: 500 });
    }
}
