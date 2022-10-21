import { UnitTestRunner } from '../../utils/test-runners';
import type { AngularLinter } from '../schema';

export interface NormalizedSchema {
  libraryOptions: {
    name: string;
    skipFormat?: boolean;
    directory?: string;
    sourceDir?: string;
    buildable?: boolean;
    publishable?: boolean;
    importPath?: string;
    spec?: boolean;
    flat?: boolean;
    commonModule?: boolean;
    tags?: string;
    strict?: boolean;
    compilationMode?: 'full' | 'partial';
    skipPackageJson?: boolean;
    skipPostInstall?: boolean;
    linter: AngularLinter;
    unitTestRunner: UnitTestRunner;
    projectRoot: string;
    entryFile: string;
    projectDirectory: string;
    parsedTags: string[];
    ngCliSchematicLibRoot: string;
    feature?: boolean;
    fileName: string;
    modulePath: string;
    moduleName: string;
    appRoutingProject?: string;
    appRoutingPath?: string;
  };
  componentOptions: {
    name: string;
  };
}
