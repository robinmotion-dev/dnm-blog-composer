'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Anmeldung fehlgeschlagen');
        return;
      }

      const from = searchParams.get('from') ?? '/';
      router.push(from);
      router.refresh();
    } catch {
      setError('Verbindungsfehler. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          E-Mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          placeholder="name@dnm.berlin"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          Passwort
        </label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          placeholder="••••••••"
        />
        <label className="mt-2 flex items-center gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
          />
          Passwort anzeigen
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Anmelden…' : 'Anmelden'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-semibold text-neutral-900">
              DNM Blog Composer
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Bitte melde dich an
            </p>
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
