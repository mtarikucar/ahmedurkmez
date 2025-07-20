import { Node } from '@tiptap/core';

export interface VideoEmbedOptions {
  allowFullscreen: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    videoEmbed: {
      setVideoEmbed: (options: { src: string }) => ReturnType;
    };
  }
}

export const VideoEmbed = Node.create<VideoEmbedOptions>({
  name: 'videoEmbed',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      allowFullscreen: true,
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
        tag: 'div[data-video-embed]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, title } = HTMLAttributes;
    
    if (!src) return ['div'];

    // Extract video ID and determine platform
    let embedUrl = '';
    let videoId = '';
    
    // YouTube
    const youtubeMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      videoId = youtubeMatch[1];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo
    const vimeoMatch = src.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      videoId = vimeoMatch[1];
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }

    if (!embedUrl) {
      // Direct video URL
      return [
        'div',
        { 'data-video-embed': '', class: 'video-embed' },
        [
          'video',
          {
            src,
            controls: true,
            class: 'w-full rounded-lg shadow-lg',
          },
        ],
      ];
    }

    return [
      'div',
      { 'data-video-embed': '', class: 'video-embed my-6' },
      [
        'iframe',
        {
          src: embedUrl,
          frameborder: '0',
          allowfullscreen: this.options.allowFullscreen,
          class: 'w-full aspect-video rounded-lg shadow-lg',
          title: title || 'Video',
        },
      ],
    ];
  },

  addCommands() {
    return {
      setVideoEmbed:
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