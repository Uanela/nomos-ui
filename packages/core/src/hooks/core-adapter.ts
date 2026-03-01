import { useProvider } from "./use-provider";

/**
 * Returns a normalized search params object with a `.get()` interface.
 * Reads from the core router adapter configured in the Provider.
 *
 * @returns An object with a `get` method to read search params by key
 *
 * @example
 * ```ts
 * const searchParams = useSearchParams();
 * searchParams.get("page"); // "1"
 * ```
 */
export function useSearchParams() {
  const { adapters } = useProvider();
  return adapters.core.useSearchParams();
}

/**
 * Returns a function to update search params.
 * Reads from the core router adapter configured in the Provider.
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
  const { adapters } = useProvider();
  return adapters.core.useUpdateSearchParams();
}

/**
 * Returns a normalized route params object with a `.get()` interface.
 * Reads from the core router adapter configured in the Provider.
 *
 * @returns An object with a `get` method to read route params by key
 *
 * @example
 * ```ts
 * const params = useParams();
 * params.get("id"); // "648339adsf043c8ed"
 * ```
 */
export function useParams() {
  const { adapters } = useProvider();
  return adapters.core.useParams();
}

/**
 * Returns the current pathname.
 * Reads from the core router adapter configured in the Provider.
 *
 * @returns The current pathname string
 *
 * @example
 * ```ts
 * const pathname = usePathname();
 * // "/products/123"
 * ```
 */
export function usePathname() {
  const { adapters } = useProvider();
  return adapters.core.usePathname();
}

/**
 * Returns a navigate function to programmatically navigate to a path.
 * Reads from the core router adapter configured in the Provider.
 *
 * @returns A function that accepts a path string to navigate to
 *
 * @example
 * ```ts
 * const navigate = useNavigate();
 * navigate("/products/123");
 * ```
 */
export function useNavigate() {
  const { adapters } = useProvider();
  return adapters.core.useNavigate();
}
