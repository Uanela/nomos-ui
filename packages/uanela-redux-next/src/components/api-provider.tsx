import { createContext, useContext } from "react";

/**
 * Context value containing the RTK Query API instance.
 */
export type ApiContextValue = {
  /** RTK Query API instance with generated endpoints and hooks */
  api: Record<string, any>;
};

/**
 * Context for sharing RTK Query API instance across the component tree.
 * This allows components to access the API without prop drilling.
 */
const ApiContext = createContext<ApiContextValue>({} as any);

/**
 * Provider component that makes the RTK Query API available to all child components.
 *
 * @example
 * ```tsx
 * import { api } from './store/api';
 *
 * function App() {
 *   return (
 *     <ApiProvider api={api}>
 *       <YourComponents />
 *     </ApiProvider>
 *   );
 * }
 * ```
 *
 * @param children - React components that need access to the API
 * @param api - RTK Query API instance created with createApi()
 */
export default function ApiProvider({
  children,
  api,
}: {
  children: React.ReactNode;
  api: any;
}) {
  return <ApiContext.Provider value={{ api }}>{children}</ApiContext.Provider>;
}

/**
 * Hook to access the RTK Query API instance from context.
 * Must be used within an ApiProvider.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { api } = useApi();
 *
 *   // Access endpoints
 *   const { data } = api.useGetUsersQuery();
 *
 *   return <div>{data?.length} users</div>;
 * }
 * ```
 *
 * @throws {Error} If used outside of ApiProvider
 * @returns The API context value containing the RTK Query API instance
 */
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) throw new Error("useApi must be used within ApiProvider");

  return context.api;
};
