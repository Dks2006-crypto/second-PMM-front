'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { getRole, logout } from '@/lib/auth';
import SafeImage from '@/components/SafeImage';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';

interface HistoryItem {
  id: number;
  employee: { firstName: string; lastName: string; email: string };
  template: { name: string };
  imageUrl: string;
  sentAt: string;
  success: boolean;
  errorMessage?: string;
}

export default function BirthdayHistoryPage() {
  const router = useRouter();
  const userRole = getRole();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole !== 'hr') {
      router.push('/dashboard');
      return;
    }
    api.get('/employees/birthday-history')
      .then(res => setHistory(res.data))
      .catch(err => {
        console.error('Ошибка при загрузке истории:', err);
        alert('Ошибка загрузки истории: ' + (err.response?.data?.message || err.message));
      })
      .finally(() => setLoading(false));
  }, [userRole, router]);

  const successCount = history.filter(h => h.success).length;
  const errorCount = history.filter(h => !h.success).length;

  return (
    <div>
      <h1 className="text-3xl mb-6 text-primary-800">История отправок поздравлений</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-primary-100 p-3 md:p-4 rounded shadow">
          <p className="text-xl md:text-2xl font-bold text-primary-800">{successCount}</p>
          <p className="text-sm md:text-base text-primary-700">Успешно отправлено</p>
        </div>
        <div className="bg-accent-100 p-3 md:p-4 rounded shadow">
          <p className="text-xl md:text-2xl font-bold text-accent-800">{errorCount}</p>
          <p className="text-sm md:text-base text-accent-700">Ошибок отправки</p>
        </div>
      </div>

      {loading ? <p className="text-secondary-600">Загрузка...</p> : (
        <ResponsiveTable
          data={history}
          columns={[
            {
              key: 'employee',
              header: 'Сотрудник',
              mobileLabel: 'Сотрудник',
              render: (item) => (
                <div className="text-secondary-700">
                  <div className="font-medium">{item.employee.firstName} {item.employee.lastName}</div>
                  <div className="text-xs text-gray-600">{item.employee.email}</div>
                </div>
              )
            },
            {
              key: 'template',
              header: 'Шаблон',
              mobileLabel: 'Шаблон',
              render: (item) => (
                <div className="text-secondary-700">
                  {item.template.name}
                </div>
              )
            },
            {
              key: 'sentAt',
              header: 'Дата отправки',
              mobileLabel: 'Дата отправки',
              render: (item) => (
                <div className="text-secondary-700">
                  {format(new Date(item.sentAt), 'dd.MM.yyyy HH:mm')}
                </div>
              )
            },
            {
              key: 'status',
              header: 'Статус',
              mobileLabel: 'Статус',
              render: (item) => (
                <div className="text-secondary-700">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.success
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.success ? 'Успех' : 'Ошибка'}
                  </span>
                </div>
              )
            },
            {
              key: 'card',
              header: 'Открытка',
              mobileLabel: 'Открытка',
              render: (item) => (
                <div>
                  {item.success && item.imageUrl ? (
                    <button
                      onClick={() => window.open(item.imageUrl, '_blank', 'noopener,noreferrer')}
                      className="text-primary-600 hover:text-primary-700 underline text-xs md:text-sm"
                    >
                      Просмотреть открытку
                    </button>
                  ) : '-'}
                </div>
              )
            },
            {
              key: 'error',
              header: 'Ошибка',
              mobileLabel: 'Ошибка',
              render: (item) => (
                <div className="text-secondary-700">
                  {item.errorMessage || '-'}
                </div>
              )
            }
          ]}
          emptyMessage="История отправок пуста"
        />
      )}
    </div>
  );
}