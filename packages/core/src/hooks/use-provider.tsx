import { useContext } from "react";
import {
  LinkConfig,
  NomosContext,
  ProviderConfig,
} from "../components/provider";

/**
 * Normalized return shape of useProvider
 */
type UseProviderReturn = {
  config: {
    queryLibrary: ProviderConfig["queryLibrary"];
  };
  components: {
    Link: {
      component: React.ElementType;
      hrefKey: string;
    };
  };
};

/**
 * Normalizes the Link config into a consistent { component, hrefKey } shape
 * regardless of whether the user passed a raw ElementType or a LinkConfig object
 */
function normalizeLinkConfig(
  link: Exclude<ProviderConfig["components"], undefined>["Link"] | undefined
): UseProviderReturn["components"]["Link"] {
  if (!link) {
    return { component: "a" as React.ElementType, hrefKey: "href" };
  }

  if ((link as LinkConfig).component) {
    const linkConfig = link as LinkConfig;
    return {
      component: linkConfig.component,
      hrefKey: linkConfig.hrefKey || "href",
    };
  }

  return {
    component: link as React.ElementType,
    hrefKey: "href",
  };
}

/**
 * Hook to access the provider context for customizable components.
 * Returns a normalized config and components shape.
 *
 * @returns config - Query library and other global config
 * @returns components - Normalized component overrides with defaults applied
 *
 * @throws {Error} If queryLibrary is not provided in the Provider
 *
 * @example
 * ```ts
 * const { config, components } = useProvider();
 * config.queryLibrary // "rtk-query" | "tanstack-query"
 * components.Link.component // Next.js Link, React Router Link, or "a"
 * ```
 */
export function useProvider(): UseProviderReturn {
  const context = useContext(NomosContext);

  if (!context.queryLibrary) {
    throw new Error(
      "queryLibrary is required — please pass it in the Provider configuration"
    );
  }

  return {
    config: {
      queryLibrary: context.queryLibrary,
    },
    components: {
      Link: normalizeLinkConfig(context.components?.Link),
    },
  };
}
