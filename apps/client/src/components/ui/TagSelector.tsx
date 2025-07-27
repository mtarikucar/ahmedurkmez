'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Hash } from 'lucide-react';

interface TagSelectorProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  suggestions?: string[];
}

export default function TagSelector({
  tags,
  onTagsChange,
  placeholder = 'Etiket ekle...',
  maxTags = 10,
  suggestions = [],
}: TagSelectorProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (input) {
      const filtered = suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(input.toLowerCase()) &&
          !tags.includes(suggestion)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [input, suggestions, tags]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      onTagsChange([...tags, trimmedTag]);
      setInput('');
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      handleRemoveTag(tags.length - 1);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="min-h-[48px] px-4 py-3 border-2 border-teal-light rounded-lg bg-white focus-within:ring-2 focus-within:ring-teal-medium focus-within:border-teal-medium transition-all duration-300 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-teal-light to-teal-medium text-dark rounded-full text-sm font-bookmania-medium animate-fadeIn"
            >
              <Hash className="w-3 h-3" />
              {tag}
              <button
                onClick={() => handleRemoveTag(index)}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          
          {tags.length < maxTags && (
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (filteredSuggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              placeholder={tags.length === 0 ? placeholder : ''}
              className="flex-1 min-w-[120px]  outline-none font-bookmania text-brown-dark placeholder-brown-light/70"
            />
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute z-20 w-full mt-2 bg-white rounded-lg shadow-xl border border-teal-light max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleAddTag(suggestion)}
              className="w-full px-4 py-2 text-left text-brown-dark hover:bg-gradient-to-r hover:from-[var(--bg-primary)] hover:to-[var(--bg-secondary)] font-bookmania transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              <span className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-teal-medium" />
                {suggestion}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Helper Text */}
      <div className="mt-2 text-xs font-bookmania text-brown-light">
        {tags.length}/{maxTags} etiket • Enter veya virgül ile ekleyin
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}