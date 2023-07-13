import {
  readNxJson,
  NxJsonConfiguration,
  updateNxJson
} from '@nx/devkit';
import { Tree } from 'nx/src/generators/tree';
import { NormalizedSchema } from '../schema';

export async function updateWorkspaceConfig(
  tree: Tree,
  options: NormalizedSchema
) {
  const workspaceConfig = readNxJson(tree);
  const packageName = require('../../../../package.json').name;
  const { style } = options;

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
  updateNxJson(tree, update);
}
