'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { getRole } from '@/lib/auth';

const schema = z.object({
  name: z.string().min(1),
  backgroundImageUrl: z.string().url(),
  textTemplate: z.string().min(1),
  fontSize: z.number().min(10),
  fontColor: z.string().regex(/^#/),
  textX: z.number().min(0),
  textY: z.number().min(0),
  departmentId: z.number().nullable().optional(),
  positionId: z.number().nullable().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditCardTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [template, setTemplate] = useState<any>(null);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
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
      api.get(`/card-templates/${id}`),
      api.get('/departments'),
      api.get('/positions'),
    ]).then(([tempRes, deptRes, posRes]) => {
      const temp = tempRes.data;
      setTemplate(temp);
      setValue('name', temp.name);
      setValue('backgroundImageUrl', temp.backgroundImageUrl);
      setValue('textTemplate', temp.textTemplate);
      setValue('fontSize', temp.fontSize);
      setValue('fontColor', temp.fontColor);
      setValue('textX', temp.textX);
      setValue('textY', temp.textY);
      setValue('departmentId', temp.departmentId || null);
      setValue('positionId', temp.positionId || null);

      setDepartments(deptRes.data);
      setPositions(posRes.data);
      setLoading(false);
    }).catch(() => alert('Ошибка загрузки'));
  }, [id, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await api.patch(`/card-templates/${id}`, data);
      router.push('/dashboard/card-templates');
    } catch {
      alert('Ошибка обновления');
    }
  };

  if (loading) return <p className="text-secondary-600">Загрузка...</p>;

  return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl mb-6 text-primary-800">Редактировать шаблон</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow space-y-4">
          {/* Аналогично форме создания */}
          <input {...register('name')} placeholder="Название" className="w-full p-2 border" />
          <input {...register('backgroundImageUrl')} placeholder="URL фона" className="w-full p-2 border" />
          <textarea {...register('textTemplate')} rows={4} className="w-full p-2 border" />
          <input {...register('fontSize', { valueAsNumber: true })} type="number" className="w-full p-2 border" />
          <input {...register('fontColor')} className="w-full p-2 border" />
          <input {...register('textX', { valueAsNumber: true })} type="number" className="w-full p-2 border" />
          <input {...register('textY', { valueAsNumber: true })} type="number" className="w-full p-2 border" />

          <select
            onChange={(e) => setValue('departmentId', e.target.value ? Number(e.target.value) : null)}
            defaultValue={template.departmentId || ''}
            className="w-full p-2 border"
          >
            <option value="">Без отдела</option>
            {departments.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            onChange={(e) => setValue('positionId', e.target.value ? Number(e.target.value) : null)}
            defaultValue={template.positionId || ''}
            className="w-full p-2 border"
          >
            <option value="">Без должности</option>
            {positions.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button type="submit" className="w-full bg-primary-700 hover:bg-primary-800 text-white py-2 rounded transition">
            Сохранить
          </button>
        </form>
      </div>
  );
}