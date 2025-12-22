'use client';

import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  className?: string;
}

export default function FileUpload({ onFileSelect, accept = 'image/*', className = '' }: FileUploadProps) {
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
    setFileName(file ? file.name : '');
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleButtonClick}
        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors text-center"
      >
        {fileName || 'Выберите файл'}
      </button>
      {fileName && (
        <p className="text-sm text-gray-600 truncate">Выбранный файл: {fileName}</p>
      )}
    </div>
  );
}