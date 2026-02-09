import { NextRequest, NextResponse } from 'next/server';
import { db, collections } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'معرف المجموعة مطلوب' }, { status: 400 });
        }

        // Get the submission
        const submissionRef = db.collection(collections.groupSubmissions).doc(id);
        const submissionDoc = await submissionRef.get();

        if (!submissionDoc.exists) {
            return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
        }

        const submission = submissionDoc.data();

        if (submission?.status === 'approved') {
            return NextResponse.json({ error: 'تمت الموافقة على هذا الطلب مسبقاً' }, { status: 400 });
        }

        // Create active group
        const groupRef = db.collection(collections.groups).doc();
        await groupRef.set({
            id: groupRef.id,
            platform: submission?.platform,
            groupType: submission?.groupType,
            college: submission?.college,
            subject: submission?.subject,
            sectionNumber: submission?.sectionNumber,
            groupLink: submission?.groupLink,
            groupName: submission?.groupName,
            description: submission?.description || '',
            memberCount: 0,
            votes: 0,
            isActive: true,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });

        // Update submission status
        await submissionRef.update({
            status: 'approved',
            updatedAt: Timestamp.now(),
        });

        return NextResponse.json(
            {
                success: true,
                message: 'تم قبول المجموعة بنجاح ونشرها في الموقع',
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('APPROVE ERROR:', error);
        return NextResponse.json(
            {
                error: 'حدث خطأ في السيرفر أثناء الموافقة',
                message: error.message,
            },
            { status: 500 }
        );
    }
}
