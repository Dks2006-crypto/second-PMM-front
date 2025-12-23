'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { getRole } from '@/lib/auth';

const schema = z.object({
  sendTime: z.string(),
  smtpHost: z.string(),
  smtpPort: z.number(),
  smtpUser: z.string(),
  smtpPass: z.string(),
  fromEmail: z.string().email(),
  retryAttempts: z.number(),
});

type FormData = z.infer<typeof schema>;

export default function SettingsPage() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const userRole = getRole();

  useEffect(() => {
    if (userRole !== 'hr') {
      router.push('/dashboard');
      return;
    }
    api.get('/mailing-settings')
      .then(res => {
        const data = res.data;
        setValue('sendTime', data.sendTime || '09:00');
        setValue('smtpHost', data.smtpHost || '');
        setValue('smtpPort', data.smtpPort || 587);
        setValue('smtpUser', data.smtpUser || '');
        setValue('smtpPass', data.smtpPass || '');
        setValue('fromEmail', data.fromEmail || '');
        setValue('retryAttempts', data.retryAttempts || 3);
      });
  }, [userRole, router, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await api.patch('/mailing-settings', data);
      alert('Настройки сохранены');
    } catch {
      alert('Ошибка сохранения');
    }
  };

  return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl mb-6 text-black">Настройки рассылки</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-soft space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-primary-700">Время отправки</label>
            <input {...register('sendTime')} placeholder="09:00" className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-primary-700">SMTP Host</label>
            <input {...register('smtpHost')} placeholder="smtp.gmail.com" className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-primary-700">SMTP Port</label>
            <input {...register('smtpPort', { valueAsNumber: true })} type="number" placeholder="587" className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-primary-700">SMTP User</label>
            <input {...register('smtpUser')} placeholder="user@example.com" className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-primary-700">SMTP Password</label>
            <input {...register('smtpPass')} type="password" placeholder="••••••••" className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-primary-700">Отправитель (From Email)</label>
            <input {...register('fromEmail')} placeholder="noreply@company.com" className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-primary-700">Количество попыток повторной отправки</label>
            <input {...register('retryAttempts', { valueAsNumber: true })} type="number" placeholder="3" className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black" />
          </div>
          <button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-4 rounded-xl transition-colors font-medium">
            Сохранить настройки
          </button>
        </form>
      </div>
  );
}