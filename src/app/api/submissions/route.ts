import { NextRequest, NextResponse } from 'next/server';
import { db, collections } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { facultyName, subjectName, sectionNumber, telegramLink, groupName, notes } = body;

        // Validation
        if (!telegramLink || !telegramLink.startsWith('https://t.me/')) {
            return NextResponse.json({ error: 'رابط التليجرام غير صحيح' }, { status: 400 });
        }

        const submissionRef = db.collection(collections.groupSubmissions).doc();
        const submissionData = {
            id: submissionRef.id,
            college: facultyName,
            subject: subjectName,
            sectionNumber,
            groupLink: telegramLink,
            groupName,
            description: notes || '',
            platform: 'telegram',
            status: 'pending',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        await submissionRef.set(submissionData);

        return NextResponse.json(submissionData, { status: 201 });
    } catch (error: any) {
        console.error('Submission error:', error);
        return NextResponse.json({ error: 'Failed to submit group', details: error.message }, { status: 500 });
    }
}
