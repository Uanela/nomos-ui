import { ElementType } from "react";
import { FrownIcon, MehIcon, ScanSearchIcon, CloudOffIcon } from "lucide-react";
import { Button } from "@nomos-ui/form";
import { twMerge } from "tailwind-merge";

interface ApiDataResponse<T> {
  data: T;
  total?: number;
  results?: number;
}

type SuccessComponentProps<
  DataType,
  AdditionalProps = Record<string, any>,
> = AdditionalProps & {
  data: ApiDataResponse<DataType>;
  hasMoreData?: boolean;
};

interface ErrorDisplayConfig {
  Icon: ElementType;
  message: string;
  buttonLabel?: string;
}

interface ServerQueryBoundaryProps<DataType, PassedSuccessComponentProps> {
  fetcher: (params: any) => Promise<ApiDataResponse<DataType> | null>;
  params?: Record<string, any>;
  errorMessage?: string;
  noResourcesMessage?: string;
  notFoundMessage?: string;
  SuccessComponent: React.FC<
    SuccessComponentProps<DataType, PassedSuccessComponentProps>
  >;
  LoadingComponent?: React.ReactNode;
  successComponentWrapperClassName?: string;
  successComponentProps?: Partial<PassedSuccessComponentProps>;
}

export default async function ServerQueryBoundary<
  DataType,
  PassedSuccessComponentProps,
>({
  fetcher,
  params = {},
  errorMessage = "An error occurred loading the data!",
  noResourcesMessage = "No data exists yet!",
  notFoundMessage = "No data was found!",
  SuccessComponent,
  LoadingComponent = (
    <div className="flex justify-center items-center p-8">
      <div className="animate-pulse">Loading...</div>
    </div>
  ),
  successComponentWrapperClassName,
  successComponentProps,
}: ServerQueryBoundaryProps<DataType, PassedSuccessComponentProps>) {
  try {
    const data = await fetcher(params);

    if (data === null) {
      return (
        <ErrorComponent
          Icon={MehIcon}
          message={notFoundMessage}
          buttonLabel="Go Back"
        />
      );
    }

    const hasData = Array.isArray(data.data)
      ? data.data.length > 0
      : data.data !== undefined && data.data !== null;

    if (!hasData) {
      return (
        <ErrorComponent
          Icon={ScanSearchIcon}
          message={noResourcesMessage}
          buttonLabel="Reload Page"
        />
      );
    }

    const limit = (params as Record<string, any>).limit || 30;
    const hasMoreData = Array.isArray(data.data)
      ? data.data.length >= limit && (data.total || 0) > data.data.length
      : false;

    return (
      <div className={twMerge("", successComponentWrapperClassName)}>
        <SuccessComponent
          data={data}
          hasMoreData={hasMoreData}
          {...(successComponentProps as any)}
        />
      </div>
    );
  } catch (error: any) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return (
        <ErrorComponent
          Icon={CloudOffIcon}
          message="Cannot connect to server. Please check your internet connection!"
          buttonLabel="Try Again"
        />
      );
    }

    return (
      <ErrorComponent
        Icon={FrownIcon}
        message={errorMessage}
        buttonLabel="Try Again"
      />
    );
  }
}

function ErrorComponent({
  Icon,
  message,
  buttonLabel = "Try Again",
}: ErrorDisplayConfig) {
  return (
    <div className="w-full flex flex-col gap-4 flex-1 max-w-[320px] mx-auto">
      <div className="flex-1 flex items-center justify-center flex-col rounded-md overflow-hidden">
        <div className="bg-red-500 md:p-6 p-4 w-full items-center flex justify-center rounded-t-md flex-col text-white gap-4">
          <Icon strokeWidth={1.5} className="md:size-24 size-16 text-white" />
          <p className="text-center text-[0.95rem]">{message}</p>
        </div>
        <div className="rounded-b-md border-2 border-t-0 w-full md:p-6 p-4 flex items-center justify-center flex-col gap-4">
          <form action="/refresh" method="post">
            <input type="hidden" name="retry" value="true" />
            <Button type="submit" className="px-4" variant="destructive">
              {buttonLabel}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
