'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { format } from 'date-fns';
import { getRole } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  department?: { name: string } | null;
  position?: { name: string } | null;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/employees')
      .then(res => setEmployees(res.data))
      .catch(() => alert('Ошибка загрузки сотрудников'))
      .finally(() => setLoading(false));
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (!getRole()) {
      router.push('/login');
    }
  }, [router]);

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl text-primary-800">Сотрудники</h1>
          <Link href="/dashboard/employees/create" className="bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded transition">
            Добавить сотрудника
          </Link>
        </div>

        {loading ? <p className="text-secondary-600">Загрузка...</p> : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-secondary-100">
                <th className="border p-3 text-left text-primary-700">ФИО</th>
                <th className="border p-3 text-left text-primary-700">Email</th>
                <th className="border p-3 text-left text-primary-700">ДР</th>
                <th className="border p-3 text-left text-primary-700">Отдел</th>
                <th className="border p-3 text-left text-primary-700">Должность</th>
                <th className="border p-3 text-primary-700">Действия</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td className="border p-3 text-secondary-700">{emp.firstName} {emp.lastName}</td>
                  <td className="border p-3 text-secondary-700">{emp.email}</td>
                  <td className="border p-3 text-secondary-700">{format(new Date(emp.birthDate), 'dd.MM.yyyy')}</td>
                  <td className="border p-3 text-secondary-700">{emp.department?.name || '-'}</td>
                  <td className="border p-3 text-secondary-700">{emp.position?.name || '-'}</td>
                  <td className="border p-3">
                    <Link href={`/dashboard/employees/${emp.id}`} className="text-primary-600 hover:text-primary-700">Редактировать</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
  );
}