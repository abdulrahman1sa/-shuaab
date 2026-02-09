import { NextResponse } from 'next/server';
import { db, collections } from '@/lib/firebase-admin';

export async function GET() {
    try {
        const groupsSnapshot = await db.collection(collections.groups).get();
        const submissionsSnapshot = await db.collection(collections.groupSubmissions).get();

        const groups = groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const submissions = submissionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json({
            groups,
            submissions,
            groupCount: groups.length,
            submissionCount: submissions.length
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
