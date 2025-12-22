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

interface Department {
  id: number;
  name: string;
}

interface Filters {
  departmentId: string;
  period: string;
  dateFrom: string;
  dateTo: string;
}

export default function ColleaguesPage() {
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    departmentId: '',
    period: 'all',
    dateFrom: '',
    dateTo: ''
  });

  // Загрузка отделов для фильтра
  useEffect(() => {
    api.get('/departments')
      .then(res => setDepartments(res.data))
      .catch(console.error);
  }, []);

  // Загрузка данных с учетом фильтров
  useEffect(() => {
    loadColleagues();
  }, [filters]);

  const loadColleagues = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (filters.departmentId) params.departmentId = filters.departmentId;
      if (filters.period && filters.period !== 'all') params.period = filters.period;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const res = await api.get('/employees/birthdays', { params });
      setColleagues(res.data);
    } catch (error) {
      console.error('Ошибка загрузки списка коллег:', error);
      alert('Ошибка загрузки списка коллег');
    } finally {
      setLoading(false);
    }
  };

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
      return 'bg-white border-b border-gray-800';
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

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      departmentId: '',
      period: 'all',
      dateFrom: '',
      dateTo: ''
    });
  };

  const hasActiveFilters = filters.departmentId || (filters.period && filters.period !== 'all') || filters.dateFrom || filters.dateTo;

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-black">Загрузка...</p>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl text-primary-800 mb-2">Коллеги и дни рождения</h1>
        <p className="text-black">Список коллег отсортирован по приближению дня рождения</p>
      </div>

      {/* Фильтры */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold text-primary-800 mb-4">Фильтры</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Фильтр по отделу */}
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Отдел</label>
            <select
              value={filters.departmentId}
              onChange={(e) => handleFilterChange('departmentId', e.target.value)}
              className="w-full p-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Все отделы</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* Быстрые фильтры по периоду */}
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Период</label>
            <select
              value={filters.period}
              onChange={(e) => handleFilterChange('period', e.target.value)}
              className="w-full p-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Все дни рождения</option>
              <option value="today">Сегодня</option>
              <option value="week">На этой неделе</option>
              <option value="month">В этом месяце</option>
            </select>
          </div>

          {/* Фильтр по дате "с" */}
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Дата "с"</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full p-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Фильтр по дате "по" */}
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Дата "по"</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full p-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Кнопка очистки фильтров */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors"
            >
              Очистить фильтры
            </button>
          </div>
        )}

        {/* Индикатор активных фильтров */}
        {hasActiveFilters && (
          <div className="mt-4 p-3 bg-primary-50 rounded-lg">
            <p className="text-sm text-primary-700">
              <span className="font-medium">Активные фильтры:</span>{' '}
              {filters.departmentId && `Отдел: ${departments.find(d => d.id.toString() === filters.departmentId)?.name}`}
              {filters.period && filters.period !== 'all' && (filters.departmentId ? ', ' : '') + `Период: ${
                filters.period === 'today' ? 'Сегодня' :
                filters.period === 'week' ? 'На этой неделе' :
                filters.period === 'month' ? 'В этом месяце' : filters.period
              }`}
              {filters.dateFrom && (filters.departmentId || (filters.period && filters.period !== 'all') ? ', ' : '') + `С: ${format(new Date(filters.dateFrom), 'dd.MM.yyyy')}`}
              {filters.dateTo && (filters.departmentId || (filters.period && filters.period !== 'all') || filters.dateFrom ? ', ' : '') + `По: ${format(new Date(filters.dateTo), 'dd.MM.yyyy')}`}
            </p>
          </div>
        )}
      </div>

      {/* Результаты */}
      {colleagues.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-black text-lg">
            {hasActiveFilters ? 'Нет сотрудников, соответствующих выбранным фильтрам' : 'Список коллег пуст'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-100 border-b">
            <p className="text-sm text-black">
              Найдено: <span className="font-medium">{colleagues.length}</span> сотрудников
              {hasActiveFilters && <span className="text-primary-600"> (отфильтровано)</span>}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    ФИО
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Отдел
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Дата рождения
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    В этом году
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    До дня рождения
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-800">
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
                        <div className="text-sm text-black">
                          {colleague.department?.name || 'Не указан'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">
                          {format(birth, 'dd.MM.yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">
                          {format(birthdayThisYear, 'dd.MM')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">
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
          <span className="text-black">Сегодня день рождения</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-50 border-l-4 border-primary-400 rounded mr-2"></div>
          <span className="text-black">Близкий день рождения (до 7 дней)</span>
        </div>
      </div>
    </div>
  );
}