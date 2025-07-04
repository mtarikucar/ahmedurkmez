'use client';

import { useState, useEffect } from 'react';
import {
  PhotoIcon,
  VideoCameraIcon,
  DocumentIcon,
  XMarkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

interface MediaFile {
  id: number;
  type: 'image' | 'video' | 'document' | 'youtube';
  url: string;
  thumbnailUrl?: string;
  title: string;
  alt?: string;
  caption?: string;
  mimeType?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  createdAt: string;
}

interface MediaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (media: MediaFile) => void;
  allowMultiple?: boolean;
  acceptedTypes?: ('image' | 'video' | 'document' | 'youtube')[];
}

export default function MediaManager({
  isOpen,
  onClose,
  onSelect,
  allowMultiple = false,
  acceptedTypes = ['image', 'video', 'document'],
}: MediaManagerProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMediaFiles();
    }
  }, [isOpen]);

  const fetchMediaFiles = async () => {
    setLoading(true);
    try {
      // TODO: Implement media API call
      // const response = await mediaAPI.getAll();
      // setMediaFiles(response.data);
      
      // Mock data for now
      setMediaFiles([
        {
          id: 1,
          type: 'image',
          url: '/images/sample1.jpg',
          thumbnailUrl: '/images/sample1-thumb.jpg',
          title: 'Örnek Görsel 1',
          alt: 'Örnek görsel açıklaması',
          mimeType: 'image/jpeg',
          fileSize: 1024000,
          width: 1920,
          height: 1080,
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: 2,
          type: 'video',
          url: '/videos/sample1.mp4',
          thumbnailUrl: '/videos/sample1-thumb.jpg',
          title: 'Örnek Video 1',
          mimeType: 'video/mp4',
          fileSize: 10240000,
          createdAt: '2024-01-14T15:30:00Z',
        },
      ]);
    } catch (error) {
      console.error('Error fetching media files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);
        
        // TODO: Implement upload API call
        // await uploadAPI.uploadFile(formData);
      }
      
      await fetchMediaFiles();
      setShowUpload(false);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = (media: MediaFile) => {
    if (allowMultiple) {
      const isSelected = selectedFiles.find(f => f.id === media.id);
      if (isSelected) {
        setSelectedFiles(prev => prev.filter(f => f.id !== media.id));
      } else {
        setSelectedFiles(prev => [...prev, media]);
      }
    } else {
      onSelect?.(media);
      onClose();
    }
  };

  const handleConfirmSelection = () => {
    if (selectedFiles.length > 0 && onSelect) {
      selectedFiles.forEach(file => onSelect(file));
      onClose();
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <PhotoIcon className="h-6 w-6" />;
      case 'video':
      case 'youtube':
        return <VideoCameraIcon className="h-6 w-6" />;
      default:
        return <DocumentIcon className="h-6 w-6" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || file.type === filterType;
    const matchesAccepted = acceptedTypes.includes(file.type);
    return matchesSearch && matchesType && matchesAccepted;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Medya Yöneticisi
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Medya dosyalarında ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Filter */}
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">Tüm Dosyalar</option>
                  <option value="image">Görseller</option>
                  <option value="video">Videolar</option>
                  <option value="document">Belgeler</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>

              {/* Upload Button */}
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Yükle
              </button>
            </div>

            {/* Upload Area */}
            {showUpload && (
              <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Dosyaları seçin veya sürükle bırakın
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                        className="sr-only"
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF, MP4, PDF, DOC - Maksimum 10MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Media Grid */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-12">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Medya dosyası bulunamadı</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Yeni dosya yükleyerek başlayın.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredFiles.map((file) => {
                    const isSelected = selectedFiles.find(f => f.id === file.id);
                    return (
                      <div
                        key={file.id}
                        onClick={() => handleSelect(file)}
                        className={`relative cursor-pointer rounded-lg border-2 p-2 hover:border-indigo-500 transition-colors ${
                          isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                        }`}
                      >
                        {/* File Preview */}
                        <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center mb-2">
                          {file.type === 'image' ? (
                            <img
                              src={file.thumbnailUrl || file.url}
                              alt={file.alt || file.title}
                              className="w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <div className="text-gray-400">
                              {getFileIcon(file.type)}
                            </div>
                          )}
                        </div>

                        {/* File Info */}
                        <div className="text-xs">
                          <p className="font-medium text-gray-900 truncate" title={file.title}>
                            {file.title}
                          </p>
                          {file.fileSize && (
                            <p className="text-gray-500">
                              {formatFileSize(file.fileSize)}
                            </p>
                          )}
                          {file.width && file.height && (
                            <p className="text-gray-500">
                              {file.width} × {file.height}
                            </p>
                          )}
                        </div>

                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          {allowMultiple && (
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                onClick={handleConfirmSelection}
                disabled={selectedFiles.length === 0}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Seç ({selectedFiles.length})
              </button>
              <button
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                İptal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
