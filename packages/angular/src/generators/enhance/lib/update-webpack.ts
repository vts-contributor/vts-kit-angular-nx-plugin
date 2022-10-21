import {
  ProjectConfiguration,
  readProjectConfiguration,
  readWorkspaceConfiguration,
  updateProjectConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';
import { Tree } from 'nx/src/generators/tree';
import { NormalizedSchema } from '../schema';

export async function updateWebpack(tree: Tree, options: NormalizedSchema) {
  const project = readWorkspaceConfiguration(tree).defaultProject;
  const projectConfig = readProjectConfiguration(tree, project);
  const { name } = projectConfig;

  const webpackPath = `apps/${name}/webpack`;
  const webpackContent = `
  const { merge } = require('webpack-merge');

  module.exports = (config, context) => {
    return merge(config, {
      // overwrite values here
    });
  };
`;
  tree.write(`${webpackPath}/webpack.config.js`, webpackContent);
  tree.write(`${webpackPath}/webpack.config.prod.js`, webpackContent);

  const update: ProjectConfiguration = {
    ...projectConfig,
    targets: {
      ...projectConfig.targets,
      build: {
        ...projectConfig.targets['build'],
        executor: '@nrwl/angular:webpack-browser',
        options: {
          ...projectConfig.targets['build'].options,
          customWebpackConfig: {
            path: `${webpackPath}/webpack.config.js`,
          },
        },
        configurations: {
          ...projectConfig.targets['build'].configurations,
          production: {
            ...projectConfig.targets['build'].configurations.production,
            fileReplacements: [
              ...projectConfig.targets['build'].configurations.production
                .fileReplacements,
              {
                replace: `${webpackPath}/webpack.config.js`,
                with: `${webpackPath}/webpack.config.prod.js`,
              },
            ],
          },
        },
      },
      serve: {
        ...projectConfig.targets['build'],
        executor: '@nrwl/angular:webpack-dev-server',
        configurations: {
          production: {
            browserTarget: `${name}:build:production`,
          },
          development: {
            browserTarget: `${name}:build:development`,
          },
        },
        options: {
          host: 'localhost',
          port: 8000,
        },
        defaultConfiguration: 'development',
      },
    },
  };
  updateProjectConfiguration(tree, project, update);
}
