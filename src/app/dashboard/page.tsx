'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';

interface BirthdayEmployee {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  department?: { name: string } | null;
}

// Simple SVG Icons
const CakeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M7,7V8A1,1 0 0,0 8,9H9A1,1 0 0,0 10,8V7H11V8A1,1 0 0,0 12,9H13A1,1 0 0,0 14,8V7H15V8A1,1 0 0,0 16,9H17A1,1 0 0,0 18,8V7H19V8A1,1 0 0,0 20,9H21A1,1 0 0,0 22,10V11H2V10A1,1 0 0,0 3,9H4A1,1 0 0,0 5,8V7H6V8A1,1 0 0,0 7,9H8A1,1 0 0,0 9,8V7H10V8A1,1 0 0,0 11,9H12A1,1 0 0,0 13,8V7H14V8A1,1 0 0,0 15,9H16A1,1 0 0,0 17,8V7H18V8A1,1 0 0,0 19,9H20A1,1 0 0,0 21,8V7H22V11H2V7Z" />
  </svg>
);

const GiftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20,12V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V12H20M20,8V10H4V8H20M20,6H4V4A2,2 0 0,1 6,2H18A2,2 0 0,1 20,4V6Z" />
  </svg>
);

export default function DashboardPage() {
  const [birthdays, setBirthdays] = useState<BirthdayEmployee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/employees/birthdays')
      .then(res => setBirthdays(res.data))
      .catch(() => alert('Ошибка загрузки дней рождения'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-600"></div>
      </div>
    );
  }

  // Функция для вычисления дней до следующего дня рождения
  const getDaysUntilNextBirthday = (birthDate: string): { days: number; nextBirthday: Date } => {
    const birth = new Date(birthDate);
    const today = new Date();
    
    // День рождения в этом году
    const thisYearBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    
    // Если день рождения в этом году уже прошел, то следующий день рождения в следующем году
    const nextBirthday = thisYearBirthday >= today 
      ? thisYearBirthday 
      : new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
    
    const diffTime = nextBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return { days: diffDays, nextBirthday };
  };

  // Функция для проверки дня рождения сегодня
  const isBirthdayToday = (birthDate: string): boolean => {
    const birth = new Date(birthDate);
    const today = new Date();
    return birth.getMonth() === today.getMonth() && birth.getDate() === today.getDate();
  };

  const today = new Date();
  const todayBirthdays = birthdays.filter(emp => isBirthdayToday(emp.birthDate));

  // Получаем предстоящие дни рождения (следующие 30 дней) с правильной логикой
  const upcoming = birthdays
    .filter(emp => {
      if (isBirthdayToday(emp.birthDate)) return false; // Исключаем сегодняшние дни рождения
      
      const { days } = getDaysUntilNextBirthday(emp.birthDate);
      return days > 0 && days <= 30;
    })
    .sort((a, b) => {
      const daysA = getDaysUntilNextBirthday(a.birthDate).days;
      const daysB = getDaysUntilNextBirthday(b.birthDate).days;
      return daysA - daysB; // Сортируем по приближению к сегодняшнему дню
    });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-neutral-600 rounded-xl p-8 md:p-12 text-white shadow-subtle">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <GiftIcon className="w-8 h-8 text-accent-400" />
            <h1 className="text-3xl md:text-4xl font-semibold">Календарь дней рождения</h1>
          </div>
          <p className="text-neutral-100 text-lg max-w-2xl">
            Автоматизированная система корпоративных поздравлений для создания атмосферы радости и признания в вашей команде
          </p>
        </div>
      </div>

      {/* Today's Birthdays */}
      <section>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent-400 rounded-lg flex items-center justify-center">
            <GiftIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-neutral-800">Сегодня отмечают ДР</h2>
            <p className="text-neutral-600 text-sm">{format(today, 'dd.MM.yyyy')}</p>
          </div>
        </div>
        
        {todayBirthdays.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-subtle border border-neutral-200 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CakeIcon className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-700 text-lg">Сегодня нет дней рождения</p>
            <p className="text-neutral-500 text-sm mt-2">Проверьте ближайшие дни для планирования поздравлений</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todayBirthdays.map((emp, index) => (
              <div 
                key={emp.id} 
                className="group relative bg-white rounded-xl p-6 shadow-subtle border border-neutral-200 hover:shadow-soft transition-all duration-200 hover:border-neutral-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-neutral-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {emp.firstName} {emp.lastName}
                    </h3>
                    <p className="text-neutral-600 text-sm">{emp.department?.name || 'Без отдела'}</p>
                    <p className="text-accent-600 text-xs font-medium mt-1">🎉 С Днём рождения!</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Birthdays */}
      <section>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
            <CakeIcon className="w-6 h-6 text-neutral-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-neutral-800">Ближайшие дни рождения</h2>
            <p className="text-neutral-600 text-sm">Следующие 30 дней</p>
          </div>
        </div>
        
        {upcoming.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-subtle border border-neutral-200 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CakeIcon className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-700 text-lg">Нет предстоящих дней рождения</p>
            <p className="text-neutral-500 text-sm mt-2">Добавьте сотрудников для получения уведомлений</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-subtle border border-neutral-200 overflow-hidden">
            <div className="divide-y divide-neutral-200">
              {upcoming.map((emp, index) => {
                const birth = new Date(emp.birthDate);
                const { days, nextBirthday } = getDaysUntilNextBirthday(emp.birthDate);
                const dateStr = format(nextBirthday, 'dd.MM');
                const isTomorrow = days === 1;
                
                return (
                  <div 
                    key={emp.id} 
                    className="p-4 hover:bg-neutral-50 transition-colors duration-200 animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                          <span className="text-neutral-600 font-medium text-sm">
                            {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{emp.firstName} {emp.lastName}</p>
                          <p className="text-sm text-neutral-600">{emp.department?.name || 'Без отдела'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-neutral-700">{dateStr}</p>
                        {isTomorrow && (
                          <p className="text-xs text-accent-600 font-medium">завтра</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}