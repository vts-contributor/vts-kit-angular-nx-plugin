import { UnitTestRunner } from '../../utils/test-runners';
import { Linter } from '@nx/linter';

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
  linter?: Linter;
  unitTestRunner?: UnitTestRunner;
  compilationMode?: 'full' | 'partial';
  skipPackageJson?: boolean;
  skipPostInstall?: boolean;
  standalone?: boolean;
  displayBlock?: boolean;
  feature?: boolean;
  appRoutingProject?: string;
}
