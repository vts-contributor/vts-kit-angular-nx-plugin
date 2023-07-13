import { exec } from 'child_process';

export function getFileName(name: string) {
  return name
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[ _]/g, '-');
}

export function mapErrorToBodyLines(error: {
  logMessage: string;
  code: number;
}): string[] {
  if (error.logMessage?.split('\n').filter((line) => !!line).length === 1) {
    return [`Error: ${error.logMessage}`];
  }
  const lines = [`Exit code: ${error.code}, Error: ${error.logMessage}`];
  return lines;
}

export function execAndWait(command: string, cwd: string) {
  return new Promise((res, rej) => {
    exec(command, { cwd, env: { ...process.env } }, (error, stdout, stderr) => {
      if (error) {
        const message = stderr && stderr.trim().length ? stderr : stdout;
        rej({ code: error.code, logMessage: message });
      } else {
        res({ code: 0, stdout });
      }
    });
  });
}
