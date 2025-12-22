'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  forwardRef,
  HTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';

// Функция для объединения классов CSS (аналог cn из @/lib/utils)
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// ============================================================================
// Types & Interfaces
// ============================================================================

type TableVariant = 'default' | 'striped' | 'bordered' | 'compact';
type TableSize = 'sm' | 'md' | 'lg';

interface TableContextValue {
  variant: TableVariant;
  size: TableSize;
  isMobile: boolean;
  expandedRows: Set<string | number>;
  toggleRow: (id: string | number) => void;
  headers: string[];
  setHeaders: (headers: string[]) => void;
}

interface ResponsiveTableProps extends HTMLAttributes<HTMLDivElement> {
  variant?: TableVariant;
  size?: TableSize;
  breakpoint?: number;
  stickyHeader?: boolean;
  loading?: boolean;
  loadingRows?: number;
  emptyState?: React.ReactNode;
  isEmpty?: boolean;
  'aria-label'?: string;
  mobileHeaders?: string[]; // Явное указание заголовков для мобильного режима
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  rowId?: string | number;
  expandable?: boolean;
  expandedContent?: React.ReactNode;
  isClickable?: boolean;
}

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  mobileLabel?: string;
  isHeader?: boolean;
  align?: 'left' | 'center' | 'right';
  truncate?: boolean;
}

interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
  align?: 'left' | 'center' | 'right';
}

// ============================================================================
// Context
// ============================================================================

const TableContext = createContext<TableContextValue | null>(null);

const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('Table components must be used within a ResponsiveTable');
  }
  return context;
};

// ============================================================================
// Custom Hooks
// ============================================================================

const useMediaQuery = (breakpoint: number): boolean => {
  const [matches, setMatches] = useState(false);

  React.useEffect(() => {
    const query = `(max-width: ${breakpoint}px)`;
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [breakpoint]);

  return matches;
};

// ============================================================================
// Utility Components
// ============================================================================

// Skeleton для loading состояния
const TableSkeleton: React.FC<{ rows: number; cols: number; size: TableSize }> = ({
  rows,
  cols,
  size,
}) => {
  const heightClass = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
  }[size];

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <td key={colIndex} className={cn('px-4 py-3', heightClass)}>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

// Mobile Skeleton
const MobileTableSkeleton: React.FC<{ rows: number }> = ({ rows }) => (
  <div className="space-y-4">
    {Array.from({ length: rows }).map((_, index) => (
      <div
        key={index}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse"
      >
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// Empty State компонент
const EmptyState: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <svg
      className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
    {children || (
      <>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
          Нет данных
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Данные для отображения отсутствуют
        </p>
      </>
    )}
  </div>
);

// Chevron Icon для expand/collapse
const ChevronIcon: React.FC<{ expanded: boolean; className?: string }> = ({
  expanded,
  className,
}) => (
  <svg
    className={cn(
      'w-5 h-5 transition-transform duration-200',
      expanded && 'rotate-180',
      className
    )}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// Sort Icon
const SortIcon: React.FC<{ direction: 'asc' | 'desc' | null }> = ({ direction }) => (
  <span className="ml-1 inline-flex flex-col" aria-hidden="true">
    <svg
      className={cn(
        'w-3 h-3 -mb-1',
        direction === 'asc' ? 'text-primary-600' : 'text-gray-300 dark:text-gray-600'
      )}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 5l7 7H5z" />
    </svg>
    <svg
      className={cn(
        'w-3 h-3',
        direction === 'desc' ? 'text-primary-600' : 'text-gray-300 dark:text-gray-600'
      )}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 19l-7-7h14z" />
    </svg>
  </span>
);

// ============================================================================
// Main Components
// ============================================================================

/**
 * ResponsiveTable - главный контейнер таблицы с автоматическим переключением
 * между desktop и mobile режимами
 */
export const ResponsiveTable = forwardRef<HTMLDivElement, ResponsiveTableProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      breakpoint = 768,
      stickyHeader = false,
      loading = false,
      loadingRows = 5,
      emptyState,
      isEmpty = false,
      mobileHeaders = [],
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const isMobile = useMediaQuery(breakpoint);
    const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());
    const [headers, setHeaders] = useState<string[]>(mobileHeaders);

    // Обновляем заголовки если передали новые
    React.useEffect(() => {
      if (mobileHeaders.length > 0) {
        setHeaders(mobileHeaders);
      }
    }, [mobileHeaders]);

    const toggleRow = useCallback((id: string | number) => {
      setExpandedRows((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    }, []);

    const contextValue: TableContextValue = {
      variant,
      size,
      isMobile,
      expandedRows,
      toggleRow,
      headers,
      setHeaders,
    };

    // Loading state
    if (loading) {
      if (isMobile) {
        return (
          <div ref={ref} className={className} {...props}>
            <MobileTableSkeleton rows={loadingRows} />
          </div>
        );
      }
      return (
        <div
          ref={ref}
          className={cn('overflow-x-auto', className)}
          {...props}
        >
          <table className="min-w-full" aria-label={ariaLabel}>
            <tbody>
              <TableSkeleton rows={loadingRows} cols={5} size={size} />
            </tbody>
          </table>
        </div>
      );
    }

    // Empty state
    if (isEmpty) {
      return (
        <div
          ref={ref}
          className={cn(
            'border border-gray-200 dark:border-gray-700 rounded-lg',
            className
          )}
          {...props}
        >
          {emptyState || <EmptyState />}
        </div>
      );
    }

    return (
      <TableContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            'w-full',
            !isMobile && 'overflow-x-auto',
            className
          )}
          {...props}
        >
          {isMobile ? (
            <div className="space-y-3" role="list" aria-label={ariaLabel}>
              {children}
            </div>
          ) : (
            <table
              className={cn(
                'min-w-full divide-y divide-gray-200 dark:divide-gray-700',
                variant === 'bordered' &&
                  'border border-gray-200 dark:border-gray-700',
                stickyHeader && '[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10'
              )}
              aria-label={ariaLabel}
            >
              {children}
            </table>
          )}
        </div>
      </TableContext.Provider>
    );
  }
);

ResponsiveTable.displayName = 'ResponsiveTable';

/**
 * Table - базовый table элемент (для использования без ResponsiveTable)
 */
export const Table = forwardRef<
  HTMLTableElement,
  HTMLAttributes<HTMLTableElement> & {
    variant?: TableVariant;
    stickyHeader?: boolean;
  }
>(({ children, className, variant = 'default', stickyHeader = false, ...props }, ref) => (
  <div className="overflow-x-auto w-full">
    <table
      ref={ref}
      className={cn(
        'min-w-full divide-y divide-gray-200 dark:divide-gray-700',
        variant === 'bordered' && 'border border-gray-200 dark:border-gray-700',
        stickyHeader && '[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10',
        className
      )}
      {...props}
    >
      {children}
    </table>
  </div>
));

Table.displayName = 'Table';

/**
 * TableHeader - контейнер для заголовков таблицы
 */
export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ children, className, ...props }, ref) => {
  const context = useContext(TableContext);

  // В мобильном режиме скрываем заголовки
  if (context?.isMobile) {
    return null;
  }

  return (
    <thead
      ref={ref}
      className={cn(
        'bg-gray-50 dark:bg-gray-800/50',
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
});

TableHeader.displayName = 'TableHeader';

/**
 * TableBody - контейнер для строк таблицы
 */
export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ children, className, ...props }, ref) => {
  const context = useContext(TableContext);

  if (context?.isMobile) {
    return <>{children}</>;
  }

  return (
    <tbody
      ref={ref}
      className={cn(
        'divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900',
        context?.variant === 'striped' &&
          '[&>tr:nth-child(odd)]:bg-gray-50 dark:[&>tr:nth-child(odd)]:bg-gray-800/30',
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  );
});

TableBody.displayName = 'TableBody';

/**
 * TableRow - строка таблицы с поддержкой expand/collapse на мобильных
 */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    {
      children,
      className,
      rowId,
      expandable = false,
      expandedContent,
      isClickable = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const context = useContext(TableContext);
    const isExpanded = rowId !== undefined && context?.expandedRows.has(rowId);

    const handleToggle = useCallback(() => {
      if (expandable && rowId !== undefined && context) {
        context.toggleRow(rowId);
      }
    }, [expandable, rowId, context]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (expandable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleToggle();
        }
      },
      [expandable, handleToggle]
    );

    // Mobile card view
    if (context?.isMobile) {
      const cells = React.Children.toArray(children);

      return (
        <div
          role="listitem"
          className={cn(
            'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
            'shadow-sm transition-shadow duration-200',
            (expandable || isClickable) &&
              'hover:shadow-md active:shadow-inner cursor-pointer',
            className
          )}
          onClick={expandable ? handleToggle : onClick}
          onKeyDown={handleKeyDown}
          tabIndex={expandable || isClickable ? 0 : undefined}
          aria-expanded={expandable ? isExpanded : undefined}
        >
          <div className="p-4">
            {/* Touch-friendly header with expand button */}
            {expandable && (
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {cells[0]}
                </span>
                <button
                  type="button"
                  className={cn(
                    'p-2 -m-2 rounded-full',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    'transition-colors duration-200'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle();
                  }}
                  aria-label={isExpanded ? 'Свернуть' : 'Развернуть'}
                  aria-expanded={isExpanded}
                >
                  <ChevronIcon expanded={!!isExpanded} />
                </button>
              </div>
            )}

            {/* Cell content as label-value pairs */}
            <div className="space-y-2">
              {cells.map((cell, index) => {
                if (expandable && index === 0) return null;
                const label = context.headers[index] || `Поле ${index + 1}`;
                return (
                  <div key={index} className="flex flex-wrap justify-between gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {label}:
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 text-right">
                      {cell}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Expanded content */}
            {expandable && isExpanded && expandedContent && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                {expandedContent}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Desktop table row
    return (
      <>
        <tr
          ref={ref}
          className={cn(
            'transition-colors duration-150',
            isClickable && 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
            context?.variant === 'compact' && 'text-sm',
            className
          )}
          onClick={onClick}
          onKeyDown={expandable ? handleKeyDown : undefined}
          tabIndex={expandable || isClickable ? 0 : undefined}
          aria-expanded={expandable ? isExpanded : undefined}
          {...props}
        >
          {expandable && (
            <td className="w-12 px-2">
              <button
                type="button"
                className={cn(
                  'p-1 rounded',
                  'hover:bg-gray-100 dark:hover:bg-gray-700',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500',
                  'transition-colors duration-200'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle();
                }}
                aria-label={isExpanded ? 'Свернуть' : 'Развернуть'}
                aria-expanded={isExpanded}
              >
                <ChevronIcon expanded={!!isExpanded} className="w-4 h-4" />
              </button>
            </td>
          )}
          {children}
        </tr>
        {expandable && isExpanded && expandedContent && (
          <tr className="bg-gray-50 dark:bg-gray-800/30">
            <td colSpan={100} className="px-4 py-3">
              {expandedContent}
            </td>
          </tr>
        )}
      </>
    );
  }
);

TableRow.displayName = 'TableRow';

/**
 * TableCell - ячейка таблицы
 */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  (
    {
      children,
      className,
      mobileLabel,
      isHeader = false,
      align = 'left',
      truncate = false,
      ...props
    },
    ref
  ) => {
    const context = useContext(TableContext);

    const alignClass = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[align];

    const sizeClass = context
      ? {
          sm: 'px-3 py-2 text-sm',
          md: 'px-4 py-3',
          lg: 'px-6 py-4 text-lg',
        }[context.size]
      : 'px-4 py-3';

    // В мобильном режиме ячейки рендерятся внутри TableRow
    if (context?.isMobile) {
      return <>{children}</>;
    }

    const Component = isHeader ? 'th' : 'td';

    return (
      <Component
        ref={ref as any}
        className={cn(
          sizeClass,
          alignClass,
          truncate && 'truncate max-w-xs',
          isHeader && 'font-semibold text-gray-700 dark:text-gray-300',
          !isHeader && 'text-gray-900 dark:text-gray-100',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

TableCell.displayName = 'TableCell';

/**
 * TableHeaderCell - ячейка заголовка с поддержкой сортировки
 */
export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  (
    {
      children,
      className,
      sortable = false,
      sortDirection = null,
      onSort,
      align = 'left',
      ...props
    },
    ref
  ) => {
    const context = useContext(TableContext);

    const alignClass = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[align];

    const sizeClass = context
      ? {
          sm: 'px-3 py-2 text-xs',
          md: 'px-4 py-3 text-sm',
          lg: 'px-6 py-4 text-base',
        }[context.size]
      : 'px-4 py-3 text-sm';

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (sortable && onSort && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onSort();
      }
    };

    return (
      <th
        ref={ref}
        className={cn(
          sizeClass,
          alignClass,
          'font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider',
          sortable && 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700/50',
          className
        )}
        onClick={sortable ? onSort : undefined}
        onKeyDown={handleKeyDown}
        tabIndex={sortable ? 0 : undefined}
        aria-sort={
          sortDirection === 'asc'
            ? 'ascending'
            : sortDirection === 'desc'
            ? 'descending'
            : undefined
        }
        role={sortable ? 'columnheader button' : 'columnheader'}
        {...props}
      >
        <span className="inline-flex items-center">
          {children}
          {sortable && <SortIcon direction={sortDirection} />}
        </span>
      </th>
    );
  }
);

TableHeaderCell.displayName = 'TableHeaderCell';

/**
 * TableFooter - подвал таблицы
 */
export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ children, className, ...props }, ref) => {
  const context = useContext(TableContext);

  if (context?.isMobile) {
    return (
      <div
        className={cn(
          'mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg',
          'border border-gray-200 dark:border-gray-700',
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <tfoot
      ref={ref}
      className={cn(
        'bg-gray-50 dark:bg-gray-800/50 font-medium',
        className
      )}
      {...props}
    >
      {children}
    </tfoot>
  );
});

TableFooter.displayName = 'TableFooter';

// ============================================================================
// Export
// ============================================================================

export default ResponsiveTable;

export {
  useTableContext,
  useMediaQuery,
  EmptyState as TableEmptyState,
  TableSkeleton,
  MobileTableSkeleton,
};

export type {
  TableVariant,
  TableSize,
  TableContextValue,
  ResponsiveTableProps,
  TableRowProps,
  TableCellProps,
  TableHeaderCellProps,
};
