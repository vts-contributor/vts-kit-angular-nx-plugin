import {
  getWorkspaceLayout,
  getWorkspacePath,
  joinPathFragments,
  names,
  readJson,
  readProjectConfiguration,
  readWorkspaceConfiguration,
  Tree,
} from '@nrwl/devkit';
import { getImportPath } from 'nx/src/utils/path';
import { Schema } from '../schema';
import { NormalizedSchema } from './normalized-schema';
import { Linter } from '@nrwl/linter';
import { UnitTestRunner } from '../../utils/test-runners';
import { logger } from '@nrwl/devkit';

export function normalizeOptions(
  host: Tree,
  schema: Partial<Schema>
): NormalizedSchema {
  // Create a schema with populated default values
  const options: Schema = {
    buildable: false,
    linter: Linter.EsLint,
    name: '', // JSON validation will ensure this is set
    publishable: false,
    unitTestRunner: UnitTestRunner.Jest,
    // Publishable libs cannot use `full` yet, so if its false then use the passed value or default to `full`
    compilationMode: schema.publishable
      ? 'partial'
      : schema.compilationMode ?? 'full',
    ...schema,
  };

  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`.replace(/\/+/g, '/')
    : name;

  const { libsDir, npmScope } = getWorkspaceLayout(host);

  const projectName = projectDirectory
    .replace(new RegExp('/', 'g'), '-')
    .replace(/-\d+/g, '');
  const fileName = projectName;
  const projectRoot = joinPathFragments(libsDir, projectDirectory);

  const moduleName = `${names(fileName).className}Module`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];
  const modulePath = `${projectRoot}/src/lib/${fileName}.module.ts`;

  const importPath =
    options.importPath || getImportPath(npmScope, projectDirectory);

  // Determine the roots where @schematics/angular will place the projects
  // This might not be where the projects actually end up
  const workspaceJsonPath = getWorkspacePath(host);
  let newProjectRoot = null;
  if (workspaceJsonPath) {
    ({ newProjectRoot } = readJson(host, workspaceJsonPath));
  }
  const ngCliSchematicLibRoot = newProjectRoot
    ? `${newProjectRoot}/${projectName}`
    : projectName;

  // App Routing Project
  let appInfo: any = { appRouting: null, appRoutingPath: null };
  let appRouting =
    options.appRoutingProject ??
    readWorkspaceConfiguration(host).defaultProject;

  const { projectType, root, sourceRoot } = readProjectConfiguration(
    host,
    appRouting
  );
  if (projectType !== 'application') {
    logger.error(
      `${appRouting} is a project of ${projectType}, which is not APPLICATION. Routing importing to application will be skipped`
    );
  } else {
    const appSourceRoot = sourceRoot ?? joinPathFragments(root, 'src');
    const appRoutingPath = joinPathFragments(appSourceRoot, 'app');
    appInfo = { appRouting, appRoutingPath };
  }

  const allNormalizedOptions = {
    ...options,
    ...appInfo,
    linter: options.linter ?? Linter.EsLint,
    unitTestRunner: options.unitTestRunner ?? UnitTestRunner.Jest,
    name: projectName,
    projectRoot,
    entryFile: 'index',
    projectDirectory,
    parsedTags,
    importPath,
    ngCliSchematicLibRoot,
    fileName,
    moduleName,
    modulePath,
  };

  const { ...libraryOptions } = allNormalizedOptions;

  return {
    libraryOptions,
    componentOptions: {
      name: libraryOptions.name,
    },
  };
}
