import React, { useState, forwardRef, useImperativeHandle } from 'react';

// Функция для объединения классов CSS
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// TypeScript интерфейсы
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  size?: 'compact' | 'small' | 'medium' | 'large';
  interactive?: boolean;
  draggable?: boolean;
  loading?: boolean;
  skeleton?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
  className?: string;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  className?: string;
}

export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

// Touch состояние для мобильных устройств
interface TouchState {
  startX: number;
  startY: number;
  isPressed: boolean;
}

// Хук для обработки touch событий
const useTouchEvents = () => {
  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    startY: 0,
    isPressed: false,
  });

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    setTouchState({
      startX: touch.clientX,
      startY: touch.clientY,
      isPressed: true,
    });
  };

  const handleTouchEnd = () => {
    setTouchState(prev => ({ ...prev, isPressed: false }));
  };

  return {
    touchState,
    handleTouchStart,
    handleTouchEnd,
  };
};

// Skeleton Loading компонент
const CardSkeleton = ({ size }: { size: CardProps['size'] }) => {
  const skeletonSizes = {
    compact: 'h-16',
    small: 'h-24',
    medium: 'h-32',
    large: 'h-48',
  };

  return (
    <div className={cn('animate-pulse', skeletonSizes[size || 'medium'])}>
      <div className="flex space-x-4">
        <div className="rounded-full bg-gray-200 h-10 w-10 dark:bg-gray-700"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
};

// Функция для получения классов карточки
const getCardClasses = (
  variant: CardProps['variant'],
  size: CardProps['size'],
  interactive: boolean,
  loading: boolean,
  skeleton: boolean,
  className?: string
) => {
  const baseClasses = [
    'bg-white border border-gray-200 rounded-lg transition-all duration-200',
    'dark:bg-gray-900 dark:border-gray-700',
    // Responsive padding для мобильных
    'p-3 sm:p-4 md:p-6',
    // Touch-friendly минимальные размеры
    'min-h-[80px] sm:min-h-[100px] md:min-h-[120px]',
  ];

  const sizeClasses = {
    compact: 'p-2 sm:p-3 min-h-[60px] sm:min-h-[80px]',
    small: 'p-3 sm:p-4 min-h-[80px] sm:min-h-[100px]',
    medium: 'p-4 sm:p-6 min-h-[120px] sm:min-h-[140px]',
    large: 'p-6 sm:p-8 min-h-[160px] sm:min-h-[200px]',
  };

  const variantClasses = {
    default: [
      'bg-white border-gray-200 shadow-sm',
      'dark:bg-gray-900 dark:border-gray-700',
    ].join(' '),
    elevated: [
      'bg-white border-gray-200 shadow-md',
      'hover:shadow-lg',
      'dark:bg-gray-900 dark:border-gray-700',
      'dark:hover:shadow-xl',
    ].join(' '),
    outlined: [
      'bg-white border-2 border-gray-300',
      'dark:bg-gray-900 dark:border-gray-600',
    ].join(' '),
    ghost: [
      'bg-transparent border-transparent',
      'hover:bg-gray-50',
      'dark:hover:bg-gray-800',
    ].join(' '),
  };

  const interactiveClasses = interactive && [
    'cursor-pointer',
    'hover:scale-[1.02] active:scale-[0.98]',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  ].join(' ');

  return cn(
    ...baseClasses,
    sizeClasses[size || 'medium'],
    variantClasses[variant || 'default'],
    interactiveClasses,
    loading && skeleton && 'opacity-50 pointer-events-none',
    className
  );
};

// Основной Card компонент
const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      size = 'medium',
      interactive = false,
      draggable = false,
      loading = false,
      skeleton = false,
      onDragStart,
      onDragEnd,
      onDrop,
      onDragOver,
      children,
      className,
      onClick,
      onTouchStart,
      onTouchEnd,
      onTouchMove,
      ...props
    },
    ref
  ) => {
    const { touchState, handleTouchStart, handleTouchEnd } = useTouchEvents();
    const [isPressed, setIsPressed] = useState(false);

    // Touch события для мобильных устройств
    const handleTouchStartWrapper = (e: React.TouchEvent<HTMLDivElement>) => {
      handleTouchStart(e);
      setIsPressed(true);
      onTouchStart?.(e);
    };

    const handleTouchEndWrapper = (e: React.TouchEvent<HTMLDivElement>) => {
      handleTouchEnd();
      setIsPressed(false);
      onTouchEnd?.(e);
    };

    // Drag & Drop события
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
      if (draggable) {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart?.(e);
      }
    };

    const handleDragEndWrapper = (e: React.DragEvent<HTMLDivElement>) => {
      if (draggable) {
        onDragEnd?.(e);
      }
    };

    const handleDropWrapper = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      onDrop?.(e);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      onDragOver?.(e);
    };

    // Keyboard события для accessibility
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (interactive && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick?.(e as any);
      }
    };

    const classes = getCardClasses(variant, size, interactive, loading, skeleton, className);

    return (
      <div
        ref={ref}
        className={classes}
        onClick={interactive ? onClick : undefined}
        onTouchStart={handleTouchStartWrapper}
        onTouchEnd={handleTouchEndWrapper}
        onTouchMove={onTouchMove}
        draggable={draggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEndWrapper}
        onDrop={handleDropWrapper}
        onDragOver={handleDragOver}
        onKeyDown={interactive ? handleKeyDown : undefined}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? 'button' : undefined}
        aria-pressed={isPressed}
        aria-label={props['aria-label']}
        {...props}
      >
        {skeleton ? (
          <CardSkeleton size={size} />
        ) : (
          children
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header компонент
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col space-y-1.5 p-4 sm:p-6 pb-2 sm:pb-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// Card Body компонент
const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-4 sm:p-6 pt-0 sm:pt-0', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

// Card Footer компонент
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center p-4 sm:p-6 pt-0 sm:pt-0',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

// Card Title компонент
const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, as: Component = 'h3', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'text-lg font-semibold leading-none tracking-tight',
          'text-gray-900 dark:text-gray-100',
          'sm:text-xl',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = 'CardTitle';

// Card Description компонент
const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'text-sm text-gray-600 dark:text-gray-400',
          'sm:text-base',
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

// Card Actions компонент
const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  ({ children, className, align = 'right', ...props }, ref) => {
    const alignClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center space-x-2 sm:space-x-4',
          alignClasses[align],
          'p-4 sm:p-6 pt-0 sm:pt-0',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardActions.displayName = 'CardActions';

// Составной экспорт
export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardDescription,
  CardActions,
};

export default Card;