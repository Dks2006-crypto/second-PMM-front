'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { getRole } from '@/lib/auth';

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  birthDate: z.string(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  departmentId: z.number().optional(),
  positionId: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [employee, setEmployee] = useState<any>(null);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
    useEffect(() => {
      const role = getRole();
      if (role !== 'hr') {
        router.push('/dashboard'); // или /login
      }
    }, [router]);

  useEffect(() => {
    Promise.all([
      api.get(`/employees/${id}`),
      api.get('/departments'),
      api.get('/positions'),
    ]).then(([empRes, deptRes, posRes]) => {
      const emp = empRes.data;
      setEmployee(emp);
      setValue('firstName', emp.firstName);
      setValue('lastName', emp.lastName);
      setValue('email', emp.email);
      setValue('birthDate', emp.birthDate.split('T')[0]); // YYYY-MM-DD
      setValue('photoUrl', emp.photoUrl || '');
      setValue('departmentId', emp.departmentId || undefined);
      setValue('positionId', emp.positionId || undefined);

      setDepartments(deptRes.data);
      setPositions(posRes.data);
      setLoading(false);
    }).catch(() => alert('Ошибка загрузки'));
  }, [id, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await api.patch(`/employees/${id}`, {
        ...data,
        departmentId: data.departmentId || null,
        positionId: data.positionId || null,
      });
      router.push('/dashboard/employees');
    } catch {
      alert('Ошибка обновления');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Удалить сотрудника?')) return;
    try {
      await api.delete(`/employees/${id}`);
      router.push('/dashboard/employees');
    } catch {
      alert('Ошибка удаления');
    }
  };

  if (loading) return <p className="text-secondary-600">Загрузка...</p>;

  return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl mb-6 text-primary-800">Редактировать сотрудника</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow space-y-4">
          <input {...register('firstName')} placeholder="Имя" className="w-full p-2 border" />
          <input {...register('lastName')} placeholder="Фамилия" className="w-full p-2 border" />
          <input {...register('email')} placeholder="Email" className="w-full p-2 border" />
          <input {...register('birthDate')} type="date" className="w-full p-2 border" />
          <input {...register('photoUrl')} placeholder="URL фото" className="w-full p-2 border" />

          <select {...register('departmentId', { valueAsNumber: true })} className="w-full p-2 border">
            <option value="">Без отдела</option>
            {departments.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select {...register('positionId', { valueAsNumber: true })} className="w-full p-2 border">
            <option value="">Без должности</option>
            {positions.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <div className="flex gap-4">
            <button type="submit" className="bg-primary-700 hover:bg-primary-800 text-white py-2 px-6 rounded transition">
              Сохранить
            </button>
            <button type="button" onClick={handleDelete} className="bg-accent-700 hover:bg-accent-800 text-white py-2 px-6 rounded transition">
              Удалить
            </button>
          </div>
        </form>
      </div>
  );
}