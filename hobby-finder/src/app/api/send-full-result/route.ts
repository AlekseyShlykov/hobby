import { NextRequest, NextResponse } from 'next/server';
import { saveFullResultEmail } from '@/lib/db';
import nodemailer from 'nodemailer';

type Locale = 'en' | 'ru' | 'fr';

function buildHtmlEmail(payload: {
  locale: Locale;
  oceanData: { trait: string; value: number }[];
  riasecData: { trait: string; value: number }[];
  oceanDescriptions: {
    traitName: string;
    level: string;
    value: number;
    title?: Record<Locale, string>;
    description?: Record<Locale, string>;
  }[];
  recommendations: {
    name: Record<Locale, string>;
    description: Record<Locale, string>;
    score: number;
    reasons: string[];
  }[];
  context: { time?: string; budget?: string; activity?: string };
}) {
  const { locale, oceanData, riasecData, oceanDescriptions, recommendations, context } = payload;
  const t = (s: string) => s;

  const oceanRows = oceanData.map((r) => `<tr><td>${r.trait}</td><td>${r.value.toFixed(1)}/10</td></tr>`).join('');
  const riasecRows = riasecData.map((r) => `<tr><td>${r.trait}</td><td>${r.value.toFixed(1)}/10</td></tr>`).join('');

  const personalityBlocks = oceanDescriptions
    .map(
      (d) => `
    <div style="margin-bottom: 1.5rem;">
      <p style="margin: 0 0 0.25rem 0; font-size: 0.75rem; text-transform: uppercase; color: #6b7280;">${d.traitName} — ${d.value.toFixed(1)}/10</p>
      <h4 style="margin: 0 0 0.5rem 0; color: #7b68ee;">${d.title?.[locale] ?? ''}</h4>
      <p style="margin: 0; line-height: 1.5; color: #374151;">${d.description?.[locale] ?? ''}</p>
    </div>`
    )
    .join('');

  const hobbyBlocks = recommendations
    .map(
      (r, i) => `
    <div style="margin-bottom: 1.5rem; padding: 1rem; background: #f9fafb; border-radius: 0.75rem;">
      <h3 style="margin: 0 0 0.5rem 0;">${i + 1}. ${r.name[locale]}</h3>
      <p style="margin: 0 0 0.5rem 0; color: #4b5563;">${r.description[locale]}</p>
      <p style="margin: 0; font-size: 0.875rem;"><strong>Match:</strong> ${Math.round(r.score * 100)}%</p>
      <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem;">${r.reasons.join(', ')}</p>
    </div>`
    )
    .join('');

  const contextLine = [context.time, context.budget, context.activity].filter(Boolean).join(' · ') || '—';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Full Hobby Finder Results</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 1.5rem;">
  <h1 style="margin: 0 0 1rem 0;">${t('Your Results')}</h1>

  <h2 style="margin: 1.5rem 0 0.5rem 0;">${t('OCEAN (Big Five)')}</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <thead><tr style="border-bottom: 1px solid #e5e7eb;"><th style="text-align: left;">${t('Trait')}</th><th>${t('Score')}</th></tr></thead>
    <tbody>${oceanRows}</tbody>
  </table>

  <h2 style="margin: 1.5rem 0 0.5rem 0;">${t('RIASEC (Interests)')}</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <thead><tr style="border-bottom: 1px solid #e5e7eb;"><th style="text-align: left;">${t('Trait')}</th><th>${t('Score')}</th></tr></thead>
    <tbody>${riasecRows}</tbody>
  </table>

  <p style="margin: 1rem 0; color: #6b7280;">${t('Context')}: ${contextLine}</p>

  <h2 style="margin: 1.5rem 0 0.5rem 0;">${t('Your Big Five Personality Profile')}</h2>
  ${personalityBlocks}

  <h2 style="margin: 1.5rem 0 0.5rem 0;">${t('Recommended Hobbies')}</h2>
  ${hobbyBlocks}

  <p style="margin-top: 2rem; font-size: 0.875rem; color: #9ca3af;">— Hobby Finder</p>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  console.log('[send-full-result] POST received');
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 });
    }

    const createdAt = new Date().toISOString();
    console.log('[send-full-result] email:', email);

    // 1) SQLite (если доступна — например, локально или на VPS)
    try {
      saveFullResultEmail(email);
    } catch (_) {
      // На serverless (Vercel и т.д.) БД может быть недоступна — не падаем
    }

    // 2) Airtable (если заданы переменные)
    const airtableKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const airtableTableName = process.env.AIRTABLE_TABLE_NAME || 'Emails';
    if (airtableKey && airtableBaseId) {
      console.log('[send-full-result] Airtable: saving to', airtableBaseId, airtableTableName);
      try {
        const tableIdEncoded = encodeURIComponent(airtableTableName);
        const airtableRes = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/${tableIdEncoded}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${airtableKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: {
              Email: email,
              Created: createdAt,
            },
          }),
        });
        if (!airtableRes.ok) {
          const errBody = await airtableRes.text();
          console.error('Airtable error:', airtableRes.status, errBody);
          throw new Error(`Airtable: ${airtableRes.status}`);
        }
        console.log('[send-full-result] Airtable: saved ok');
      } catch (e) {
        console.error('Airtable save error:', e);
        throw e;
      }
    } else {
      console.log('[send-full-result] Airtable: skipped (no AIRTABLE_API_KEY or AIRTABLE_BASE_ID)');
    }

    // 3) Google Таблица через Web App URL (Apps Script)
    const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (sheetsWebhookUrl) {
      try {
        await fetch(sheetsWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, createdAt }),
        });
      } catch (e) {
        console.error('Google Sheets webhook error:', e);
      }
    }

    const html = buildHtmlEmail({
      locale: body.locale || 'en',
      oceanData: body.oceanData || [],
      riasecData: body.riasecData || [],
      oceanDescriptions: body.oceanDescriptions || [],
      recommendations: body.recommendations || [],
      context: body.context || {},
    });

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@hobbyfinder.local';

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({
        from: smtpFrom,
        to: email,
        subject: 'Your full Hobby Finder results',
        html,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send full result error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send' },
      { status: 500 }
    );
  }
}
