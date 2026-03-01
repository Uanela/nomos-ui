import {
  Link,
  useParams as useTanstackParams,
  useNavigate as useTanstackNavigate,
  useLocation,
  useSearch,
} from "@tanstack/react-router";
import { RouterAdapter } from "@nomos-ui/core";
import { useUpdateSearchParams } from "./hooks/use-update-search-params";

/**
 * Returns a normalized search params object with a `.get()` interface.
 * Wraps TanStack Router's `useSearch` to match the `RouterAdapter` contract.
 *
 * @returns An object with a `get` method to read search params by key
 *
 * @example
 * ```ts
 * const searchParams = useSearchParams();
 * searchParams.get("page"); // "1"
 * ```
 */
function useSearchParams() {
  const search = useSearch({ strict: false }) as Record<string, any>;
  return {
    get: (key: string) => search[key] ?? null,
  };
}

/**
 * Returns a normalized route params object with a `.get()` interface.
 * Wraps TanStack Router's `useParams` to match the `RouterAdapter` contract.
 *
 * @returns An object with a `get` method to read route params by key
 *
 * @example
 * ```ts
 * const params = useParams();
 * params.get("id"); // "648339adsf043c8ed"
 * ```
 */
function useParams() {
  const params = useTanstackParams({ strict: false }) as Record<string, any>;
  return {
    get: (key: string) => params[key] ?? null,
  };
}

/**
 * Returns the current pathname.
 * Wraps TanStack Router's `useLocation` to match the `RouterAdapter` contract.
 *
 * @returns The current pathname string
 *
 * @example
 * ```ts
 * const pathname = usePathname();
 * // "/products/123"
 * ```
 */
function usePathname(): string {
  return useLocation().pathname;
}

/**
 * Returns a navigate function.
 * Wraps TanStack Router's `useNavigate` to match the `RouterAdapter` contract.
 *
 * @returns A function that accepts a path string to navigate to
 *
 * @example
 * ```ts
 * const navigate = useNavigate();
 * navigate("/products/123");
 * ```
 */
function useNavigate() {
  const navigate = useTanstackNavigate();
  return (path: string) => navigate({ to: path });
}

/**
 * TanStack Router adapter for `@nomos-ui/core` Provider.
 * Implements the `RouterAdapter` contract using TanStack Router hooks and components.
 *
 * Pass this to the `adapter` prop of the Provider to enable routing support
 * in all `@nomos-ui` components when using TanStack Router.
 *
 * @example
 * ```tsx
 * import { TanstackRouterAdapter } from "@nomos-ui/tanstack-router-adapter";
 *
 * <Provider queryLibrary="tanstack-query" adapters={{ core: TanstackRouterAdapter }}>
 *   <App />
 * </Provider>
 * ```
 */
export const TanstackRouterAdapter: RouterAdapter = {
  useSearchParams,
  useUpdateSearchParams,
  useParams,
  usePathname,
  useNavigate,
  components: {
    Link: { component: Link, hrefKey: "to" },
  },
};
