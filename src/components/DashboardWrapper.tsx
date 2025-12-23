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

const BuildingOfficeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const BriefcaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<'employee' | 'hr' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      href: '/dashboard/departments',
      label: 'Отделы',
      icon: BuildingOfficeIcon,
      description: 'Управление отделами'
    },
    {
      href: '/dashboard/positions',
      label: 'Должности',
      icon: BriefcaseIcon,
      description: 'Управление должностями'
    },
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background-50 flex flex-col">
      {/* Header with responsive design */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-subtle">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-16 w-full py-2 sm:py-0">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2 md:space-x-3 mb-2 sm:mb-0">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-neutral-600 rounded-lg flex items-center justify-center">
                <GiftIcon className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-semibold text-neutral-800">
                  BirthdayFlow
                </h1>
                <p className="text-xs text-neutral-600 hidden md:block">Система корпоративных поздравлений</p>
              </div>
            </div>

            {/* Desktop Tech Stack Badge */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="bg-neutral-100 text-neutral-700 px-2 md:px-3 py-1 rounded-md text-xs font-medium">
                Next.js
              </div>
              <div className="bg-neutral-100 text-neutral-700 px-2 md:px-3 py-1 rounded-md text-xs font-medium">
                NestJS
              </div>
              <div className="bg-neutral-100 text-neutral-700 px-2 md:px-3 py-1 rounded-md text-xs font-medium">
                Prisma
              </div>
            </div>

            {/* Controls Container */}
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-black hover:bg-neutral-100 transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
 
              {/* Desktop Logout Button */}
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center space-x-2 bg-neutral-600 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-lg transition-colors text-sm"
              >
                <LogoutIcon className="w-3 h-3" />
                <span className="font-medium text-sm">Выйти</span>
              </button>
            </div>
          </div>
        </div>

      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 w-full">
          {/* Desktop Navigation - теперь видна на sm и выше */}
          <div className="hidden sm:flex flex-wrap gap-1 py-2 sm:py-3 md:py-4 w-full">
            {[...navigationItems, ...(role === 'hr' ? hrItems : [])].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center space-x-2 px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 rounded-lg text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors text-xs sm:text-sm md:text-base flex-shrink-0"
                >
                  <Icon className="w-3 h-3 sm:w-4 md:w-5 sm:h-4 md:h-5" />
                  <span className="font-medium text-xs sm:text-sm md:text-base">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white border-b border-neutral-200 shadow-lg`}>
            <div className="py-2 space-y-1 border-t border-neutral-200 bg-white">
              {[...navigationItems, ...(role === 'hr' ? hrItems : [])].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 text-neutral-600" />
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{item.label}</span>
                      <span className="text-xs text-neutral-500">{item.description}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="animate-fade-in w-full">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-50 border-t border-neutral-200 mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <GiftIcon className="w-5 h-5 text-neutral-600" />
              <span className="text-neutral-700 font-medium text-base md:text-lg">BirthdayFlow</span>
            </div>
            <p className="text-neutral-600 text-sm md:text-base mb-4">
              Современная система автоматизации корпоративных поздравлений
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs md:text-sm text-neutral-500">
              <span>© 2025 BirthdayFlow</span>
              <div className="hidden sm:block">•</div>
              <span>Next.js + NestJS + Prisma</span>
              <div className="hidden sm:block">•</div>
              <span>Nodemailer</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}