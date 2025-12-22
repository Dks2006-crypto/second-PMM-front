# Responsive Table Component

Полностью адаптивный компонент таблицы для проекта BirthdayFlow с автоматическим переключением между desktop и mobile режимами.

## Особенности

- ✅ **Автоматическая мобильная адаптивность** - переключение между таблицей и карточным видом
- ✅ **Collapsible строки** - expand/collapse функциональность на мобильных
- ✅ **Touch-friendly** интерактивные элементы
- ✅ **Loading состояния** с skeleton анимациями
- ✅ **Empty state** компонент
- ✅ **Accessibility** - ARIA labels, keyboard navigation
- ✅ **Сортировка** заголовков с визуальными индикаторами
- ✅ **Sticky header** для больших таблиц
- ✅ **Горизонтальная прокрутка** для широких таблиц
- ✅ **Dark mode** поддержка

## Установка

Компонент уже интегрирован в проект и находится по пути:
```typescript
import {
  ResponsiveTable,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
  TableFooter,
  TableEmptyState,
} from '@/components/ui/Table';
```

## Базовое использование

```tsx
import { 
  ResponsiveTable, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableCell 
} from '@/components/ui/Table';

const BasicTable = () => (
  <ResponsiveTable aria-label="Пользователи">
    <TableHeader>
      <TableRow>
        <TableHeaderCell>Имя</TableHeaderCell>
        <TableHeaderCell>Email</TableHeaderCell>
        <TableHeaderCell>Роль</TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Иван Петров</TableCell>
        <TableCell>ivan@example.com</TableCell>
        <TableCell>Администратор</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Мария Сидорова</TableCell>
        <TableCell>maria@example.com</TableCell>
        <TableCell>Менеджер</TableCell>
      </TableRow>
    </TableBody>
  </ResponsiveTable>
);
```

## Расширенные возможности

### Сортировка

```tsx
const SortableTable = () => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <ResponsiveTable>
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Данные */}
      </TableBody>
    </ResponsiveTable>
  );
};
```

### Expandable строки

```tsx
<ResponsiveTable>
  <TableHeader>
    <TableRow>
      <TableHeaderCell>Имя</TableHeaderCell>
      <TableHeaderCell>Email</TableHeaderCell>
      <TableHeaderCell>Действия</TableHeaderCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow
      rowId="user-1"
      expandable
      expandedContent={
        <div className="space-y-2">
          <div><strong>ID:</strong> 1</div>
          <div><strong>Дата регистрации:</strong> 2023-01-15</div>
          <div><strong>Дополнительная информация:</strong> Подробности...</div>
        </div>
      }
    >
      <TableCell>Иван Петров</TableCell>
      <TableCell>ivan@example.com</TableCell>
      <TableCell>
        <button className="text-blue-600">Редактировать</button>
      </TableCell>
    </TableRow>
  </TableBody>
</ResponsiveTable>
```

### Loading состояние

```tsx
<ResponsiveTable 
  loading 
  loadingRows={5}
  aria-label="Загрузка пользователей"
/>
```

### Empty state

```tsx
<ResponsiveTable 
  isEmpty
  emptyState={
    <div className="text-center py-8">
      <h3>Пользователи не найдены</h3>
      <p>Попробуйте изменить фильтры поиска</p>
    </div>
  }
  aria-label="Пустая таблица"
/>
```

### Различные варианты и размеры

```tsx
// Варианты: 'default' | 'striped' | 'bordered' | 'compact'
// Размеры: 'sm' | 'md' | 'lg'

<ResponsiveTable 
  variant="striped" 
  size="lg"
  stickyHeader
  aria-label="Большая таблица"
>
  {/* Содержимое */}
</ResponsiveTable>
```

## API Reference

### ResponsiveTable

Основной компонент контейнера таблицы.

#### Props

| Пропс | Тип | По умолчанию | Описание |
|-------|-----|--------------|----------|
| `variant` | `'default' \| 'striped' \| 'bordered' \| 'compact'` | `'default'` | Вариант оформления |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Размер таблицы |
| `breakpoint` | `number` | `768` | Breakpoint для переключения мобильного режима (px) |
| `stickyHeader` | `boolean` | `false` | Липкий заголовок |
| `loading` | `boolean` | `false` | Показать skeleton загрузки |
| `loadingRows` | `number` | `5` | Количество строк skeleton |
| `emptyState` | `React.ReactNode` | - | Кастомный empty state |
| `isEmpty` | `boolean` | `false` | Показать empty state |
| `aria-label` | `string` | - | ARIA label для accessibility |

### TableRow

#### Props

| Пропс | Тип | По умолчанию | Описание |
|-------|-----|--------------|----------|
| `rowId` | `string \| number` | - | Уникальный ID строки для expand/collapse |
| `expandable` | `boolean` | `false` | Делает строку раскрывающейся |
| `expandedContent` | `React.ReactNode` | - | Контент для раскрытой строки |
| `isClickable` | `boolean` | `false` | Делает строку кликабельной |

### TableHeaderCell

#### Props

| Пропс | Тип | По умолчанию | Описание |
|-------|-----|--------------|----------|
| `sortable` | `boolean` | `false` | Делает заголовок сортируемым |
| `sortDirection` | `'asc' \| 'desc' \| null` | `null` | Направление сортировки |
| `onSort` | `() => void` | - | Функция сортировки |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Выравнивание |

### TableCell

#### Props

| Пропс | Тип | По умолчанию | Описание |
|-------|-----|--------------|----------|
| `mobileLabel` | `string` | - | Метка для мобильного отображения |
| `isHeader` | `boolean` | `false` | Ячейка является заголовком |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Выравнивание |
| `truncate` | `boolean` | `false` | Обрезать длинный текст |

## Мобильная адаптивность

### Desktop (>= 768px)
- Обычная табличная структура с заголовками
- Expand/collapse через кнопку в первой колонке
- Горизонтальная прокрутка при необходимости

### Mobile (< 768px)
- Карточный вид с информацией в виде label-value пар
- Touch-friendly expand/collapse кнопки
- Оптимизированные отступы для touch интерфейса
- Автоматические метки для ячеек на основе заголовков

## Accessibility

- ✅ ARIA labels для screen readers
- ✅ Keyboard navigation поддержка
- ✅ Focus management
- ✅ Semantic HTML структура
- ✅ Color contrast соответствие WCAG

## Темизация

Компонент поддерживает dark mode через Tailwind CSS classes:
- `dark:bg-gray-800`, `dark:text-gray-100` и т.д.

## Примеры использования

Посмотрите файл `TableDemo.tsx` для полных примеров использования всех возможностей компонента.

## Требования

- React 18+
- TypeScript
- Tailwind CSS
- Next.js (для SSR совместимости)

## Лицензия

Внутренний компонент проекта BirthdayFlow.
