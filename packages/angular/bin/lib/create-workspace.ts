import * as yargs from 'yargs';
import * as chalk from 'chalk';
import { Arguments } from './arguments';
import { output } from './output';
import * as enquirer from 'enquirer';
import {
  detectPackageManager,
  getPackageManagerCommand,
  getPackageManagerVersion,
} from '@nrwl/devkit';
import { unparse } from 'nx/src/tasks-runner/utils';
import * as ora from 'ora';
import { join } from 'path';
import { execAndWait, getFileName, mapErrorToBodyLines } from './utils';
import { dirSync } from 'tmp';
import { writeFileSync } from 'fs';
import { nxVersion } from '../../src/generators/utils/versions';

const packageName = require('../../package.json').name;
const version = require('../../package.json').version;
const defaultNxArgs = {
  cli: 'angular',
  preset: 'angular',
  presetVersion: version,
};

export const commandsObject: yargs.Argv<Arguments> = yargs
  .wrap(yargs.terminalWidth())
  .parserConfiguration({
    'strip-dashed': true,
    'dot-notation': true,
  })
  .command(
    '$0 [name] [options]',
    'Create a new Angular workspace',
    (yargs) =>
      yargs
        .option('workspaceName', {
          describe: chalk.dim`Workspace name (e.g. org name)`,
          type: 'string',
        })
        .option('appName', {
          describe: chalk.dim`Application name`,
          type: 'string',
        })
        .option('style', {
          describe: chalk.dim`Stylesheet format`,
          type: 'string',
        }),
    async (argv: yargs.ArgumentsCamelCase<Arguments>) => {
      await main(argv).catch((error) => {
        const { version } = require('../package.json');
        output.error({
          title: `Something went wrong! v${version}`,
        });
        throw error;
      });
    },
    [getConfiguration]
  )
  .help('help', chalk.dim`Show help`)
  .version(
    'version',
    chalk.dim`Show version`,
    version
  ) as yargs.Argv<Arguments>;

async function getConfiguration(
  argv: yargs.Arguments<Arguments>
): Promise<void> {
  try {
    output.log({
      title: `Version ${version}`,
      bodyLines: [
        `Collecting configuration...`,
      ],
    });

    let workspaceName, appName, style;
    workspaceName = await determineWorkspaceName(argv);
    appName = await determineAppName(argv);
    style = await determineStyle(argv);
    Object.assign(argv, {
      workspaceName,
      appName,
      style,
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

function determineWorkspaceName(
  parsedArgs: yargs.Arguments<Arguments>
): Promise<string> {
  if (parsedArgs.workspaceName) {
    return Promise.resolve(parsedArgs.workspaceName);
  }

  return enquirer
    .prompt([
      {
        name: 'WorkspaceName',
        message: `Workspace name: `,
        type: 'input',
      },
    ])
    .then((a: { WorkspaceName: string }) => {
      if (!a.WorkspaceName) {
        output.error({
          title: 'Invalid workspace name',
          bodyLines: [`Workspace name cannot be empty`],
        });
        process.exit(1);
      }
      return a.WorkspaceName;
    });
}

async function determineAppName(
  parsedArgs: yargs.Arguments<Arguments>
): Promise<string> {
  if (parsedArgs.appName) {
    return Promise.resolve(parsedArgs.appName);
  }

  return enquirer
    .prompt([
      {
        name: 'AppName',
        message: `Application name: `,
        type: 'input',
      },
    ])
    .then((a: { AppName: string }) => {
      if (!a.AppName) {
        output.error({
          title: 'Invalid name',
          bodyLines: [`Name cannot be empty`],
        });
        process.exit(1);
      }
      return a.AppName;
    });
}

async function determineStyle(
  parsedArgs: yargs.Arguments<Arguments>
): Promise<string> {
  const choices = [
    {
      name: 'scss',
      message: 'SASS(.scss)       [ http://sass-lang.com   ]',
    },
    {
      name: 'less',
      message: 'LESS              [ http://lesscss.org     ]',
    },
    {
      name: 'css',
      message: 'CSS',
    },
  ];

  if (!parsedArgs.style) {
    return enquirer
      .prompt([
        {
          name: 'style',
          message: `Default stylesheet format: `,
          initial: 'scss' as any,
          type: 'autocomplete',
          choices: choices,
        },
      ])
      .then((a: { style: string }) => a.style);
  }

  const foundStyle = choices.find((choice) => choice.name === parsedArgs.style);

  if (foundStyle === undefined) {
    output.error({
      title: 'Invalid stylesheet type',
      bodyLines: [
        `It must be one of the following:`,
        '',
        ...choices.map((choice) => choice.name),
      ],
    });

    process.exit(1);
  }

  return Promise.resolve(parsedArgs.style);
}

async function main(parsedArgs: yargs.Arguments<Arguments>) {
  output.log({
    title: `Version ${version}`,
    bodyLines: [
      `Please wait...`,
      `It may take a few minutes to gather necessary information.`,
    ],
  });

  const tmpDir = await createSandbox();
  const projectPath = await createApp(parsedArgs, tmpDir);
  await applyVtsChange(parsedArgs, projectPath);
}

async function createSandbox() {
  const packageManager = detectPackageManager();
  const [pmMajor] = getPackageManagerVersion(packageManager).split('.');

  const installSpinner = ora(`Installing dependencies`).start();

  const { install } = getPackageManagerCommand();
  const dependencies = [
    `@nrwl/workspace@${nxVersion}`,
    `nx@${nxVersion}`,
    'typescript',
    'prettier',
  ];

  const tmpDir = dirSync().name;

  try {
    writeFileSync(
      join(tmpDir, 'package.json'),
      JSON.stringify({
        dependencies: {},
      })
    );

    switch (packageManager) {
      case 'yarn':
        if (+pmMajor >= 2) {
          writeFileSync(
            join(tmpDir, '.yarnrc.yml'),
            'nodeLinker: node-modules\nenableScripts: false'
          );
        }
        break;
    }

    await execAndWait(`${install} ${dependencies.join(' ')}`, tmpDir);

    installSpinner.succeed();
  } catch (e) {
    installSpinner.fail();
    output.error({
      title: `Failed to install dependencies`,
      bodyLines: mapErrorToBodyLines(e),
    });
    process.exit(1);
  } finally {
    installSpinner.stop();
  }

  return tmpDir;
}

async function createApp(
  parsedArgs: yargs.Arguments<Arguments>,
  tmpDir: string
) {
  const { workspaceName, appName, style } = parsedArgs;

  const args = unparse({
    appName,
    style,
    preset: defaultNxArgs.preset,
    cli: defaultNxArgs.cli,
  }).join(' ');

  const packageManager = detectPackageManager();
  const { exec } = getPackageManagerCommand();
  const command = `new ${workspaceName} ${args} --collection=@nrwl/workspace/generators.json`;
  const workingDir = process.cwd().replace(/\\/g, '/');
  let nxWorkspaceRoot = `"${workingDir}"`;

  // If path contains spaces there is a problem in Windows for npm@6.
  // In this case we have to escape the wrapping quotes.
  if (
    process.platform === 'win32' &&
    /\s/.test(nxWorkspaceRoot) &&
    packageManager === 'npm'
  ) {
    const pmVersion = +getPackageManagerVersion(packageManager).split('.')[0];
    if (pmVersion < 7) {
      nxWorkspaceRoot = `\\"${nxWorkspaceRoot.slice(1, -1)}\\"`;
    }
  }
  let workspaceSetupSpinner = ora(
    `Workspace is creating in ${getFileName(workspaceName)}`
  ).start();

  try {
    const fullCommand = `${exec} nx ${command} --nxWorkspaceRoot=${nxWorkspaceRoot}`;
    await execAndWait(fullCommand, tmpDir);

    workspaceSetupSpinner.succeed(
      `Workspace created in ${getFileName(workspaceName)}.`
    );
  } catch (e) {
    workspaceSetupSpinner.fail();
    output.error({
      title: `Failed to create a workspace.`,
      bodyLines: mapErrorToBodyLines(e),
    });
    process.exit(1);
  } finally {
    workspaceSetupSpinner.stop();
  }
  return join(workingDir, getFileName(workspaceName));
}

async function applyVtsChange(
  parsedArgs: yargs.Arguments<Arguments>,
  projectPath: string
) {
  await installVtsPlugin(projectPath);
  await runEnhancement(parsedArgs, projectPath);
}

async function installVtsPlugin(projectPath: string) {
  let installSetupSpinner = ora(`Installing ${packageName}`).start();

  try {
    const { install } = getPackageManagerCommand();
    const command = `--save-dev ${packageName}@${version}`;
    const fullCommand = `${install} ${command}`;
    await execAndWait(fullCommand, projectPath);

    installSetupSpinner.succeed(`Installed ${packageName}`);
  } catch (e) {
    installSetupSpinner.fail();
    output.error({
      title: `Failed to install ${packageName}.`,
      bodyLines: mapErrorToBodyLines(e),
    });
    process.exit(1);
  } finally {
    installSetupSpinner.stop();
  }
}

async function runEnhancement(
  parsedArgs: yargs.Arguments<Arguments>,
  projectPath: string
) {
  let workspaceUpdateSpinner = ora(`Workspace is updating`).start();

  try {
    const { style } = parsedArgs;
    const { exec } = getPackageManagerCommand();
    const args = unparse({
      style,
    }).join(' ');
    const command = `g ${packageName}:enhance`;
    const fullCommand = `${exec} nx ${command} ${args}`;
    await execAndWait(fullCommand, projectPath);

    workspaceUpdateSpinner.succeed(`Workspace updated.`);
  } catch (e) {
    workspaceUpdateSpinner.fail();
    output.error({
      title: `Failed to update workspace.`,
      bodyLines: mapErrorToBodyLines(e),
    });
    process.exit(1);
  } finally {
    workspaceUpdateSpinner.stop();
  }
}
