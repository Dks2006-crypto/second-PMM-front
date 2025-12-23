import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  withCredentials: true, // ИЗМЕНЕНО: было false
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API для работы с профилем
export const profileApi = {
  // Получение профиля
  getProfile: () => api.get('/employees/me/profile'),

  // Обновление профиля
  updateProfile: (data: {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    photoUrl?: string;
    receiveEmail?: boolean;
    receiveInApp?: boolean;
    reminderDaysBefore?: number;
    sendTime?: string;
    showBirthdayPublic?: boolean;
    allowCardPersonalization?: boolean;
    currentPassword?: string;
    newPassword?: string;
  }) => api.patch('/employees/me/profile', data),

  // Получение настроек уведомлений
  getNotificationSettings: () => api.get('/employees/me/notification-settings'),

  // Обновление настроек уведомлений
  updateNotificationSettings: (receiveEmail: boolean) =>
    api.patch('/employees/me/notification-settings', { receiveEmail }),

  // Смена пароля
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/employees/me/change-password', { currentPassword, newPassword }),

  // Загрузка фото профиля
  uploadPhoto: (photoFile: File) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    return api.post('/employees/me/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Удаление фото профиля
  deletePhoto: () => api.delete('/employees/me/photo'),

  // Создание пользователя и сотрудника вместе (только HR)
  createUserAndEmployee: (data: {
    email: string;
    password: string;
    role: 'employee' | 'hr';
    firstName: string;
    lastName: string;
    birthDate: string;
    photoUrl?: string;
    departmentId?: number;
    positionId?: number;
  }) => api.post('/employees/create-with-user', data),

  // Получение отделов
  getDepartments: () => api.get('/departments'),

  // Создание отдела (только HR)
  createDepartment: (name: string) => api.post('/departments', { name }),

  // Обновление отдела (только HR)
  updateDepartment: (id: number, name: string) => api.patch(`/departments/${id}`, { name }),

  // Удаление отдела (только HR)
  deleteDepartment: (id: number) => api.delete(`/departments/${id}`),

  // Получение должностей
  getPositions: () => api.get('/positions'),
};

export default api;