import { Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import {
  addDependenciesToPackageJson,
} from '@nx/devkit';
import * as versions from '../../utils/versions'

export function installPackage(tree: Tree, options: NormalizedSchema) {
  return addDependenciesToPackageJson(
    tree,
    {
      "@ngrx/component-store": versions.angularVersion,
      "@ngrx/effects": versions.angularVersion,
      "@ngrx/entity": versions.angularVersion,
      "@ngrx/router-store": versions.angularVersion,
      "@ngrx/store": versions.angularVersion,
      "ngrx-immer": "latest",
    },
    {
      "@ngrx/schematics": versions.angularVersion,
    }
  );
}