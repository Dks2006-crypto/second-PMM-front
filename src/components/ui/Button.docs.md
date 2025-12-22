# Button Component Documentation

## Обзор

Современный полностью адаптивный Button компонент с touch-оптимизацией для проекта BirthdayFlow. Компонент создан с использованием React, TypeScript и Tailwind CSS, обеспечивая отличную производительность и пользовательский опыт на всех устройствах.

## Особенности

✅ **Touch-оптимизация** - Минимальный размер 44px для удобства использования на мобильных устройствах  
✅ **Полная TypeScript поддержка** - Строгая типизация с интерфейсами  
✅ **Accessibility** - Полная поддержка ARIA атрибутов  
✅ **Responsive дизайн** - Адаптивное поведение  
✅ **Touch жесты** - Long press и swipe события  
✅ **Loading состояния** - С анимацией и пользовательским текстом  
✅ **Иконки** - Поддержка иконок с позиционированием  
✅ **Группировка** - Горизонтальная и вертикальная группировка кнопок  
✅ **Dark Mode** - Встроенная поддержка темной темы  

## Компоненты

### 1. Button

Основной компонент кнопки с полной функциональностью.

```tsx
import { Button } from '@/components/ui/Button';

<Button
  variant="primary"
  size="md"
  loading={false}
  loadingText="Загрузка..."
  icon={<Icon />}
  iconPosition="left"
  fullWidth={false}
  onClick={() => console.log('Clicked!')}
  onLongPress={() => console.log('Long press!')}
  onSwipeLeft={() => console.log('Swipe left!')}
  onSwipeRight={() => console.log('Swipe right!')}
>
  Нажми меня
</Button>
```

### 2. ButtonGroup

Компонент для группировки кнопок с автоматическим стилизованием.

```tsx
import { ButtonGroup } from '@/components/ui/Button';

<ButtonGroup orientation="horizontal" spacing="normal">
  <Button variant="primary">Accept</Button>
  <Button variant="outline">Cancel</Button>
  <Button variant="ghost">Delete</Button>
</ButtonGroup>
```

### 3. IconButton

Компонент для кнопок-иконок с автоматическим центрированием.

```tsx
import { IconButton } from '@/components/ui/Button';

<IconButton
  icon={<Heart />}
  aria-label="Add to favorites"
  variant="ghost"
  size="md"
/>
```

## API Reference

### ButtonProps

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'link'` | `'primary'` | Стиль кнопки |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Размер кнопки |
| `loading` | `boolean` | `false` | Состояние загрузки |
| `loadingText` | `string` | `undefined` | Текст во время загрузки |
| `icon` | `React.ReactNode` | `undefined` | Иконка кнопки |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Позиция иконки |
| `fullWidth` | `boolean` | `false` | Полная ширина |
| `group` | `boolean` | `false` | Часть группы кнопок |
| `groupPosition` | `'first' \| 'middle' \| 'last'` | `undefined` | Позиция в группе |
| `touchFeedback` | `boolean` | `true` | Визуальная обратная связь при touch |
| `longPressDelay` | `number` | `500` | Задержка для long press (мс) |
| `onLongPress` | `() => void` | `undefined` | Обработчик long press |
| `onSwipeLeft` | `() => void` | `undefined` | Обработчик swipe влево |
| `onSwipeRight` | `() => void` | `undefined` | Обработчик swipe вправо |
| `swipeThreshold` | `number` | `50` | Пороговое значение для swipe |

### ButtonGroupProps

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `children` | `React.ReactNode` | - | Дочерние кнопки |
| `className` | `string` | `undefined` | Дополнительные классы |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Ориентация группы |
| `spacing` | `'tight' \| 'normal' \| 'loose'` | `'normal'` | Расстояние между кнопками |

## Размеры

| Размер | Высота | Padding | Размер текста | Touch-friendly |
|--------|--------|---------|---------------|----------------|
| `xs` | 32px | px-2.5 py-1.5 | text-xs | ❌ |
| `sm` | 36px | px-3 py-2 | text-sm | ❌ |
| `md` | 44px | px-4 py-2.5 | text-sm | ✅ |
| `lg` | 48px | px-6 py-3 | text-base | ✅ |
| `xl` | 56px | px-8 py-4 | text-lg | ✅ |

## Варианты стилей

### Primary
```tsx
<Button variant="primary">Primary Button</Button>
```
- Синий фон с белым текстом
- Hover эффект - темнее
- Активное состояние - еще темнее
- Dark mode: голубой фон

### Secondary  
```tsx
<Button variant="secondary">Secondary Button</Button>
```
- Серый фон с темным текстом
- Темная граница
- Hover эффект - светлее
- Dark mode: темно-серый фон

### Outline
```tsx
<Button variant="outline">Outline Button</Button>
```
- Прозрачный фон
- Синяя граница и текст
- Hover эффект - светло-синий фон
- Dark mode: голубая граница

### Ghost
```tsx
<Button variant="ghost">Ghost Button</Button>
```
- Прозрачный фон
- Серая граница (только при focus)
- Hover эффект - светло-серый фон
- Dark mode: темно-серый hover

### Link
```tsx
<Button variant="link">Link Button</Button>
```
- Прозрачный фон без padding
- Синий текст с underline при hover
- Минимальная высота

## Touch жесты

### Long Press
Автоматически срабатывает при удержании кнопки дольше `longPressDelay` миллисекунд.

```tsx
<Button
  onLongPress={() => console.log('Long press!')}
  longPressDelay={800}
>
  Long Press Me
</Button>
```

### Swipe Gestures
Поддерживает swipe влево и вправо с настраиваемым порогом.

```tsx
<Button
  onSwipeLeft={() => console.log('Swipe left!')}
  onSwipeRight={() => console.log('Swipe right!')}
  swipeThreshold={50}
>
  Swipe Me
</Button>
```

## Accessibility

### ARIA Атрибуты
- `aria-pressed` - состояние нажатия
- `aria-busy` - состояние загрузки
- `aria-label` - описание для screen readers
- `aria-describedby` - ссылка на описание

### Keyboard Support
- `Enter` - активация кнопки
- `Space` - активация кнопки
- `Tab` - навигация между элементами

### Focus Management
- Автоматический focus ring
- Видимые состояния focus
- Поддержка skip links

## Loading состояния

### Базовый loading
```tsx
<Button loading={isLoading}>
  Save Changes
</Button>
```

### С пользовательским текстом
```tsx
<Button
  loading={isLoading}
  loadingText="Сохранение..."
>
  Save
</Button>
```

### Иконка с loading
```tsx
<Button
  icon={<Upload />}
  loading={isUploading}
  loadingText="Загрузка..."
>
  Upload File
</Button>
```

## Группировка кнопок

### Горизонтальная группа
```tsx
<ButtonGroup>
  <Button variant="primary">Accept</Button>
  <Button variant="outline">Cancel</Button>
  <Button variant="ghost">Skip</Button>
</ButtonGroup>
```

### Вертикальная группа
```tsx
<ButtonGroup orientation="vertical" spacing="loose">
  <Button>Option 1</Button>
  <Button>Option 2</Button>
  <Button>Option 3</Button>
</ButtonGroup>
```

## Иконки

### Слева от текста
```tsx
<Button icon={<Save />}>
  Save Document
</Button>
```

### Справа от текста
```tsx
<Button icon={<ArrowRight />} iconPosition="right">
  Next Step
</Button>
```

### Только иконка
```tsx
<IconButton
  icon={<Heart />}
  aria-label="Add to favorites"
  variant="ghost"
/>
```

## Responsive поведение

### Полная ширина
```tsx
<Button fullWidth>
  Full Width Button
</Button>
```

### Адаптивные размеры
```tsx
<Button size={{ base: 'md', md: 'lg' }}>
  Responsive Button
</Button>
```

## Dark Mode

Компонент автоматически адаптируется к темной теме через Tailwind CSS:

- Автоматические цвета для dark mode
- Сохранение контрастности
- Правильные hover состояния

## Производительность

- Минимальные re-renders через React.memo
- Оптимизированные touch события
- Эффективное управление состоянием
- Минимальный размер bundle

## Тестирование

### Unit Tests
```tsx
// Пример теста
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

### Accessibility Tests
```tsx
// Проверка ARIA атрибутов
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Примеры использования

### Форма с кнопками
```tsx
<form onSubmit={handleSubmit}>
  <input type="text" />
  <div className="flex gap-4 mt-4">
    <Button type="submit" variant="primary" loading={isSubmitting}>
      {isSubmitting ? 'Сохранение...' : 'Сохранить'}
    </Button>
    <Button type="button" variant="outline" onClick={handleCancel}>
      Отмена
    </Button>
  </div>
</form>
```

### Карточка с действиями
```tsx
<Card>
  <CardHeader>
    <h3>Документ</h3>
  </CardHeader>
  <CardContent>
    <p>Описание документа</p>
  </CardContent>
  <CardFooter>
    <ButtonGroup>
      <Button variant="primary" icon={<Edit />}>
        Редактировать
      </Button>
      <Button variant="outline" icon={<Download />}>
        Скачать
      </Button>
      <IconButton
        icon={<Trash />}
        variant="ghost"
        aria-label="Удалить"
      />
    </ButtonGroup>
  </CardFooter>
</Card>
```

### Мобильное меню
```tsx
<div className="fixed bottom-4 right-4">
  <Button
    variant="primary"
    size="lg"
    icon={<Plus />}
    fullWidth={false}
    onLongPress={() => setShowMenu(!showMenu)}
  >
    Добавить
  </Button>
</div>
```

## Миграция

### С предыдущих версий
Компонент обратно совместим с существующими Button компонентами. Просто замените импорты:

```tsx
// Старый импорт
import { Button } from '@/components/ui/Button';

// Новый импорт (тот же)
import { Button } from '@/components/ui/Button';
```

### С других библиотек
Если вы мигрируете с Material-UI или Ant Design:

```tsx
// Material-UI
<Button variant="contained" size="large">
  Button
</Button>

// Новый Button
<Button variant="primary" size="lg">
  Button
</Button>
```

## Заключение

Button компонент предоставляет современное, производительное и доступное решение для создания кнопок в React приложениях. Благодаря touch-оптимизации и comprehensive API, он идеально подходит для создания пользовательских интерфейсов как на мобильных, так и на десктопных устройствах.