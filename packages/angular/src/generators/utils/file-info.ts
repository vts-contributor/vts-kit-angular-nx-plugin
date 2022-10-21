import {
  joinPathFragments,
  names,
  normalizePath,
  readProjectConfiguration,
  readWorkspaceConfiguration,
  Tree,
} from '@nrwl/devkit';

export type GenerationOptions = {
  name: string;
  flat: boolean;
  path: string;
  project: string;
  projectSourceRoot: string;
  type?: string;
};
export type FileInfo = {
  directory: string;
  fileName: string;
  filePath: string;
};

export function getFileInfo(tree: Tree, options: GenerationOptions): FileInfo {
  const project =
    options.project ?? readWorkspaceConfiguration(tree).defaultProject;
  const { root, sourceRoot, projectType } = readProjectConfiguration(
    tree,
    project
  );
  const { fileName: normalizedName } = names(options.name);

  let fileName = normalizedName;
  if (options.type)
    fileName = `${normalizedName}.${names(options.type).fileName}`;

  const projectSourceRoot = sourceRoot ?? joinPathFragments(root, 'src');
  const path =
    options.path ??
    joinPathFragments(
      projectSourceRoot,
      projectType === 'application' ? 'app' : 'lib'
    );
  const directory = options.flat
    ? normalizePath(path)
    : joinPathFragments(path, normalizedName);

  const filePath = joinPathFragments(directory, `${fileName}.ts`);

  return { directory, fileName, filePath };
}
