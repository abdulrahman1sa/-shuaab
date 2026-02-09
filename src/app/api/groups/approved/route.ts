import { NextRequest, NextResponse } from 'next/server';
import { db, collections } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const college = searchParams.get('college');
        const subject = searchParams.get('subject');
        const section = searchParams.get('section');
        const platform = searchParams.get('platform');

        let query: any = db.collection(collections.groups).where('isActive', '==', true);

        if (college) {
            query = query.where('college', '==', college);
        }

        if (subject) {
            query = query.where('subject', '==', subject);
        }

        if (platform) {
            query = query.where('platform', '==', platform);
        }

        const snapshot = await query.get();
        let groups = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : null,
            updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate().toISOString() : null,
        }));

        // Manual filtering for section since Firestore doesn't support complex 'OR' easily without multiple queries
        if (section) {
            groups = groups.filter((g: any) => g.sectionNumber === section || g.sectionNumber === 'عام');
        }

        // Manual sort
        groups.sort((a: any, b: any) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
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
