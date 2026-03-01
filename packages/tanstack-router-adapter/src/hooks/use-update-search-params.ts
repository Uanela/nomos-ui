import { useNavigate } from "@tanstack/react-router";

/**
 * Returns a function to update search params while preserving existing ones.
 * Wraps TanStack Router's `useNavigate` to match the `RouterAdapter` contract.
 *
 * @returns A function that accepts an array of `{ name, value }` pairs to set
 *
 * @example
 * ```ts
 * const updateSearchParams = useUpdateSearchParams();
 * updateSearchParams([{ name: "page", value: "2" }]);
 * ```
 */
export function useUpdateSearchParams() {
  const navigate = useNavigate();
  return function (fields: { name: string; value: string }[]) {
    navigate({
      search: (prev: Record<string, any>) => {
        const next = { ...prev };
        fields.forEach((field) => (next[field.name] = field.value));
        return next;
      },
    } as any);
  };
}
