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
  const userRole = getRole();
  const id = Number(params.id);

  const [template, setTemplate] = useState<any>(null);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (userRole !== 'hr') {
      router.push('/dashboard');
      return;
    }
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
  }, [userRole, router, id, setValue]);

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
        <h1 className="text-3xl mb-6 text-neutral-800">Редактировать шаблон</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-soft space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-primary-700">Название</label>
            <input {...register('name')} placeholder="Название" className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-primary-700">URL фонового изображения</label>
            <input {...register('backgroundImageUrl')} placeholder="https://..." className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-primary-700">Текст поздравления</label>
            <textarea {...register('textTemplate')} rows={4} placeholder="Используйте {name} для имени именинника" className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-primary-700">Размер шрифта</label>
              <input {...register('fontSize', { valueAsNumber: true })} type="number" className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-primary-700">Цвет шрифта</label>
              <input {...register('fontColor')} className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-primary-700">X позиция текста</label>
              <input {...register('textX', { valueAsNumber: true })} type="number" className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-primary-700">Y позиция текста</label>
              <input {...register('textY', { valueAsNumber: true })} type="number" className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-primary-700">Отдел (опционально)</label>
            <select
              onChange={(e) => setValue('departmentId', e.target.value ? Number(e.target.value) : null)}
              defaultValue={template.departmentId || ''}
              className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Без отдела</option>
              {departments.map((d: any) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-primary-700">Должность (опционально)</label>
            <select
              onChange={(e) => setValue('positionId', e.target.value ? Number(e.target.value) : null)}
              defaultValue={template.positionId || ''}
              className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Без должности</option>
              {positions.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-neutral-600 hover:bg-neutral-700 text-white py-3 px-4 rounded-xl transition-colors font-medium">
            Сохранить изменения
          </button>
        </form>
      </div>
  );
}