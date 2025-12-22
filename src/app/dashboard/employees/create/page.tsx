'use client';

import { useEffect, useState } from 'react';
import { profileApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { getRole } from '@/lib/auth';

interface Department {
  id: number;
  name: string;
}

interface Position {
  id: number;
  name: string;
}

export default function CreateEmployeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    // Данные пользователя
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee' as 'employee' | 'hr',
    
    // Данные сотрудника
    firstName: '',
    lastName: '',
    birthDate: '',
    photoUrl: '',
    departmentId: '',
    positionId: '',
  });

  useEffect(() => {
    // Проверяем роль пользователя
    if (!getRole()) {
      router.push('/login');
      return;
    }

    if (getRole() !== 'hr') {
      router.push('/dashboard');
      return;
    }

    // Загружаем отделы и должности
    loadDepartments();
    loadPositions();
  }, [router]);

  const loadDepartments = async () => {
    try {
      const response = await profileApi.getDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error('Ошибка загрузки отделов:', error);
    }
  };

  const loadPositions = async () => {
    try {
      const response = await profileApi.getPositions();
      setPositions(response.data);
    } catch (error) {
      console.error('Ошибка загрузки должностей:', error);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    if (formData.password !== formData.confirmPassword) {
      showMessage('error', 'Пароли не совпадают');
      return;
    }

    if (formData.password.length < 6) {
      showMessage('error', 'Пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        photoUrl: formData.photoUrl || undefined,
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : undefined,
        positionId: formData.positionId ? parseInt(formData.positionId) : undefined,
      };

      await profileApi.createUserAndEmployee(submitData);
      
      showMessage('success', 'Пользователь и сотрудник успешно созданы!');
      
      // Переходим к списку сотрудников через 2 секунды
      setTimeout(() => {
        router.push('/dashboard/employees');
      }, 2000);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка создания пользователя';
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl text-primary-800">Создание нового сотрудника</h1>
        <p className="text-secondary-600 mt-2">Создание пользователя в системе и профиля сотрудника</p>
      </div>

      {/* Сообщения */}
      {message && (
        <div className={`p-4 rounded mb-6 ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Информация о пользователе */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-primary-700">Информация о пользователе</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                placeholder="user@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Пароль <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                minLength={6}
                placeholder="Минимум 6 символов"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Подтвердите пароль <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                minLength={6}
                placeholder="Повторите пароль"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Роль <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="employee">Сотрудник</option>
                <option value="hr">HR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Информация о сотруднике */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-primary-700">Информация о сотруднике</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Имя <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                placeholder="Иван"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Фамилия <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                placeholder="Петров"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Дата рождения <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Фото профиля (URL)
              </label>
              <input
                type="url"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Отдел</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Выберите отдел</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Должность</label>
              <select
                name="positionId"
                value={formData.positionId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Выберите должность</option>
                {positions.map(pos => (
                  <option key={pos.id} value={pos.id}>
                    {pos.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Создание...' : 'Создать пользователя'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/dashboard/employees')}
            className="bg-secondary-600 text-white px-6 py-2 rounded hover:bg-secondary-700"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}