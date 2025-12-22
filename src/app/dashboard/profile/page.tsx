'use client';

import { useEffect, useState } from 'react';
import api, { profileApi } from '@/lib/api';
import { format } from 'date-fns';
import { getRole } from '@/lib/auth';
import SafeImage from '@/components/SafeImage';

interface EmployeeProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  photoUrl?: string;
  department?: { name: string } | null;
  position?: { name: string } | null;
  preferences?: { receiveEmail: boolean } | null;
  BirthdayCardHistory?: Array<{
    id: number;
    sentAt: string;
    template: { name: string };
    imageUrl: string;
    success: boolean;
  }>;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Формы
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    receiveEmail: true,
    receiveInApp: true,
    showBirthdayPublic: true,
    allowCardPersonalization: true,
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setUserRole(getRole());
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await profileApi.getProfile();
      const data = response.data;
      setProfile(data);
      
      // Заполняем формы данными
      setProfileForm({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
      });

      setNotificationSettings({
        receiveEmail: data.preferences?.receiveEmail ?? true,
        receiveInApp: data.preferences?.receiveInApp ?? true,
        showBirthdayPublic: data.preferences?.showBirthdayPublic ?? true,
        allowCardPersonalization: data.preferences?.allowCardPersonalization ?? true,
      });

      setError(null);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Профиль сотрудника не найден. Для HR это нормально — профиль не обязателен.');
      } else {
        setError('Ошибка загрузки профиля');
      }
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      const updateData: any = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
      };
      
      // Только HR может изменять дату рождения
      if (userRole === 'hr') {
        updateData.birthDate = profileForm.birthDate;
      }

      await profileApi.updateProfile(updateData);
      await loadProfile();
      setEditing(false);
      showMessage('success', 'Профиль успешно обновлен');
    } catch (err: any) {
      showMessage('error', err.response?.data?.message || 'Ошибка обновления профиля');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'Новые пароли не совпадают');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage('error', 'Новый пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      setSaving(true);
      await profileApi.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('success', 'Пароль успешно изменен');
    } catch (err: any) {
      showMessage('error', err.response?.data?.message || 'Ошибка смены пароля');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationUpdate = async (settings: any) => {
    try {
      await profileApi.updateProfile(settings);
      setNotificationSettings(prev => ({ ...prev, ...settings }));
      showMessage('success', 'Настройки предпочтений обновлены');
    } catch (err: any) {
      showMessage('error', err.response?.data?.message || 'Ошибка обновления настроек');
    }
  };

  const handleNotificationToggle = async (field: string, value: any) => {
    try {
      await profileApi.updateProfile({ [field]: value });
      setNotificationSettings(prev => ({ ...prev, [field]: value }));
      showMessage('success', 'Настройка обновлена');
    } catch (err: any) {
      showMessage('error', err.response?.data?.message || 'Ошибка обновления настройки');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Пожалуйста, выберите файл изображения');
      return;
    }

    // Проверяем размер файла (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Размер файла не должен превышать 5MB');
      return;
    }

    try {
      setUploadingPhoto(true);
      const response = await profileApi.uploadPhoto(file);
      await loadProfile(); // Обновляем данные профиля
      showMessage('success', 'Фото успешно загружено');
    } catch (err: any) {
      showMessage('error', err.response?.data?.message || 'Ошибка загрузки фото');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!confirm('Вы уверены, что хотите удалить фото профиля?')) return;

    try {
      setUploadingPhoto(true);
      await profileApi.deletePhoto();
      await loadProfile(); // Обновляем данные профиля
      showMessage('success', 'Фото удалено');
    } catch (err: any) {
      showMessage('error', err.response?.data?.message || 'Ошибка удаления фото');
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) return <p className="text-center">Загрузка...</p>;
  if (error) return <p className="text-center text-orange-600">{error}</p>;
  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 px-2 md:px-0">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl md:text-3xl mb-4 md:mb-6 text-neutral-800">Мой профиль</h1>
        
        {/* Сообщения */}
        {message && (
          <div className={`p-3 md:p-4 rounded mb-4 ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <p className="text-sm md:text-base">{message.text}</p>
          </div>
        )}
      </div>

      {/* Основная информация */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-800">Основная информация</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="bg-primary-600 text-white px-3 py-2 md:px-4 md:py-2 rounded hover:bg-primary-700 transition-colors w-full sm:w-auto text-sm md:text-base"
            >
              Редактировать
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-700">Имя</label>
                <input
                  type="text"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full p-2 md:p-3 border border-gray-300 rounded text-black text-sm md:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-700">Фамилия</label>
                <input
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full p-2 md:p-3 border border-gray-300 rounded text-black text-sm md:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-primary-700">
                  Дата рождения
                  {userRole !== 'hr' && (
                    <span className="text-neutral-500 text-xs ml-2">(только для HR)</span>
                  )}
                </label>
                <input
                  type="date"
                  value={profileForm.birthDate}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, birthDate: e.target.value }))}
                  className={`w-full p-2 md:p-3 border border-gray-300 rounded text-black text-sm md:text-base ${
                    userRole !== 'hr' ? 'bg-secondary-50 cursor-not-allowed' : ''
                  }`}
                  required={userRole === 'hr'}
                  disabled={userRole !== 'hr'}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition-colors w-full sm:w-auto text-sm md:text-base"
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setProfileForm({
                    firstName: profile.firstName || '',
                    lastName: profile.lastName || '',
                    birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
                  });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors w-full sm:w-auto text-sm md:text-base"
              >
                Отмена
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
              {profile.photoUrl && profile.photoUrl.trim() ? (
                <div className="relative">
                  <img
                    src={profile.photoUrl.trim()}
                    alt="Фото"
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 flex space-x-1">
                    <button
                      onClick={() => document.getElementById('photo-upload')?.click()}
                      className="bg-blue-600 text-white p-1.5 md:p-2 rounded-full hover:bg-blue-700 transition-colors"
                      disabled={uploadingPhoto}
                      title="Изменить фото"
                    >
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={handleDeletePhoto}
                      className="bg-red-600 text-white p-1 rounded-full text-xs hover:bg-red-700"
                      disabled={uploadingPhoto}
                      title="Удалить фото"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-300 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold text-gray-600">
                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                  </div>
                  <button
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    className="absolute -bottom-2 -right-2 bg-green-600 text-white p-1.5 md:p-2 rounded-full hover:bg-green-700 transition-colors"
                    disabled={uploadingPhoto}
                    title="Загрузить фото"
                  >
                    {uploadingPhoto ? (
                      <svg className="w-3 h-3 md:w-4 md:h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                    )}
                  </button>
                </div>
              )}
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="text-center sm:text-left">
                <h3 className="text-lg md:text-xl font-semibold text-primary-900">{profile.firstName} {profile.lastName}</h3>
                <p className="text-sm md:text-base text-primary-700">{profile.email}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm md:text-base text-primary-900"><strong>Дата рождения:</strong> {format(new Date(profile.birthDate), 'dd.MM.yyyy')}</p>
              <p className="text-sm md:text-base text-primary-900"><strong>Отдел:</strong> {profile.department?.name || 'Не указан'}</p>
              <p className="text-sm md:text-base text-primary-900"><strong>Должность:</strong> {profile.position?.name || 'Не указана'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Настройки предпочтений получения поздравлений */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">Настройки предпочтений получения поздравлений</h2>
        
        <div className="space-y-6">
          {/* Каналы уведомлений */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-neutral-700">Каналы уведомлений</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-700">Email-уведомления</p>
                  <p className="text-sm text-neutral-600">Получать уведомления о предстоящих днях рождения коллег</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.receiveEmail}
                    onChange={(e) => handleNotificationToggle('receiveEmail', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-700">Уведомления в приложении</p>
                  <p className="text-sm text-neutral-600">Получать уведомления в веб-интерфейсе системы</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.receiveInApp}
                    onChange={(e) => handleNotificationToggle('receiveInApp', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Настройки приватности */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-neutral-700">Настройки приватности</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-700">Показывать день рождения публично</p>
                  <p className="text-sm text-neutral-600">Разрешить коллегам видеть ваш день рождения в списке</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.showBirthdayPublic}
                    onChange={(e) => handleNotificationToggle('showBirthdayPublic', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-700">Разрешить персонализацию открыток</p>
                  <p className="text-sm text-neutral-600">Позволить коллегам добавлять персональные сообщения к поздравлениям</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.allowCardPersonalization}
                    onChange={(e) => handleNotificationToggle('allowCardPersonalization', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Смена пароля */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Смена пароля</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-700">Текущий пароль</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700">Новый пароль</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full p-2 border rounded text-black"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700">Подтвердите пароль</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full p-2 border rounded text-black"
                required
                minLength={6}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword}
            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? 'Изменение...' : 'Изменить пароль'}
          </button>
        </form>
      </div>

      {/* История поздравлений */}
      {profile.BirthdayCardHistory && profile.BirthdayCardHistory.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Последние поздравления</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.BirthdayCardHistory.slice(0, 6).map((card) => (
              <div key={card.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-secondary-100 flex items-center justify-center">
                  {card.imageUrl && card.imageUrl.trim() ? (
                    <SafeImage
                      src={card.imageUrl.trim()}
                      alt={`Открытка: ${card.template.name}`}
                      className="max-w-full max-h-full object-contain"
                      fallbackText="Открытка недоступна"
                    />
                  ) : (
                    <div className="text-secondary-500 text-center p-4">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm">Открытка недоступна</p>
                    </div>
                  )}
                </div>
                  <div className="p-3">
                    <p className="font-medium text-sm">{card.template.name}</p>
                    <p className="text-xs text-primary-600">
                      {format(new Date(card.sentAt), 'dd.MM.yyyy HH:mm')}
                    </p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        card.success 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {card.success ? '✅ Отправлено' : '❌ Ошибка'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          {profile.BirthdayCardHistory.length > 6 && (
            <div className="mt-4 text-center">
              <p className="text-secondary-600 text-sm">
                Показано 6 из {profile.BirthdayCardHistory.length} поздравлений
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}