import type { GeneratorCallback, Tree } from '@nx/devkit';
import { formatFiles } from '@nx/devkit';
import { generateLayout } from './lib/generate-layout';
import { generateShareFolder } from './lib/generate-share-folder';
import { installKits } from './lib/install-kits';
import { normalizeOptions } from './lib/normalize-options';
import { overwriteTemplate } from './lib/overwrite-template';
import { updateAppConstructor } from './lib/update-app-constructor';
import { updateCICD } from './lib/update-cicd';
import { updateWebpack } from './lib/update-webpack';
import { updateWorkspaceConfig } from './lib/update-workspace-config';
import type { Schema } from './schema';

export async function enhanceGenerator(tree: Tree, rawOptions: Schema) {
  const options = normalizeOptions(tree, rawOptions);
  try {
    await updateWorkspaceConfig(tree, options);
    await overwriteTemplate(tree, options);

    let installTask: GeneratorCallback = () => { };
    installTask = installKits(tree, options);
    await updateAppConstructor(tree, options);
    await updateWebpack(tree, options);
    await generateLayout(tree, options);
    await generateShareFolder(tree, options);
    await formatFiles(tree);

    // Due to error formatting yaml, CICD will be created after formatting
    await updateCICD(tree, options);

    return installTask;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export default enhanceGenerator;
