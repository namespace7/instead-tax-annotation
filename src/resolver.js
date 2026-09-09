export function resolvePath(data, path) {
  if (typeof path !== "string" || !path.startsWith("$.")) {
    throw new Error(`Invalid path: ${path}`);
  }

  const tokens = tokenize(path);

  let current = data;

  for (const token of tokens) {
    if (current === null || current === undefined) {
      return undefined;
    }

    current = current[token];
  }

  return current;
}

function tokenize(path) {
  return path
    .slice(2)
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
}
