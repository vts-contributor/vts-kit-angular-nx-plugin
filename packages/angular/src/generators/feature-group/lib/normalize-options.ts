import {
  joinPathFragments,
  readProjectConfiguration,
  readNxJson,
  Tree,
} from '@nx/devkit';
import type { NormalizedSchema, Schema } from '../schema';
import { warn } from 'console';
import { dasherize } from '@angular-devkit/core/src/utils/strings';

export function normalizeOptions(
  tree: Tree,
  options: Schema
): NormalizedSchema {
  return {
    ...options,
    groupPath: dasherize(options.name),
    uiName: 'ui',
    featureName: 'feature',
    dataAccessName: 'data-access',
  };
}
