import {
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
  WorkspaceConfiguration,
} from '@nrwl/devkit';
import { Tree } from 'nx/src/generators/tree';
import { NormalizedSchema } from '../schema';

export async function updateWorkspaceConfig(
  tree: Tree,
  options: NormalizedSchema
) {
  const workspaceConfig = readWorkspaceConfiguration(tree);
  const packageName = require('../../../../package.json').name;
  const { style } = options;

  const update: WorkspaceConfiguration = {
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
      // [`${packageName}:application`]: {
      //   style,
      //   linter: "eslint",
      //   unitTestRunner: "jest",
      //   e2eTestRunner: "cypress"
      // },
      [`${packageName}:library`]: {
        linter: 'eslint',
        unitTestRunner: 'jest',
      },
      [`${packageName}:component`]: {
        style,
      },
    },
  };
  updateWorkspaceConfiguration(tree, update);
}
