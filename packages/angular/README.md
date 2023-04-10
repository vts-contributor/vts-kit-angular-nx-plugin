# VTS Kit Angular NX Plugin

VTS Kit Angular NX Plugin is a collection of generators to be integrated with [Nx Workspace](https://nx.dev/getting-started/intro).
This library aims to provide a quick way to start a new Angular Project and maintain code structure with least effort.

## Requirement

- Node: 12+
- Npm: 6+ (included in Node installation)
- Npx: 6+ (included in Node installation)

## Intergrated Features

- Custom Webpack ([Guideline](#feature-custom-webpack))
- UI Component: VTS UI Kit ([Guideline](#feature-ui-component) + [Home](https://design.atviettelsolutions.com/uikit/))
- Localization: @ngx-translate/core ([Guideline](#feature-localization) + [Git](https://github.com/ngx-translate/core))
- Network Utilities: VTS Kit Angular Utilities ([Guideline](#feature-network) + [Git](https://github.com/vts-contributor/vts-kit-angular-utils/tree/main/libs/network))
- Validator Utilities: VTS Kit Angular Utilities ([Guideline](#feature-validation) + [Git](https://github.com/vts-contributor/vts-kit-angular-utils/tree/main/libs/validator))
- Common Utilities: VTS Kit Angular Common ([Guideline](#feature-common) + [Git](https://github.com/vts-contributor/vts-kit-angular-utils/tree/main/libs/common))
- Bundle Analyze: webpack-bundle-analyzer ([Guideline](#feature-bundle-analyzer) + [Git](https://github.com/webpack-contrib/webpack-bundle-analyzer) + [NPM](https://www.npmjs.com/package/webpack-bundle-analyzer))
- CICD (Jenkin + Docker) intergrated ([Guideline](#feature-cicd))
- Dynamic Environment ([Guideline](#feature-dynamic-environment))
- 3rd party integration ([Guideline](#feature-3rd-party-integration) + [Git](https://github.com/vts-contributor/vts-kit-angular-utils/tree/main/libs/integration))

## Quickstart

- Create a new workspace using VTS Kit Angular NX Plugin:

```ts
npx @vts-kit/nx-angular@latest
```

## Structure

```
.
└── <workspace_name>/
    ├── apps/
    │   └── <app_name>/
    │       ├── src/
    │       │   ├── app/
    │       │   │   ├── app.module.ts           // Root component
    │       │   │   ├── app.component.ts        // Root component, bootstrap
    │       │   │   ├── app.component.spec.ts   // Root component, test
    │       │   │   ├── app.component.html      // Root component, outlet
    │       │   │   ├── configs.ts              // Provider, import configs
    │       │   │   └── routes.ts               // RouterModule config, lazy load to feature libraries
    │       │   ├── assets/                     // Public assets
    │       │   │   └── locale/                 // Translation dictionary
    │       │   │       ├── en.json             // JSON dictionary
    │       │   │       └── vi.json             // JSON dictionary
    │       │   ├── environments/               // Environment config
    │       │   |    ├── environment.ts         // Environment profile
    │       │   |    └── environment.prod.ts    // Environment profile
    │       │   └── styles/                     // Global styles
    │       ├── webpack/                        // Webpack config
    │       │   ├── webpack.config.js           // Webpack profile
    │       │   └── webpack.config.prod.js      // Webpack profile
    │       ├── project.json                    // Nx Project configuration
    │       ├── tsconfig(.|lib|spec).json       // Tsconfig
    │       ├── favicon.ico                     // Angular starter files
    │       ├── index.html                      // Angular starter files
    │       ├── main.ts                         // Angular starter files
    │       ├── polyfills.ts                    // Angular starter files
    │       └── test.ts                         // Angular starter files
    ├── libs/                                   // Shared modules and feature modules
    │   ├── layout/                             // Feature group, layout
    │   │   ├── ui/                             // Library (generatable)
    │   │   │   ├── src/
    │   │   │   │   ├── index.ts                // Automatically exporter on generating
    │   │   │   │   └── lib/
    │   │   │   │       ├── <topbar>            // Standalone UI components, unit (generatable)
    │   │   │   │       └── <sider>             // Standalone UI components, unit (generatable)
    │   │   │   ├── project.json                // NX Project configuration
    │   │   │   └── tsconfig(.|lib|spec).json   // Tsconfig
    │   │   ├── feature/                        // Library (generatable)
    │   │   │   ├── src/
    │   │   │   │   ├── index.ts                // Automatically exporter on generating
    │   │   │   │   └── lib/
    │   │   │   │       ├── <dasboard_layout>   // Standalone UI components, container (ultilize units in template)
    │   │   │   │       ├── <home_layout>       // Standalone UI components, container (ultilize units in template)
    │   │   │   │       ├── routes.ts           // RouterModule config, lazy load
    │   │   │   │       └── *.module.ts
    │   │   │   ├── project.json                // NX Project configuration
    │   │   │   └── tsconfig(.|lib|spec).json   // Tsconfig
    │   │   └── data-access/                    // Library (generatable)
    │   │       ├── src/
    │   │       │   ├── index.ts                // Automatically exporter on generating
    │   │       │   └── lib/
    │   │       │       └── <store_1>           // State management, store
    │   │       ├── project.json                // NX Project configuration
    │   │       └── tsconfig(.|lib|spec).json   // Tsconfig
    │   ├── <feature_product>/                  // Feature group (generatable)
    │   │   ├── ui/                             // Library (generatable)
    │   │   │   ├── src/
    │   │   │   │   ├── index.ts                // Automatically exporter on generating
    │   │   │   │   └── lib/
    │   │   │   │       ├── <product_form>      // Standalone UI components, unit (generatable)
    │   │   │   │       └── <product_table>     // Standalone UI components, unit (generatable)
    │   │   │   ├── project.json                // NX Project configuration
    │   │   │   └── tsconfig(.|lib|spec).json   // Tsconfig
    │   │   ├── feature/                        // Library (generatable)
    │   │   │   ├── src/
    │   │   │   │   ├── index.ts                // Automatically exporter on generating
    │   │   │   │   └── lib/
    │   │   │   │       ├── <list_screen>       // Standalone UI components, container (ultilize units in template)
    │   │   │   │       ├── <detail_screen>     // Standalone UI components, container (ultilize units in template)
    │   │   │   │       ├── routes.ts           // RouterModule config, lazy load
    │   │   │   │       └── *.module.ts
    │   │   │   ├── project.json                // NX Project configuration
    │   │   │   └── tsconfig(.|lib|spec).json   // Tsconfig
    │   │   └── data-access/                    // Library (generatable)
    │   │       ├── src/
    │   │       │   ├── index.ts                // Automatically exporter on generating
    │   │       │   └── lib/
    │   │       │       ├── <item_state>        // State management, store
    │   │       │       └── <filter_state>      // State management, store
    │   │       ├── project.json                // NX Project configuration
    │   │       └── tsconfig(.|lib|spec).json   // Tsconfig
    │   └── share/
    │       └── guards/                         // Library, publishable (generatable)
    │       ├── interceptors/                   // Library, publishable (generatable)
    │       ├── data-access/                    // Library, publishable (generatable)
    │       ├── pipes/                          // Library, publishable (generatable)
    │       ├── services/                       // Library, publishable (generatable)
    │       ├── ui/                             // Library, publishable (generatable)
    │       ├── utils/                          // Library, publishable (generatable)
    │       └── validators/                     // Library, publishable (generatable)
    ├── package.json
    ├── nx.json                                 // NX Workspace configuration
    └── tsconfig.base.json                      // Tsconfig, automatically update project alias
```

Using NX generators to generate necessary items and keep structure sync.

## Generators

### Schematics

| No  | Name                                      | Description                        |
| --- | ----------------------------------------- | ---------------------------------- |
| 1   | [Library](#generator-library)             | Creates an Angular library.        |
| 2   | [Feature Group](#generator-feature-group) | Generate an Angular Feature group. |
| 3   | [Component](#generator-component)         | Generate an Angular Component.     |
| 4   | [Directive](#generator-directive)         | Generate an Angular Directive.     |
| 5   | [Pipe](#generator-pipe)                   | Generate an Angular Pipe.          |
| 6   | [Service](#generator-service)             | Generate an Angular Service.       |
| 7   | [Class](#generator-class)                 | Generate an Angular Class.         |
| 8   | [Interface](#generator-interface)         | Generate an Angular Interface.     |
| 9   | [Enum](#generator-enum)                   | Generate an Angular Enum.          |
| 10  | [Guard](#generator-guard)                 | Generate an Angular Guard.         |
| 11  | [Interceptor](#generator-interceptor)     | Generate an Angular Interceptor.   |
| 12  | [Resolver](#generator-resolver)           | Generate an Angular Resolver.      |
| 13  | [Validator](#generator-validator)         | Generate an Angular Validator.     |
| 14  | [Template](#generator-template)           | Generate a feature group template. |

### Usage

#### Using Nx CLI

- Make sure NX CLI has been installed.

```
npm i -g nx
```

- Using VTS Kit generators.

```
nx g @vts-kit/nx-angular:<generator_name> <generator_args>
```

#### Using Nx Console (GUI)

- Install Nx Console in VSCode

<p align="center">
    <img src="/doc/images/install-nx-console.png" />
</p>

- Using generator:

  - Option 1: Select `generate` Nx Console Tab and select a generator

    <p align="center">
        <img src="/doc/images/generate-in-nx-tab.png" />
    </p>

    - Option 2: Right click on a library and select `nx generate` in context menu

    <p align="center">
        <img src="/doc/images/generate-in-nx-context-menu.png" />
    </p>

- Fill in options

<p align="center">
    <img src="/doc/images/fill-option.png" />
</p>

- Preview changes

<p align="center">
    <img src="/doc/images/preview-change.png" />
</p>

- Press Run to make changes

<p align="center">
    <img src="/doc/images/apply-change.png" />
</p>

### Generator: Library

| No  | Name              | Description                                                                                                                                                                                                        | Type                  | Require | Default          |
| --- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ------- | ---------------- |
| 1   | name              | The name of the library.                                                                                                                                                                                           | string                | ✔       |                  |
| 2   | directory         | A directory where the library is placed.                                                                                                                                                                           | string                |         | false            |
| 3   | publishable       | Generate a publishable library. Must specify importPath for other projects be able to import it.                                                                                                                   | boolean               |         | false            |
| 4   | importPath        | The library name used to import it, like `@organize/lib-name`. Must be a valid npm name.                                                                                                                           | string                |         |                  |
| 5   | buildable         | Generate a buildable library.                                                                                                                                                                                      | boolean               |         | false            |
| 6   | skipPackageJson   | Do not add dependencies to `package.json`.                                                                                                                                                                         | boolean               |         | false            |
| 7   | skipTsConfig      | Do not update `tsconfig.json` for development experience.                                                                                                                                                          | boolean               |         | false            |
| 8   | tag               | Add tags to the library (used for linting)                                                                                                                                                                         | string                |         |                  |
| 9   | unitTestRunner    | Test runner to use for unit tests.                                                                                                                                                                                 | `karma` `jest` `none` |         | `jest`           |
| 10  | strict            | Create a library with stricter type checking and build optimization options.                                                                                                                                       | boolean               |         | true             |
| 11  | linter            | The tool to use for running lint checks.                                                                                                                                                                           | `eslint` `none`       |         | `eslint`         |
| 12  | compilationMode   | Specifies the compilation mode to use. If not specified, it will default to `partial` for publishable libraries and to `full` for buildable libraries. The `full` value can not be used for publishable libraries. | `full` `partial`      |         | `depend`         |
| 13  | feature           | Generate additional NgModule and Routing config with library. Every component generated inside feature library will automatically create a route to it.                                                            | boolean               |         | false            |
| 14  | appRoutingProject | (Only work with feature library) The name of the app where feature will be imported for routing. Only projects of application are valid                                                                            | string                |         | `defaultProject` |

### Generator: Feature Group

| No  | Name              | Description                                                                                                                             | Type   | Require | Default          |
| --- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------- | ---------------- |
| 1   | name              | The name of the feature group.                                                                                                          | string |         |                  |
| 2   | appRoutingProject | (Only work with feature library) The name of the app where feature will be imported for routing. Only projects of application are valid | string |         | `defaultProject` |

### Generator: Component

| No  | Name              | Description                                                                                                                                                                               | Type                          | Require | Default          |
| --- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------- | ---------------- |
| 1   | path              | The path at which to create the component file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) or relative to workspace (\<root_workspace\>\/\<relative_path\>). | string                        |         |                  |
| 2   | project           | The name of the project.                                                                                                                                                                  | string                        |         | `defaultProject` |
| 3   | name              | The name of the component.                                                                                                                                                                | string                        | ✔       |                  |
| 4   | displayBlock      | Specifies if the style will contain `:host { display: block; }`.                                                                                                                          | boolean                       |         | false            |
| 5   | inlineStyle       | Include styles inline in the component.ts file. Only CSS styles can be included inline. By default, an external styles file is created and referenced in the component.ts file.           | boolean                       |         | false            |
| 6   | inlineTemplate    | Include template inline in the component.ts file. By default, an external template file is created and referenced in the component.ts file.                                               | boolean                       |         | false            |
| 7   | viewEncapsulation | The view encapsulation strategy to use in the new component.                                                                                                                              | `Emulated` `None` `ShadowDom` |         |                  |
| 8   | changeDetection   | The change detection strategy to use in the new component.                                                                                                                                | `Default` `OnPush`            |         | `Default`        |
| 9   | style             | The file extension or preprocessor to use for style files, or `none` to skip generating the style file.                                                                                   | `scss` `css` `less`           |         | `scss`           |
| 10  | skipTests         | Do not create `spec.ts` test files for the new component.                                                                                                                                 | boolean                       |         | false            |
| 11  | skipImport        | Do not import this component into the owning NgModule.                                                                                                                                    | boolean                       |         | false            |
| 12  | skipSelector      | Specifies if the component should have a selector or not.                                                                                                                                 | boolean                       |         | false            |
| 13  | selector          | The HTML selector to use for this component.                                                                                                                                              | string                        |         |                  |

### Generator: Directive

| No  | Name      | Description                                                                                                                                                                               | Type    | Require | Default          |
| --- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------- | ---------------- |
| 1   | path      | The path at which to create the directive file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) or relative to workspace (\<root_workspace\>\/\<relative_path\>). | string  |         |                  |
| 2   | project   | The name of the project.                                                                                                                                                                  | string  |         | `defaultProject` |
| 3   | name      | The name of the directive.                                                                                                                                                                | string  | ✔       |                  |
| 4   | prefix    | A prefix to apply to generated selectors.                                                                                                                                                 | string  |         |                  |
| 5   | skipTests | Do not create `spec.ts` test files for the new directive.                                                                                                                                 | boolean |         | false            |
| 6   | selector  | The HTML selector to use for this directive.                                                                                                                                              | string  |         |                  |

### Generator: Pipe

| No  | Name      | Description                                                                                                                                                                          | Type    | Require | Default          |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | ------- | ---------------- |
| 1   | path      | The path at which to create the pipe file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) or relative to workspace (\<root_workspace\>\/\<relative_path\>). | string  |         |                  |
| 2   | project   | The name of the project.                                                                                                                                                             | string  |         | `defaultProject` |
| 3   | name      | The name of the pipe.                                                                                                                                                                | string  | ✔       |                  |
| 4   | skipTests | Do not create `spec.ts` test files for the new pipe.                                                                                                                                 | boolean |         | false            |

### Generator: Service

| No  | Name      | Description                                                                                                                                                                             | Type    | Require | Default          |
| --- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------- | ---------------- |
| 1   | path      | The path at which to create the service file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) or relative to workspace (\<root_workspace\>\/\<relative_path\>). | string  |         |                  |
| 2   | project   | The name of the project.                                                                                                                                                                | string  |         | `defaultProject` |
| 3   | name      | The name of the service.                                                                                                                                                                | string  | ✔       |                  |
| 4   | skipTests | Do not create `spec.ts` test files for the new service.                                                                                                                                 | boolean |         | false            |

### Generator: Class

| No  | Name      | Description                                                                                                                                                                             | Type    | Require | Default          |
| --- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------- | ---------------- |
| 1   | path      | The path at which to create the service file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) or relative to workspace (\<root_workspace\>\/\<relative_path\>). | string  |         |                  |
| 2   | project   | The name of the project.                                                                                                                                                                | string  |         | `defaultProject` |
| 3   | name      | The name of the class.                                                                                                                                                                  | string  | ✔       |                  |
| 4   | skipTests | Do not create `spec.ts` test files for the new class.                                                                                                                                   | boolean |         | false            |
| 5   | type      | Adds a developer-defined type to the filename, in the format \"name.<type>.ts\".                                                                                                        | string  |         |                  |

### Generator: Interface

| No  | Name    | Description                                                                                                                                                                               | Type   | Require | Default          |
| --- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------- | ---------------- |
| 1   | path    | The path at which to create the interface file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) or relative to workspace (\<root_workspace\>\/\<relative_path\>). | string |         |                  |
| 2   | project | The name of the project.                                                                                                                                                                  | string |         | `defaultProject` |
| 3   | name    | The name of the interface.                                                                                                                                                                | string | ✔       |                  |
| 4   | type    | Adds a developer-defined type to the filename, in the format \"name.<type>.ts\".                                                                                                          | string |         |                  |
| 5   | prefix  | Prefix to be added before interface name                                                                                                                                                  | string |         |                  |

### Generator: Enum

| No  | Name    | Description                                                                                                                                                                          | Type   | Require | Default          |
| --- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | ------- | ---------------- |
| 1   | path    | The path at which to create the enum file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) or relative to workspace (\<root_workspace\>\/\<relative_path\>). | string |         |                  |
| 2   | project | The name of the project.                                                                                                                                                             | string |         | `defaultProject` |
| 3   | name    | The name of the enum.                                                                                                                                                                | string | ✔       |                  |
| 4   | type    | Adds a developer-defined type to the filename, in the format \"name.<type>.ts\".                                                                                                     | string |         |                  |

### Generator: Guard

| No  | Name       | Description                                                                                                                                                                           | Type                                                                            | Require | Default          |
| --- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------- | ---------------- |
| 1   | path       | The path at which to create the guard file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) or relative to workspace (\<root_workspace\>\/\<relative_path\>). | string                                                                          |         |                  |
| 2   | project    | The name of the project.                                                                                                                                                              | string                                                                          |         | `defaultProject` |
| 3   | name       | The name of the guard.                                                                                                                                                                | string                                                                          | ✔       |                  |
| 4   | skipTests  | Do not create `spec.ts` test files for the new guard.                                                                                                                                 | boolean                                                                         |         | false            |
| 5   | implements | Specifies which route guards to implement (hold Ctrl to multiselect).                                                                                                                 | Multiple choice ["CanActivate", "CanActivateChild", "CanDeactivate", "CanLoad"] |         | ["CanActivate"]  |

### Generator: Interceptor

| No  | Name      | Description                                                                                                                                                                                 | Type    | Require | Default          |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------- | ---------------- |
| 1   | path      | The path at which to create the interceptor file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) or relative to workspace (\<root_workspace\>\/\<relative_path\>). | string  |         |                  |
| 2   | project   | The name of the project.                                                                                                                                                                    | string  |         | `defaultProject` |
| 3   | name      | The name of the interceptor.                                                                                                                                                                | string  | ✔       |                  |
| 4   | skipTests | Do not create `spec.ts` test files for the new interceptor.                                                                                                                                 | boolean |         | false            |

### Generator: Resolver

| No  | Name      | Description                                                                                                                                                                              | Type    | Require | Default          |
| --- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------- | ---------------- |
| 1   | path      | The path at which to create the resolver file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) or relative to workspace (\<root_workspace\>\/\<relative_path\>). | string  |         |                  |
| 2   | project   | The name of the project.                                                                                                                                                                 | string  |         | `defaultProject` |
| 3   | name      | The name of the resolver.                                                                                                                                                                | string  | ✔       |                  |
| 4   | skipTests | Do not create `spec.ts` test files for the new resolver.                                                                                                                                 | boolean |         | false            |

### Generator: Validator

| No  | Name      | Description                                                                                                                                                                               | Type                     | Require | Default          |
| --- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------- | ---------------- |
| 1   | path      | The path at which to create the validator file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) or relative to workspace (\<root_workspace\>\/\<relative_path\>). | string                   |         |                  |
| 2   | project   | The name of the project.                                                                                                                                                                  | string                   |         | `defaultProject` |
| 3   | name      | The name of the validator.                                                                                                                                                                | string                   | ✔       |                  |
| 4   | skipTests | Do not create `spec.ts` test files for the new validator.                                                                                                                                 | boolean                  |         | false            |
| 5   | type      | Specifies type of validator.                                                                                                                                                              | ["sync", "async"]        | ✔       |                  |
| 6   | form      | Specifies type of Angular form in which validator be used (Reactive form / Template-driven form).                                                                                         | ["reactive", "template"] | ✔       |                  |

### Generator: Template

| No  | Name       | Description                                                                                                                                       | Type                                                                                          | Require | Default |
| --- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------- | ------- |
| 1   | name       | Name of feature group                                                                                                                             | string                                                                                        | ✔       |         |
| 2   | type       | Type of template which will be created                                                                                                            | ["ErrorTemplate-NoLayout", "AuthenticationTemplate-WithLayout", "LandingTemplate-WithLayout"] | ✔       |         |
| 3   | layoutName | Name of layout feature will be generated in feature-group `layout`. Only neccessary if template type require a layout, check template description | string                                                                                        | ✔       |         |

## Feature Guideline

### Feature: Custom webpack

Custom webpack unlock the ability to enhance web builder process.  
VTS Kit Angular provides 2 profile of webpack on generating project. You find these files under `app/<app_name>/webpack.config.<profile>.js`.  
You can also add another profile, but take note to register profile in `app/<app_name>/project.json`

### Feature: UI Component

Please see full guideline in [https://design.atviettelsolutions.com/uikit/](https://design.atviettelsolutions.com/uikit/)

### Feature: Localization

Translation dictionary can be found under `app/<app_name>/src/assets/locale/`. By default, VTS Kit generate 2 translation files which are Vietnamese and English. If you want to add new language, just create new JSON file under this folder and use `TranslateService` to use new language.

**Config** (Already declared on generating, maybe be overwritten)

Translation config is localed in `app/<app_name>/src/app/configs.ts`.

```ts
// configs.ts

import { TranslateLoader, TranslateModuleConfig } from '@ngx-translate/core';

class TranslateHttpLoader extends TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return from(fetch(`./assets/locale/${lang}.json`).then((d) => d.json()));
  }
}

export const TRANSLATE_MODULE_CONFIG: TranslateModuleConfig = {
  defaultLanguage: 'vi',
  loader: {
    provide: TranslateLoader,
    useClass: TranslateHttpLoader,
  },
};
```

By default, translation module is configured to use HTTP loader to load translation file from `assets` and use `vi` language.

**Import** (Already imported on generating)

```ts
// app.module.ts
@NgModule({
  imports: [
    TranslateModule.forRoot(TRANSLATE_MODULE_CONFIG)
  ]
})
```

**Usage**

- Switch language

```ts
constructor(private translateService: TranslateService) {
  this.translateService.use('en')
}
```

- Get current language:

```ts
this.translateService.currentLang;
```

- Get translate:

Example dictionary

```json
{
  "hello": {
    "world": "Xin chào {{name}}"
  }
}
```

Get translation using service

```ts
// Return value of string => Xin chào A
// Note: instant() require the TranslateModule has been loaded, if you're unsure about this, use get() or pipe
this.translateService.instant('hello.world', { name: 'A' });

// Return Observable of value of string
this.translateService
  .get('hello.world', { name: 'A' })
  .subscribe((d) => console.log(d)); // d = 'Xin chào A'
```

Get translation using pipe

```ts
// Will render paragraph of "Xin chào A"
<p>{{ 'hello.world' | translate:{name: 'A'} }}
```

### Feature: Network

VTS KIT provides easy-to-config RestClient to interactive with RESTful API and some other network utilities.

**Config** (Already declared on generating, maybe be overwritten)

Network config is localed in `app/<app_name>/src/app/configs.ts`.

```ts
// configs.ts
import {
  RestClientOptions,
  VtsRestModuleConfig,
} from '@vts-kit/angular-network';

const NETWORK_MODULE_CONFIG: VtsRestModuleConfig = {
  defaultConfig: new RestClientOptions()
    .setBaseUrl('https://<base_api_url>')
    .setHeader('key', 'value')
    .setParam('key', 'value')
    .setRetry(3),
};
```

**Import** (Already imported on generating)

```ts
// app.module.ts
@NgModule({
  imports: [
    TranslateModule.forRoot(TRANSLATE_MODULE_CONFIG),
  ]
})
```

**Usage**

Pattern

```ts
client
  .setHeader("key", "value")
  .setTimeout(60000)
  ... // More builder
  .obserseBody() // or obserseEvents() or obserseResponse()
  .get("<path or url>") // or post, patch, put, options, delete
  .subscribe(...)
```

Example

```ts
// name.any.ts
import { RestClient } from '@vts-kit/angular-network';

@Injectable({
  providedIn: 'root',
})
export class Service {
  constructor(private client: RestClient) {}

  callApi() {
    this.client
      .obserseBody()
      .get<Post[]>('/posts')
      .subscribe({
        next: (d) => console.log(d[0].title),
        error: (e) => console.log(e),
      });
  }
}
```

### Feature: Validation

VTS KIT provides common validation function to be used combine with [Angular Validator](https://angular.io/api/forms/Validators) to make form validation easier.

**List of validator**

| No  | Name                         | From                 | Description                                                             |
| --- | ---------------------------- | -------------------- | ----------------------------------------------------------------------- |
| 1   | required                     | `Angular Validators` | Whether input is required                                               |
| 2   | requiredTrue                 | `Angular Validators` | Whether input is required to be true                                    |
| 3   | email                        | `Angular Validators` | Whether input is a valid email format                                   |
| 4   | min                          | `Angular Validators` | Whether input value to be greater than or equal to the provided number  |
| 5   | max                          | `Angular Validators` | Whether input value to be less than or equal to the provided number     |
| 6   | minLength                    | `Angular Validators` | Whether input length to be greater than or equal to the provided number |
| 7   | maxLength                    | `Angular Validators` | Whether input length to be less than or equal to the provided number    |
| 8   | pattern                      | `Angular Validators` | Whether input value is matched a RegExe pattern                         |
| 9   | viettelMail                  | `VTS Kit Validators` | Whether input value is valid Viettel Email                              |
| 10  | ipAddress                    | `VTS Kit Validators` | Whether input value is valid ip address                                 |
| 11  | ipAddressPort                | `VTS Kit Validators` | Whether input value is valid ip address and port (\<ip\>:\<port\>)      |
| 12  | url                          | `VTS Kit Validators` | Whether input value is valid url                                        |
| 13  | \[number\]                   | `VTS Kit Validators` | Whether input can be convert to number                                  |
| 14  | \[number\]\[numberType\]     | `VTS Kit Validators` | Whether input number is specific type (float, integer, any)             |
| 15  | \[number\]\[larger\]         | `VTS Kit Validators` | Whether input number is greater than provided number                    |
| 16  | \[number\]\[largerOrEqual\]  | `VTS Kit Validators` | Whether input number is greater than or equal to provided number        |
| 17  | \[number\]\[smaller\]        | `VTS Kit Validators` | Whether input number is less than provided number                       |
| 18  | \[number\]\[smallerOrEqual\] | `VTS Kit Validators` | Whether input number is less than or equal to provided number           |

**Usage**

For template-driven form:

```ts
// *.ts
import { VtsValidatorModule } from '@vts-kit/angular-validator';

@(NgModule | Component | ...)({
    imports: [VtsValidatorModule]
})

// *.html
<input ngModel url  />
<input number [larger]="5" [smallerOrEqual]="10" #control="ngModel">

// You can see raise errors here
{{ control.errors | json }}
```

For reactive form:

```ts
// *.ts
import { VTSValidators } from '@vts-kit/angular-validator';

export class Component ... {
  // Use with 'validators' property of FormControl, FormGroup, FormBuilder, ...
  control1 = new FormBuilder().control('', {
      validators: [VTSValidators.url]
  })

  control2 = new FormBuilder().control('', {
    validators: [
        VTSValidators.number({
          larger: 5,
          smallerOrEqual: 10
        })
    ]
  })
}

// *.html
<input [formControl]="control1" />
<input [formControl]="control2" />

// You can see raise errors here
{{ control1.errors | json }}
{{ control2.errors | json }}
```

### Feature: Common

VTS KIT provides common utility function to help code faster.

#### Date

| No  | Function Name    | Description                                                | Output  |
| --- | ---------------- | ---------------------------------------------------------- | ------- |
| 1   | distance         | Return a distance between two dates in miliseconds         | number  |
| 2   | isGreater        | Return whether `date1` is greater than `date2`             | boolean |
| 3   | isGreaterOrEqual | Return whether `date1` is greater than or equal to `date2` | boolean |
| 4   | isSmaller        | Return whether `date1` is smaller than `date2`             | boolean |
| 5   | isSmallerOrEqual | Return whether `date1` is smaller than or equal to `date2` | boolean |

#### String

| No  | Function Name | Description                                                                                         | Output  |
| --- | ------------- | --------------------------------------------------------------------------------------------------- | ------- |
| 1   | isNullOrEmpty | Return whether a string is null or empty                                                            | boolean |
| 2   | defaultValue  | Return `defaultValue` if `value` is null or empty, else return `value`                              | string  |
| 3   | upperFirst    | Return `value` with first character is setted to be uppercase                                       | string  |
| 4   | lowerFirst    | Return `value` with first character is setted to be lowercase                                       | string  |
| 5   | camelCase     | Converts `value` to camel case                                                                      | string  |
| 6   | pascalCase    | Converts `value` to pascal case                                                                     | string  |
| 7   | kebabCase     | Converts `value` to kebab case                                                                      | string  |
| 8   | snakeCase     | Converts `value` to snake case                                                                      | string  |
| 9   | capitalize    | Converts the first character of first word in `value` to upper case and the remaining to lower case | string  |
| 10  | capitalizeAll | Converts the first character of each word in `value` to upper case and the remaining to lower case  | string  |

#### Path

| No  | Function Name | Description                     | Output |
| --- | ------------- | ------------------------------- | ------ |
| 1   | getExtName    | Return extension of the path    | string |
| 2   | getDirName    | Return dir of the path          | string |
| 3   | getBaseName   | Return last portion of the path | string |

### Feature: Bundle Analyzer

VTS KIT integrated bundle analyzer to help auditing overall bundle size.

**Config** (Already declared on generating, maybe be overwritten)

Webpack bundle analyzer config is localed in `app/<app_name>/webpack/webpack.configs(.prod).ts`.

```ts
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (config, context) => {
  return merge(config, {
    plugins: [
      // Other plugins
      ...(process.env.ANALYZE
        ? [
            new BundleAnalyzerPlugin({
              analyzerMode: 'server',
              analyzerHost: '127.0.0.1',
              analyzerPort: 8001,
            }),
          ]
        : []),
    ]
  })
```

By default, webpack bundle analyzer will serve a web report at http://127.0.0.1:8001. You can check out more options for webpack bundle analyzer [here](https://www.npmjs.com/package/webpack-bundle-analyzer)

**Usage**

Either use VTS Kit script inside `package.json` or custom your own.

```ts
// package.json
  ...
  scripts: {
    "start:analyze": "cross-env ANALYZE=1 npm run start",
    "build:analyze": "cross-env ANALYZE=1 npm run build"
  }
```

Using `start:analyzer` to start analyzing on Development Environment or `build:analyzer` to analyze on Production Environment

<p align="center">
    <img src="/doc/images/webpack-bundle-analyze.png" />
</p>
  
### Feature: CICD

VTS KIT provides Docker config and Jenkin config with dynamic variables, developer can make change at ease.

CICD variables can be found under `cicd/jenkinsfile/environment.groovy`. Developer have to **fill out all required fields** to make it work in jenkine pipeline.

```
/** Pipeline options **/
env.flag_sonar = ""                                         // OPTIONAL, Enable sonar scan (set to 'yes' to enable)
env.flag_security = ""                                      // OPTIONAL, Enable fortify scan (set to 'yes' to enable)

/** Application information **/
env.appName = "demo"                                        // REQUIRED
                                                            // Determine docker image name (<harborServer>/<harborProject>/<appName>:<version>_<buildNumber>)
                                                            // and deployment/service name


/** Kubernetes profile **/

// Development profile
env.devKubeConfigFileSecret = "dev-k8s-config"              // REQUIRED, Secret file credential stored on Jenkin, give in fileID
env.devNamespace = ""                                       // REQUIRED, Kubernetes namespace to deploy
env.devPort = "80"                                          // REQUIRED, Should be nginx port
env.devTargetPort = "80"                                    // REQUIRED, Container port, should be nginx port
env.devNodePort = ""                                        // REQUIRED, Exposal port for external access
env.devImagePullSecrets = "default"                         // REQUIRED, Docker secret to pull image

// Production profile
env.prodKubeConfigFileSecret = "prod-k8s-config"            // REQUIRED, Secret file credential stored on Jenkin, give in fileID
env.prodNamespace = ""                                      // REQUIRED, Kubernetes namespace to deploy
env.prodPort = "80"                                         // REQUIRED, Should be nginx port
env.prodTargetPort = "80"                                   // REQUIRED, Container port, should be nginx port
env.prodNodePort = ""                                       // REQUIRED, Exposal port for external access
env.prodImagePullSecrets = "default"                        // REQUIRED, Docker secret to pull image


/** Docker harbor configuration **/
env.pullRegistry = ""                                       // REQUIRED, Harbor registry to pull base images
env.harborProject = ""                                      // REQUIRED, Harbor folder to store image


/** Git information **/
env.gitTokenSecret = ""                                     // REQUIRED, Secret token credential stored on Jenkin, give in secretID
env.stagingBranch = ""                                      // OPTIONAL, Staging branch won't trigger merge build pipeline


/** Sonar config **/
env.maximumAllowedBugs = 0
env.maximumAllowedVunerabilities = 0
env.maximumAllowedCodeSmell = 0


/** Build prefix for building report **/
env.pushBuildPrefix = "JENKINS-PUSH"
env.mrBuildPrefix = "JENKINS-MERGE"
env.acceptCloseMRBuildPrefix = "JENKINS-ACCEPT-CLOSE"
```

### Feature: Dynamic Environment

VTS KIT provides ability to use environment from container. All system environment which are started with `VTS_KIT_` will be collected and injected into Web Server on running. Developer can reference to these environment inside `window.env`.

Ways to make changes to environments:

- 1\. Add environment inside kubernetes YAML deployment
- 2\. Use `kubectl` to change environment while application is running (require rolloul restart)
- 3\. Set environment on running docker (if deploy as docker)

1. Add environment inside kubernetes YAML deployment:

For example, make change to development profile, create two environemnt `VTS_KIT_ENV1` and `VTS_KIT_ENV2`. You can find kubernetes YAML under `cicd/manifests/dev-deploy-manifest.yaml`.

```
---
apiVersion: v1
kind: Service
metadata:
  name: {{appName}}-svc
  labels:
    app: {{appName}}
  namespace: {{devNamespace}}
spec:
  type: NodePort
  ports:
    - port: {{devPort}}
      name: {{appName}}-external-port
      protocol: TCP
      targetPort: {{devTargetPort}}
      nodePort: {{devNodePort}}
  selector:
    app: {{appName}}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{appName}}-deployment
  labels:
    app: {{appName}}
  namespace: {{devNamespace}}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: {{appName}}
  template:
    metadata:
      labels:
        app: {{appName}}
    spec:
      containers:
        - name: {{appName}}-container
          image: {{imageName}}
          env:
            - name: VTS_KIT_ENV1
              value: "Hello"
            - name: VTS_KIT_ENV2
              value: "World"
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: {{devTargetPort}}
      imagePullSecrets:
        - name: {{devImagePullSecrets}}
```

2. Use `kubectl` to change environment while application is running (require rolloul restart)

Use `kubectl` CLI to make change to an applied-deployment.

```
  // Set new environemtn
  kubectl set env deployment/demo VTS_KIT_ENV1=hello

  // Rollout restart to apply change
  kubectl rollout restart deployment/demo

  // Unset environment (Also need to rollout restart to apply change)
  kubectl set env deployment/demo VTS_KIT_ENV1-
```

3. Set environment on running docker (if deploy as docker)

Use `docker` CLI to set environment on running an image

```
  docker run -e VTS_KIT_ENV1=hello -t webapp-demo:1.0.0
```

### Feature: 3rd party integration

VTS KIT offers libraries that facilitate the integration of third-party libraries and services with minimal effort.

Check out [documentation](https://github.com/vts-contributor/vts-kit-angular-utils/tree/main/libs/integration) for more detail.

## References

- [Nx Introduction](https://nx.dev/getting-started/intro)
- [App and lib](https://nx.dev/more-concepts/applications-and-libraries)
- [Monorepo](https://nx.dev/more-concepts/why-monorepos)
- [Buildable and Publishable](https://nx.dev/more-concepts/buildable-and-publishable-libraries)

## Contribute Guidelines

If you have any ideas, just open an issue and tell us what you think.

If you'd like to contribute, please refer [Contributors Guide](https://github.com/vts-contributor/vts-kit-angular-nx-plugin/blob/master/CONTRIBUTING.md)

## License

This code is under the [MIT License](https://opensource.org/licenses/MIT).

See the [LICENSE](https://github.com/vts-contributor/vts-kit-angular-nx-plugin/blob/master/LICENSE) file for required notices and attributions.
