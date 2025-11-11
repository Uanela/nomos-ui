export function getNestedErrorMessage(
  errors: Record<string, any>,
  path: string
) {
  const parts = path.split(".");

  let current = errors;
  for (const part of parts) {
    if (!current || !current[part]) return null;
    current = current[part];
  }

  return current.message ? current.message : null;
}
