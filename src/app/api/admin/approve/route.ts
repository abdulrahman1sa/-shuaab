import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;
        console.log('Approve attempt for ID:', id);

        if (!id) {
            return NextResponse.json({ error: 'معرف المجموعة مطلوب' }, { status: 400 });
        }

        // Get the submission details
        console.log('Fetching submission...');
        const submission = await (prisma as any).groupSubmission.findUnique({
            where: { id }
        });

        if (!submission) {
            console.error('Submission not found for ID:', id);
            return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
        }

        console.log('Found submission:', submission.groupName);

        // Check if already approved to prevent duplicates
        // Check if already approved to prevent duplicates
        if (submission.status === 'approved') {
            return NextResponse.json({ error: 'تمت الموافقة على هذا الطلب مسبقاً' }, { status: 400 });
        }

        // Use a transaction to ensure both operations succeed or fail together
        console.log('Starting transaction...');
        try {
            await prisma.$transaction([
                // 1. Create the active group
                prisma.group.create({
                    data: {
                        platform: submission.platform,
                        groupType: submission.groupType,
                        college: submission.college,
                        subject: submission.subject,
                        sectionNumber: submission.sectionNumber,
                        groupLink: submission.groupLink,
                        groupName: submission.groupName,
                        description: submission.description,
                        isActive: true
                    }
                }),
                // 2. Update submission status
                prisma.groupSubmission.update({
                    where: { id },
                    data: {
                        status: 'approved',
                        updatedAt: new Date()
                    }
                })
            ]);
            console.log('Transaction completed successfully');
        } catch (txError: any) {
            console.error('TRANSACTION FAILED:', txError);
            throw txError;
        }

        return NextResponse.json(
            {
                success: true,
                message: 'تم قبول المجموعة بنجاح ونشرها في الموقع',
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('CRITICAL ERROR IN APPROVE ROUTE:', error);
        return NextResponse.json(
            {
                error: 'حدث خطأ في السيرفر أثناء الموافقة',
                message: error.message,
                details: error.toString()
            },
            { status: 500 }
        );
    }
}
