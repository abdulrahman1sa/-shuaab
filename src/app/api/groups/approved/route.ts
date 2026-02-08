import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const college = searchParams.get('college');
        const subject = searchParams.get('subject');
        const section = searchParams.get('section');
        const platform = searchParams.get('platform');

        // Build Prisma Filter
        const where: any = {
            isActive: true,
        };

        if (college) where.college = college;
        if (subject) where.subject = subject;

        if (section) {
            // Fetch the specific section OR "general" subject groups (عام)
            where.sectionNumber = {
                in: [section, 'عام']
            };
        }

        if (platform) where.platform = platform;

        const groups = await prisma.group.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ groups }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching approved groups:', error);
        return NextResponse.json(
            {
                error: 'حدث خطأ في قاعدة البيانات أثناء البحث عن المجموعات',
                details: error.message
            },
            { status: 500 }
        );
    }
}
