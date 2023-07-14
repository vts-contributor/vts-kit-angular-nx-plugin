import {
  joinPathFragments,
  ProjectGraph,
  readJsonFile,
  workspaceRoot,
} from '@nx/devkit';
import { existsSync } from 'fs';
import { readTsPathMappings } from './typescript';

export type WorkspaceLibrary = {
  name: string;
  root: string;
  importKey: string | undefined;
};

export function readRootPackageJson(): {
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
} {
  const pkgJsonPath = joinPathFragments(workspaceRoot, 'package.json');
  if (!existsSync(pkgJsonPath)) {
    throw new Error(
      'NX MF: Could not find root package.json to determine dependency versions.'
    );
  }

  return readJsonFile(pkgJsonPath);
}

export function getDependentPackagesForProject(
  projectGraph: ProjectGraph,
  name: string
): {
  workspaceLibraries: WorkspaceLibrary[];
  npmPackages: string[];
} {
  const { npmPackages, workspaceLibraries } = collectDependencies(
    projectGraph,
    name
  );

  return {
    workspaceLibraries: [...workspaceLibraries.values()],
    npmPackages: [...npmPackages],
  };
}

function collectDependencies(
  projectGraph: ProjectGraph,
  name: string,
  dependencies = {
    workspaceLibraries: new Map<string, WorkspaceLibrary>(),
    npmPackages: new Set<string>(),
  },
  seen: Set<string> = new Set()
): {
  workspaceLibraries: Map<string, WorkspaceLibrary>;
  npmPackages: Set<string>;
} {
  if (seen.has(name)) {
    return dependencies;
  }
  seen.add(name);

  (projectGraph.dependencies[name] ?? []).forEach((dependency) => {
    if (dependency.target.startsWith('npm:')) {
      dependencies.npmPackages.add(dependency.target.replace('npm:', ''));
    } else {
      dependencies.workspaceLibraries.set(dependency.target, {
        name: dependency.target,
        root: projectGraph.nodes[dependency.target].data.root,
        importKey: getLibraryImportPath(dependency.target, projectGraph),
      });
      collectDependencies(projectGraph, dependency.target, dependencies, seen);
    }
  });

  return dependencies;
}

function getLibraryImportPath(
  library: string,
  projectGraph: ProjectGraph
): string | undefined {
  const tsConfigPathMappings = readTsPathMappings();

  const sourceRoot = projectGraph.nodes[library].data.sourceRoot;
  for (const [key, value] of Object.entries(tsConfigPathMappings)) {
    if (value.find((path) => path.startsWith(sourceRoot))) {
      return key;
    }
  }

  return undefined;
}
