declare module '*.css';

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';
  const SvgComponent: React.FunctionComponent<React.HTMLAttributes<HTMLSpanElement>>;
  export default SvgComponent;
}
