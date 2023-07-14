import type { Tree } from '@nx/devkit';
import type { NormalizedSchema, Schema } from '../schema';

export function normalizeOptions(
  tree: Tree,
  options: Schema
): NormalizedSchema {
  return {
    ...options,
  };
}
