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
      const role = getRole();
      if (role !== 'hr') {
        router.push('/dashboard'); // или /login
      }
    }, [router]);

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
        <h1 className="text-3xl mb-6 text-primary-800">Создать шаблон открытки</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow space-y-4">
          <input {...register('name')} placeholder="Название" className="w-full p-2 border" />
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={noBackground}
                onChange={(e) => handleNoBackgroundChange(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Без фонового изображения (белый фон)</span>
            </label>
            
            {!noBackground && (
              <>
                <input {...register('backgroundImageUrl')} placeholder="URL фонового изображения" className="w-full p-2 border" />
                {errors.backgroundImageUrl && (
                  <p className="text-red-500 text-sm">{errors.backgroundImageUrl.message}</p>
                )}
              </>
            )}
          </div>
          
          <textarea {...register('textTemplate')} placeholder="Текст (используйте {name} для имени)" rows={4} className="w-full p-2 border" />
          <input {...register('fontSize', { valueAsNumber: true })} type="number" placeholder="Размер шрифта" className="w-full p-2 border" />
          <input {...register('fontColor')} placeholder="Цвет шрифта (#FFFFFF)" className="w-full p-2 border" />
          <input {...register('textX', { valueAsNumber: true })} type="number" placeholder="X позиция текста" className="w-full p-2 border" />
          <input {...register('textY', { valueAsNumber: true })} type="number" placeholder="Y позиция текста" className="w-full p-2 border" />

          <select
            onChange={(e) => setValue('departmentId', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-2 border"
          >
            <option value="">Без отдела</option>
            {departments.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            onChange={(e) => setValue('positionId', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-2 border"
          >
            <option value="">Без должности</option>
            {positions.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button type="submit" className="w-full bg-primary-700 hover:bg-primary-800 text-white py-2 rounded transition">
            Создать шаблон
          </button>
        </form>
      </div>
  );
}