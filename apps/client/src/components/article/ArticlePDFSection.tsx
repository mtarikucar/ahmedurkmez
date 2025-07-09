'use client';

import { useState } from 'react';
import PDFViewer from '@/components/ui/PDFViewer';
import {
  DocumentIcon,
  AcademicCapIcon,
  CalendarIcon,
  UserGroupIcon,
  HashtagIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

interface ArticlePDFSectionProps {
  article: {
    id: number;
    title: string;
    subtitle?: string;
    pdfFile?: string;
    doi?: string;
    journal?: string;
    publishedDate?: string;
    authors?: string[];
    keywords?: string[];
    type: 'blog_post' | 'academic_paper';
  };
}

export default function ArticlePDFSection({ article }: ArticlePDFSectionProps) {
  const [showPDFViewer, setShowPDFViewer] = useState(false);

  if (!article.pdfFile) {
    return null;
  }

  const isAcademicPaper = article.type === 'academic_paper';

  return (
    <div className="space-y-6">
      {/* Academic Paper Info */}
      {isAcademicPaper && (
        <div className="card-seljuk p-6 animate-fade-in">
          <div className="flex items-center mb-4">
            <AcademicCapIcon className="h-6 w-6 text-burgundy-medium mr-2" />
            <h3 className="text-lg font-bookmania-bold text-brown-dark">
              Akademik Makale Bilgileri
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {article.journal && (
              <div className="flex items-center">
                <DocumentIcon className="h-5 w-5 text-teal-medium mr-2" />
                <div>
                  <span className="text-sm font-bookmania text-brown-light">Dergi:</span>
                  <p className="font-bookmania-medium text-brown-dark">{article.journal}</p>
                </div>
              </div>
            )}
            
            {article.publishedDate && (
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-teal-medium mr-2" />
                <div>
                  <span className="text-sm font-bookmania text-brown-light">Yayın Tarihi:</span>
                  <p className="font-bookmania-medium text-brown-dark">
                    {new Date(article.publishedDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
            )}
            
            {article.authors && article.authors.length > 0 && (
              <div className="flex items-start">
                <UserGroupIcon className="h-5 w-5 text-teal-medium mr-2 mt-1" />
                <div>
                  <span className="text-sm font-bookmania text-brown-light">Yazarlar:</span>
                  <div className="flex flex-wrap gap-1">
                    {article.authors.map((author, index) => (
                      <span
                        key={index}
                        className="inline-block bg-teal-light text-white text-xs font-bookmania-medium px-2 py-1 rounded-full"
                      >
                        {author}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {article.doi && (
              <div className="flex items-center">
                <LinkIcon className="h-5 w-5 text-teal-medium mr-2" />
                <div>
                  <span className="text-sm font-bookmania text-brown-light">DOI:</span>
                  <a
                    href={`https://doi.org/${article.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bookmania-medium text-burgundy-medium hover:text-burgundy-dark transition-colors duration-300"
                  >
                    {article.doi}
                  </a>
                </div>
              </div>
            )}
          </div>
          
          {article.keywords && article.keywords.length > 0 && (
            <div className="mt-4 pt-4 border-t border-teal-light">
              <div className="flex items-start">
                <HashtagIcon className="h-5 w-5 text-teal-medium mr-2 mt-1" />
                <div>
                  <span className="text-sm font-bookmania text-brown-light">Anahtar Kelimeler:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {article.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gradient-to-r from-burgundy-light to-burgundy-medium text-white text-xs font-bookmania-medium px-3 py-1 rounded-full shadow-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PDF Viewer Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bookmania-bold text-brown-dark">
            {isAcademicPaper ? 'Makale PDF\'i' : 'Belge'}
          </h3>
          <button
            onClick={() => setShowPDFViewer(!showPDFViewer)}
            className="btn-primary text-sm"
          >
            {showPDFViewer ? 'Gizle' : 'PDF\'i Görüntüle'}
          </button>
        </div>

        {showPDFViewer ? (
          <div className="animate-scale-in">
            <PDFViewer
              pdfUrl={article.pdfFile}
              title={article.title}
              description={article.subtitle}
              className="max-w-2xl mx-auto"
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            <PDFViewer
              pdfUrl={article.pdfFile}
              title={article.title}
              description={article.subtitle}
              showPreview={false}
              className="max-w-lg"
            />
          </div>
        )}
      </div>

      {/* Citation Section for Academic Papers */}
      {isAcademicPaper && (
        <div className="card-seljuk p-6 animate-fade-in">
          <h4 className="text-lg font-bookmania-bold text-brown-dark mb-3">
            Alıntı Bilgisi
          </h4>
          <div className="bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-tertiary)] p-4 rounded-lg border-l-4 border-burgundy-medium">
            <p className="font-bookmania text-brown-dark text-sm leading-relaxed">
              {article.authors?.join(', ')} ({article.publishedDate ? new Date(article.publishedDate).getFullYear() : 'Tarih belirtilmemiş'}). 
              <em className="font-bookmania-medium"> {article.title}</em>
              {article.subtitle && `: ${article.subtitle}`}. 
              {article.journal && <em> {article.journal}</em>}
              {article.doi && `. DOI: ${article.doi}`}
            </p>
          </div>
          <div className="mt-3 flex space-x-2">
            <button className="btn-secondary text-xs">
              APA Formatı
            </button>
            <button className="btn-secondary text-xs">
              MLA Formatı
            </button>
            <button className="btn-secondary text-xs">
              Chicago Formatı
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
