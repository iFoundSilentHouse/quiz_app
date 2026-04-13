'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const success = searchParams.get('success');
    if (success) {
      setMessage(success);
      const timer = setTimeout(() => {
        setMessage(null);
        // Убираем ?success=... из URL без перезагрузки страницы
        const params = new URLSearchParams(searchParams.toString());
        params.delete('success');
        router.replace(`/dashboard?${params.toString()}`, { scroll: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
      <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg border border-green-600 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-xl">{message}</span>
      </div>
    </div>
  );
}