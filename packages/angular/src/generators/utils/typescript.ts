import { ensurePackage, Tree, workspaceRoot } from '@nx/devkit';
import { typescriptVersion } from './versions';

export function ensureTypescript() {
    return ensurePackage<typeof import('typescript')>(
        'typescript',
        typescriptVersion
    );
}