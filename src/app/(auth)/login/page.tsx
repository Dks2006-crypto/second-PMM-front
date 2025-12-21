'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/login', data);
      localStorage.setItem('access_token', res.data.access_token);
      router.push('/dashboard');
    } catch (err) {
      alert('Неверный логин или пароль');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl mb-6 text-primary-800">Вход в систему</h1>
        <input {...register('email')} placeholder="Email" className="w-full p-2 border mb-4" />
        {errors.email && <p className="text-accent-600">Неверный email</p>}
        <input {...register('password')} type="password" placeholder="Пароль" className="w-full p-2 border mb-4" />
        <button type="submit" className="w-full bg-primary-700 hover:bg-primary-800 text-white py-2 rounded transition">
          Войти
        </button>
      </form>
    </div>
  );
}