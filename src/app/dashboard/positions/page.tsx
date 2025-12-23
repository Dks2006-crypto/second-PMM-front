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
  departmentId?: number;
  department?: { name: string } | null;
  employeeCount?: number;
}

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<{id: number, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPositionName, setNewPositionName] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | ''>('');
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
      const [positionsRes, departmentsRes] = await Promise.all([
        profileApi.getPositionsWithDepartments(),
        profileApi.getDepartments()
      ]);
      
      // Обрабатываем данные должностей, извлекая информацию об отделах
      const processedPositions = positionsRes.data.map((position: any) => {
        // Находим первый отдел из сотрудников на этой должности
        const department = position.employees?.[0]?.department;
        return {
          id: position.id,
          name: position.name,
          departmentId: department?.id,
          department: department ? { name: department.name } : null,
        };
      });
      
      setPositions(processedPositions);
      setDepartments(departmentsRes.data);
    } catch (error) {
      alert('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPositionName.trim()) return;

    const positionData = {
      name: newPositionName.trim(),
      departmentId: selectedDepartmentId ? Number(selectedDepartmentId) : undefined
    };
    
    console.log('Создаем должность с данными:', positionData);

    setSaving(true);
    try {
      await profileApi.createPosition(
        positionData.name, 
        positionData.departmentId
      );
      setNewPositionName('');
      setSelectedDepartmentId('');
      setShowAddForm(false);
      await loadPositions();
      alert('Должность успешно создана');
    } catch (error: any) {
      console.error('Ошибка при создании должности:', error);
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
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Отдел (опционально)
              </label>
              <select
                value={selectedDepartmentId}
                onChange={(e) => setSelectedDepartmentId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                disabled={saving}
              >
                <option value="">Выберите отдел</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {selectedDepartmentId && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    ✓ Отдел будет назначен: <strong>{departments.find(d => d.id === selectedDepartmentId)?.name}</strong>
                  </p>
                </div>
              )}
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
                  setSelectedDepartmentId('');
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
              key: 'department',
              header: 'Отдел',
              mobileLabel: 'Отдел',
              render: (pos) => (
                <div className="text-black">
                  {pos.department?.name ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                      {pos.department.name}
                    </div>
                  ) : (
                    <span className="text-gray-400">Не привязана</span>
                  )}
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