import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID || "yaerib-e835e",
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-pvhu2@yaerib-e835e.iam.gserviceaccount.com",
            privateKey: (process.env.FIREBASE_PRIVATE_KEY || `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDVZ3840fVO3t2g\nFNcVpnLrF79heXwk5ZYIeYst9XZipWhOd6jnbVzoEj3TpQaF3H46RZQsVxaZzzqC\nISxGqnW2Gr5wjWHOdyLN1t2YY03ZDiKFgOUA8D7kQ1wAU7ZaHSu948B5AXUrC/cX\nWzeUnpPQByzpRVNJwHsCa1tEWhnOja3OloZg2PQQgGarhHGMB7j99H5G29nx8zGE\nHnwbZNjzLnnB/Q3Ce5SlPeWNQ5ozgRwny3JbMxHb9BFIC+afDLpecxLkc2G/ZrVy\nRRa36056btMWi5PlvXTj5ZiPL+CbBhdumX2jNj2rLaNqANw2lojSRr2CYXXGyQRV\ndF7hdMVnAgMBAAECggEAFVnmi6vODFcV+3c6Ucs2gjj9B+acuiBSU4S9nRqK/rGn\n7vnf50+01O9GSk+fiHMYGgJuIcWQ2FC4fN6OzH8vicnBNgefOoYG8GtH/oApAMd+\nQrczslVXJYVrxgiaHQgAIV6RGkpAC8+FqEuTEwaOqWieYLRz8dQVOpe9KOiO3nB1\nodmFHpvtTZB57HHi+JxckYc4D8TIBBpbZiFCDepdiIws2IIL0HZ1jJ3NDvHWnT1b\nFZM3kdep2tr5SLSQUV0uv9EX+2dNLJ94ZqW++5DH+v+YOCXUWcE+Bn9iAvN+XLdZ\nubfAZIgkRlOF2puKNQyGLQ5XH7qSgRTvTCU4CUu+OQKBgQDwpBczZlXpkDj+qybS\no9Efpdajb9G8vh4nIQCpFoXjKjYbbz/R1TD0qr0q1+EzHqkt78y9etigv9Mb2w8T\nRWr6rgIBY1w0/7JFEIIo1FQc6Qj0XZbfYzMlLhy6wLUPgKo/MDvlg27IspQiiegW\njsfoxHc6i3v68iZjHRnhmL/7AwKBgQDjBmCZXd9hHdyvS6+D3tSEk/oHszRxu8NB\nuuWYpOOCsSBzEScGp0cwUJPLbbT0h0cIOTuHWc36yqd+Kgk9eEK1LufXvcpHLvM3\nzhkSJajHxact3wUpVy4kJivbkW/fbFvT1ETqTAg8TXJCSRrjOf3lhshIIAUOToIN\nwSMo0MbszQKBgFI1bKulmVIKcD4oUEIDruyl5ha9m6RkOr7ZWnVpeWHqyMNElUPl\nFi1vquJZD9k770X/Ny3AKwN3pPJOOu81dt+e1JaO0DBW7hsEEcNLDlU2E1YQJvu3\n0wAvqabvMKvUI9UkcEHvTciIoWzPOheCva66d5Trk/ZeBVk01uOoIGXrAoGBAMNd\n45dXzzm2BwnbagljoyMMbOhfcUxGtrtD6P05OIhpgXFEW39ASOTtEqLHoCemmpwb\nFH1f7QBbkVPjPNxnN4ntiZqBOyeS4b8uXyjcu6hfEYVKHRj8azq0lp13RPzSNRvP\n2hZ+o7+xLhiY7MiKSVJScNyQoYk0Snsnr+gZ8nYpAoGBALQu9EiLoQLCpUiq6MjA\nDlviP1jqF0K0lN7b8vrXxw8OPB6hDjVdN432Kr+veUIu3XQxrxYzrahj2yHLQI2O\nyqradWPVL7cqKulOTgLchzBm2X8vbxqsBF+CLYvkZvhSsmK+f62LDuIrcJdnmuNe\nDUnsENLr6UikYW5MEANVNCio\n-----END PRIVATE KEY-----\n`).replace(/\\n/g, '\n'),
        }),
    });
}

export const db = getFirestore();

// Collections
export const collections = {
    groups: 'groups',
    groupSubmissions: 'groupSubmissions',
    votes: 'votes',
} as const;
