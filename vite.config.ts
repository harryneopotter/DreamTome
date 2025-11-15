import { readFile } from 'fs/promises';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

function svgComponentPlugin(): Plugin {
  return {
    name: 'inline-svg-component',
    enforce: 'pre',
    async load(id) {
      if (!id.endsWith('.svg')) {
        return null;
      }

      const raw = await readFile(id, 'utf8');
      const sanitized = raw
        .replace(/<\?xml[^>]*>/g, '')
        .replace(/\r?\n/g, '')
        .replace(/`/g, '\\`')
        .replace(/\$\{/g, '\\${');

      return `import * as React from 'react';
const SvgComponent = React.forwardRef(function SvgComponent({ children, dangerouslySetInnerHTML, ...rest }, ref) {
  return React.createElement('span', {
    ...rest,
    ref,
    dangerouslySetInnerHTML: { __html: \`${sanitized}\` },
  });
});
export default SvgComponent;
`;
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [svgComponentPlugin(), react(), tailwindcss()],
  server: {
    allowedHosts: true,
  },
  esbuild: {
    target: 'esnext',
  },
});
