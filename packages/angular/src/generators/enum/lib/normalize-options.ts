import type { Tree } from '@nx/devkit';
import type { NormalizedSchema, Schema } from '../schema';
import { normalizeProjectAndPath } from '../../utils/project';

export function normalizeOptions(
  tree: Tree,
  options: Schema
): NormalizedSchema {
  const { isDefault, ...rest } = normalizeProjectAndPath(tree, options);
  return {
    type: 'enum',
    ...options,
    ...rest,
  };
}
