'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { getRole, logout } from '@/lib/auth';

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
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = getRole();
    if (role !== 'hr') {
      router.push('/dashboard');
      return;
    }

    api.get('/employees/birthday-history')
      .then(res => setHistory(res.data))
      .catch(err => {
        console.error('Ошибка при загрузке истории:', err);
        if (err.response?.status === 403 || err.response?.status === 401) {
          alert('Доступ запрещён или сессия истекла');
          router.push('/login');
        } else {
          alert('Ошибка загрузки истории: ' + (err.response?.data?.message || err.message));
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const successCount = history.filter(h => h.success).length;
  const errorCount = history.filter(h => !h.success).length;

  return (
    <div>
      <h1 className="text-3xl mb-6 text-primary-800">История отправок поздравлений</h1>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-primary-100 p-4 rounded shadow">
          <p className="text-2xl font-bold text-primary-800">{successCount}</p>
          <p className="text-primary-700">Успешно отправлено</p>
        </div>
        <div className="bg-accent-100 p-4 rounded shadow">
          <p className="text-2xl font-bold text-accent-800">{errorCount}</p>
          <p className="text-accent-700">Ошибок отправки</p>
        </div>
      </div>

      {loading ? <p className="text-secondary-600">Загрузка...</p> : (
        <table className="w-full border-collapse">
            <thead>
              <tr className="bg-secondary-100">
                <th className="border p-3 text-left text-primary-700">Сотрудник</th>
                <th className="border p-3 text-left text-primary-700">Шаблон</th>
                <th className="border p-3 text-left text-primary-700">Дата отправки</th>
                <th className="border p-3 text-left text-primary-700">Статус</th>
                <th className="border p-3 text-left text-primary-700">Открытка</th>
                <th className="border p-3 text-left text-primary-700">Ошибка</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id} className={item.success ? 'bg-primary-50' : 'bg-accent-50'}>
                  <td className="border p-3 text-secondary-700">
                    {item.employee.firstName} {item.employee.lastName}<br />
                    <small>{item.employee.email}</small>
                  </td>
                  <td className="border p-3 text-secondary-700">{item.template.name}</td>
                  <td className="border p-3 text-secondary-700">{format(new Date(item.sentAt), 'dd.MM.yyyy HH:mm')}</td>
                  <td className="border p-3 text-secondary-700">{item.success ? 'Успех' : 'Ошибка'}</td>
                  <td className="border p-3">
                    {item.success && item.imageUrl ? (
                      <a href={item.imageUrl} target="_blank" className="text-primary-600 hover:text-primary-700">
                        Просмотреть открытку
                      </a>
                    ) : '-'}
                  </td>
                  <td className="border p-3 text-secondary-700">{item.errorMessage || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
      )}
    </div>
  );
}