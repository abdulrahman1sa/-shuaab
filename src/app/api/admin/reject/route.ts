import { NextRequest, NextResponse } from 'next/server';
import { db, collections } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, reason } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'معرف المجموعة مطلوب' },
                { status: 400 }
            );
        }

        // Update submission status to rejected
        await db.collection(collections.groupSubmissions).doc(id).update({
            status: 'rejected',
            reviewNote: reason || 'غير محدد',
            updatedAt: Timestamp.now(),
        });

        return NextResponse.json(
            {
                success: true,
                message: 'تم رفض المجموعة بنجاح',
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('REJECT ERROR:', error);
        return NextResponse.json(
            {
                error: 'حدث خطأ أثناء الرفض',
                details: error.message
            },
            { status: 500 }
        );
    }
}
