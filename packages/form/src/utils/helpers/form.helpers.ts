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

/**
 * Converts a JSON object to FormData with support for nested objects, arrays, and files.
 *
 * @param {Record<string, any>} json - The JSON object to convert
 * @param {FormData} [formData=new FormData()] - Optional existing FormData to append to
 * @param {string} [parentKey=''] - Internal parameter for tracking nested keys
 * @returns {FormData} The populated FormData object
 *
 * @example
 * const data = {
 *   name: 'John',
 *   tags: ['js', 'react'],
 *   profile: {
 *     age: 30,
 *     address: {
 *       city: 'NYC'
 *     }
 *   }
 * };
 * const formData = jsonToFormData(data);
 * // Results in:
 * // name: 'John'
 * // tags[0]: 'js'
 * // tags[1]: 'react'
 * // profile[age]: 30
 * // profile[address][city]: 'NYC'
 */
export function objectToFormData(
  obj: Record<string, any>,
  formData: FormData = new FormData(),
  parentKey: string = ""
): FormData {
  if (obj === null || obj === undefined) return formData;

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const value = obj[key];
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if ((value instanceof File || value instanceof Blob) && value) {
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        formData.append(`${formKey}[]`, "");
      } else {
        value.forEach((item, index) => {
          const arrayKey = `${formKey}[${index}]`;

          if (
            typeof item === "object" &&
            item !== null &&
            !(item instanceof File) &&
            !(item instanceof Blob)
          ) {
            objectToFormData({ [index]: item }, formData, formKey);
          } else {
            formData.append(arrayKey, item);
          }
        });
      }
    } else if (typeof value === "object" && value !== null) {
      objectToFormData(value, formData, formKey);
    } else if (value !== undefined) {
      formData.append(formKey, value);
    }
  }

  return formData;
}
