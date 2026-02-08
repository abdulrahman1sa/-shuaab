import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    // Simple protection
    const auth = request.headers.get('x-admin-secret');
    if (auth !== 'admin123') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const submissions = await prisma.groupSubmission.findMany({
            orderBy: { createdAt: 'desc' },
            where: { status: 'pending' }
        });
        return NextResponse.json(submissions);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
