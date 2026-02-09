import { NextRequest, NextResponse } from 'next/server';
import { db, collections } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            platform,
            groupType,
            college,
            subject,
            sectionNumber,
            groupLink,
            groupName,
            description,
            submitterName,
        } = body;

        // Validation
        if (!platform || !college || !subject || !groupLink || !groupName) {
            return NextResponse.json(
                { error: 'حقول ناقصة: تأكد من تعبئة جميع البيانات المطلوبة' },
                { status: 400 }
            );
        }

        // Create submission in Firestore
        const submissionRef = db.collection(collections.groupSubmissions).doc();
        const submissionData = {
            id: submissionRef.id,
            platform,
            groupType: groupType || 'section',
            college,
            subject,
            sectionNumber: sectionNumber || 'عام',
            groupLink,
            groupName,
            description: description || '',
            submitterName: submitterName || 'مجهول',
            status: 'pending',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        await submissionRef.set(submissionData);

        return NextResponse.json(
            {
                success: true,
                message: 'تم إرسال طلبك بنجاح! سيتم مراجعته قريباً',
                submissionId: submissionRef.id,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('SUBMISSION ERROR:', error);
        return NextResponse.json(
            { error: 'فشل في إرسال الطلب', message: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const snapshot = await db
            .collection(collections.groupSubmissions)
            .orderBy('createdAt', 'desc')
            .get();

        const submissions = snapshot.docs.map(doc => ({
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toISOString(),
            updatedAt: doc.data().updatedAt?.toDate().toISOString(),
        }));

        return NextResponse.json({ submissions }, { status: 200 });
    } catch (error: any) {
        console.error('GET ERROR:', error);
        return NextResponse.json(
            { error: 'فشل في قراءة البيانات', details: error.message },
            { status: 500 }
        );
    }
}
