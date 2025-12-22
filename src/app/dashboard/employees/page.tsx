'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { format } from 'date-fns';
import { getRole } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-2xl md:text-3xl text-primary-800">Сотрудники</h1>
          <Link href="/dashboard/employees/create" className="bg-primary-700 hover:bg-primary-800 text-white px-3 py-2 md:px-4 md:py-2 rounded transition text-sm md:text-base w-full sm:w-auto text-center">
            Добавить сотрудника
          </Link>
        </div>

        {loading ? <p className="text-secondary-600">Загрузка...</p> : (
          <ResponsiveTable
            data={employees}
            columns={[
              {
                key: 'fullName',
                header: 'ФИО',
                mobileLabel: 'Полное имя',
                render: (emp) => (
                  <div className="text-secondary-700 font-medium">
                    {emp.firstName} {emp.lastName}
                  </div>
                )
              },
              {
                key: 'email',
                header: 'Email',
                mobileLabel: 'Электронная почта',
                render: (emp) => (
                  <div className="text-secondary-700">
                    {emp.email}
                  </div>
                )
              },
              {
                key: 'birthDate',
                header: 'ДР',
                mobileLabel: 'Дата рождения',
                render: (emp) => (
                  <div className="text-secondary-700">
                    {format(new Date(emp.birthDate), 'dd.MM.yyyy')}
                  </div>
                )
              },
              {
                key: 'department',
                header: 'Отдел',
                mobileLabel: 'Отдел',
                render: (emp) => (
                  <div className="text-secondary-700">
                    {emp.department?.name || '-'}
                  </div>
                )
              },
              {
                key: 'position',
                header: 'Должность',
                mobileLabel: 'Должность',
                render: (emp) => (
                  <div className="text-secondary-700">
                    {emp.position?.name || '-'}
                  </div>
                )
              },
              {
                key: 'actions',
                header: 'Действия',
                mobileLabel: 'Действия',
                render: (emp) => (
                  <Link href={`/dashboard/employees/${emp.id}`} className="text-primary-600 hover:text-primary-700">
                    Редактировать
                  </Link>
                )
              }
            ]}
            emptyMessage="Список сотрудников пуст"
          />
        )}
      </div>
  );
}