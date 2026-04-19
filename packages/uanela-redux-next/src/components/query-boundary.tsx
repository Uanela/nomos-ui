import { ElementType, useEffect, useState } from "react";
import {
  FrownIcon,
  MehIcon,
  RotateCcwIcon,
  ScanSearchIcon,
  CloudOffIcon,
  Loader,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import equal from "deep-equal";
import { Button } from "@nomos-ui/common";
import { useProvider } from "@nomos-ui/core";
import { extractQuery } from "@nomos-ui/core/utils";

/**
 * Standard response format for API data
 *
 * @template T - The type of data being returned
 */
export interface ApiDataResponse<T> {
  /** The actual data returned from the API */
  data: T;
  /** Optional total count of all available records */
  total?: number;
  /** Optional count of results in the current response */
  results?: number;
}

/**
 * Props passed to the success component
 *
 * @template DataType - The type of data being displayed
 * @template AdditionalProps - Additional props specific to the success component
 */
export type SuccessComponentProps<
  DataType,
  AdditionalProps extends Record<string, any> = Record<string, any>,
> = AdditionalProps & {
  /** Callback function triggered when the end of the content is reached */
  handleEndReached: () => void;
  /** Function to trigger a data refresh */
  triggerRefetch: () => void;
  /** The API response data */
  data: ApiDataResponse<DataType>;
};

/**
 * Configuration for error display
 */
interface ErrorDisplayConfig {
  /** Icon component to display */
  Icon?: ElementType;
  /** Error message to show */
  message?: string;
  /** Optional label for the retry button */
  buttonLabel?: string;
  /** The error object received from the API */
  error?: any;
}

/**
 * Props for the QueryBoundary component
 *
 * @template DataType - The type of data being queried
 * @template PassedSuccessComponentProps - Additional props for the success component
 */
interface QueryBoundaryProps<DataType, PassedSuccessComponentProps> {
  /**
   * The query hook to call for data fetching.
   * Pass the hook itself, not its result.
   * Must follow the contract:
   * - RTK Query: `useQuery(params, { skip: boolean })`
   * - TanStack Query: `useQuery(params, { enabled: boolean })`
   *
   * @example
   * useQuery={useGetProductsQuery}
   */
  useQuery: (params: any, options?: any) => any;
  /** Error message to display when data fetch fails */
  errorMessage?: string;
  /** Message to display when no resources exist */
  noResourcesMessage?: string;
  /** Message to display when no data is found */
  notFoundMessage?: string;
  /** Component to render when data is successfully loaded */
  SuccessComponent: ElementType;
  /** Component to render during loading state */
  LoadingComponent?: ElementType;
  /** Parameters to pass to the query hook */
  params?: Record<string, any> | string | number;
  /** Whether to show the reload button */
  showReloadAgainButton?: boolean;
  /** Class name for the success component wrapper */
  successComponentWrapperClassName?: string;
  /** Additional props to pass to the success component */
  successComponentProps?: Partial<PassedSuccessComponentProps>;
  /** Whether to load more data when reaching the end */
  loadMoreOnEndReach?: boolean;
  /** Class name for the loading component */
  loadingComponentClassName?: string;
  /** Interval in milliseconds to automatically reload data */
  reloadAgainAfter?: number;
}

/**
 * A component that handles data fetching, loading states, pagination, and error handling.
 * Supports both RTK Query and TanStack Query via the provider config.
 *
 * @template DataType - The type of data being queried
 * @template PassedSuccessComponentProps - Additional props for the success component
 *
 * @example
 * ```tsx
 * <QueryBoundary
 *   useQuery={useGetProductsQuery}
 *   SuccessComponent={ProductList}
 *   errorMessage="Error loading products"
 * />
 * ```
 */
export default function QueryBoundary<DataType, PassedSuccessComponentProps>({
  useQuery,
  errorMessage = "Ocorreu um erro carregando o dado!",
  noResourcesMessage = "Ainda não existe nenhum dado!",
  notFoundMessage = "Não foi encontrado nenhum dado!",
  SuccessComponent,
  LoadingComponent = () => (
    <div>
      <Loader className="animate-spin" />
    </div>
  ),
  params = {},
  showReloadAgainButton = true,
  successComponentWrapperClassName,
  successComponentProps,
  loadMoreOnEndReach = true,
  loadingComponentClassName,
  reloadAgainAfter = 0,
}: QueryBoundaryProps<DataType, PassedSuccessComponentProps>) {
  const { config } = useProvider();
  const [page, setPage] = useState(1);
  const [queryParams, setQueryParams] = useState<any>();
  const [isRefetch, setIsRefetch] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const normalizedParams =
    typeof params === "object" ? { page, ...params } : params;

  const skip = !equal(normalizedParams, queryParams) && !isRefetch;

  const { refetch, state } = extractQuery<ApiDataResponse<DataType>>(
    useQuery,
    queryParams,
    skip,
    config.queryLibrary
  );

  const isLoading = state.isLoading ?? state.isPending;
  const { isError, isSuccess, isFetching, error, data } = state;

  useEffect(() => {
    if (!isFetching && !isLoading && (isSuccess || isError)) {
      setIsRefetch(false);
      setIsLoadingMore(false);
    }
  }, [isFetching, isLoading, isSuccess, isError]);

  useEffect(() => {
    if (reloadAgainAfter > 0) {
      const interval = setInterval(refetch, reloadAgainAfter);
      return () => clearInterval(interval);
    }
  }, [reloadAgainAfter, refetch]);

  useEffect(() => {
    if (!equal(normalizedParams, queryParams)) {
      setQueryParams(normalizedParams);
      setIsRefetch(true);
    }
  }, [normalizedParams]);

  const handleEndReached = () => {
    const limit = (normalizedParams as Record<string, any>).limit || 30;
    const canLoadMore =
      data?.data && Array.isArray(data.data) && data.data.length % limit === 0;

    if (!isLoading && !isFetching && canLoadMore && loadMoreOnEndReach) {
      setPage((prev) => prev + 1);
      setIsLoadingMore(true);
    }
  };

  if (isLoading || (isRefetch && isFetching)) {
    return (
      <LoadingComponent className={twMerge("", loadingComponentClassName)} />
    );
  }

  if (isError) {
    const errorStates: Record<string, ErrorDisplayConfig> = {
      FETCH_ERROR: {
        Icon: CloudOffIcon,
        message:
          "Não é Possível Conectar ao Servidor Ou Tente Verificar Sua Conexão a Internet!",
      },
      "404": {
        Icon: MehIcon,
        message: notFoundMessage,
      },
      default: {
        Icon: FrownIcon,
        message: errorMessage,
      },
    };

    const errorConfig = error?.status
      ? errorStates[error.status] || errorStates.default
      : errorStates.default;

    return <ErrorComponent {...errorConfig} triggerRefetch={refetch} />;
  }

  if (isSuccess && data?.data) {
    const hasData = Array.isArray(data.data) ? data.data.length > 0 : true;

    if (hasData) {
      return (
        <>
          <div className={twMerge("", successComponentWrapperClassName)}>
            <SuccessComponent
              data={data}
              {...successComponentProps}
              handleEndReached={handleEndReached}
              triggerRefetch={refetch}
            />
            {Array.isArray(data.data) && showReloadAgainButton && (
              <Button
                isLoading={isLoading}
                onClick={refetch}
                className="self-center justify-self-center p-2 mt-4"
              >
                <RotateCcwIcon className="size-4" strokeWidth={3} />
              </Button>
            )}
          </div>
          {isLoadingMore && (
            <div className="block w-full items-center">
              <span className="mt-4">Carregando mais...</span>
            </div>
          )}
        </>
      );
    }

    return (
      <ErrorComponent
        Icon={ScanSearchIcon}
        message={noResourcesMessage}
        buttonLabel="Carregar Novamente"
        triggerRefetch={refetch}
        error={error}
      />
    );
  }

  return null;
}

/**
 * Displays error states with an icon, message, and retry button.
 *
 * @param Icon - Icon component to display
 * @param message - Error message to show
 * @param triggerRefetch - Function to retry the failed request
 * @param buttonLabel - Label for the retry button
 * @param error - The error object received from the API
 */
function ErrorComponent({
  Icon,
  message,
  triggerRefetch,
  buttonLabel = "Tentar Novamente",
  error,
}: ErrorDisplayConfig & { triggerRefetch: () => void }) {
  return (
    <div className="w-full flex flex-col gap-4 flex-1 max-w-[320px] mx-auto">
      <div className="flex-1 flex items-center justify-center flex-col rounded-md overflow-hidden">
        <div className="bg-red-500 md:p-6 p-4 w-full items-center flex justify-center rounded-t-md flex-col text-white gap-4">
          {Icon && (
            <Icon strokeWidth={1.5} className="md:size-24 size-16 text-white" />
          )}
          <p className="text-center text-[0.95rem]">{message}</p>
        </div>
        <div className="rounded-b-md border-2 border-t-0 w-full md:p-6 p-4 flex items-center justify-center flex-col gap-4">
          {error?.data?.message && (
            <p className="text-center py-2">{error.data.message}</p>
          )}
          <Button
            className="px-4"
            variant="destructive"
            onClick={triggerRefetch}
          >
            <RotateCcwIcon className="size-4" /> {buttonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
