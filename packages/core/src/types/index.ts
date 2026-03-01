import { LinkConfig } from "../components/provider";

/**
 * The contract every router adapter must implement.
 * Pass an adapter to the Provider to enable routing support in all @nomos-ui components.
 *
 * @example
 * ```tsx
 * import { NextAdapter } from "@nomos-ui/next-adapter";
 * <Provider adapter={NextAdapter} queryLibrary="rtk-query" />
 * ```
 */
export type RouterAdapter = {
  /** Hook that returns normalized search params */
  useSearchParams: () => { get: (key: string) => string | null };
  /** Hook that returns a function to update search params */
  useUpdateSearchParams: () => (
    params: { name: string; value: string }[]
  ) => void;
  /** Hook that returns normalized route params */
  useParams: () => { get: (key: string) => string | string[] | null };
  /** Hook that returns the current pathname */
  usePathname: () => string;
  /** Framework-specific components */
  components: {
    Link: LinkConfig;
  };
};
