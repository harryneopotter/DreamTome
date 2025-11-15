declare module '*.css';

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import type { FunctionComponent, SVGProps } from 'react';
  const Component: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default Component;
}
