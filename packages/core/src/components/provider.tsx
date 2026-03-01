import { createContext, ReactNode } from "react";
import { RouterAdapter } from "../types";

/**
 * Configuration for custom Link components to support different routing systems
 *
 * @property component - The Link component to render (e.g., Next.js Link, React Router Link)
 * @property hrefKey - The prop name used for the URL path (defaults to "href")
 *
 * @example
 * // Next.js Link (uses "href")
 * { component: NextLink, hrefKey: "href" }
 *
 * @example
 * // React Router Link (uses "to")
 * { component: RouterLink, hrefKey: "to" }
 *
 * @default
 * - component: <a> (HTML anchor tag)
 * - hrefKey: "href"
 */
export type LinkConfig = {
  component: React.ElementType;
  hrefKey?: string;
};

/**
 * The shape of the provider configuration — what consumers read via useProvider
 */
export type ProviderConfig = {
  queryLibrary: "rtk-query" | "tanstack-query";
  components?: {
    Link?: React.ElementType | LinkConfig;
  };
  adapters: {
    core: RouterAdapter;
  };
};

/**
 * Props for the Provider component
 */
export type ProviderProps = ProviderConfig & {
  children: ReactNode;
};

export const NomosContext = createContext<ProviderConfig>({} as any);

/**
 * Provider component that supplies context for customizable UI components.
 *
 * @param children - Child components that will have access to the provider context
 * @param queryLibrary - The query library in use ("rtk-query" | "tanstack-query")
 * @param components.Link - Optional custom Link component configuration
 *
 * @example
 * ```tsx
 * <Provider queryLibrary="rtk-query" components={{ Link: NextLink }}>
 *   <App />
 * </Provider>
 * ```
 */
export default function Provider({ children, ...props }: ProviderProps) {
  return (
    <NomosContext.Provider value={{ ...props }}>
      {children}
    </NomosContext.Provider>
  );
}
