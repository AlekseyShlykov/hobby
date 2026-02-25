'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { useTestStore } from '@/lib/store';
import { getRecommendedHobbies, getOceanLevel } from '@/lib/scoring';
import hobbiesData from '@/data/hobbies.json';
import resultsData from '@/data/results.json';
import testConfig from '@/data/test-config.json';
import type { Hobby, OceanTrait } from '@/types';
import ShareCard from './ShareCard';

const traitOrder: OceanTrait[] = ['O', 'C', 'E', 'A', 'N'];
// Axis ticks for labels (2,4,6,8,10)
const radiusTicks = [2, 4, 6, 8, 10].map((value, index) => ({ value, coordinate: value, index }));
// Concentric grid circles: scale 2,4,6,8,10 to pixel radii (chart height 300, outerRadius ~80% of half = 120)
const GRID_MAX_R = 120;
const gridRadii = [2, 4, 6, 8, 10].map((v) => (v / 10) * GRID_MAX_R);

export default function Results() {
  const { locale, scores, context, answers, resetTest } = useTestStore();
  const ui = resultsData.ui.results;
  const [saved, setSaved] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [shareInProgress, setShareInProgress] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Get recommended hobbies
  const hobbies = hobbiesData.hobbies as Hobby[];
  const recommendations = getRecommendedHobbies(hobbies, scores, context, 5);

  // Prepare OCEAN chart data
  const oceanData = Object.entries(scores.ocean).map(([key, value]) => ({
    trait: testConfig.traits.ocean[key as OceanTrait]?.name[locale] || key,
    value: value,
    fullMark: 10,
  }));

  // Prepare RIASEC chart data
  const riasecData = Object.entries(scores.riasec).map(([key, value]) => ({
    trait: testConfig.traits.riasec[key as keyof typeof testConfig.traits.riasec]?.name[locale] || key,
    value: value,
    fullMark: 10,
  }));

  // Get ALL personality descriptions for each OCEAN trait
  const allOceanDescriptions = traitOrder.map((trait) => {
    const value = scores.ocean[trait];
    const level = getOceanLevel(value);
    const traitData = resultsData.ocean[trait]?.[level];
    const traitName = testConfig.traits.ocean[trait]?.name[locale] || trait;
    return { trait, traitName, level, value, ...traitData };
  }).filter(d => d.title);

  const top3ForShare = recommendations.slice(0, 3);

  async function handleShare() {
    if (!shareCardRef.current || top3ForShare.length === 0) return;
    setShareInProgress(true);
    try {
      await new Promise((r) => setTimeout(r, 100));
      if (!shareCardRef.current) {
        setShareInProgress(false);
        return;
      }
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setShareInProgress(false);
          return;
        }
        const file = new File([blob], 'my-hobby-results.png', { type: 'image/png' });
        const shareText = `${ui.shareCardTitle?.[locale] ?? 'Such hobbies suit me'}: ${top3ForShare.map((r) => r.hobby.name[locale]).join(', ')}`;
        const url = window.location.href;
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({
              title: 'My Hobby Test Results',
              text: shareText,
              url,
              files: [file],
            });
          } catch (e) {
            if ((e as Error).name !== 'AbortError') {
              fallbackShare(file, shareText, url);
            }
          }
        } else {
          fallbackShare(file, shareText, url);
        }
        setShareInProgress(false);
      }, 'image/png');
    } catch (e) {
      console.error(e);
      setShareInProgress(false);
    }
  }

  function fallbackShare(file: File, text: string, url: string) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(a.href);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(`${text}\n${url}`);
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sheetsUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !emailRegex.test(trimmed)) {
      setEmailError(ui.emailInvalid?.[locale] ?? 'Please enter a valid email.');
      return;
    }
    setEmailError(null);
    setEmailLoading(true);
    const createdAt = new Date().toISOString();

    try {
      if (sheetsUrl) {
        // Прямой вызов Google Apps Script из браузера (работает на GitHub Pages без своего API)
        const formBody = new URLSearchParams({ email: trimmed, createdAt });
        await fetch(sheetsUrl, {
          method: 'POST',
          mode: 'no-cors',
          body: formBody,
        });
        setEmailSuccess(true);
        setEmail('');
      } else {
        // Вызов через наш API (когда запущено с сервером)
        const res = await fetch('/api/send-full-result/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmed }),
        });
        const contentType = res.headers.get('content-type') || '';
        const data = contentType.includes('application/json')
          ? await res.json()
          : { error: (res.status === 404 || res.status === 405) ? 'STATIC_HOST' : `HTTP ${res.status}` };
        if (!res.ok) {
          console.error('newsletter failed:', res.status, data);
          const staticHostMsg = ui.emailErrorStaticHost?.[locale];
          throw new Error(
            (res.status === 404 || res.status === 405) && staticHostMsg
              ? staticHostMsg
              : (data.error && data.error !== 'STATIC_HOST' ? data.error : `HTTP ${res.status}`)
          );
        }
        setEmailSuccess(true);
        setEmail('');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setEmailError(message || (ui.emailError?.[locale] ?? 'Failed to send. Try again later.'));
    } finally {
      setEmailLoading(false);
    }
  }

  // Save results to database (skipped on static host, e.g. GitHub Pages)
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DISABLE_SAVE === 'true') return;
    if (!saved && recommendations.length > 0) {
      fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores,
          context,
          answers,
          recommendedHobbies: recommendations.map(r => r.hobby.id),
        }),
      })
        .then(() => setSaved(true))
        .catch(console.error);
    }
  }, [saved, scores, context, answers, recommendations]);

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--bg-primary)' }}>
      {/* Off-screen card for share image capture */}
      <div
        ref={shareCardRef}
        className="absolute top-0 w-[800px] h-[500px]"
        style={{ left: -9999, overflow: 'hidden' }}
        aria-hidden
      >
        <ShareCard
          shareCardTitle={ui.shareCardTitle?.[locale] ?? 'Such hobbies suit me'}
          shareCardTop3Label={ui.shareCardTop3?.[locale] ?? 'Top 3'}
          riasecData={riasecData}
          top3={top3ForShare}
          locale={locale}
          backgroundColor="var(--bg-secondary)"
          textColor="var(--text-primary)"
          borderColor="var(--border)"
          accentColor="#7ba88a"
        />
      </div>

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {ui.title[locale]}
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            {{ en: 'Based on your responses', ru: 'На основе ваших ответов', fr: 'Basé sur vos réponses' }[locale]}
          </p>
        </div>

        {/* Radar Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* OCEAN Chart */}
          <div className="rounded-3xl p-6 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <h3 className="text-xl font-semibold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
              {ui.personality[locale]}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={oceanData}>
                <PolarGrid stroke="rgba(107, 95, 122, 0.25)" gridType="circle" polarRadius={gridRadii} />
                <PolarAngleAxis
                  dataKey="trait"
                  tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 10]}
                  ticks={radiusTicks}
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                />
                <Radar
                  name="OCEAN"
                  dataKey="value"
                  stroke="#9b87b8"
                  fill="#9b87b8"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* RIASEC Chart */}
          <div className="rounded-3xl p-6 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <h3 className="text-xl font-semibold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
              {ui.interests[locale]}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={riasecData}>
                <PolarGrid stroke="rgba(107, 95, 122, 0.25)" gridType="circle" polarRadius={gridRadii} />
                <PolarAngleAxis
                  dataKey="trait"
                  tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 10]}
                  ticks={radiusTicks}
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                />
                <Radar
                  name="RIASEC"
                  dataKey="value"
                  stroke="#7ba88a"
                  fill="#7ba88a"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Big Five Personality Profile */}
        <div className="rounded-3xl p-8 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
            {{ en: 'Your Big Five Personality Profile', ru: 'Твой профиль по Big Five', fr: 'Votre profil Big Five' }[locale]}
          </h2>
          <div className="space-y-8 relative">
            {allOceanDescriptions.map((desc, i) => (
              <div
                key={i}
                className="pb-8 last:pb-0 transition-all duration-300"
                style={{
                  borderBottom: i < allOceanDescriptions.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {desc.traitName}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    desc.level === 'high' ? 'bg-purple-500/20 text-purple-400' :
                    desc.level === 'low' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-zinc-500/20 text-zinc-400'
                  }`}>
                    {desc.value.toFixed(1)}/10
                  </span>
                </div>
                <h4 className="text-xl font-bold mb-3" style={{ color: 'var(--accent-primary)' }}>
                  {desc.title?.[locale]}
                </h4>
                <p className="leading-relaxed text-base" style={{ color: 'var(--text-secondary)' }}>
                  {desc.description?.[locale]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Hobbies */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {ui.hobbies[locale]}
          </h2>

          <div className="space-y-5 relative">
            {recommendations.map(({ hobby, score, reasons }, index) => (
              <div
                key={hobby.id}
                className="rounded-3xl p-6 border transition-all duration-300 hover:scale-[1.01]"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-hover))' }}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {hobby.name[locale]}
                    </h3>
                    <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {hobby.description[locale]}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {reasons.map((reason, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-full text-sm font-medium"
                          style={{ background: 'var(--accent-light)', color: 'var(--accent-primary)' }}
                        >
                          {reason}
                        </span>
                      ))}
                      <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-emerald-500/20 text-emerald-400">
                        {Math.round(score * 100)}% match
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <button
            onClick={handleShare}
            disabled={shareInProgress}
            className="group relative px-8 py-4 font-semibold rounded-2xl transition-all duration-300 overflow-hidden disabled:opacity-70"
            style={{ background: 'var(--accent-primary)', color: 'white' }}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            <span className="relative">
              {shareInProgress ? (locale === 'ru' ? 'Готовим…' : locale === 'fr' ? 'Préparation…' : 'Preparing…') : ui.share[locale]}
            </span>
          </button>
          <button
            onClick={() => { setShowEmailForm(true); setEmailSuccess(false); setEmailError(null); }}
            className="px-8 py-4 font-semibold rounded-2xl transition-all duration-300 border hover:scale-[1.02] flex items-center gap-2"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {ui.newsletterSubscribe?.[locale]}
          </button>
          <button
            onClick={resetTest}
            className="px-8 py-4 font-semibold rounded-2xl transition-all duration-300 border hover:scale-[1.02]"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            {ui.retake[locale]}
          </button>
        </div>

        {/* Newsletter signup form */}
        {(showEmailForm || emailSuccess) && (
          <div className="rounded-3xl p-8 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              {ui.newsletterSubscribe?.[locale]}
            </h3>
            {emailSuccess ? (
              <p className="text-lg" style={{ color: 'var(--success)' }}>
                {ui.newsletterSuccess?.[locale]}
              </p>
            ) : (
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
                  placeholder={ui.emailPlaceholder?.[locale] ?? 'Your email'}
                  className="flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                  style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  disabled={emailLoading}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={emailLoading}
                  className="px-6 py-3 font-semibold rounded-xl transition-all disabled:opacity-70"
                  style={{ background: 'var(--accent-primary)', color: 'white' }}
                >
                  {emailLoading ? (locale === 'ru' ? 'Подписываем…' : locale === 'fr' ? 'Inscription…' : 'Subscribing…') : ui.emailSend?.[locale]}
                </button>
              </form>
            )}
            {emailError && (
              <p className="mt-2 text-sm" style={{ color: 'var(--error, #ef4444)' }}>{emailError}</p>
            )}
          </div>
        )}

        {/* Find Hobbies Nearby */}
        <div className="rounded-3xl p-8 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: 'var(--text-primary)' }}>
            {{ en: 'Find Places to Practice', ru: 'Найти места для занятий', fr: 'Trouver des lieux pour pratiquer' }[locale]}
          </h2>

          {!showMap && !location && (
            <button
              onClick={() => {
                setShowMap(true);
                setLocationError(null);
                if ('geolocation' in navigator) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    },
                    () => {
                      setLocationError(ui.locationError?.[locale] || 'Location error');
                    }
                  );
                } else {
                  setLocationError(ui.locationError?.[locale] || 'Geolocation not supported');
                }
              }}
              className="group relative w-full px-8 py-5 font-semibold rounded-2xl transition-all duration-300 overflow-hidden flex items-center justify-center gap-3"
              style={{ background: 'var(--success)', color: 'white' }}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              <svg className="w-6 h-6 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="relative">{ui.findNearby?.[locale] || 'Find These Hobbies Near Me'}</span>
            </button>
          )}

          {showMap && !location && !locationError && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent mx-auto mb-4" />
              <p style={{ color: 'var(--text-secondary)' }}>{ui.loadingLocation?.[locale] || 'Getting your location...'}</p>
            </div>
          )}

          {locationError && (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">{locationError}</p>
              <button
                onClick={() => {
                  setShowMap(false);
                  setLocationError(null);
                }}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
              >
                {{ en: 'Try Again', ru: 'Попробовать снова', fr: 'Réessayer' }[locale]}
              </button>
            </div>
          )}

          {location && (
            <div className="space-y-5">
              <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
                {{ en: 'Click on a hobby to find places nearby:', ru: 'Нажми на хобби, чтобы найти места поблизости:', fr: 'Cliquez sur un hobby pour trouver des lieux à proximité:' }[locale]}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendations.slice(0, 4).map(({ hobby }) => (
                  <a
                    key={hobby.id}
                    href={`https://www.google.com/maps/search/${encodeURIComponent(hobby.name.en)}/@${location.lat},${location.lng},14z`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative px-5 py-4 font-semibold rounded-2xl transition-all duration-300 overflow-hidden flex items-center justify-center gap-3"
                    style={{ background: 'linear-gradient(135deg, #7ba88a, #6b9a7a)', color: 'white' }}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    <svg className="w-5 h-5 relative flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="relative">{hobby.name[locale]}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
