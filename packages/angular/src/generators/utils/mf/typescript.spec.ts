import * as tsUtils from '@nx/workspace/src/utilities/typescript';
import * as fs from 'fs';
import { readTsPathMappings } from './typescript';

describe('readTsPathMappings', () => {
  it('should normalize paths', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(tsUtils, 'readTsConfig').mockReturnValue({
      options: {
        paths: {
          '@myorg/lib1': ['./libs/lib1/src/index.ts'],
          '@myorg/lib2': ['libs/lib2/src/index.ts'],
        },
      },
    } as any);

    const paths = readTsPathMappings('/path/to/tsconfig.json');

    expect(paths).toEqual({
      '@myorg/lib1': ['libs/lib1/src/index.ts'],
      '@myorg/lib2': ['libs/lib2/src/index.ts'],
    });
  });
});
