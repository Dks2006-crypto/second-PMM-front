'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getRole } from '@/lib/auth';
import { logout } from '@/lib/auth';

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<'employee' | 'hr' | null>(null);

  useEffect(() => {
    setRole(getRole());
  }, []);

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <header className="bg-primary-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Система поздравлений с Днем рождения</h1>
          <button
            onClick={logout}
            className="bg-accent-700 hover:bg-accent-800 px-4 py-2 rounded transition"
          >
            Выйти
          </button>
        </div>
      </header>

      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            <Link href="/dashboard" className="text-primary-700 hover:text-primary-900 font-medium">
              Календарь ДР
            </Link>
            <Link href="/dashboard/profile" className="text-primary-700 hover:text-primary-900 font-medium">
              Мой профиль
            </Link>

            {role === 'hr' && (
              <>
                <Link href="/dashboard/employees" className="text-primary-700 hover:text-primary-900 font-medium">
                  Сотрудники
                </Link>
                <Link href="/dashboard/card-template" className="text-primary-700 hover:text-primary-900 font-medium">
                  Шаблоны открыток
                </Link>
                <Link href="/dashboard/settings" className="text-primary-700 hover:text-primary-900 font-medium">
                  Настройки рассылки
                </Link>
                <Link href="/dashboard/birthday-history" className="text-primary-700 hover:text-primary-900 font-medium">
                  История отправок
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-secondary-100 border-t py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-secondary-700 text-sm">
          © 2025 Система учета сотрудников и поздравлений
        </div>
      </footer>
    </div>
  );
}