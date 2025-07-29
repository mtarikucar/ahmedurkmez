'use client';

import { useState, useRef, useCallback } from 'react';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  currentFile?: string;
  label?: string;
  description?: string;
  className?: string;
}

export default function FileUpload({
  onFileSelect,
  accept = '.pdf,.doc,.docx',
  maxSize = 10,
  currentFile,
  label = 'Dosya Yükle',
  description = 'PDF, DOC veya DOCX dosyası seçin',
  className = '',
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `Dosya boyutu ${maxSize}MB'dan büyük olamaz`;
    }

    // Check file type
    const allowedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      return `Desteklenmeyen dosya türü. İzin verilen türler: ${allowedTypes.join(', ')}`;
    }

    return null;
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const error = validateFile(file);

    if (error) {
      setErrorMessage(error);
      setUploadStatus('error');
      return;
    }

    setSelectedFile(file);
    setUploadStatus('success');
    setErrorMessage('');
    onFileSelect(file);
  }, [accept, maxSize, onFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleFiles(e.target.files);
  }, [handleFiles]);

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setErrorMessage('');
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <DocumentIcon className="h-8 w-8 text-red-500" />;
      case 'doc':
      case 'docx':
        return <DocumentIcon className="h-8 w-8 text-blue-500" />;
      default:
        return <DocumentIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : uploadStatus === 'error'
            ? 'border-red-300 bg-red-50'
            : uploadStatus === 'success'
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {selectedFile || currentFile ? (
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              {selectedFile && getFileIcon(selectedFile.name)}
              {!selectedFile && currentFile && <DocumentIcon className="h-8 w-8 text-gray-500" />}
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-900">
                {selectedFile ? selectedFile.name : 'Mevcut dosya'}
              </span>
            </div>
            
            {selectedFile && (
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(selectedFile.size)}
              </p>
            )}
            
            <div className="flex items-center justify-center space-x-2 mt-3">
              <button
                type="button"
                onClick={openFileDialog}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Değiştir
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={removeFile}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Kaldır
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <button
                type="button"
                onClick={openFileDialog}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Dosya seçin
              </button>
              <span className="text-sm text-gray-600"> veya buraya sürükleyin</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {description}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Maksimum dosya boyutu: {maxSize}MB
            </p>
          </div>
        )}

        {uploadStatus === 'error' && errorMessage && (
          <div className="mt-3 flex items-center justify-center space-x-2 text-red-600">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <span className="text-xs">{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
