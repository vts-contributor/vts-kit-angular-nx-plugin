import {
  joinPathFragments,
  ProjectConfiguration,
  readJsonFile,
  updateProjectConfiguration,
  workspaceRoot,
} from '@nrwl/devkit';
import { existsSync } from 'fs';
import { Tree } from 'nx/src/generators/tree';
import { readDefaultProjectConfigurationFromTree } from '../../utils/project';
import { NormalizedSchema } from '../schema';

/**
 * Create webpack and add bundle analyze
 */
export async function updateWebpack(tree: Tree, options: NormalizedSchema) {
  await createWebpackAndProjectConfig(tree, options)
  await addScript(tree, options)
}

export async function createWebpackAndProjectConfig(tree: Tree, options: NormalizedSchema) {
  const projectConfig = readDefaultProjectConfigurationFromTree(tree);
  const { name } = projectConfig;

  const webpackPath = `apps/${name}/webpack`;
  const webpackContent = `
  const { merge } = require('webpack-merge');
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  
  module.exports = (config, context) => {
    return merge(config, {
      // overwrite values here
      plugins: [
        ...(process.env.ANALYZE ? [new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerHost: '127.0.0.1',
          analyzerPort: 8001
        })] : [])
      ]
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
  updateProjectConfiguration(tree, name, update);
}

export async function addScript(tree: Tree, options: NormalizedSchema) {
  try {
    const pkgJsonContent = JSON.parse(tree.read('package.json', 'utf-8'))
    const update = {
      ...pkgJsonContent,
      scripts: {
        ...pkgJsonContent.scripts,
        'start:analyze': 'cross-env ANALYZE=1 npm run start',
        'build:analyze': 'cross-env ANALYZE=1 npm run build'
      }
    }
    tree.write('package.json', JSON.stringify(update))
  } catch {
    throw new Error("Failed to update script in package.json")
  }
}