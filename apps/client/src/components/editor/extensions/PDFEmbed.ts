import { Node } from '@tiptap/core';

export interface PDFEmbedOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pdfEmbed: {
      setPDFEmbed: (options: { src: string; title?: string }) => ReturnType;
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
    const { src, title } = HTMLAttributes;
    
    if (!src) return ['div'];

    return [
      'div',
      { 'data-pdf-embed': '', class: 'pdf-embed my-6' },
      [
        'div',
        { class: 'bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] rounded-lg shadow-lg p-4' },
        [
          'div',
          { class: 'flex items-center justify-between mb-2' },
          [
            'span',
            { class: 'text-brown-dark font-bookmania-medium' },
            title || 'PDF Belgesi',
          ],
          [
            'a',
            {
              href: src,
              target: '_blank',
              rel: 'noopener noreferrer',
              class: 'text-teal-medium hover:text-teal-dark transition-colors',
            },
            'İndir',
          ],
        ],
        [
          'iframe',
          {
            src,
            class: 'w-full h-96 border-2 border-teal-light rounded',
          },
        ],
      ],
    ];
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