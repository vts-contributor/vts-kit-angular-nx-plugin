jest.mock('fs');
import * as fs from 'fs';
import * as tsUtils from './typescript';

import * as devkit from '@nx/devkit';
import { sharePackages, shareWorkspaceLibraries } from './mf-webpack';

describe('MF Webpack Utils', () => {
  afterEach(() => jest.clearAllMocks());

  describe('ShareWorkspaceLibraries', () => {
    it('should error when the tsconfig file does not exist', () => {
      // ARRANGE
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      // ACT
      try {
        shareWorkspaceLibraries([
          { name: 'shared', root: 'libs/shared', importKey: '@myorg/shared' },
        ]);
      } catch (error) {
        // ASSERT
        expect(error.message).toContain(
          'NX MF: TsConfig Path for workspace libraries does not exist!'
        );
      }
    });

    it('should create an object with correct setup', () => {
      // ARRANGE
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      jest.spyOn(tsUtils, 'readTsPathMappings').mockReturnValue({
        '@myorg/shared': ['/libs/shared/src/index.ts'],
      });

      // ACT
      const sharedLibraries = shareWorkspaceLibraries([
        { name: 'shared', root: 'libs/shared', importKey: '@myorg/shared' },
      ]);

      // ASSERT
      expect(sharedLibraries.getAliases()).toHaveProperty('@myorg/shared');
      expect(sharedLibraries.getAliases()['@myorg/shared']).toContain(
        'libs/shared/src/index.ts'
      );
      expect(sharedLibraries.getLibraries()).toEqual({
        '@myorg/shared': {
          eager: undefined,
          requiredVersion: false,
        },
      });
    });

    it('should handle path mappings with wildcards correctly in non-buildable libraries', () => {
      // ARRANGE
      (fs.existsSync as jest.Mock).mockImplementation(
        (file: string) => !file?.endsWith('package.json')
      );
      jest.spyOn(tsUtils, 'readTsPathMappings').mockReturnValue({
        '@myorg/shared': ['/libs/shared/src/index.ts'],
        '@myorg/shared/*': ['/libs/shared/src/lib/*'],
      });

      // ACT
      const sharedLibraries = shareWorkspaceLibraries([
        { name: 'shared', root: 'libs/shared', importKey: '@myorg/shared' },
      ]);

      // ASSERT
      expect(sharedLibraries.getAliases()).toHaveProperty('@myorg/shared');
      expect(sharedLibraries.getAliases()['@myorg/shared']).toContain(
        'libs/shared/src/index.ts'
      );
      expect(sharedLibraries.getLibraries()).toEqual({
        '@myorg/shared': {
          eager: undefined,
          requiredVersion: false,
        },
      });
    });

    it('should create an object with empty setup when tsconfig does not contain the shared lib', () => {
      // ARRANGE
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      jest.spyOn(tsUtils, 'readTsPathMappings').mockReturnValue({});

      // ACT
      const sharedLibraries = shareWorkspaceLibraries([
        { name: 'shared', root: 'libs/shared', importKey: '@myorg/shared' },
      ]);

      // ASSERT
      expect(sharedLibraries.getAliases()).toEqual({});
      expect(sharedLibraries.getLibraries()).toEqual({});
    });
  });

  describe('SharePackages', () => {
    it('should throw when it cannot find root package.json', () => {
      // ARRANGE
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      // ACT
      try {
        sharePackages(['@angular/core']);
      } catch (error) {
        // ASSERT
        expect(error.message).toEqual(
          'NX MF: Could not find root package.json to determine dependency versions.'
        );
      }
    });

    it('should correctly map the shared packages to objects', () => {
      // ARRANGE
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      jest.spyOn(devkit, 'readJsonFile').mockImplementation((file) => ({
        name: file.replace(/\\/g, '/').replace(/^.*node_modules[/]/, ''),
        dependencies: {
          '@angular/core': '~13.2.0',
          '@angular/common': '~13.2.0',
          rxjs: '~7.4.0',
        },
      }));
      (fs.readdirSync as jest.Mock).mockReturnValue([]);

      // ACT
      const packages = sharePackages([
        '@angular/core',
        '@angular/common',
        'rxjs',
      ]);
      // ASSERT
      expect(packages).toEqual({
        '@angular/core': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '~13.2.0',
        },
        '@angular/common': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '~13.2.0',
        },
        rxjs: {
          singleton: true,
          strictVersion: true,
          requiredVersion: '~7.4.0',
        },
      });
    });

    it('should correctly map the shared packages to objects even with nested entry points', () => {
      // ARRANGE

      /**
       * This creates a bunch of mocks that aims to test that
       * the sharePackages function can handle nested
       * entrypoints in the package that is being shared.
       *
       * This will set up a directory structure that matches
       * the following:
       *
       * - @angular/core/
       *   - package.json
       * - @angular/common/
       *   - http/
       *     - testing/
       *       - package.json
       *   - package.json
       * - rxjs
       *   - package.json
       *
       * The result is that there would be 4 packages that
       * need to be shared, as determined by the folders
       * containing the package.json files
       */
      createMockedFSForNestedEntryPoints();

      // ACT
      const packages = sharePackages([
        '@angular/core',
        '@angular/common',
        'rxjs',
      ]);
      // ASSERT
      expect(packages).toEqual({
        '@angular/core': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '~13.2.0',
        },
        '@angular/common': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '~13.2.0',
        },
        '@angular/common/http/testing': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '~13.2.0',
        },
        rxjs: {
          singleton: true,
          strictVersion: true,
          requiredVersion: '~7.4.0',
        },
      });
    });

    it('should not collect a folder with a package.json when cannot be required', () => {
      // ARRANGE
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      jest.spyOn(devkit, 'readJsonFile').mockImplementation((file) => {
        // the "schematics" folder is not an entry point
        if (file.endsWith('@angular/core/schematics/package.json')) {
          return {};
        }

        return {
          name: file
            .replace(/\\/g, '/')
            .replace(/^.*node_modules[/]/, '')
            .replace('/package.json', ''),
          dependencies: { '@angular/core': '~13.2.0' },
        };
      });
      (fs.readdirSync as jest.Mock).mockImplementation(
        (directoryPath: string) => {
          const packages = {
            '@angular/core': ['testing', 'schematics'],
          };

          for (const key of Object.keys(packages)) {
            if (directoryPath.endsWith(key)) {
              return packages[key];
            }
          }
          return [];
        }
      );
      (fs.lstatSync as jest.Mock).mockReturnValue({ isDirectory: () => true });

      // ACT
      const packages = sharePackages(['@angular/core']);

      // ASSERT
      expect(packages).toStrictEqual({
        '@angular/core': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '~13.2.0',
        },
        '@angular/core/testing': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '~13.2.0',
        },
      });
    });

    it('should collect secondary entry points from exports and fall back to lookinp up for package.json', () => {
      // ARRANGE
      (fs.existsSync as jest.Mock).mockImplementation(
        (path) => !path.endsWith('/secondary/package.json')
      );
      jest.spyOn(devkit, 'readJsonFile').mockImplementation((file) => {
        if (file.endsWith('pkg1/package.json')) {
          return {
            name: 'pkg1',
            version: '1.0.0',
            exports: {
              '.': './index.js',
              './package.json': './package.json',
              './secondary': './secondary/index.js',
            },
          };
        }

        // @angular/core/package.json won't have exports, so it looks up for package.json
        return {
          name: file
            .replace(/\\/g, '/')
            .replace(/^.*node_modules[/]/, '')
            .replace('/package.json', ''),
          dependencies: { pkg1: '1.0.0', '@angular/core': '~13.2.0' },
        };
      });
      (fs.readdirSync as jest.Mock).mockImplementation(
        (directoryPath: string) => {
          const packages = {
            pkg1: ['secondary'],
            '@angular/core': ['testing'],
          };

          for (const key of Object.keys(packages)) {
            if (directoryPath.endsWith(key)) {
              return packages[key];
            }
          }
          return [];
        }
      );
      (fs.lstatSync as jest.Mock).mockReturnValue({ isDirectory: () => true });

      // ACT
      const packages = sharePackages(['pkg1', '@angular/core']);

      // ASSERT
      expect(packages).toStrictEqual({
        pkg1: {
          singleton: true,
          strictVersion: true,
          requiredVersion: '1.0.0',
        },
        'pkg1/secondary': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '1.0.0',
        },
        '@angular/core': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '~13.2.0',
        },
        '@angular/core/testing': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '~13.2.0',
        },
      });
    });

    it('should not throw when the main entry point package.json cannot be required', () => {
      // ARRANGE
      (fs.existsSync as jest.Mock).mockImplementation(
        (file) => !file.endsWith('non-existent-top-level-package/package.json')
      );
      jest.spyOn(devkit, 'readJsonFile').mockImplementation((file) => ({
        name: file
          .replace(/\\/g, '/')
          .replace(/^.*node_modules[/]/, '')
          .replace('/package.json', ''),
        dependencies: { '@angular/core': '~13.2.0' },
      }));

      // ACT & ASSERT
      expect(() =>
        sharePackages(['non-existent-top-level-package'])
      ).not.toThrow();
    });
  });
});

function createMockedFSForNestedEntryPoints() {
  (fs.existsSync as jest.Mock).mockImplementation((file: string) => {
    if (file.endsWith('http/package.json')) {
      return false;
    } else {
      return true;
    }
  });

  jest.spyOn(devkit, 'readJsonFile').mockImplementation((file) => ({
    name: file
      .replace(/\\/g, '/')
      .replace(/^.*node_modules[/]/, '')
      .replace('/package.json', ''),
    dependencies: {
      '@angular/core': '~13.2.0',
      '@angular/common': '~13.2.0',
      rxjs: '~7.4.0',
    },
  }));

  (fs.readdirSync as jest.Mock).mockImplementation((directoryPath: string) => {
    const PACKAGE_SETUP = {
      '@angular/core': [],
      '@angular/common': ['http'],
      http: ['testing'],
      testing: [],
    };

    for (const key of Object.keys(PACKAGE_SETUP)) {
      if (directoryPath.endsWith(key)) {
        return PACKAGE_SETUP[key];
      }
    }
    return [];
  });

  (fs.lstatSync as jest.Mock).mockReturnValue({ isDirectory: () => true });
}
