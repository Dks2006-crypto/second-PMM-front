import React, { useState } from 'react';
import { Button, ButtonGroup, IconButton } from './Button';

// Примеры использования Button компонента
const ButtonExamples = () => {
  const [loading, setLoading] = useState(false);

  const handleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleLongPress = () => {
    alert('Long press detected!');
  };

  const handleSwipeLeft = () => {
    alert('Swipe left detected!');
  };

  const handleSwipeRight = () => {
    alert('Swipe right detected!');
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Button Component Examples
      </h1>

      {/* Размеры кнопок */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Размеры кнопок (все touch-friendly 44px+)
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </section>

      {/* Варианты стилей */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Варианты стилей
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* Loading состояния */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Loading состояния
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button loading={loading}>Loading Button</Button>
          <Button loading={loading} loadingText="Saving...">Custom Loading Text</Button>
          <Button onClick={handleLoading}>Start Loading</Button>
        </div>
      </section>

      {/* Иконки */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Поддержка иконок
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button icon={<span>👍</span>}>With Icon</Button>
          <Button icon={<span>🚀</span>} iconPosition="right">
            Icon Right
          </Button>
          <IconButton icon={<span>❤️</span>} aria-label="Like" />
        </div>
      </section>

      {/* Группировка кнопок */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Группировка кнопок
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-600">Horizontal Group</h3>
            <ButtonGroup>
              <Button>First</Button>
              <Button>Second</Button>
              <Button>Third</Button>
            </ButtonGroup>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-600">Vertical Group</h3>
            <ButtonGroup orientation="vertical">
              <Button>First</Button>
              <Button>Second</Button>
              <Button>Third</Button>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* Touch жесты */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Touch жесты (long press, swipe)
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button
            onLongPress={handleLongPress}
            longPressDelay={800}
            touchFeedback={true}
          >
            Long Press Me
          </Button>
          <Button
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            swipeThreshold={50}
          >
            Swipe Left/Right
          </Button>
        </div>
      </section>

      {/* Responsive поведение */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Responsive поведение
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button fullWidth>Full Width Button</Button>
          <Button disabled>Disabled Button</Button>
          <Button variant="outline" size="lg">
            Large Outline
          </Button>
        </div>
      </section>

      {/* Accessibility */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Accessibility (ARIA поддержка)
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button
            aria-label="Save document"
            icon={<span>💾</span>}
            variant="ghost"
          />
          <Button
            aria-describedby="delete-description"
            variant="outline"
            icon={<span>🗑️</span>}
          >
            Delete
          </Button>
        </div>
        <p id="delete-description" className="sr-only">
          This action cannot be undone
        </p>
      </section>

      {/* Комбинации */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Комбинации функций
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-600">
              Button с иконкой, loading и полной шириной
            </h3>
            <Button
              icon={<span>📤</span>}
              loading={loading}
              loadingText="Uploading..."
              fullWidth
              onClick={handleLoading}
            >
              Upload File
            </Button>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-600">
              Группа кнопок с разными вариантами
            </h3>
            <ButtonGroup>
              <Button variant="primary" icon={<span>✓</span>}>
                Accept
              </Button>
              <Button variant="outline" icon={<span>⏸️</span>}>
                Pause
              </Button>
              <Button variant="ghost" icon={<span>✗</span>}>
                Decline
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* Dark mode поддержка */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Dark Mode поддержка
        </h2>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary">Primary Dark</Button>
            <Button variant="secondary">Secondary Dark</Button>
            <Button variant="outline">Outline Dark</Button>
            <Button variant="ghost">Ghost Dark</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ButtonExamples;