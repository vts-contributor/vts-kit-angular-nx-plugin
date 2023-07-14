import type { Tree } from '@nx/devkit';
import {
  readNxJson,
  updateJson,
  updateNxJson,
} from '@nx/devkit';
import { NormalizedSchema } from './normalized-schema';

/**
 * Enable Strict Mode in the library and spec TS Config
 * */
export function enableStrictTypeChecking(
  host: Tree,
  options: NormalizedSchema['libraryOptions']
) {
  updateTsConfig(host, options);
}

// export function setLibraryStrictDefault(host: Tree, isStrict: boolean) {
//   // set the default so future libraries use it
//   // unless the user has previously set this value
//   const workspace = readNxJson(host);

//   workspace.generators = workspace.generators || {};

//   workspace.generators['@nx/angular:library'] =
//     workspace.generators['@nx/angular:library'] || {};

//   workspace.generators['@nx/angular:library'].strict =
//     workspace.generators['@nx/angular:library'].strict ?? isStrict;
//   updateNxJson(host, workspace);
// }

function updateTsConfig(
  host: Tree,
  options: NormalizedSchema['libraryOptions']
) {
  // Update the settings in the tsconfig.app.json to enable strict type checking.
  // This matches the settings defined by the Angular CLI https://angular.io/guide/strict-mode
  updateJson(host, `${options.projectRoot}/tsconfig.json`, (json) => {
    // update the TypeScript settings
    json.compilerOptions = {
      ...(json.compilerOptions ?? {}),
      forceConsistentCasingInFileNames: true,
      strict: true,
      noImplicitOverride: true,
      noPropertyAccessFromIndexSignature: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
    };

    // update Angular Template Settings
    json.angularCompilerOptions = {
      ...(json.angularCompilerOptions ?? {}),
      enableI18nLegacyMessageIdFormat: false,
      strictInjectionParameters: true,
      strictInputAccessModifiers: true,
      strictTemplates: true,
    };

    return json;
  });
}
