// src/lib/seo-analyzer.ts

import { SEOData } from '@/types';

export interface SEOCheck {
  label: string;
  passed: boolean;
  message: string;
}

export interface SEOScore {
  score: number; // 0-100
  status: 'bad' | 'okay' | 'good'; // red, yellow, green
  checks: SEOCheck[];
}

export function analyzeSEO(
  seo: SEOData,
  title: string,
  content: string
): SEOScore {
  const checks: SEOCheck[] = [];

  // 1. Check SEO Title length (50-60 chars optimal)
  const titleLength = seo.title.length;
  checks.push({
    label: 'SEO Titel Länge',
    passed: titleLength >= 50 && titleLength <= 60,
    message:
      titleLength === 0
        ? 'Kein SEO Titel vorhanden'
        : titleLength < 50
        ? `Zu kurz (${titleLength}/50 Zeichen)`
        : titleLength > 60
        ? `Zu lang (${titleLength}/60 Zeichen)`
        : `Optimal (${titleLength} Zeichen)`,
  });

  // 2. Check Meta Description length (120-160 chars optimal)
  const descLength = seo.description.length;
  checks.push({
    label: 'Meta Description Länge',
    passed: descLength >= 120 && descLength <= 160,
    message:
      descLength === 0
        ? 'Keine Meta Description vorhanden'
        : descLength < 120
        ? `Zu kurz (${descLength}/120 Zeichen)`
        : descLength > 160
        ? `Zu lang (${descLength}/160 Zeichen)`
        : `Optimal (${descLength} Zeichen)`,
  });

  // 3. Check if focus keyword is set
  checks.push({
    label: 'Focus Keyword',
    passed: seo.focusKeyword.length > 0,
    message:
      seo.focusKeyword.length > 0
        ? `Keyword gesetzt: "${seo.focusKeyword}"`
        : 'Kein Focus Keyword gesetzt',
  });

  // 4. Check if focus keyword is in SEO title
  const keywordInTitle =
    seo.focusKeyword.length > 0 &&
    seo.title.toLowerCase().includes(seo.focusKeyword.toLowerCase());
  checks.push({
    label: 'Keyword im SEO Titel',
    passed: keywordInTitle,
    message: keywordInTitle
      ? 'Keyword gefunden'
      : seo.focusKeyword.length === 0
      ? 'Kein Keyword zum Prüfen'
      : 'Keyword nicht im Titel',
  });

  // 5. Check if focus keyword is in meta description
  const keywordInDesc =
    seo.focusKeyword.length > 0 &&
    seo.description.toLowerCase().includes(seo.focusKeyword.toLowerCase());
  checks.push({
    label: 'Keyword in Meta Description',
    passed: keywordInDesc,
    message: keywordInDesc
      ? 'Keyword gefunden'
      : seo.focusKeyword.length === 0
      ? 'Kein Keyword zum Prüfen'
      : 'Keyword nicht in Description',
  });

  // 6. Check if slug is set
  checks.push({
    label: 'URL Slug',
    passed: seo.slug.length > 0,
    message: seo.slug.length > 0 ? `Slug: "${seo.slug}"` : 'Kein Slug gesetzt',
  });

  // 7. Check if main title is set
  checks.push({
    label: 'Artikel Titel',
    passed: title.length > 0,
    message: title.length > 0 ? 'Titel vorhanden' : 'Kein Titel gesetzt',
  });

  // Calculate score
  const passedChecks = checks.filter((c) => c.passed).length;
  const score = Math.round((passedChecks / checks.length) * 100);

  // Determine status
  let status: 'bad' | 'okay' | 'good';
  if (score >= 80) {
    status = 'good';
  } else if (score >= 50) {
    status = 'okay';
  } else {
    status = 'bad';
  }

  return {
    score,
    status,
    checks,
  };
}
