import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { facultyName, subjectName, sectionNumber, telegramLink, groupName, notes } = body;

        // Validation
        if (!telegramLink || !telegramLink.startsWith('https://t.me/')) {
            return NextResponse.json({ error: 'رابط التليجرام غير صحيح' }, { status: 400 });
        }

        const submission = await prisma.groupSubmission.create({
            data: {
                college: facultyName,
                subject: subjectName,
                sectionNumber,
                groupLink: telegramLink,
                groupName,
                description: notes,
                platform: 'telegram', // Assumed from telegramLink
                status: 'pending'
            }
        });

        return NextResponse.json(submission, { status: 201 });
    } catch (error) {
        console.error('Submission error:', error);
        return NextResponse.json({ error: 'Failed to submit group' }, { status: 500 });
    }
}
