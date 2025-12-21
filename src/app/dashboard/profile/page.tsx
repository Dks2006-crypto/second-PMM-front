'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { getRole } from '@/lib/auth';

interface EmployeeProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  photoUrl?: string;
  department?: { name: string } | null;
  position?: { name: string } | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/employees/me/profile')
      .then(res => setProfile(res.data))
      .catch(err => {
        if (err.response?.status === 404) {
          setError('Профиль сотрудника не найден. Обратитесь к HR для привязки аккаунта.');
        } else {
          setError('Ошибка загрузки профиля');
        }
      })
      .finally(() => setLoading(false));
  }, []);



  if (loading) return <p className="text-center text-secondary-600">Загрузка...</p>;
  if (error) return <p className="text-center text-accent-600">{error}</p>;
  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl mb-6 text-primary-800">Мой профиль</h1>
      <div className="bg-white p-8 rounded-lg shadow">
        {profile.photoUrl ? (
          <img src={profile.photoUrl} alt="Фото" className="w-32 h-32 rounded-full mb-6 mx-auto" />
        ) : (
          <div className="w-32 h-32 bg-secondary-300 rounded-full mb-6 mx-auto flex items-center justify-center text-4xl font-bold text-secondary-700">
            {profile.firstName[0]}{profile.lastName[0]}
          </div>
        )}
        <div className="text-center">
          <p className="text-2xl font-bold mb-2 text-primary-800">{profile.firstName} {profile.lastName}</p>
          <p className="text-secondary-700 mb-4">{profile.email}</p>
          <p className="text-lg text-secondary-700">Дата рождения: {format(new Date(profile.birthDate), 'dd.MM.yyyy')}</p>
          <p className="text-lg mt-2 text-secondary-700">Отдел: {profile.department?.name || 'Не указан'}</p>
          <p className="text-lg text-secondary-700">Должность: {profile.position?.name || 'Не указана'}</p>
        </div>
      </div>
    </div>
  );
}