'use client';

import { useEffect, useState } from 'react';
import { profileApi } from '@/lib/api';
import { getRole } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
import { Button } from '@/components/ui/Button';

interface Department {
  id: number;
  name: string;
  employeeCount?: number;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const response = await profileApi.getDepartments();
      setDepartments(response.data);
    } catch (error) {
      alert('Ошибка загрузки отделов');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepartmentName.trim()) return;

    setSaving(true);
    try {
      await profileApi.createDepartment(newDepartmentName.trim());
      setNewDepartmentName('');
      setShowAddForm(false);
      await loadDepartments();
      alert('Отдел успешно создан');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка создания отдела');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDepartment = async (id: number, name: string) => {
    if (!confirm(`Вы уверены, что хотите удалить отдел "${name}"?`)) {
      return;
    }

    try {
      await profileApi.deleteDepartment(id);
      await loadDepartments();
      alert('Отдел успешно удален');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка удаления отдела');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl md:text-3xl text-black">Отделы</h1>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          variant="primary"
          className="w-full sm:w-auto"
        >
          {showAddForm ? 'Отменить' : 'Добавить отдел'}
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-soft mb-6">
          <h2 className="text-lg font-semibold text-black mb-4">Новый отдел</h2>
          <form onSubmit={handleAddDepartment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Название отдела
              </label>
              <input
                type="text"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                placeholder="Введите название отдела"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                disabled={saving}
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                type="submit" 
                disabled={saving || !newDepartmentName.trim()}
                variant="primary"
                className="w-full sm:w-auto"
              >
                {saving ? 'Сохранение...' : 'Создать отдел'}
              </Button>
              <Button 
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewDepartmentName('');
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
      ) : departments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-black text-lg mb-4">Список отделов пуст</p>
          <p className="text-gray-600">Добавьте первый отдел, нажав кнопку выше</p>
        </div>
      ) : (
        <ResponsiveTable
          data={departments}
          columns={[
            {
              key: 'name',
              header: 'Название отдела',
              mobileLabel: 'Название',
              render: (dept) => (
                <div className="text-black font-medium">
                  {dept.name}
                </div>
              )
            },
            {
              key: 'actions',
              header: 'Действия',
              mobileLabel: 'Действия',
              render: (dept) => (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Удалить
                  </button>
                </div>
              )
            }
          ]}
          emptyMessage="Список отделов пуст"
        />
      )}
    </div>
  );
}