import { UnitTestRunner } from '../../utils/test-runners';
import { Linter } from '@nrwl/linter';

type AngularLinter = Exclude<Linter, Linter.TsLint>;

export interface Schema {
  name: string;
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
  linter?: AngularLinter;
  unitTestRunner?: UnitTestRunner;
  compilationMode?: 'full' | 'partial';
  skipPackageJson?: boolean;
  skipPostInstall?: boolean;
  standalone?: boolean;
  displayBlock?: boolean;
  feature?: boolean;
  appRoutingProject?: string;
}
