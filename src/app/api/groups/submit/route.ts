import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

        // Try to save via Prisma
        try {
            const submission = await prisma.groupSubmission.create({
                data: {
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
                }
            });

            return NextResponse.json(
                {
                    success: true,
                    message: 'تم الحفظ بنجاح في قاعدة البيانات المحلية',
                    submissionId: submission.id,
                },
                { status: 201 }
            );
        } catch (dbError: any) {
            console.error('DATABASE INSERT ERROR:', dbError);
            return NextResponse.json(
                {
                    error: 'فشل الحفظ في قاعدة البيانات',
                    message: dbError.message,
                    code: dbError.code
                },
                { status: 500 }
            );
        }
    } catch (parseError: any) {
        console.error('JSON PARSE ERROR:', parseError);
        return NextResponse.json(
            { error: 'فشل في قراءة بيانات الطلب (JSON Error)' },
            { status: 400 }
        );
    }
}

export async function GET() {
    try {
        const submissions = await (prisma as any).groupSubmission.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ submissions }, { status: 200 });
    } catch (error: any) {
        console.error('GET ERROR:', error);
        return NextResponse.json({ error: 'فشل في قراءة البيانات', details: error.message }, { status: 500 });
    }
}
