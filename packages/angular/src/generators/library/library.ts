import {
  addDependenciesToPackageJson,
  formatFiles,
  installPackagesTask,
  moveFilesToNewDirectory,
  removeDependenciesFromPackageJson,
  Tree,
} from '@nrwl/devkit';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';
import { jestProjectGenerator } from '@nrwl/jest';
import { convertToNxProjectGenerator } from '@nrwl/workspace/generators';
import { ngPackagrVersion } from '../utils/versions';
import { karmaProjectGenerator } from '@nrwl/angular/generators';
import { addBuildableLibrariesPostCssDependencies } from '../utils/dependencies';
import { enableStrictTypeChecking } from './lib/enable-strict-type-checking';
import { normalizeOptions } from './lib/normalize-options';
import { NormalizedSchema } from './lib/normalized-schema';
import { updateLibPackageNpmScope } from './lib/update-lib-package-npm-scope';
import { updateProject } from './lib/update-project';
import { updateTsConfig } from './lib/update-tsconfig';
import { Schema } from './schema';
import { createRoutes } from './lib/create-routes';
import { addLazyLoadedRouterConfiguration } from './lib/add-lazy-loaded-router-configuration';
import { logger } from '@nrwl/devkit';

export async function libraryGenerator(tree: Tree, schema: Partial<Schema>) {
  // Do some validation checks
  if (schema.publishable === true && !schema.importPath) {
    throw new Error(
      `For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)`
    );
  }

  // Warn app routing importing
  if (schema.feature === true && !schema.appRoutingProject) {
    logger.warn(
      'You are about to create a feature library which should have an importing in main application but no option of appRoutingProject provided. Using default project.'
    );
  }

  const options = normalizeOptions(tree, schema);
  const { libraryOptions } = options;

  const runAngularLibrarySchematic = wrapAngularDevkitSchematic(
    '@schematics/angular',
    'library'
  );
  await runAngularLibrarySchematic(tree, {
    name: libraryOptions.name,
    entryFile: 'index',
    skipPackageJson:
      libraryOptions.skipPackageJson ||
      !(libraryOptions.publishable || libraryOptions.buildable),
    skipTsConfig: true,
  });

  if (libraryOptions.ngCliSchematicLibRoot !== libraryOptions.projectRoot) {
    moveFilesToNewDirectory(
      tree,
      libraryOptions.ngCliSchematicLibRoot,
      libraryOptions.projectRoot
    );
  }
  await updateProject(tree, libraryOptions);
  updateTsConfig(tree, libraryOptions);
  await addUnitTestRunner(tree, libraryOptions);
  updateNpmScopeIfBuildableOrPublishable(tree, libraryOptions);

  if (libraryOptions.feature) {
    await createRoutes(tree, options);
    addLazyLoadedRouterConfiguration(tree, libraryOptions);
  }

  setStrictMode(tree, libraryOptions);

  if (libraryOptions.buildable || libraryOptions.publishable) {
    removeDependenciesFromPackageJson(tree, [], ['ng-packagr']);
    addDependenciesToPackageJson(
      tree,
      {},
      {
        'ng-packagr': ngPackagrVersion,
      }
    );
    addBuildableLibrariesPostCssDependencies(tree);
  }

  await convertToNxProjectGenerator(tree, {
    project: libraryOptions.name,
    all: false,
    skipFormat: true,
  });

  await formatFiles(tree);

  return () => {
    installPackagesTask(tree);
  };
}

async function addUnitTestRunner(
  host: Tree,
  options: NormalizedSchema['libraryOptions']
) {
  if (options.unitTestRunner === 'jest') {
    await jestProjectGenerator(host, {
      project: options.name,
      setupFile: 'angular',
      supportTsx: false,
      skipSerializers: false,
      skipFormat: true,
    });
  } else if (options.unitTestRunner === 'karma') {
    await karmaProjectGenerator(host, {
      project: options.name,
      skipFormat: true,
    });
  }
}

function updateNpmScopeIfBuildableOrPublishable(
  host: Tree,
  options: NormalizedSchema['libraryOptions']
) {
  if (options.buildable || options.publishable) {
    updateLibPackageNpmScope(host, options);
  }
}

function setStrictMode(
  host: Tree,
  options: NormalizedSchema['libraryOptions']
) {
  if (options.strict) {
    enableStrictTypeChecking(host, options);
  }
}

export default libraryGenerator;
