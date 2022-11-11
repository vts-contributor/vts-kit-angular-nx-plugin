import type { GeneratorCallback, Tree } from '@nrwl/devkit';
import { formatFiles } from '@nrwl/devkit';
import { generateLayout } from './lib/generate-layout';
import { generateShareFolder } from './lib/generate-share-folder';
import { installKits } from './lib/install-kits';
import { normalizeOptions } from './lib/normalize-options';
import { overwriteTemplate } from './lib/overwrite-template';
import { updateAppConstructor } from './lib/update-app-constructor';
import { updateWebpack } from './lib/update-webpack';
import { updateWorkspaceConfig } from './lib/update-workspace-config';
import type { Schema } from './schema';

export async function enhanceGenerator(tree: Tree, rawOptions: Schema) {
  const options = normalizeOptions(tree, rawOptions);
  try {
    await overwriteTemplate(tree, options);
    await updateWorkspaceConfig(tree, options);

    let installTask: GeneratorCallback = () => {};
    installTask = installKits(tree, options);
    await updateAppConstructor(tree, options);
    await updateWebpack(tree, options);
    await generateLayout(tree, options);
    await generateShareFolder(tree, options);
    await formatFiles(tree);
    return installTask

  } catch (e) {
    console.error(e);
    throw e;
  }
}

export default enhanceGenerator;
