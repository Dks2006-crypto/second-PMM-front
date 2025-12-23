'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getRole } from '@/lib/auth';

const schema = z.object({
  name: z.string().min(1),
  backgroundImageUrl: z.string().url().optional().or(z.literal('')),
  textTemplate: z.string().min(1),
  fontSize: z.number().min(10),
  fontColor: z.string().regex(/^#/),
  textX: z.number().min(0),
  textY: z.number().min(0),
  departmentId: z.number().optional(),
  positionId: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CreateCardTemplatePage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fontSize: 48,
      fontColor: '#FFFFFF',
      textX: 100,
      textY: 200,
    },
  });

  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noBackground, setNoBackground] = useState(false);



  useEffect(() => {
    Promise.all([
      api.get('/departments'),
      api.get('/positions'),
    ]).then(([deptRes, posRes]) => {
      setDepartments(deptRes.data);
      setPositions(posRes.data);
      setLoading(false);
    }).catch(() => alert('Ошибка загрузки справочников'));
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/card-templates', {
        ...data,
        backgroundImageUrl: noBackground ? null : (data.backgroundImageUrl || null),
        departmentId: data.departmentId || null,
        positionId: data.positionId || null,
      });
      router.push('/dashboard/card-templates');
    } catch {
      alert('Ошибка создания шаблона');
    }
  };

  const handleNoBackgroundChange = (checked: boolean) => {
    setNoBackground(checked);
    if (checked) {
      setValue('backgroundImageUrl', '');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl mb-6 text-neutral-800">Создать шаблон открытки</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-soft space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-primary-700">Название</label>
          <input {...register('name')} placeholder="Название" className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black" />
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-2 text-primary-700">
            <input 
              type="checkbox" 
              checked={noBackground}
              onChange={(e) => handleNoBackgroundChange(e.target.checked)}
              className="rounded border-primary-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-primary-600">Без фонового изображения (белый фон)</span>
          </label>
          
          {!noBackground && (
            <div>
              <label className="block text-sm font-medium mb-2 text-primary-700">URL фонового изображения</label>
              <input {...register('backgroundImageUrl')} placeholder="https://..." className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black" />
              {errors.backgroundImageUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.backgroundImageUrl.message}</p>
              )}
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-primary-700">Текст поздравления</label>
          <textarea {...register('textTemplate')} placeholder="Используйте {name} для имени именинника" rows={4} className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-primary-700">Размер шрифта</label>
            <input {...register('fontSize', { valueAsNumber: true })} type="number" placeholder="48" className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-primary-700">Цвет шрифта</label>
            <input {...register('fontColor')} placeholder="#FFFFFF" className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-primary-700">X позиция текста</label>
            <input {...register('textX', { valueAsNumber: true })} type="number" placeholder="100" className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-primary-700">Y позиция текста</label>
            <input {...register('textY', { valueAsNumber: true })} type="number" placeholder="200" className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-primary-700">Отдел (опционально)</label>
          <select
            onChange={(e) => setValue('departmentId', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
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
            onChange={(e) => setValue('positionId', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
          >
            <option value="">Без должности</option>
            {positions.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-lg font-medium">
          Создать шаблон
        </button>
      </form>
    </div>
  );
}