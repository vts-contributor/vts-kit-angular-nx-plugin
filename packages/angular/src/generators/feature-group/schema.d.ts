export interface Schema {
  appRoutingProject?: string;
  name?: string;
  skipRoute?: boolean;
}

export interface NormalizedSchema extends Schema {
  groupPath: string;
  uiName: string;
  featureName: string;
  dataAccessName: string;
  skipRoute?: boolean;
}
