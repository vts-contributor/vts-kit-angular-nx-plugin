export interface Schema {
  appRoutingProject?: string;
  name?: string;
}

export interface NormalizedSchema extends Schema {
  groupPath: string;
  uiName: string;
  featureName: string;
  dataAccessName: string;
}
