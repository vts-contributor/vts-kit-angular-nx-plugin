export interface Schema {
  name: string;
  path?: string;
  project?: string;
  type?: string;
}

export interface NormalizedSchema extends Schema {
  path: string;
  project: string;
  projectSourceRoot: string;
  type: string;
}
