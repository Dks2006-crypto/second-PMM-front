'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRole } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    const role = getRole();
    
    if (role) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 font-sans dark:bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-black">Загрузка...</p>
      </div>
    </div>
  );
}
