import { NextResponse } from 'next/server';
import { getAllFullResultEmails } from '@/lib/db';

/**
 * GET /api/full-result-emails
 * Returns the list of all emails that requested full result by email.
 * Optionally protect with Authorization header in production.
 */
export async function GET() {
  try {
    const emails = getAllFullResultEmails();
    return NextResponse.json({ success: true, emails });
  } catch (error) {
    console.error('Error fetching full-result emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
