import { NextRequest, NextResponse } from 'next/server';

/**
 * Newsletter signup: stores email in Google Sheet via Apps Script Web App.
 * Set GOOGLE_SHEETS_WEBHOOK_URL in .env to the Web App URL.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 });
    }

    const createdAt = new Date().toISOString();
    const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!sheetsWebhookUrl) {
      console.error('[newsletter] GOOGLE_SHEETS_WEBHOOK_URL is not set');
      return NextResponse.json(
        { success: false, error: 'Newsletter not configured (missing GOOGLE_SHEETS_WEBHOOK_URL)' },
        { status: 500 }
      );
    }

    const res = await fetch(sheetsWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, createdAt }),
    });

    if (!res.ok) {
      console.error('[newsletter] Google Sheets webhook error:', res.status, await res.text());
      return NextResponse.json(
        { success: false, error: 'Failed to subscribe' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[newsletter] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
