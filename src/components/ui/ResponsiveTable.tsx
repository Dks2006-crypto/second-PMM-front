'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface TableColumn {
  key: string;
  header: string;
  render?: (item: any) => React.ReactNode;
  mobileLabel?: string;
}

interface ResponsiveTableProps {
  data: any[];
  columns: TableColumn[];
  className?: string;
  emptyMessage?: string;
  getRowStyle?: (item: any) => string;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  data,
  columns,
  className = '',
  emptyMessage = 'Нет данных',
  getRowStyle
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getDaysUntilBirthday = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    
    const thisYearBirth = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    
    let nextBirthday = thisYearBirth;
    if (thisYearBirth < today) {
      nextBirthday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    
    const diffTime = nextBirthday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getBirthdayBadge = (birthDate: string) => {
    const daysUntil = getDaysUntilBirthday(birthDate);
    const birth = new Date(birthDate);
    const today = new Date();
    const birthdayThisYear = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    const isToday = birthdayThisYear.toDateString() === today.toDateString();
    
    if (isToday) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-600 text-white">
          🎉 Сегодня!
        </span>
      );
    } else if (daysUntil <= 7) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-600 text-white">
          Скоро: {daysUntil} {daysUntil === 1 ? 'день' : daysUntil < 5 ? 'дня' : 'дней'}
        </span>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
        <p className="text-center text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className={`space-y-4 ${className}`}>
        {data.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            {columns.map((column) => (
              <div key={column.key} className="mb-3 last:mb-0">
                <div className="text-sm font-medium text-gray-500 mb-1">
                  {column.mobileLabel || column.header}
                </div>
                <div className="text-base text-gray-900">
                  {column.render ? column.render(item) : item[column.key]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => {
            const rowStyle = getRowStyle ? getRowStyle(item) : '';
            return (
              <tr key={index} className={`hover:bg-gray-50 ${rowStyle}`}>
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};