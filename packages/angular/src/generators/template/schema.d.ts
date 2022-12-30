export interface Schema {
  type:
    | 'ErrorTemplate-NoLayout'
    | 'AuthenticationTemplate-WithLayout'
    | 'LandingTemplate-WithLayout';
  name: string;
  layoutName: string;
}

export interface NormalizedSchema extends Schema {}
