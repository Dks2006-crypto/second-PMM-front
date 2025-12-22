// Демонстрационный файл для Table компонента
// Показывает различные варианты использования с мобильной адаптивностью

'use client';

import React, { useState } from 'react';
import {
  ResponsiveTable,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
  TableFooter,
  TableEmptyState,
  type TableSize,
  type TableVariant,
} from './Table';

// Пример данных
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  created: string;
}

const sampleUsers: User[] = [
  {
    id: 1,
    name: 'Иван Петров',
    email: 'ivan@example.com',
    role: 'Администратор',
    status: 'active',
    created: '2023-01-15',
  },
  {
    id: 2,
    name: 'Мария Сидорова',
    email: 'maria@example.com',
    role: 'Менеджер',
    status: 'active',
    created: '2023-02-20',
  },
  {
    id: 3,
    name: 'Алексей Козлов',
    email: 'alex@example.com',
    role: 'Пользователь',
    status: 'inactive',
    created: '2023-03-10',
  },
];

const TableDemo: React.FC = () => {
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>(sampleUsers);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortField as keyof User];
    const bValue = b[sortField as keyof User];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleToggleUser = (userId: number) => {
    setUsers(users => 
      users.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      )
    );
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Демонстрация Table компонента
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Автоматически адаптируется под мобильные устройства
        </p>
      </div>

      {/* 1. Базовая таблица с сортировкой */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Базовая таблица с сортировкой</h2>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <ResponsiveTable
            variant="default"
            size="md"
            aria-label="Пользователи"
          >
            <TableHeader>
              <TableRow>
                <TableHeaderCell
                  sortable
                  sortDirection={sortField === 'name' ? sortDirection : null}
                  onSort={() => handleSort('name')}
                >
                  Имя
                </TableHeaderCell>
                <TableHeaderCell
                  sortable
                  sortDirection={sortField === 'email' ? sortDirection : null}
                  onSort={() => handleSort('email')}
                >
                  Email
                </TableHeaderCell>
                <TableHeaderCell
                  sortable
                  sortDirection={sortField === 'role' ? sortDirection : null}
                  onSort={() => handleSort('role')}
                >
                  Роль
                </TableHeaderCell>
                <TableHeaderCell>Статус</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {user.status === 'active' ? 'Активен' : 'Неактивен'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </ResponsiveTable>
        </div>
      </section>

      {/* 2. Таблица с expand/collapse */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Таблица с раскрывающимися строками</h2>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <ResponsiveTable
            variant="striped"
            size="md"
            aria-label="Пользователи с подробной информацией"
          >
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Имя</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Роль</TableHeaderCell>
                <TableHeaderCell>Действия</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  rowId={user.id}
                  expandable
                  expandedContent={
                    <div className="space-y-2">
                      <div><strong>ID:</strong> {user.id}</div>
                      <div><strong>Дата создания:</strong> {user.created}</div>
                      <div><strong>Полная информация:</strong> Это дополнительная информация, которая отображается при раскрытии строки.</div>
                    </div>
                  }
                >
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleUser(user.id);
                      }}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      {user.status === 'active' ? 'Деактивировать' : 'Активировать'}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </ResponsiveTable>
        </div>
      </section>

      {/* 3. Loading состояние */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Loading состояние</h2>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <ResponsiveTable
            loading
            loadingRows={3}
            size="sm"
            aria-label="Загрузка данных"
          />
          <div className="mt-4">
            <button
              onClick={() => setLoading(!loading)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? 'Скрыть загрузку' : 'Показать загрузку'}
            </button>
          </div>
        </div>
      </section>

      {/* 4. Empty state */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Empty state</h2>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <ResponsiveTable
            isEmpty
            emptyState={
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Пользователи не найдены
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Попробуйте изменить фильтры поиска
                </p>
              </div>
            }
            aria-label="Пустая таблица"
          />
        </div>
      </section>

      {/* 5. Разные размеры */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. Разные размеры</h2>
        <div className="space-y-4">
          {(['sm', 'md', 'lg'] as TableSize[]).map((size) => (
            <div key={size} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Размер: {size}</h3>
              <ResponsiveTable
                size={size}
                variant="bordered"
                aria-label={`Таблица размера ${size}`}
              >
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Заголовок 1</TableHeaderCell>
                    <TableHeaderCell>Заголовок 2</TableHeaderCell>
                    <TableHeaderCell>Заголовок 3</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Данные 1-{size}</TableCell>
                    <TableCell>Данные 2-{size}</TableCell>
                    <TableCell>Данные 3-{size}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Данные 4-{size}</TableCell>
                    <TableCell>Данные 5-{size}</TableCell>
                    <TableCell>Данные 6-{size}</TableCell>
                  </TableRow>
                </TableBody>
              </ResponsiveTable>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Sticky header */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">6. Липкий заголовок</h2>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-96 overflow-auto">
          <ResponsiveTable
            stickyHeader
            aria-label="Таблица с липким заголовком"
          >
            <TableHeader>
              <TableRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Название</TableHeaderCell>
                <TableHeaderCell>Статус</TableHeaderCell>
                <TableHeaderCell>Дата</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 20 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>Элемент {i + 1}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">
                      Активен
                    </span>
                  </TableCell>
                  <TableCell>2023-{String(Math.floor(i / 12) + 1).padStart(2, '0')}-{String((i % 12) + 1).padStart(2, '0')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </ResponsiveTable>
        </div>
      </section>

      {/* 7. С подвалом таблицы */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">7. Таблица с подвалом</h2>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <ResponsiveTable
            variant="compact"
            aria-label="Таблица с подвалом"
          >
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Продукт</TableHeaderCell>
                <TableHeaderCell align="right">Цена</TableHeaderCell>
                <TableHeaderCell align="right">Количество</TableHeaderCell>
                <TableHeaderCell align="right">Сумма</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Товар 1</TableCell>
                <TableCell align="right">1,000 ₽</TableCell>
                <TableCell align="right">2</TableCell>
                <TableCell align="right">2,000 ₽</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Товар 2</TableCell>
                <TableCell align="right">500 ₽</TableCell>
                <TableCell align="right">3</TableCell>
                <TableCell align="right">1,500 ₽</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Товар 3</TableCell>
                <TableCell align="right">750 ₽</TableCell>
                <TableCell align="right">1</TableCell>
                <TableCell align="right">750 ₽</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-bold">Итого:</TableCell>
                <TableCell></TableCell>
                <TableCell className="font-bold text-right">6 шт.</TableCell>
                <TableCell className="font-bold text-right">4,250 ₽</TableCell>
              </TableRow>
            </TableFooter>
          </ResponsiveTable>
        </div>
      </section>
    </div>
  );
};

export default TableDemo;
