# VTS Kit Angular NX Plugin

VTS Kit Angular NX Plugin is a collection of generators to be integrated with [Nx Workspace](https://nx.dev/getting-started/intro).
This library aims to provide a quick way to start a new Angular Project and maintain code structure with least effort.

## Requirement
* Node: 12+
* Npm: 6+ (included in Node installation)
* Npx: 6+ (included in Node installation)

## Quickstart
- Update npm registry:

```
npm config set registry http://10.254.144.164:8081/repository/npm-all/
```

- Create a new workspace using VTS Kit Angular NX Plugin:

```
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
    │       │   │   └── routes.ts               // RouterModule config, lazy load to feature libraries
    │       │   ├── assets/                     // Public assets
    │       │   └── environments/               // Environment config
    │       │       ├── environment.ts          // Environment profile
    │       │       └── environment.prod.ts     // Environment profile
    │       ├── webpack/                        // Webpack config
    │       │   ├── webpack.config.js           // Webpack profile
    │       │   └── webpack.config.prod.js      // Webpack profile
    │       ├── project.json                    // Nx Project configuration
    │       ├── tsconfig(.|lib|spec).json       // Tsconfig
    │       ├── favicon.ico                     // Angular starter files
    │       ├── index.html                      // Angular starter files
    │       ├── main.ts                         // Angular starter files
    │       ├── polyfills.ts                    // Angular starter files
    │       ├── styles.scss                     // Angular starter files
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
    │       ├── mixins/                         // Library, publishable (generatable)
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

- Select Nx generate in context menu or Nx Console Tab

- Fill in options and preview changes

- Press Run to make changes

### Generator: Library

  
| No  | Name              | Description                                                                                                                                                                               | Type                          | Require | Default          |  
| --- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------- | ---------------- |  
| 1   | path              | The path at which to create the component file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) or relative to workspace (\<root_workspace\>\/\<relative_path\>). | string                        |         |                  |  
| 2   | project           | The name of the project.                                                                                                                                                                  | string                        |         | `defaultProject` |  
| 3   | name              | The name of the component.                                                                                                                                                                | string                        | ✔ |                  |  
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

### Generator: Feature Group

| No  | Name              | Description                                                                                                                             | Type   | Require | Default          |
| --- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------- | ---------------- |
| 1   | name              | The name of the feature group.                                                                                                          | string |         |                  |
| 2   | appRoutingProject | (Only work with feature library) The name of the app where feature will be imported for routing. Only projects of application are valid | string |         | `defaultProject` |

### Generator: Component

| No  | Name              | Description                                                                                                                                                                               | Type                          | Require | Default          |
| --- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------- | ---------------- |
| 1   | path              | The path at which to create the component file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) | string                        |         |                  |
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

| No  | Name      | Description                                                                                                                                                                               | Type    | Require | Default          |
| --- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------- | ---------------- |
| 1   | path      | The path at which to create the pipe file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) or relative to workspace (\<root_workspace\>\/\<relative_path\>). | string  |         |                  |
| 2   | project   | The name of the project.                                                                                                                                                                  | string  |         | `defaultProject` |
| 3   | name      | The name of the pipe.                                                                                                                                                                | string  | ✔       |                  |
| 4   | skipTests | Do not create `spec.ts` test files for the new pipe.                                                                                                                                 | boolean |         | false            |

### Generator: Service

| No  | Name      | Description                                                                                                                                                                               | Type    | Require | Default          |
| --- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------- | ---------------- |
| 1   | path      | The path at which to create the service file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) or relative to workspace (\<root_workspace\>\/\<relative_path\>). | string  |         |                  |
| 2   | project   | The name of the project.                                                                                                                                                                  | string  |         | `defaultProject` |
| 3   | name      | The name of the service.                                                                                                                                                                | string  | ✔       |                  |
| 4   | skipTests | Do not create `spec.ts` test files for the new service.                                                                                                                                 | boolean |         | false            |

### Generator: Class

| No  | Name      | Description                                                                                                                                                                           | Type    | Require | Default          |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------- | ---------------- |
| 1   | path      | The path at which to create the class file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) or relative to workspace (\<root_workspace\>\/\<relative_path\>). | string  |         |                  |
| 2   | project   | The name of the project.                                                                                                                                                              | string  |         | `defaultProject` |
| 3   | name      | The name of the class.                                                                                                                                                                | string  | ✔       |                  |
| 4   | skipTests | Do not create `spec.ts` test files for the new class.                                                                                                                                 | boolean |         | false            |
| 5   | type      | Adds a developer-defined type to the filename, in the format \"name.<type>.ts\".                                                                                                      | string  |         |                  |

### Generator: Interface

| No  | Name    | Description                                                                                                                                                                           | Type   | Require | Default          |
| --- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------- | ---------------- |
| 1   | path    | The path at which to create the interface file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) or relative to workspace (\<root_workspace\>\/\<relative_path\>). | string |         |                  |
| 2   | project | The name of the project.                                                                                                                                                              | string |         | `defaultProject` |
| 3   | name    | The name of the interface.                                                                                                                                                                | string | ✔       |                  |
| 4   | type    | Adds a developer-defined type to the filename, in the format \"name.<type>.ts\".                                                                                                      | string |         |                  |
| 5   | prefix  | Prefix to be added before interface name                                                                                                                                              | string |         |                  |

### Generator: Enum

| No  | Name    | Description                                                                                                                                                                           | Type   | Require | Default          |
| --- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------- | ---------------- |
| 1   | path    | The path at which to create the enum file, relative to the selected project (\/src\/(lib\|app)\/\<relative_path\>) or relative to workspace (\<root_workspace\>\/\<relative_path\>). | string |         |                  |
| 2   | project | The name of the project.                                                                                                                                                              | string |         | `defaultProject` |
| 3   | name    | The name of the enum.                                                                                                                                                                | string | ✔       |                  |
| 4   | type    | Adds a developer-defined type to the filename, in the format \"name.<type>.ts\".                                                                                                      | string |         |                  |

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

## References

* [App and lib](https://nx.dev/more-concepts/applications-and-libraries)
* [Monorepo](https://nx.dev/more-concepts/why-monorepos)
* [Nx Introduction](https://nx.dev/getting-started/intro)

## Contribute Guidelines

If you have any ideas, just open an issue and tell us what you think.

If you'd like to contribute, please refer [Contributors Guide](CONTRIBUTING.md)

## License

This code is under the [MIT License](https://opensource.org/licenses/MIT).

See the [LICENSE](LICENSE) file for required notices and attributions.
