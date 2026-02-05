const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function supabaseFetch(endpoint: string, options: RequestInit = {}) {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    const headers = {
        'apikey': SUPABASE_KEY || '',
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Supabase request failed');
    }

    // Handle empty responses for DELETE/PATCH etc
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}
