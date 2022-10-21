export interface Schema {
  name: string;
  path?: string;
  project?: string;
  skipTests: boolean;
  implements?: string;
}

export interface NormalizedSchema extends Schema {
  path: string;
  project: string;
  projectSourceRoot: string;
  flat: boolean;
}
