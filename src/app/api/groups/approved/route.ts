import { NextRequest, NextResponse } from 'next/server';
import { supabaseFetch } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const college = searchParams.get('college');
        const subject = searchParams.get('subject');
        const section = searchParams.get('section');
        const platform = searchParams.get('platform');

        // Build Supabase query
        let query = 'submissions?select=*&status=eq.approved';

        if (college) query += `&college=eq.${encodeURIComponent(college)}`;
        if (subject) query += `&subject=eq.${encodeURIComponent(subject)}`;
        if (section) query += `&section_number=eq.${encodeURIComponent(section)}`;
        if (platform) query += `&platform=eq.${encodeURIComponent(platform)}`;

        query += '&order=created_at.desc';

        const groups = await supabaseFetch(query);

        return NextResponse.json({ groups }, { status: 200 });
    } catch (error) {
        console.error('Error reading groups:', error);
        return NextResponse.json(
            { error: 'حدث خطأ أثناء قراءة المجموعات' },
            { status: 500 }
        );
    }
}
