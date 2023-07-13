import {
  getWorkspaceLayout,
  joinPathFragments,
  Tree,
  updateJson,
} from '@nx/devkit';
import { getRootTsConfigPathInTree } from '@nx/js';
import { NormalizedSchema } from './normalized-schema';

function updateRootConfig(
  host: Tree,
  options: NormalizedSchema['libraryOptions']
) {
  updateJson(host, getRootTsConfigPathInTree(host), (json) => {
    const c = json.compilerOptions;
    c.paths = c.paths || {};
    delete c.paths[options.name];

    if (c.paths[options.importPath]) {
      throw new Error(
        `You already have a library using the import path "${options.importPath}". Make sure to specify a unique one.`
      );
    }

    c.paths[options.importPath] = [
      joinPathFragments(
        getWorkspaceLayout(host).libsDir,
        options.projectDirectory,
        '/src/index.ts'
      ),
    ];

    return json;
  });
}

function updateProjectConfig(
  host: Tree,
  options: NormalizedSchema['libraryOptions']
) {
  updateJson(host, `${options.projectRoot}/tsconfig.lib.json`, (json) => {
    json.include = ['**/*.ts'];
    json.exclude = [
      ...new Set([
        ...(json.exclude || []),
        'jest.config.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
      ]),
    ];
    return json;
  });

  // tsconfig.json
  updateJson(host, `${options.projectRoot}/tsconfig.json`, (json) => ({
    ...json,
    compilerOptions: { ...json.compilerOptions, target: 'es2020' },
  }));
}

function updateProjectIvyConfig(
  host: Tree,
  options: NormalizedSchema['libraryOptions']
) {
  if (options.buildable || options.publishable) {
    return updateJson(
      host,
      `${options.projectRoot}/tsconfig.lib.prod.json`,
      (json) => {
        json.angularCompilerOptions['compilationMode'] =
          options.compilationMode === 'full' ? undefined : 'partial';
        return json;
      }
    );
  }
}

export function updateTsConfig(
  host: Tree,
  options: NormalizedSchema['libraryOptions']
) {
  updateRootConfig(host, options);
  updateProjectConfig(host, options);
  updateProjectIvyConfig(host, options);
}
