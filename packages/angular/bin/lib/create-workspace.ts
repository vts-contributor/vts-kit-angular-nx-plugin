import * as yargs from 'yargs';
import * as chalk from 'chalk';
import { Arguments } from './arguments';
import { output } from './output';
import * as enquirer from 'enquirer';
import {
  detectPackageManager,
  getPackageManagerCommand,
  getPackageManagerVersion,
} from '@nx/devkit';
import { unparse } from './utils';
import * as ora from 'ora';
import { join } from 'path';
import { execAndWait, getFileName, mapErrorToBodyLines } from './utils';
import { dirSync } from 'tmp';
import { readFileSync, writeFileSync } from 'fs';
import { nxVersion } from '../../src/generators/utils/versions';

const packageName = require('../../package.json').name;
const version = require('../../package.json').version;
const generateArgs = {
  preset: 'angular-monorepo',
  workspaceType: 'integrated',
  standaloneApi: true,
};

export const commandsObject: yargs.Argv<Arguments> = yargs
  .wrap(yargs.terminalWidth())
  .parserConfiguration({
    'strip-dashed': true,
    'dot-notation': true,
  })
  .command(
    '$0 [options]',
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
        })
        .option('templates', {
          describe: chalk.dim`Initial Templates`,
          type: 'array',
        }),
    async (argv: yargs.ArgumentsCamelCase<Arguments>) => {
      await main(argv).catch((error) => {
        output.error({
          title: `Something went wrong!`,
        });
        throw error;
      });
    },
    [getConfiguration]
  )
  .command({
    command: 'example',
    describe: 'Generate an example',
    handler: async (argv) => {
      const expArgv = {
        workspaceName: 'vts-kit-nx-webapp',
        appName: 'demoapp',
        style: 'less',
        templates: ['ErrorTemplate-NoLayout'],
        example: true,
      } as yargs.Arguments<Arguments>;
      await main(expArgv).catch((error) => {
        output.error({
          title: `Something went wrong!`,
        });
        throw error;
      });
    },
    builder: {
      prefix: {
        type: 'string',
        demandOption: false,
        describe:
          'Specify prefix of window environment, any environments start with this prefix will be injected into HTML',
        default: 'VTS_KIT_',
      },
      htmlPath: {
        type: 'string',
        demandOption: false,
        describe:
          'Path to HTML file which will be injected, by default, use the nearest index.html file',
      },
    },
  })
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
      bodyLines: [`Collecting configuration...`],
    });

    let workspaceName, appName, style, templates;
    workspaceName = await determineWorkspaceName(argv);
    appName = await determineAppName(argv);
    style = await determineStyle(argv);
    templates = await determineTemplate(argv);
    Object.assign(argv, {
      workspaceName,
      appName,
      style,
      templates,
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

async function determineTemplate(
  parsedArgs: yargs.Arguments<Arguments>
): Promise<string[]> {
  const templateChoices = [
    {
      name: 'ErrorTemplate-NoLayout',
      message: 'Error Template',
    },
    {
      name: 'AuthenticationTemplate-WithLayout',
      message: 'Authentication',
    },
    {
      name: 'LandingTemplate-WithLayout',
      message: 'Landing Page',
    },
  ];

  if (!parsedArgs.templates) {
    return enquirer
      .prompt([
        {
          name: 'useTemplate',
          message: `Do you want to generate inital templates?`,
          type: 'confirm',
        },
      ])
      .then((a: { useTemplate: boolean }) => {
        if (!!a.useTemplate) {
          return enquirer
            .prompt([
              {
                name: 'templates',
                message: `Select inital templates: (Use <space> to toggle select)`,
                type: 'multiselect',
                initial: ['ErrorTemplate-NoLayout'] as any,
                choices: templateChoices,
              },
            ])
            .then((a: { templates: string[] }) => a.templates);
        } else return [];
      });
  }
}

async function main(parsedArgs: yargs.Arguments<Arguments>) {
  const { example } = parsedArgs;

  output.log({
    title: `Version ${version}`,
    bodyLines: [
      `Please wait...`,
      `It may take a few minutes to gather necessary information.`,
    ],
  });

  if (example)
    output.log({
      title: ``,
      bodyLines: [`Generating Mode: Example`],
    });

  const tmpDir = await createSandbox();
  const projectPath = await createWorkspace(parsedArgs, tmpDir);
  await applyVtsChange(parsedArgs, projectPath);
}

async function createSandbox() {
  const packageManager = detectPackageManager();
  const [pmMajor] = getPackageManagerVersion(packageManager).split('.');

  const installSpinner = ora(`Installing dependencies`).start();

  const { install } = getPackageManagerCommand();
  const dependencies = [
    `@nx/workspace@${nxVersion}`,
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

async function createWorkspace(
  parsedArgs: yargs.Arguments<Arguments>,
  tmpDir: string
) {
  const { workspaceName, appName } = parsedArgs;
  const args = unparse({
    ...generateArgs,
    appName,
    verbose: true
  }).join(' ');

  const packageManager = detectPackageManager();
  const { exec } = getPackageManagerCommand();
  const command = `new ${workspaceName} ${args} --collection=@nx/workspace/generators.json`;
  const workingDir = process.cwd().replace(/\\/g, '/');
  let nxWorkspaceRoot = `"${workingDir}"`;

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
    const fullCommand = `${exec} nx ${command} --nxWorkspaceRoot=${nxWorkspaceRoot} --verbose`;
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

async function createApp(
  parsedArgs: yargs.Arguments<Arguments>,
  projectPath: string
) {
  const { appName } = parsedArgs;
  let installSetupSpinner = ora(`Creating application ${appName}`).start();

  try {
    const { style, appName } = parsedArgs;
    const { exec } = getPackageManagerCommand();
    const args = unparse({
      style,
      name: appName,
      verbose: true
    }).join(' ');
    let command = `g angular-monorepo:preset`;
    const fullCommand = `${exec} nx ${command} ${args}`;
    await execAndWait(fullCommand, projectPath);

    installSetupSpinner.succeed(`Created application ${appName}`);
  } catch (e) {
    installSetupSpinner.fail();
    output.error({
      title: `Failed to create application ${appName}.`,
      bodyLines: mapErrorToBodyLines(e),
    });
    process.exit(1);
  } finally {
    installSetupSpinner.stop();
  }
}

async function applyVtsChange(
  parsedArgs: yargs.Arguments<Arguments>,
  projectPath: string
) {
  const { example } = parsedArgs;

  await installVtsPlugin(parsedArgs, projectPath);
  await runEnhancement(parsedArgs, projectPath);
  await generateTemplate(parsedArgs, projectPath);

  if (example) await updateExample(projectPath);
}

async function installVtsPlugin(
  parsedArgs: yargs.Arguments<Arguments>,
  projectPath: string
) {
  let installSetupSpinner = ora(`Installing ${packageName}`).start();

  try {
    const { install } = getPackageManagerCommand();
    let command = `--save-dev ${packageName}@${version}`;
    if (version.endsWith('local'))
      command = `--save-dev ${join(__dirname, '..', '..')}`;
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
    const { style, appName } = parsedArgs;
    const { exec } = getPackageManagerCommand();
    const args = unparse({
      style,
      defaultApp: appName,
      verbose: true
    }).join(' ');
    const command = `g ${packageName}:enhance`;
    const fullCommand = `${exec} nx ${command} ${args}`;
    await execAndWait(fullCommand, projectPath);

    workspaceUpdateSpinner.succeed(`Workspace updated.`);
  } catch (e) {
    console.log(e)
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

async function generateTemplate(
  parsedArgs: yargs.Arguments<Arguments>,
  projectPath: string
) {
  const { templates } = parsedArgs;
  if (templates == null || templates.length == 0) return;

  const generate = async (type) => {
    const formattedName = type
      .split('-')
      .reverse()
      .pop()
      .replace(/Template/g, '');
    let templateGenerateSpinner = ora(
      `Generating template (${formattedName}).`
    ).start();
    try {
      const { exec } = getPackageManagerCommand();
      const args = unparse({
        type,
        name: formattedName,
        verbose: true
      }).join(' ');
      const command = `g ${packageName}:template`;
      const fullCommand = `${exec} nx ${command} ${args}`;
      await execAndWait(fullCommand, projectPath);

      templateGenerateSpinner.succeed(`Generated template (${formattedName}).`);
    } catch (e) {
      templateGenerateSpinner.fail();
      output.error({
        title: `Failed to generate template.`,
        bodyLines: mapErrorToBodyLines(e),
      });
      process.exit(1);
    } finally {
      templateGenerateSpinner.stop();
    }
  };

  for await (const item of templates) {
    await generate(item);
  }
}

async function updateExample(projectPath: string) {
  let exampleSpinner = ora(`Update example`).start();

  try {
    const packageJson = JSON.parse(
      readFileSync(join(projectPath, 'package.json')).toString()
    );
    writeFileSync(
      join(projectPath, 'package.json'),
      JSON.stringify(
        {
          ...packageJson,
          devDependencies: {
            ...packageJson.devDependencies,
            '@vts-kit/nx-angular': 'latest',
          },
        },
        null,
        2
      )
    );
  } catch (e) {
    exampleSpinner.fail();
    output.error({
      title: `Failed to update example`,
      bodyLines: mapErrorToBodyLines(e),
    });
    process.exit(1);
  } finally {
    exampleSpinner.stop();
  }
}
