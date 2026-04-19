import { useEffect, useMemo, useRef, useState } from "react";
import { ListPageProps } from "./list-page";
import { TableField } from "./table/types";
import QueryBoundary from "../../query-boundary";
import Table, { BaseData, TableActionTypes, TableProps } from "./table/table";
import { Input, Select } from "@nomos-ui/form";
import { Button } from "@nomos-ui/common";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import HeaderActionButtons from "./header-action-buttons";
import { twMerge } from "tailwind-merge";
import { useProvider } from "@nomos-ui/core";
import { extractMutation } from "@nomos-ui/core/utils";
import { useSearchParams, useUpdateSearchParams } from "@nomos-ui/core/hooks";

/**
 * Props for the ListPageTemplate component
 *
 * @template T - The type of data being listed
 */
export type ListPageTemplateProps<T extends BaseData> = {
  /** Optional title for the page */
  title?: string;
  /** Optional description for the page */
  description?: string;
  /**
   * The query hook to fetch the list data.
   * Pass the hook itself, not its result.
   *
   * @example
   * useQuery={useGetProductsQuery}
   */
  useQuery: (params: any, options?: any) => any;
  /**
   * The delete mutation hook.
   * Pass the hook itself, not its result.
   *
   * @example
   * useDeleteMutation={useDeleteProductMutation}
   */
  useDeleteMutation: () => any;
  /** Additional query parameters */
  params?: Record<string, any>;
  /** Custom loading component */
  LoadingComponent?: React.ComponentType;
  /** Custom list item render component */
  ListRenderItem?: React.ComponentType;
  /** Custom list item content render component */
  ListRenderItemContent?: React.ComponentType;
  /** Custom list component — defaults to Table */
  ListComponent?: React.ComponentType<any>;
  /** Additional props passed to the list component */
  listComponentProps?: Record<string, any>;
  /** Additional props passed to the query component */
  queryComponentProps?: Record<string, any>;
  /** Icon displayed next to each item */
  itemIcon?: React.ReactNode;
  /** Screen to navigate to for creating a new item */
  createScreen?: string;
  /** Whether to hide items */
  hideItem?: boolean;
  /** Callback when the update button is clicked */
  onClickUpdate?: (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
    item: T
  ) => void;
  /** Callback when the create button is clicked */
  onClickCreate?: (
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>
  ) => void;
  /** Config for item options */
  itemOptionsConfig?: Record<string, any>;
  /** Buttons displayed in the top-right corner */
  topButtons?: React.ReactNode[];
  /** Table field definitions */
  fields?: TableField<T>[];
  /** Callback after successful delete */
  onDeleteSuccess?: (deleteItem: T, res?: any) => void;
  /** Function to transform data for template use */
  cleanDataForTemplate?: (data: T) => Promise<Partial<T>>;
  /** Props for the table container div */
  tableContainerProps?: React.ComponentProps<"div">;
  /** Modal component for creating data */
  CreateDataModal?: React.ElementType;
  /** Modal component for updating data */
  UpdateDataModal?: React.ElementType;
} & React.ComponentProps<"div"> &
  TableActionTypes<T>;

/**
 * A generic list page template that handles data fetching, filtering, pagination,
 * and CRUD operations via modals.
 *
 * @template T - The type of data being listed
 *
 * @example
 * ```tsx
 * <ListPageTemplate<Product>
 *   useQuery={useGetProductsQuery}
 *   useDeleteMutation={useDeleteProductMutation}
 *   fields={productFields}
 * />
 * ```
 */
export default function ListPageTemplate<T extends BaseData>({
  LoadingComponent,
  params = {},
  onClickUpdate,
  ListComponent,
  listComponentProps = {},
  queryComponentProps = {},
  topButtons,
  onClickCreate,
  fields = [],
  onDeleteSuccess = () => {},
  cleanDataForTemplate = async (data) => data,
  className,
  tableContainerProps,
  CreateDataModal,
  UpdateDataModal,
  actionButtons,
  defaultActionButtons,
  useQuery,
  useDeleteMutation,
}: ListPageTemplateProps<T> & Partial<ListPageProps<T>>) {
  const { config } = useProvider();
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  const isFirstRender = useRef(false);

  useEffect(() => {
    isFirstRender.current = true;
  });

  const [queryParams, setQueryParams] = useState<
    Record<string, any> | undefined
  >({});
  const [selectedItem, setSelectedItem] = useState<BaseData | null>({});

  const deleteMutationResult = useDeleteMutation();
  const { trigger: deleteData, state: deleteMutationState } = extractMutation(
    deleteMutationResult,
    config.queryLibrary
  );

  const [selectedOptions, setSelectedOptions] = useState<any[]>(
    fields.map((field) => field.name)
  );

  const [responseData, setResponseData] = useState<{
    total: number;
    data: Record<string, any>[];
    results: number;
  }>();

  let total = 1;
  if (responseData) ({ total } = responseData);

  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  const [filterName, setFilterName] = useState(
    String(searchParams.get("filterName") || fields?.[0]?.label)
  );
  const [limit, setLimit] = useState(Number(searchParams.get("limit") || 18));
  const [searchTerm, setSearchTerm] = useState<string | number>(
    searchParams.get("search") || ""
  );
  const [searchQuery, setSearchQuery] = useState<Record<string, any>>({});

  useEffect(() => {
    updateSearchParams([{ name: "page", value: String(page) }]);
  }, [page]);

  useEffect(() => {
    updateSearchParams([{ name: "limit", value: String(limit) }]);
  }, [limit]);

  useEffect(() => {
    if (isFirstRender.current === false) setPage(1);
  }, [queryParams]);

  const filterField = useMemo(() => {
    const field = fields.find((field) => field.label === filterName)!;
    const { type, inputType } = field;
    let input;
    let getSearchValue = (value: string | number) =>
      String(value).split(" ").join(" | ");

    let formatSearchQuery = (value: string | number) => {
      setSearchQuery({
        [field.name]: {
          contains: String(value).split(" ").join(" | "),
          mode: "insensitive",
        },
      });
    };

    switch (type) {
      case "TEXT":
      case "NUMBER":
        if (type === "NUMBER")
          formatSearchQuery = (value: string | number) => {
            setSearchQuery({ [field.name]: Number(value) });
          };
      case "DATE":
        if (type === "DATE")
          formatSearchQuery = (value: string | number) => {
            const startDate = new Date(value);
            startDate.setDate(startDate.getDate() - 1);

            const endDate = new Date(value);
            endDate.setDate(endDate.getDate() + 1);

            setSearchQuery({
              [field.name]: {
                lte: endDate.toISOString(),
                gte: startDate.toISOString(),
              },
            });
          };
        input = (
          <Input
            className="block w-full flex-1 max-w-80"
            inputClassName="h-8 w-full w-96"
            type={inputType}
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value!);
              if (!value) {
                updateSearchParams([{ name: "search", value: "" }]);
                setPage(1);
              }
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                updateSearchParams([
                  {
                    name: "search",
                    value: getSearchValue(e.currentTarget.value),
                  },
                ]);
                formatSearchQuery(e.currentTarget.value);
                setPage(1);
              }
            }}
            placeholder={`Pesquisar por ${filterName}`}
          />
        );
        break;
    }

    return { input, field };
  }, [filterName, searchTerm]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [idToUpdate, setIdToUpdate] = useState("");

  function modalOnClickCreate(
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>
  ) {
    if (CreateDataModal) {
      e.preventDefault();
      setModalIsOpen(true);
    }
    onClickCreate?.(e);
  }

  function modalOnUpdate(
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
    data: any
  ) {
    if (UpdateDataModal) {
      e.preventDefault();
      setUpdateModalIsOpen(true);
      setIdToUpdate(data.id!);
    }
    onClickUpdate?.(e, data);
  }

  return (
    <>
      <div className={twMerge("overflow-auto", className)}>
        <div className="flex small-sm:items-center items-end justify-between gap-2 small-sm:gap-4 small-sm:mb-0 mb-2">
          <div className="flex gap-2 items-center small-sm:mb-2">
            <Select
              placeholder="Filtrar Por"
              triggerProps={{ className: "w-[150px]" }}
              value={filterName || "max-h-8"}
              onChange={(value) => setFilterName(value as string)}
              options={fields.map(({ label }) => ({
                value: label?.toString() || "",
                label: label?.toString() || "",
              }))}
            />
            {filterField.input}
          </div>
          <div className="flex items-start gap-2 justify-center">
            <HeaderActionButtons
              topButtons={topButtons}
              {...(CreateDataModal && { onClickCreate: modalOnClickCreate })}
            />
          </div>
        </div>

        <div
          {...tableContainerProps}
          className={twMerge("", tableContainerProps?.className)}
        >
          <QueryBoundary<T[], TableProps<T> & Partial<ListPageTemplateProps<T>>>
            useQuery={useQuery}
            {...queryComponentProps}
            successComponentProps={{
              ...listComponentProps,
              ...(CreateDataModal && { onClickCreate: modalOnClickCreate }),
              ...(UpdateDataModal && { onClickUpdate: modalOnUpdate }),
              selectedItem,
              setSelectedItem,
              fields,
              deleteMutationResult: deleteMutationState,
              selectedOptions,
              setResponseData,
              onDeleteSuccess,
              cleanDataForTemplate,
              deleteData,
              defaultActionButtons,
              actionButtons,
            }}
            SuccessComponent={ListComponent || Table<T & BaseData>}
            notFoundMessage="Não foi encontrando nenhuma lista!"
            noResourcesMessage="Não foi encontrando nenhum dado"
            errorMessage="Ocorreu um erro carregando a lista!"
            showReloadAgainButton={false}
            LoadingComponent={LoadingComponent || TableShimmer}
            params={{
              limit,
              page,
              ...(searchParams.get("search") && searchQuery),
              ...params,
              ...(Object.keys(queryParams || {}).length > 0 && {
                ...queryParams,
                filterMode: "AND",
              }),
            }}
          />
        </div>

        <div className="pt-1 flex w-full justify-end mb-1 mt-auto">
          {responseData && (
            <div className="flex items-center small:justify-end justify-between gap-2 mr-4">
              <p className="small-sm:block hidden">Linhas por página</p>
              <Select
                value={String(limit)}
                onChange={setLimit as any}
                options={[
                  { label: "18", value: "18" },
                  ...((total >= 36 && [{ label: "36", value: "36" }]) || []),
                  ...((total >= 72 && [{ label: "72", value: "72" }]) || []),
                  ...((total >= 144 && [{ label: "144", value: "144" }]) || []),
                  { label: "Todos", value: String(Math.max(total, 1000)) },
                ]}
                className="mr-4 w-[72px]"
              />
              <div>
                {limit * page - limit + 1} -{" "}
                {limit * page >= total ? total : limit * page} de {total}
              </div>
              <div className="flex gap-1 items-center -z-10">
                <Button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-0 aspect-square"
                  size="sm"
                >
                  <ChevronLeftIcon />
                </Button>
                <div className="aspect-square w-4 flex items-center justify-center">
                  {page}
                </div>
                <Button
                  size="sm"
                  disabled={limit * page >= total}
                  onClick={() => setPage(page + 1)}
                  className="px-0 aspect-square"
                >
                  <ChevronRightIcon />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {CreateDataModal && (
        <CreateDataModal isOpen={modalIsOpen} setIsOpen={setModalIsOpen} />
      )}
      {UpdateDataModal && (
        <UpdateDataModal
          id={idToUpdate}
          isOpen={updateModalIsOpen}
          setIsOpen={setUpdateModalIsOpen}
        />
      )}
    </>
  );
}

const TableShimmer = () => {
  return (
    <div className="w-full animate-pulse mt-2 border rounded-md overflow-hidden">
      <div className="flex items-center border-b border-gray-200 py-3 border-t px-3">
        <div className="w-10 h-5 flex-shrink-0">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded flex-shrink-0 mr-4"></div>
        <div className="h-5 bg-gray-200 rounded flex-shrink-0 mr-4 w-[440px]"></div>
        <div className="w-28 h-5 bg-gray-200 rounded flex-shrink-0 mr-4"></div>
        <div className="w-28 h-5 bg-gray-200 rounded flex-shrink-0 mr-4"></div>
        <div className="w-28 h-5 bg-gray-200 rounded flex-shrink-0 mr-4"></div>
        <div className="w-28 h-5 bg-gray-200 rounded flex-shrink-0 mr-4"></div>
        <div className="w-28 h-5 bg-gray-200 rounded flex-shrink-0 mr-4"></div>
        <div className="w-28 h-5 bg-gray-200 rounded flex-shrink-0 mr-4"></div>
        <div className="w-28 h-5 bg-gray-200 rounded flex-shrink-0 mr-4"></div>
        <div className="w-32 h-5 bg-gray-200 rounded flex-shrink-0"></div>
      </div>
      {[...Array(10)].map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex items-center py-3 border-b border-gray-200 px-3"
        >
          <div className="w-10 h-5 flex-shrink-0 mr-4">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded flex-shrink-0 mr-4 w-[440px]"></div>
          <div className="w-28 h-5 bg-gray-200 rounded flex-shrink-0 mr-4"></div>
          <div className="w-28 h-5 bg-gray-200 rounded flex-shrink-0 mr-4"></div>
          <div className="w-28 h-5 bg-gray-200 rounded flex-shrink-0 mr-4"></div>
          <div className="w-28 h-5 bg-gray-200 rounded flex-shrink-0 mr-4"></div>
          <div className="w-28 h-5 bg-gray-200 rounded flex-shrink-0 mr-4"></div>
          <div className="w-28 h-5 bg-gray-200 rounded flex-shrink-0 mr-4"></div>
          <div className="w-28 h-5 bg-gray-200 rounded flex-shrink-0 mr-4"></div>
          <div className="w-32 h-5 bg-gray-200 rounded flex-shrink-0"></div>
        </div>
      ))}
    </div>
  );
};
