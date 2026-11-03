import ts from 'typescript';
import { createReactTypeChecker } from './check';

self.onmessage = async ({ data }: MessageEvent<{ code: string }>) => {
  try {
    const response = await fetch('/react-typescript-libs.json');
    if (!response.ok) throw new Error('TypeScript declarations unavailable. Rebuild and retry.');
    const checker = createReactTypeChecker(ts, await response.json());
    self.postMessage({ errors: checker(data.code) });
  } catch (error) {
    self.postMessage({ errors: [error instanceof Error ? error.message : 'Type checker failed.'] });
  }
};
