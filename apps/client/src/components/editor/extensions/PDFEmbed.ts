import { Node } from '@tiptap/core';

export interface PDFEmbedOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pdfEmbed: {
      setPDFEmbed: (options: { src: string; title?: string; displayMode?: 'viewer' | 'ebook' }) => ReturnType;
    };
  }
}

export const PDFEmbed = Node.create<PDFEmbedOptions>({
  name: 'pdfEmbed',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      title: {
        default: null,
      },
      displayMode: {
        default: 'viewer',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-pdf-embed]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, title, displayMode = 'viewer' } = HTMLAttributes;
    
    if (!src) return ['div'];

    if (displayMode === 'ebook') {
      // Interactive E-book viewer
      return [
        'div',
        { 
          'data-pdf-embed': '', 
          class: 'pdf-ebook-embed my-8',
          'data-pdf-url': src,
          'data-pdf-title': title || 'PDF Belgesi'
        },
        [
          'div',
          { class: 'ebook-placeholder bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 text-center shadow-lg border border-blue-200' },
          [
            'div',
            { class: 'inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full mb-4 shadow-lg' },
            [
              'svg',
              { class: 'w-10 h-10 text-white', fill: 'currentColor', viewBox: '0 0 20 20' },
              [
                'path',
                { d: 'M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z' }
              ]
            ]
          ],
          [
            'h3',
            { class: 'text-xl font-bold text-gray-800 mb-2' },
            title || 'PDF E-Kitap'
          ],
          [
            'p',
            { class: 'text-gray-600 mb-6' },
            'İnteraktif sayfa çevirme ile okuyun'
          ],
          [
            'button',
            {
              class: 'ebook-open-btn bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg',
              'data-src': src,
              'data-title': title || 'PDF Belgesi'
            },
            'E-Kitabı Aç'
          ]
        ]
      ];
    } else {
      // Traditional PDF viewer
      return [
        'div',
        { 'data-pdf-embed': '', class: 'pdf-embed my-6' },
        [
          'div',
          { class: 'bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200' },
          [
            'div',
            { class: 'bg-gray-50 px-4 py-3 border-b border-gray-200' },
            [
              'div',
              { class: 'flex items-center justify-between' },
              [
                'div',
                { class: 'flex items-center gap-2' },
                [
                  'svg',
                  { class: 'w-5 h-5 text-red-500', fill: 'currentColor', viewBox: '0 0 20 20' },
                  [
                    'path',
                    { 
                      'fill-rule': 'evenodd',
                      d: 'M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z',
                      'clip-rule': 'evenodd'
                    }
                  ]
                ],
                [
                  'span',
                  { class: 'font-medium text-gray-900' },
                  title || 'PDF Belgesi'
                ]
              ],
              [
                'div',
                { class: 'flex items-center gap-2' },
                [
                  'a',
                  {
                    href: src,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    class: 'text-gray-600 hover:text-gray-800 transition-colors'
                  },
                  'Yeni sekmede aç'
                ],
                [
                  'a',
                  {
                    href: src,
                    download: true,
                    class: 'text-indigo-600 hover:text-indigo-800 transition-colors font-medium'
                  },
                  'İndir'
                ]
              ]
            ]
          ],
          [
            'iframe',
            {
              src,
              class: 'w-full h-96 border-0',
              style: 'min-height: 500px;'
            }
          ]
        ]
      ];
    }
  },

  addCommands() {
    return {
      setPDFEmbed:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});