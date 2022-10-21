export interface Schema {
  name: string;
  path?: string;
  project?: string;
  prefix?: string;
  skipTests: boolean;
  selector?: string;
}

export interface NormalizedSchema extends Schema {
  path: string;
  project: string;
  projectSourceRoot: string;
  skipImport: boolean;
  standalone: boolean;
  flat: boolean;
  selector: string;
}
