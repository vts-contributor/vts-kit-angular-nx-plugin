import type { Tree } from '@nrwl/devkit';
import type { NormalizedSchema, Schema } from '../schema';
import { normalizeProjectAndPath } from '../../utils/project';

export function normalizeOptions(
  tree: Tree,
  options: Schema
): NormalizedSchema {
  return options;
}
