'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getRole } from '@/lib/auth';
import { logout } from '@/lib/auth';

// Simple SVG Icons
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CogIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const GiftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<'employee' | 'hr' | null>(null);

  useEffect(() => {
    setRole(getRole());
  }, []);

  const navigationItems = [
    { 
      href: '/dashboard', 
      label: 'Календарь ДР', 
      icon: CalendarIcon,
      description: 'Просмотр дней рождения'
    },
    { 
      href: '/dashboard/colleagues', 
      label: 'Коллеги', 
      icon: UsersIcon,
      description: 'Список сотрудников'
    },
    { 
      href: '/dashboard/profile', 
      label: 'Мой профиль', 
      icon: UserIcon,
      description: 'Настройки профиля'
    },
  ];

  const hrItems = [
    { 
      href: '/dashboard/employees', 
      label: 'Сотрудники', 
      icon: UserIcon,
      description: 'Управление персоналом'
    },
    { 
      href: '/dashboard/card-templates', 
      label: 'Шаблоны открыток', 
      icon: DocumentIcon,
      description: 'Создание шаблонов'
    },
    { 
      href: '/dashboard/settings', 
      label: 'Настройки рассылки', 
      icon: CogIcon,
      description: 'Конфигурация системы'
    },
    { 
      href: '/dashboard/birthday-history', 
      label: 'История отправок', 
      icon: MailIcon,
      description: 'Отчеты по рассылке'
    },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background-50">
      {/* Header with clean design */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-neutral-600 rounded-lg flex items-center justify-center">
                <GiftIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-neutral-800">
                  BirthdayFlow
                </h1>
                <p className="text-xs text-neutral-600">Система корпоративных поздравлений</p>
              </div>
            </div>

            {/* Tech Stack Badge */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-md text-xs font-medium">
                Next.js
              </div>
              <div className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-md text-xs font-medium">
                NestJS
              </div>
              <div className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-md text-xs font-medium">
                Prisma
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-neutral-600 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogoutIcon className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-4 overflow-x-auto">
            {[...navigationItems, ...(role === 'hr' ? hrItems : [])].map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center space-x-2 px-4 py-2 rounded-lg text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors whitespace-nowrap"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-50 border-t border-neutral-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <GiftIcon className="w-5 h-5 text-neutral-600" />
              <span className="text-neutral-700 font-medium">BirthdayFlow</span>
            </div>
            <p className="text-neutral-600 text-sm mb-4">
              Современная система автоматизации корпоративных поздравлений
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-neutral-500">
              <span>© 2025 BirthdayFlow</span>
              <span>•</span>
              <span>Next.js + NestJS + Prisma</span>
              <span>•</span>
              <span>Nodemailer</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}