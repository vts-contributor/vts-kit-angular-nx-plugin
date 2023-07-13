import { addDependenciesToPackageJson, Tree } from '@nx/devkit';
import { postcssVersion, postcssImportVersion, postcssPresetEnvVersion, postcssUrlVersion } from './versions'

export function addBuildableLibrariesPostCssDependencies(tree: Tree): void {
  addDependenciesToPackageJson(
    tree,
    {},
    {
      postcss: postcssVersion,
      'postcss-import': postcssImportVersion,
      'postcss-preset-env': postcssPresetEnvVersion,
      'postcss-url': postcssUrlVersion,
    }
  );
}