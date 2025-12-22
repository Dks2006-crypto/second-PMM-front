'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { getRole } from '@/lib/auth';
import FileUpload from '@/components/ui/FileUpload';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      // Преобразуем дату в формат ISO-8601
      const birthDate = new Date(data.birthDate);
      const isoBirthDate = birthDate.toISOString();
      
      const payload: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        birthDate: isoBirthDate,
        departmentId: data.departmentId || null,
        positionId: data.positionId || null,
      };
      
      // Если photoUrl не пустой, добавляем его в payload
      if (data.photoUrl) {
        payload.photoUrl = data.photoUrl;
      }
      
      await api.patch(`/employees/${id}`, payload);
      router.push('/dashboard/employees');
    } catch (error: any) {
      console.error('Ошибка обновления:', error);
      alert('Ошибка обновления: ' + (error.response?.data?.message || error.message || 'Неизвестная ошибка'));
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
      <div className="max-w-2xl mx-auto w-full px-2 md:px-0">
        <h1 className="text-2xl md:text-3xl mb-4 md:mb-6 text-primary-800">Редактировать сотрудника</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 md:p-6 rounded shadow space-y-4">
          <input {...register('firstName')} placeholder="Имя" className="w-full p-2 md:p-3 border border-gray-300 rounded text-black" />
          <input {...register('lastName')} placeholder="Фамилия" className="w-full p-2 md:p-3 border border-gray-300 rounded text-black" />
          <input {...register('email')} placeholder="Email" className="w-full p-2 md:p-3 border border-gray-300 rounded text-black" />
          <input {...register('birthDate')} type="date" className="w-full p-2 md:p-3 border border-gray-300 rounded text-black" />
          
          {/* Компонент загрузки фото */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Фото сотрудника</label>
            <FileUpload onFileSelect={setSelectedFile} accept="image/*" />
            {selectedFile && (
              <p className="text-sm text-gray-600">Выбран: {selectedFile.name}</p>
            )}
          </div>

          <select {...register('departmentId', { valueAsNumber: true })} className="w-full p-2 md:p-3 border border-gray-300 rounded text-black">
            <option value="">Без отдела</option>
            {departments.map((d: any) => (
              <option key={d.id} value={d.id} className="text-black">{d.name}</option>
            ))}
          </select>

          <select {...register('positionId', { valueAsNumber: true })} className="w-full p-2 md:p-3 border border-gray-300 rounded text-black">
            <option value="">Без должности</option>
            {positions.map((p: any) => (
              <option key={p.id} value={p.id} className="text-black">{p.name}</option>
            ))}
          </select>

          <div className="flex flex-col sm:flex-row gap-4">
            <button type="submit" className="bg-primary-700 hover:bg-primary-800 text-white py-2 px-4 md:py-2 md:px-6 rounded transition w-full sm:w-auto">
              Сохранить
            </button>
            <button type="button" onClick={handleDelete} className="bg-accent-700 hover:bg-accent-800 text-white py-2 px-4 md:py-2 md:px-6 rounded transition w-full sm:w-auto">
              Удалить
            </button>
          </div>
        </form>
      </div>
  );
}