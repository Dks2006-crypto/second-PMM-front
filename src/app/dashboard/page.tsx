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

export default function DashboardPage() {
  const [birthdays, setBirthdays] = useState<BirthdayEmployee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/employees/birthdays')
      .then(res => setBirthdays(res.data))
      .catch(() => alert('Ошибка загрузки дней рождения'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Загрузка...</p>;

  const today = new Date();
  const todayBirthdays = birthdays.filter(emp => {
    const birth = new Date(emp.birthDate);
    return birth.getMonth() === today.getMonth() && birth.getDate() === today.getDate();
  });

  const upcoming = birthdays.filter(emp => {
    const birth = new Date(emp.birthDate);
    const thisYearBirth = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    return thisYearBirth >= today && thisYearBirth <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  });

  return (
    <div>
      <h1 className="text-3xl mb-6 text-primary-800">Календарь дней рождения</h1>

      <section className="mb-8">
        <h2 className="text-2xl mb-4 text-primary-700">Сегодня ({format(today, 'dd.MM.yyyy')})</h2>
        {todayBirthdays.length === 0 ? (
          <p className="text-secondary-600">Сегодня нет дней рождения</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayBirthdays.map(emp => (
              <div key={emp.id} className="bg-primary-100 p-4 rounded shadow">
                <p className="text-xl font-bold text-primary-800">{emp.firstName} {emp.lastName}</p>
                <p className="text-primary-700">{emp.department?.name || 'Без отдела'}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl mb-4 text-primary-700">Ближайшие (30 дней)</h2>
        {upcoming.length === 0 ? (
          <p className="text-secondary-600">Нет предстоящих дней рождения</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map(emp => {
              const birth = new Date(emp.birthDate);
              const dateStr = format(new Date(today.getFullYear(), birth.getMonth(), birth.getDate()), 'dd.MM');
              return (
                <li key={emp.id} className="bg-secondary-100 p-3 rounded">
                  <span className="text-primary-700">{dateStr}</span> — {emp.firstName} {emp.lastName} ({emp.department?.name || 'Без отдела'})
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}