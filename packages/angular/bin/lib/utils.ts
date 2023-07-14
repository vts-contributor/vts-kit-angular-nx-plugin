import { exec } from 'child_process';
import { flatten } from 'flat';

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

export function unparse(options: Object): string[] {
  const unparsed: string[] = [];
  for (const key of Object.keys(options)) {
    const value = options[key as keyof typeof options];
    unparseOption(key, value, unparsed);
  }

  return unparsed;
}

function unparseOption(key: string, value: any, unparsed: string[]) {
  if (value === true) {
    unparsed.push(`--${key}`);
  } else if (value === false) {
    unparsed.push(`--no-${key}`);
  } else if (Array.isArray(value)) {
    value.forEach((item) => unparseOption(key, item, unparsed));
  } else if (Object.prototype.toString.call(value) === '[object Object]') {
    const flattened = flatten<any, any>(value, { safe: true });
    for (const flattenedKey in flattened) {
      unparseOption(
        `${key}.${flattenedKey}`,
        flattened[flattenedKey],
        unparsed
      );
    }
  } else if (typeof value === 'string' && value.includes(' ')) {
    unparsed.push(`--${key}="${value}"`);
  } else if (value != null) {
    unparsed.push(`--${key}=${value}`);
  }
}