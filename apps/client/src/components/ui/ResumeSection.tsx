'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ResumeSectionProps {
  section: {
    id: number;
    title: string;
    summary: string;
    description: string;
    icon: any;
    color: string;
    gradient: string;
    slug: string;
    details: string;
  };
}

export default function ResumeSection({ section }: ResumeSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const IconComponent = section.icon;

  return (
    <div className="mb-4">
      {/* Section Header */}
      <div 
        className="p-4 rounded-xl cursor-pointer transition-all font-bookmania shadow-md hover:shadow-lg border-2 border-white/40 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          color: 'white'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <IconComponent className="h-6 w-6 text-white" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-white">{section.title}</h3>
              <p className="text-sm opacity-90 mt-1 text-white leading-relaxed">{section.summary}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isExpanded ? (
              <ChevronDownIcon className="h-5 w-5 text-white" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-white" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 p-4 rounded-xl border-2 border-white/20" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
          <p className="text-white font-bookmania text-sm leading-relaxed mb-4 opacity-90">
            {section.description}
          </p>
          
          {/* Preview Content */}
          <div 
            className="text-white font-bookmania text-sm leading-relaxed mb-4 opacity-80"
            dangerouslySetInnerHTML={{ 
              __html: section.details.substring(0, 200) + '...' 
            }}
          />
          
          {/* Detail Link */}
          <Link 
            href={`/resume/${section.slug}`}
            className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-bookmania text-sm font-medium border border-white/30"
          >
            Detaya Git →
          </Link>
        </div>
      )}
    </div>
  );
}
