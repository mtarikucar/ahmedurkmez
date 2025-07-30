'use client';

import { useState } from 'react';
import EBookViewer from '@/components/ui/EBookViewer';
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
    content: string;
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

  // Extract PDF URL from article content or pdfFile field
  const getPdfUrl = () => {
    // First try the pdfFile field
    if (article.pdfFile) {
      return article.pdfFile;
    }

    // Parse content for embedded PDFs
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = article.content;
    
    // Look for data-src attributes in PDF embeds
    const pdfEmbeds = tempDiv.querySelectorAll('[data-src*=".pdf"]');
    if (pdfEmbeds.length > 0) {
      const firstEmbed = pdfEmbeds[0] as HTMLElement;
      return firstEmbed.getAttribute('data-src');
    }

    // Look for iframe src attributes pointing to PDFs
    const iframes = tempDiv.querySelectorAll('iframe[src*=".pdf"]');
    if (iframes.length > 0) {
      const firstIframe = iframes[0] as HTMLIFrameElement;
      return firstIframe.src;
    }

    return null;
  };

  const pdfUrl = getPdfUrl();
  
  if (!pdfUrl) {
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
            {showPDFViewer ? 'E-Kitabı Kapat' : 'E-Kitabı Aç'}
          </button>
        </div>

        {showPDFViewer && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
            <button
              onClick={() => setShowPDFViewer(false)}
              className="absolute top-4 right-4 z-60 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <EBookViewer
              pdfUrl={pdfUrl}
              title={article.title || 'PDF Belgesi'}
              onClose={() => setShowPDFViewer(false)}
            />
          </div>
        )}

        {/* PDF Preview Card */}
        {!showPDFViewer && (
          <div className="animate-fade-in">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 text-center shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer" 
                 onClick={() => setShowPDFViewer(true)}>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full mb-4 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {article.title || 'PDF E-Kitap'}
              </h3>
              <p className="text-gray-600 mb-6">
                İnteraktif sayfa çevirme ile okuyun
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg hover:transform hover:translateY(-1px)">
                E-Kitabı Aç
              </button>
            </div>
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
