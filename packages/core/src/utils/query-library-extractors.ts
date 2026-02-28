/**
 * The normalized shape returned by extractMutation.
 *
 * @template Input - The shape of the data being submitted
 * @template Response - The shape of the API response returned after successful mutation
 */
type ExtractMutationReturn<Input, Response> = {
  /**
   * Normalized trigger function that works regardless of the query library.
   * - RTK Query: wraps the trigger with `.unwrap()` so it throws on error
   * - TanStack Query: uses `mutateAsync` directly which throws on error
   *
   * @param data - The data to submit
   * @returns A promise that resolves with the response or throws on error
   */
  trigger: (data: Input) => Promise<Response>;
  /**
   * The raw mutation state as returned by the library.
   * Passed through untouched so the Form receives exactly what the library provides.
   *
   * - RTK Query: `{ isLoading, isSuccess, isError, error, data, reset, originalArgs, ... }`
   * - TanStack Query: `{ isPending, isSuccess, isError, error, data, reset, variables, context, ... }`
   */
  state: any;
};

/**
 * Extracts a normalized trigger function and raw state from a mutation hook result.
 * Supports both RTK Query (tuple) and TanStack Query (object) shapes.
 *
 * The only thing normalized is the trigger — state is passed through raw
 * so consumers receive exactly what their chosen library provides.
 *
 * @template Input - The shape of the data being submitted
 * @template Response - The shape of the API response returned after successful mutation
 *
 * @param result - The raw result returned from calling the mutation hook
 * @param queryLibrary - The query library in use, from the provider config
 * @returns An object with a normalized `trigger` function and the raw `state`
 *
 * @example
 * // RTK Query
 * const result = useCreateProductMutation();
 * const { trigger, state } = extractMutation<CreateProductInput, Product>(result, "rtk-query");
 *
 * @example
 * // TanStack Query
 * const result = useCreateProductMutation();
 * const { trigger, state } = extractMutation<CreateProductInput, Product>(result, "tanstack-query");
 */
export function extractMutation<Input, Response>(
  result: any,
  queryLibrary: "rtk-query" | "tanstack-query"
): ExtractMutationReturn<Input, Response> {
  if (queryLibrary === "rtk-query") {
    const [triggerFn, state] = result;
    return {
      trigger: (data: Input) => triggerFn(data).unwrap(),
      state,
    };
  }

  const { mutateAsync, ...state } = result;
  return {
    trigger: mutateAsync,
    state,
  };
}

/**
 * The return shape of extractQuery.
 *
 * @template Data - The shape of the data returned by the query
 */
type ExtractQueryReturn<Data> = {
  /**
   * Normalized refetch function that works regardless of the query library.
   * Both RTK Query and TanStack Query expose `refetch` with the same name,
   * so this is extracted for convenience and consistency with extractMutation.
   */
  refetch: () => void;
  /**
   * The raw query state as returned by the library.
   * Passed through untouched so consumers receive exactly what the library provides.
   *
   * - RTK Query: `{ data, isLoading, isSuccess, isError, isFetching, error, refetch, ... }`
   * - TanStack Query: `{ data, isPending, isSuccess, isError, isFetching, error, refetch, ... }`
   */
  state: any;
};

/**
 * Calls a query hook with normalized options and returns the raw state.
 * Handles the skip/enabled difference between RTK Query and TanStack Query.
 *
 * The only thing normalized is the options translation (skip → enabled) and
 * the refetch extraction — state is passed through raw so consumers receive
 * exactly what their chosen library provides.
 *
 * Consumers must follow this contract when writing their query hooks:
 * - RTK Query: `useQuery(params, { skip: boolean })`
 * - TanStack Query: `useQuery(params, { enabled: boolean })`
 *
 * @template Data - The shape of the data returned by the query
 *
 * @param useQuery - The query hook to call
 * @param params - The parameters to pass to the query hook
 * @param skip - Whether to skip/disable the query
 * @param queryLibrary - The query library in use, from the provider config
 * @returns An object with a normalized `refetch` function and the raw `state`
 *
 * @example
 * // RTK Query
 * const { refetch, state } = extractQuery<Product[]>(
 *   useGetProductsQuery,
 *   { page: 1, limit: 18 },
 *   false,
 *   "rtk-query"
 * );
 *
 * @example
 * // TanStack Query
 * const { refetch, state } = extractQuery<Product[]>(
 *   useGetProductsQuery,
 *   { page: 1, limit: 18 },
 *   false,
 *   "tanstack-query"
 * );
 */
export function extractQuery<Data>(
  useQuery: (params: any, options?: any) => any,
  params: any,
  skip: boolean,
  queryLibrary: "rtk-query" | "tanstack-query"
): ExtractQueryReturn<Data> {
  const options = queryLibrary === "rtk-query" ? { skip } : { enabled: !skip };

  const { refetch, ...state } = useQuery(params, options);

  return {
    refetch,
    state,
  };
}
