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
  const { register, handleSubmit, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  
    useEffect(() => {
      const role = getRole();
      if (role !== 'hr') {
        router.push('/dashboard'); // или /login
      }
    }, [router]);

  useEffect(() => {
    api.get('/mailing-settings')
      .then(res => {
        const data = res.data;
        setValue('sendTime', data.sendTime);
        setValue('smtpHost', data.smtpHost);
        setValue('smtpPort', data.smtpPort);
        setValue('smtpUser', data.smtpUser);
        setValue('smtpPass', data.smtpPass);
        setValue('fromEmail', data.fromEmail);
        setValue('retryAttempts', data.retryAttempts);
      });
  }, [setValue]);

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
        <h1 className="text-3xl mb-6 text-primary-800">Настройки рассылки</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow space-y-4">
          <input {...register('sendTime')} placeholder="Время отправки (HH:MM)" className="w-full p-2 border" />
          <input {...register('smtpHost')} placeholder="SMTP Host" className="w-full p-2 border" />
          <input {...register('smtpPort', { valueAsNumber: true })} type="number" placeholder="SMTP Port" className="w-full p-2 border" />
          <input {...register('smtpUser')} placeholder="SMTP User" className="w-full p-2 border" />
          <input {...register('smtpPass')} type="password" placeholder="SMTP Password" className="w-full p-2 border" />
          <input {...register('fromEmail')} placeholder="From Email" className="w-full p-2 border" />
          <input {...register('retryAttempts', { valueAsNumber: true })} type="number" placeholder="Повторные попытки" className="w-full p-2 border" />

          <button type="submit" className="w-full bg-primary-700 hover:bg-primary-800 text-white py-2 rounded transition">
            Сохранить настройки
          </button>
        </form>
      </div>
  );
}