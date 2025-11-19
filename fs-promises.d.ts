declare module 'fs/promises' {
  export function readFile(
    path: string | URL,
    options?: { encoding?: string | null } | string
  ): Promise<string>;
}
