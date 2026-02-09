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
        // 1. Get submission
        const submissionRef = db.collection(collections.groupSubmissions).doc(id);
        const submissionDoc = await submissionRef.get();

        if (!submissionDoc.exists) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        const submission = submissionDoc.data();

        // 2. Create Group
        const groupRef = db.collection(collections.groups).doc();
        await groupRef.set({
            id: groupRef.id,
            platform: submission?.platform,
            groupType: submission?.groupType,
            college: submission?.college,
            subject: submission?.subject,
            sectionNumber: submission?.sectionNumber,
            groupLink: submission?.groupLink,
            groupName: submission?.groupName || 'مجموعة جديدة',
            description: submission?.description || '',
            isActive: true,
            votes: 0,
            memberCount: 0,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });

        // 3. Update Submission status
        await submissionRef.update({
            status: 'approved',
            updatedAt: Timestamp.now()
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('ADMIN APPROVE ERROR:', error);
        return NextResponse.json({ error: 'Failed', details: error.message }, { status: 500 });
    }
}
