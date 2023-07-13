import type { Tree } from '@nx/devkit';
import { formatFiles } from '@nx/devkit';
import { generateAuthenticationTemplate } from './lib/generate-authentication';
import { generateErrorTemplate } from './lib/generate-error';
import { generateLandingPageTemplate } from './lib/generate-landing-page';
import { normalizeOptions } from './lib/normalize-options';
import type { Schema } from './schema';

export async function templateGenerator(tree: Tree, rawOptions: Schema) {
  const options = normalizeOptions(tree, rawOptions);
  const { type } = options;
  switch (type) {
    case 'ErrorTemplate-NoLayout':
      await generateErrorTemplate(tree, options);
      break;
    case 'AuthenticationTemplate-WithLayout':
      await generateAuthenticationTemplate(tree, options);
      break;
    case 'LandingTemplate-WithLayout':
      await generateLandingPageTemplate(tree, options);
      break;
  }
  await formatFiles(tree);
}

export default templateGenerator;
