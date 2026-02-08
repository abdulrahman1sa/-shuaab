import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function POST(
    request: NextRequest,
    { params }: RouteContext
) {
    const { id } = await params;
    const auth = request.headers.get('x-admin-secret');
    if (auth !== 'admin123') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.groupSubmission.update({
            where: { id },
            data: { status: 'rejected' }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
