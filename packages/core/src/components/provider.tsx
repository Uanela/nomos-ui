import { createContext, ReactNode } from "react";

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
  component: ReactNode;
  hrefKey?: string;
};

export type ProviderContext = {
  children: React.ReactNode;
  components?: {
    Link?: ReactNode | LinkConfig;
  };
};

export const ProviderContext = createContext<Omit<ProviderContext, "children">>(
  {}
);

/**
 * Provider component that supplies context for customizable UI components.
 *
 * @param children - Child components that will have access to the provider context
 * @param components.Link - Optional custom Link component configuration
 */
export default function Provider({ children, ...props }: ProviderContext) {
  return (
    <ProviderContext.Provider value={{ ...props }}>
      {children}
    </ProviderContext.Provider>
  );
}
