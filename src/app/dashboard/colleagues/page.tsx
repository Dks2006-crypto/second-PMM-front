'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';

interface Colleague {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  department?: { name: string } | null;
}

export default function ColleaguesPage() {
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/employees/birthdays')
      .then(res => setColleagues(res.data))
      .catch(() => alert('Ошибка загрузки списка коллег'))
      .finally(() => setLoading(false));
  }, []);

  const getDaysUntilBirthday = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    
    // Получаем дату рождения в этом году
    const thisYearBirth = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    
    // Если день рождения в этом году уже прошел, берем следующий год
    let nextBirthday = thisYearBirth;
    if (thisYearBirth < today) {
      nextBirthday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    
    const diffTime = nextBirthday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getNextBirthdayDate = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    
    const thisYearBirth = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    
    if (thisYearBirth < today) {
      return new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    
    return thisYearBirth;
  };

  const sortedColleagues = [...colleagues].sort((a, b) => {
    const birthA = new Date(a.birthDate);
    const birthB = new Date(b.birthDate);
    const today = new Date();
    const birthdayAThisYear = new Date(today.getFullYear(), birthA.getMonth(), birthA.getDate());
    const birthdayBThisYear = new Date(today.getFullYear(), birthB.getMonth(), birthB.getDate());
    
    const isTodayA = birthdayAThisYear.toDateString() === today.toDateString();
    const isTodayB = birthdayBThisYear.toDateString() === today.toDateString();
    
    // Сначала сортируем по приоритету: сегодня -> скоро -> остальные
    if (isTodayA && !isTodayB) return -1;
    if (!isTodayA && isTodayB) return 1;
    
    // Если оба сегодня или оба не сегодня, сортируем по дням до дня рождения
    const daysA = getDaysUntilBirthday(a.birthDate);
    const daysB = getDaysUntilBirthday(b.birthDate);
    return daysA - daysB;
  });

  const getRowStyle = (birthDate: string) => {
    const daysUntil = getDaysUntilBirthday(birthDate);
    const birth = new Date(birthDate);
    const today = new Date();
    const birthdayThisYear = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    const isToday = birthdayThisYear.toDateString() === today.toDateString();
    
    if (isToday) {
      return 'bg-accent-100 border-l-4 border-accent-500';
    } else if (daysUntil <= 7) {
      return 'bg-primary-50 border-l-4 border-primary-400';
    } else {
      return 'bg-white border-b border-secondary-200';
    }
  };

  const getBirthdayBadge = (birthDate: string) => {
    const daysUntil = getDaysUntilBirthday(birthDate);
    const birth = new Date(birthDate);
    const today = new Date();
    const birthdayThisYear = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    const isToday = birthdayThisYear.toDateString() === today.toDateString();
    
    if (isToday) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-600 text-white">
          🎉 Сегодня!
        </span>
      );
    } else if (daysUntil <= 7) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-600 text-white">
          Скоро: {daysUntil} {daysUntil === 1 ? 'день' : daysUntil < 5 ? 'дня' : 'дней'}
        </span>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-secondary-600">Загрузка...</p>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl text-primary-800 mb-2">Коллеги и дни рождения</h1>
        <p className="text-secondary-600">Список коллег отсортирован по приближению дня рождения</p>
      </div>

      {colleagues.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-secondary-600 text-lg">Список коллег пуст</p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    ФИО
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Отдел
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Дата рождения
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    В этом году
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    До дня рождения
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {sortedColleagues.map((colleague) => {
                  const birth = new Date(colleague.birthDate);
                  const daysUntil = getDaysUntilBirthday(colleague.birthDate);
                  const nextBirthday = getNextBirthdayDate(colleague.birthDate);
                  const birthdayThisYear = new Date(new Date().getFullYear(), birth.getMonth(), birth.getDate());
                  const isToday = birthdayThisYear.toDateString() === new Date().toDateString();

                  return (
                    <tr key={colleague.id} className={getRowStyle(colleague.birthDate)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-primary-900">
                          {colleague.firstName} {colleague.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-secondary-700">
                          {colleague.department?.name || 'Не указан'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-secondary-700">
                          {format(birth, 'dd.MM.yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-secondary-700">
                          {format(birthdayThisYear, 'dd.MM')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-secondary-700">
                          {isToday ? 'Сегодня!' : `${daysUntil} ${daysUntil === 1 ? 'день' : daysUntil < 5 ? 'дня' : 'дней'}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getBirthdayBadge(colleague.birthDate)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Легенда */}
      <div className="mt-6 flex items-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-accent-100 border-l-4 border-accent-500 rounded mr-2"></div>
          <span className="text-secondary-600">Сегодня день рождения</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-50 border-l-4 border-primary-400 rounded mr-2"></div>
          <span className="text-secondary-600">Близкий день рождения (до 7 дней)</span>
        </div>
      </div>
    </div>
  );
}