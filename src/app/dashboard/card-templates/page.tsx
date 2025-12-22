'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { getRole } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import SafeImage from '@/components/SafeImage';

interface CardTemplate {
  id: number;
  name: string;
  backgroundImageUrl: string;
  textTemplate: string;
  fontSize: number;
  fontColor: string;
  textX: number;
  textY: number;
  department?: { name: string } | null;
  position?: { name: string } | null;
}

export default function CardTemplatesPage() {
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const role = getRole();
    if (role !== 'hr') {
      router.push('/dashboard'); // или /login
    }
  }, [router]);

  useEffect(() => {
    api.get('/card-templates')
      .then(res => setTemplates(res.data))
      .catch(() => alert('Ошибка загрузки шаблонов'))
      .finally(() => setLoading(false));
  }, []);


  const handleDelete = async (id: number) => {
    if (!confirm('Удалить шаблон?')) return;
    try {
      await api.delete(`/card-templates/${id}`);
      setTemplates(templates.filter(t => t.id !== id));
    } catch {
      alert('Ошибка удаления');
    }
  };

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl text-primary-800">Шаблоны открыток</h1>
          <Link href="/dashboard/card-templates/create" className="bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded transition">
            Создать шаблон
          </Link>
        </div>

        {loading ? <p className="text-secondary-600">Загрузка...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(template => (
              <div key={template.id} className="bg-white p-4 rounded shadow">
                {template.backgroundImageUrl && template.backgroundImageUrl.trim() ? (
                  <SafeImage
                    src={template.backgroundImageUrl.trim()}
                    alt={template.name}
                    className="w-full h-64 object-cover rounded mb-4"
                    fallbackText="Фоновое изображение недоступно"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded mb-4 flex items-center justify-center">
                    <span className="text-gray-500">Без фонового изображения</span>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2 text-primary-800">{template.name}</h3>
                <p className="text-sm text-secondary-700 mb-2">Текст: {template.textTemplate}</p>
                <p className="text-sm text-secondary-700">Шрифт: {template.fontSize}px {template.fontColor}</p>
                <p className="text-sm text-secondary-700">Позиция: X:{template.textX} Y:{template.textY}</p>
                {template.department && <p className="text-sm text-secondary-700">Отдел: {template.department.name}</p>}
                {template.position && <p className="text-sm text-secondary-700">Должность: {template.position.name}</p>}
                <div className="mt-4 flex gap-2">
                  <Link href={`/dashboard/card-templates/${template.id}`} className="text-primary-600 hover:text-primary-700">
                    Редактировать
                  </Link>
                  <button onClick={() => handleDelete(template.id)} className="text-accent-600 hover:text-accent-700">
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}