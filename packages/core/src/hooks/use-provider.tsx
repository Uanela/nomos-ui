import { useContext } from "react";
import { LinkConfig, ProviderContext } from "../components/provider";

/**
 * Hook to access the provider context for customizable components
 *
 * @returns The provider context containing component configurations with defaults applied
 *
 * @example
 * const { components } = useProvider();
 * // components.Link defaults to "a" if not provided
 *
 * @throws {Error} If used outside of Provider
 */
export function useProvider() {
  const context = useContext(ProviderContext);

  if (!context) {
    throw new Error("useProvider must be used within a Provider");
  }

  return {
    ...context,
    components: {
      ...context.components,
      Link: (context?.components?.Link as LinkConfig)?.component
        ? {
            component:
              (context?.components?.Link as LinkConfig)?.component || "a",
            hrefKey:
              (context?.components?.Link as LinkConfig)?.hrefKey || "href",
          }
        : {
            component: context?.components?.Link || "a",
            hrefKey: "href",
          },
    },
  };
}
