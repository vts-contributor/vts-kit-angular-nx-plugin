export interface Schema {
  name: string;
  path?: string;
  project?: string;
  type?: string;
  prefix?: string;
}

export interface NormalizedSchema extends Schema {
  path: string;
  project: string;
  projectSourceRoot: string;
}
