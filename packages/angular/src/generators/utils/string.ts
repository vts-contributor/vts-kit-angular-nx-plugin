const regexEnv = /{{([a-zA-Z0-9\_\-\.]+)([a-zA-Z0-9])}}/g;

export const format = (
  replace: string,
  replaceWith: { [k: string]: string | number | null }
) => {
  return replace.replace(regexEnv, (placeholderWithDelimiters) => {
    const replaceKey = placeholderWithDelimiters.replace(/[\{\}]/g, '');
    return replaceWith.hasOwnProperty(replaceKey)
      ? replaceWith[replaceKey]?.toString() || ''
      : placeholderWithDelimiters;
  });
};

export function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export default function mergeDeep(target, source) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}
