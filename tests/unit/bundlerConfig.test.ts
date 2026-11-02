import { describe, expect, it } from 'vitest';
import config from '../../next.config.mjs';

describe('Turbopack compatibility boundaries', () => {
  it('excludes AlaSQL’s unused React Native adapters in client and SSR builds', () => {
    expect(config).toMatchObject({ turbopack: { resolveAlias: {
      'react-native': './src/lib/compat/emptyOptionalModule.ts',
      'react-native-fs': './src/lib/compat/emptyOptionalModule.ts',
      'react-native-fetch-blob': './src/lib/compat/emptyOptionalModule.ts',
    } } });
  });

  it('preserves server Node built-ins used by authentication and database access', () => {
    expect(config.serverExternalPackages).toContain('@electric-sql/pglite');
    for (const name of ['crypto', 'node:crypto', 'fs', 'node:fs', 'module', 'node:module']) {
      expect(config).not.toHaveProperty(`turbopack.resolveAlias.${name}`);
    }
  });
});
