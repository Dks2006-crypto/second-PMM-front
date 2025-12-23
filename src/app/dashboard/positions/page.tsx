'use client';

import { useEffect, useState } from 'react';
import { profileApi } from '@/lib/api';
import { getRole } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
import { Button } from '@/components/ui/Button';

interface Position {
  id: number;
  name: string;
  employeeCount?: number;
}

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPositionName, setNewPositionName] = useState('');
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!getRole()) {
      router.push('/login');
      return;
    }
    if (getRole() !== 'hr') {
      alert('У вас нет прав доступа к этой странице');
      router.push('/dashboard');
      return;
    }
    loadPositions();
  }, [router]);

  const loadPositions = async () => {
    try {
      const response = await profileApi.getPositions();
      setPositions(response.data);
    } catch (error) {
      alert('Ошибка загрузки должностей');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPositionName.trim()) return;

    setSaving(true);
    try {
      await profileApi.createPosition(newPositionName.trim());
      setNewPositionName('');
      setShowAddForm(false);
      await loadPositions();
      alert('Должность успешно создана');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка создания должности');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePosition = async (id: number, name: string) => {
    if (!confirm(`Вы уверены, что хотите удалить должность "${name}"?`)) {
      return;
    }

    try {
      await profileApi.deletePosition(id);
      await loadPositions();
      alert('Должность успешно удалена');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка удаления должности');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl md:text-3xl text-black">Должности</h1>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          variant="primary"
          className="w-full sm:w-auto"
        >
          {showAddForm ? 'Отменить' : 'Добавить должность'}
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-soft mb-6">
          <h2 className="text-lg font-semibold text-black mb-4">Новая должность</h2>
          <form onSubmit={handleAddPosition} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Название должности
              </label>
              <input
                type="text"
                value={newPositionName}
                onChange={(e) => setNewPositionName(e.target.value)}
                placeholder="Введите название должности"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                disabled={saving}
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                type="submit" 
                disabled={saving || !newPositionName.trim()}
                variant="primary"
                className="w-full sm:w-auto"
              >
                {saving ? 'Сохранение...' : 'Создать должность'}
              </Button>
              <Button 
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewPositionName('');
                }}
                variant="outline"
                className="w-full sm:w-auto"
                disabled={saving}
              >
                Отменить
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-black">Загрузка...</p>
      ) : positions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-black text-lg mb-4">Список должностей пуст</p>
          <p className="text-gray-600">Добавьте первую должность, нажав кнопку выше</p>
        </div>
      ) : (
        <ResponsiveTable
          data={positions}
          columns={[
            {
              key: 'name',
              header: 'Название должности',
              mobileLabel: 'Название',
              render: (pos) => (
                <div className="text-black font-medium">
                  {pos.name}
                </div>
              )
            },
            {
              key: 'actions',
              header: 'Действия',
              mobileLabel: 'Действия',
              render: (pos) => (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleDeletePosition(pos.id, pos.name)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Удалить
                  </button>
                </div>
              )
            }
          ]}
          emptyMessage="Список должностей пуст"
        />
      )}
    </div>
  );
}