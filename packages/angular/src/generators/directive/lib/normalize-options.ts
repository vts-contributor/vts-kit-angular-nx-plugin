import type { Tree } from '@nx/devkit';
import type { NormalizedSchema, Schema } from '../schema';
import { normalizeProjectAndPath } from '../../utils/project';
import { dasherize } from '@angular-devkit/core/src/utils/strings';

export function normalizeOptions(
  tree: Tree,
  options: Schema
): NormalizedSchema {
  const { isDefault, ...rest } = normalizeProjectAndPath(tree, options);
  let selector = '';
  const { selector: providedSelector, project, name } = options;
  if (providedSelector) selector = providedSelector;
  else selector = `${dasherize(project)}-${dasherize(name)}`;

  return {
    ...options,
    ...rest,
    skipImport: true,
    standalone: true,
    flat: !isDefault,
    selector,
  };
}
