'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, X, ChevronDown, Folder, FolderPlus } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onCategorySelect: (categoryId: number) => void;
  onCategoryCreate: (name: string, description: string) => Promise<Category>;
  placeholder?: string;
  allowCreate?: boolean;
}

export default function CategorySelector({
  categories,
  selectedCategoryId,
  onCategorySelect,
  onCategoryCreate,
  placeholder = 'Kategori seçin...',
  allowCreate = true,
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
  
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowCreateForm(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsCreating(true);
    try {
      const newCategory = await onCategoryCreate(
        newCategoryName.trim(),
        newCategoryDescription.trim()
      );
      onCategorySelect(newCategory.id);
      setNewCategoryName('');
      setNewCategoryDescription('');
      setShowCreateForm(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    onCategorySelect(categoryId);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border-2 border-teal-light rounded-lg bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] focus:ring-2 focus:ring-teal-medium focus:border-teal-medium transition-all duration-300 text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-teal-medium" />
            <span className="font-bookmania text-brown-dark">
              {selectedCategory ? selectedCategory.name : placeholder}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 text-brown-light transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white rounded-lg shadow-xl border border-teal-light max-h-80 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-teal-light/30">
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kategori ara..."
              className="w-full px-3 py-2 bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] rounded-lg border border-teal-light focus:ring-2 focus:ring-teal-medium focus:border-teal-medium outline-none font-bookmania text-brown-dark placeholder-brown-light"
            />
          </div>

          {/* Categories List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-[var(--bg-primary)] hover:to-[var(--bg-secondary)] font-bookmania transition-colors ${
                    selectedCategoryId === category.id
                      ? 'bg-gradient-to-r from-teal-light/20 to-teal-medium/20 text-teal-dark'
                      : 'text-brown-dark'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-teal-medium" />
                    <div>
                      <div className="font-bookmania-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-xs text-brown-light font-bookmania">
                          {category.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-brown-light font-bookmania">
                {searchQuery ? 'Kategori bulunamadı' : 'Kategori yok'}
              </div>
            )}
          </div>

          {/* Create Category Section */}
          {allowCreate && (
            <div className="border-t border-teal-light/30">
              {!showCreateForm ? (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-[var(--bg-primary)] hover:to-[var(--bg-secondary)] font-bookmania text-teal-medium transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FolderPlus className="w-4 h-4" />
                    <span>Yeni Kategori Oluştur</span>
                  </div>
                </button>
              ) : (
                <form onSubmit={handleCreateCategory} className="p-4 space-y-3">
                  <div>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Kategori adı..."
                      required
                      className="w-full px-3 py-2 bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] rounded-lg border border-teal-light focus:ring-2 focus:ring-teal-medium focus:border-teal-medium outline-none font-bookmania text-brown-dark placeholder-brown-light"
                    />
                  </div>
                  
                  <div>
                    <textarea
                      value={newCategoryDescription}
                      onChange={(e) => setNewCategoryDescription(e.target.value)}
                      placeholder="Kategori açıklaması (opsiyonel)..."
                      rows={2}
                      className="w-full px-3 py-2 bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] rounded-lg border border-teal-light focus:ring-2 focus:ring-teal-medium focus:border-teal-medium outline-none font-bookmania text-brown-dark placeholder-brown-light resize-none"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={!newCategoryName.trim() || isCreating}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-teal-medium to-teal-dark text-white rounded-lg hover:from-teal-dark hover:to-teal-dark disabled:opacity-50 disabled:cursor-not-allowed font-bookmania-medium text-sm transition-all duration-300"
                    >
                      {isCreating ? 'Oluşturuluyor...' : 'Oluştur'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewCategoryName('');
                        setNewCategoryDescription('');
                      }}
                      className="px-3 py-2 bg-gradient-to-r from-brown-light to-brown-medium text-white rounded-lg hover:from-brown-medium hover:to-brown-dark font-bookmania-medium text-sm transition-all duration-300"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}