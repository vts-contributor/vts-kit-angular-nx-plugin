import {
  readNxJson,
  NxJsonConfiguration,
  updateNxJson
} from '@nx/devkit';
import { Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export async function updateWorkspaceConfig(
  tree: Tree,
  options: NormalizedSchema
) {
  const workspaceConfig = readNxJson(tree);
  const packageName = require('../../../../package.json').name;
  const { style, defaultApp } = options;

  const update: NxJsonConfiguration = {
    ...workspaceConfig,
    generators: {
      [`${packageName}`]: {
        application: {
          linter: 'eslint',
        },
        library: {
          linter: 'eslint',
        },
      },
      [`${packageName}:library`]: {
        linter: 'eslint',
        unitTestRunner: 'jest',
      },
      [`${packageName}:component`]: {
        style,
      },
    },
    defaultProject: defaultApp
  };
  updateNxJson(tree, update);
}
