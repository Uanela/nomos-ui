import Link from "next/link";
import {
  useSearchParams as useNextSearchParams,
  useParams as useNextParams,
  usePathname as useNextPathname,
  useRouter,
} from "next/navigation";
import useNextUpdateSearchParams from "./hooks/use-update-search-params";
import { RouterAdapter } from "@nomos-ui/core";

/**
 * Returns a normalized search params object with a `.get()` interface.
 * Wraps Next.js `useSearchParams` to match the `RouterAdapter` contract.
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
  const searchParams = useNextSearchParams();
  return {
    get: (key: string) => searchParams.get(key),
  };
}

/**
 * Returns a normalized route params object with a `.get()` interface.
 * Wraps Next.js `useParams` to match the `RouterAdapter` contract.
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
  const params = useNextParams();
  return {
    get: (key: string) => params[key] ?? null,
  };
}

/**
 * Returns the current pathname.
 * Wraps Next.js `usePathname` to match the `RouterAdapter` contract.
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
  return useNextPathname();
}

/**
 * Returns a navigate function.
 * Wraps Next.js `useRouter().push` to match the `RouterAdapter` contract.
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
  const router = useRouter();
  return (path: string) => router.push(path);
}

/**
 * Next.js router adapter for `@nomos-ui/core` Provider.
 * Implements the `RouterAdapter` contract using Next.js navigation hooks and components.
 *
 * @example
 * ```tsx
 * import { NextAdapter } from "@nomos-ui/next-adapter";
 * <Provider queryLibrary="rtk-query" adapter={NextAdapter} />
 * ```
 */
export const NextAdapter: RouterAdapter = {
  useSearchParams,
  useUpdateSearchParams: useNextUpdateSearchParams,
  useParams,
  usePathname,
  useNavigate,
  components: {
    Link: { component: Link, hrefKey: "href" },
  },
};
