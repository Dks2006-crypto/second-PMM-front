import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';

// Функция для объединения классов CSS (аналог cn из @/lib/utils)
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// TypeScript интерфейсы
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  group?: boolean;
  groupPosition?: 'first' | 'middle' | 'last';
  touchFeedback?: boolean;
  longPressDelay?: number;
  onLongPress?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  swipeThreshold?: number;
  children?: React.ReactNode;
  className?: string;
}

export interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
}

// Touch события
interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  isPressed: boolean;
  longPressTimer: NodeJS.Timeout | null;
}

// Хук для обработки touch событий
const useTouchEvents = (
  longPressDelay: number = 500,
  swipeThreshold: number = 50
) => {
  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    isPressed: false,
    longPressTimer: null,
  });

  const handlers = useRef({
    onTouchStart: (e: React.TouchEvent<HTMLButtonElement>) => {
      const touch = e.touches[0];
      touchState.current = {
        ...touchState.current,
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        isPressed: true,
      };
    },
    onTouchEnd: (e: React.TouchEvent<HTMLButtonElement>) => {
      const endTime = Date.now();
      const duration = endTime - touchState.current.startTime;
      const touch = e.changedTouches[0];
      const deltaX = Math.abs(touch.clientX - touchState.current.startX);
      const deltaY = Math.abs(touch.clientY - touchState.current.startY);
      
      // Очищаем long press timer
      if (touchState.current.longPressTimer) {
        clearTimeout(touchState.current.longPressTimer);
        touchState.current.longPressTimer = null;
      }
      
      touchState.current.isPressed = false;
      
      return { duration, deltaX, deltaY };
    },
    onTouchMove: (e: React.TouchEvent<HTMLButtonElement>) => {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchState.current.startX);
      const deltaY = Math.abs(touch.clientY - touchState.current.startY);
      
      // Отменяем long press при значительном движении
      if (touchState.current.longPressTimer && (deltaX > 10 || deltaY > 10)) {
        clearTimeout(touchState.current.longPressTimer);
        touchState.current.longPressTimer = null;
      }
    },
  });

  return handlers.current;
};

// Простой Loading Spinner компонент
const LoadingSpinner = ({ size }: { size: ButtonProps['size'] }) => {
  const spinnerSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  return (
    <svg 
      className={cn('animate-spin', spinnerSizes[size || 'md'])} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Классы стилей для различных вариантов и размеров
const getButtonClasses = (
  variant: ButtonProps['variant'],
  size: ButtonProps['size'],
  group: boolean,
  groupPosition: ButtonProps['groupPosition'],
  loading: boolean,
  fullWidth: boolean,
  className?: string
) => {
  const baseClasses = [
    'inline-flex items-center justify-center gap-2',
    'font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:scale-95 select-none',
    fullWidth && 'w-full',
    // Touch-friendly минимальные размеры
    size === 'xs' && 'min-h-[32px] px-2.5 py-1.5 text-xs',
    size === 'sm' && 'min-h-[36px] px-3 py-2 text-sm',
    size === 'md' && 'min-h-[44px] px-4 py-2.5 text-sm', // Touch-friendly размер
    size === 'lg' && 'min-h-[48px] px-6 py-3 text-base',
    size === 'xl' && 'min-h-[56px] px-8 py-4 text-lg',
    // Группировка
    group && 'border-r-0 last:border-r',
    group && groupPosition === 'first' && 'rounded-r-none',
    group && groupPosition === 'middle' && 'rounded-none border-l-0',
    group && groupPosition === 'last' && 'rounded-l-none border-l-0',
    // Loading состояние
    loading && 'cursor-wait',
  ].filter(Boolean).join(' ');

  const variantClasses = {
    primary: [
      'bg-blue-600 text-white border border-blue-600',
      'hover:bg-blue-700 active:bg-blue-800',
      'focus:ring-blue-500',
      'dark:bg-blue-500 dark:hover:bg-blue-600',
    ].join(' '),
    secondary: [
      'bg-gray-100 text-gray-900 border border-gray-300',
      'hover:bg-gray-200 active:bg-gray-300',
      'focus:ring-gray-500',
      'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
      'dark:hover:bg-gray-700',
    ].join(' '),
    outline: [
      'bg-transparent text-blue-600 border border-blue-600',
      'hover:bg-blue-50 active:bg-blue-100',
      'focus:ring-blue-500',
      'dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950',
    ].join(' '),
    ghost: [
      'bg-transparent text-gray-700 border border-transparent',
      'hover:bg-gray-100 active:bg-gray-200',
      'focus:ring-gray-500',
      'dark:text-gray-300 dark:hover:bg-gray-800',
    ].join(' '),
    link: [
      'bg-transparent text-blue-600 border border-transparent',
      'hover:underline focus:ring-blue-500 p-0 h-auto min-h-0',
      'dark:text-blue-400',
    ].join(' '),
  };

  return cn(baseClasses, variantClasses[variant || 'primary'], className);
};

// Основной Button компонент
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingText,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      group = false,
      groupPosition,
      touchFeedback = true,
      longPressDelay = 500,
      onLongPress,
      onSwipeLeft,
      onSwipeRight,
      swipeThreshold = 50,
      children,
      className,
      disabled,
      onTouchStart,
      onTouchEnd,
      onTouchMove,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const touchHandlers = useTouchEvents(longPressDelay, swipeThreshold);

    useImperativeHandle(ref, () => buttonRef.current!);

    // Touch события
    const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
      if (touchFeedback) {
        setIsPressed(true);
      }
      touchHandlers.onTouchStart(e);
      onTouchStart?.(e);
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
      const { duration, deltaX, deltaY } = touchHandlers.onTouchEnd(e);
      
      // Long press
      if (duration >= longPressDelay && onLongPress) {
        onLongPress();
      }
      
      // Swipe gestures
      if (deltaX > swipeThreshold && deltaY < swipeThreshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (onSwipeLeft) {
          onSwipeLeft();
        }
      }
      
      setIsPressed(false);
      onTouchEnd?.(e);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
      touchHandlers.onTouchMove(e);
      onTouchMove?.(e);
    };

    // Дополнительные обработчики для accessibility
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Браузер автоматически вызывает onClick для кнопок
      }
    };

    const classes = getButtonClasses(
      variant,
      size,
      group,
      groupPosition,
      loading,
      fullWidth,
      className
    );

    return (
      <button
        ref={buttonRef}
        className={classes}
        disabled={disabled || loading}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onKeyDown={handleKeyDown}
        aria-pressed={isPressed}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner size={size} />
            {loadingText || children}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="flex-shrink-0">{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className="flex-shrink-0">{icon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Button Group компонент
const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, className, orientation = 'horizontal', spacing = 'normal' }, ref) => {
    const spacingClasses = {
      tight: 'gap-0',
      normal: 'gap-1',
      loose: 'gap-2',
    };

    const orientationClasses = {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex',
          orientationClasses[orientation],
          spacingClasses[spacing],
          className
        )}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement<ButtonProps>(child)) {
            const position = 
              index === 0 ? 'first' :
              index === React.Children.count(children) - 1 ? 'last' : 'middle';
            
            return React.cloneElement(child, {
              group: true,
              groupPosition: position,
            });
          }
          return child;
        })}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

// Компонент для отдельной иконки
interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  'aria-label': string;
  icon: React.ReactNode;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', ...props }, ref) => {
    const iconOnlyClasses = getButtonClasses(
      props.variant || 'ghost',
      size,
      false,
      undefined,
      props.loading || false,
      false
    );

    return (
      <Button
        ref={ref}
        className={cn(iconOnlyClasses, 'p-0 w-10 h-10')}
        {...props}
      >
        {props.loading ? (
          <LoadingSpinner size={size} />
        ) : (
          <span className="flex items-center justify-center">{icon}</span>
        )}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

export { Button, ButtonGroup, IconButton };