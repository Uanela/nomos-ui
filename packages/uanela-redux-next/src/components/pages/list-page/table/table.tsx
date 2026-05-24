import { usePathname, useSearchParams } from "@nomos-ui/core/hooks";
import { Popover } from "@nomos-ui/common";
import {
  EllipsisVerticalIcon,
  LoaderCircleIcon,
  PencilIcon,
  SquareMousePointerIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import uuid4 from "uuid4";
import TableData from "./table-data";
import ActionButton, { ActionButtonProps } from "./action-button";
import ConfirmDeleteModal from "./confirm-delete.modal";
import { ListPageTemplateProps } from "../template";
import { SuccessComponentProps } from "../../../query-boundary";
import { twMerge } from "tailwind-merge";

export type TableActionOption<T extends BaseData> = Omit<
  ActionButtonProps<T>,
  "item"
>;

export type TableDefaultActionOption<T extends BaseData> =
  TableActionOption<T> & { hidden?: boolean };

export type TableActionTypes<T extends BaseData> = {
  /** Adds more item actions */
  actionButtons?:
    | TableActionOption<T>[]
    | ((item: T) => TableActionOption<T>[]);
  defaultActionButtons?: {
    edit?: TableDefaultActionOption<T>;
    delete?: TableDefaultActionOption<T>;
    cancel?: TableDefaultActionOption<T>;
  };
};

export type TableProps<T extends BaseData> = {
  name: string;
  handleDelete: () => void;
  selectedItem: BaseData | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<BaseData | null>>;
  isDeleting: boolean;
  deleteMutationResult: any;
  selectedOptions: any[];
  setResponseData: React.Dispatch<
    React.SetStateAction<
      | {
          total: number;
          data: Record<string, any>[];
          results: number;
        }
      | undefined
    >
  >;
  setTriggerReloadAgain?: React.Dispatch<
    React.SetStateAction<(() => void) | undefined>
  >;
  deleteData: (data: any) => Promise<any>;
} & Partial<ListPageTemplateProps<T>> &
  TableActionTypes<T>;

export type BaseData = {
  id?: string;
  [x: string]: any;
};

export default function Table<T extends BaseData>({
  data: responseData,
  onClickUpdate,
  fields,
  selectedItem,
  setSelectedItem,
  deleteMutationResult,
  selectedOptions,
  setResponseData,
  onDeleteSuccess,
  deleteData,
  actionButtons,
  defaultActionButtons,
}: SuccessComponentProps<T[], TableProps<T>>) {
  const pathname = usePathname();
  const { data, total } = responseData;

  useEffect(() => {
    setResponseData(
      responseData as {
        total: number;
        data: Record<string, any>[];
        results: number;
      }
    );
  }, [responseData]);

  const [selectedItemToOpen, setSelectedItemToOpen] = useState<any>();
  const [hoveredRow, setHoveredRow] = useState<any>();
  const optionsMenuTrigger = useRef<any>(null);

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 30);

  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

  function closeActionHoverCard(item?: T) {
    selectedItemToOpen?.id === item?.id || hoveredRow?.id === item?.id
      ? setSelectedItemToOpen(null)
      : setSelectedItemToOpen(item);
  }

  const visibleFields = useMemo(
    () => (fields || []).filter((field) => field.visible !== false),
    [fields]
  );

  return (
    <>
      <ConfirmDeleteModal
        isOpen={confirmDeleteModalOpen}
        setIsOpen={setConfirmDeleteModalOpen}
        onChoose={(choice) => {
          if (choice)
            deleteData(selectedItemToOpen?.id).then((res: any) => {
              closeActionHoverCard(selectedItemToOpen);
              onDeleteSuccess?.(selectedItemToOpen as T, res);
            });
        }}
      />
      <div className="relative border rounded-lg overflow-hidden">
        {/* Outer wrapper enables horizontal scroll for all non-sticky columns */}
        <div className="overflow-x-auto">
          {/* Header row */}
          <div className="bg-zinc-50 text-zinc-500 flex items-center min-w-fit w-full relative">
            {/* Sticky left: checkbox + row number */}
            <div className="sticky left-0  bg-zinc-50 flex items-center pl-4">
              <div className="flex items-center justify-center">
                <input
                  disabled
                  type="checkbox"
                  name=""
                  id=""
                  className="size-4 cursor-pointer"
                />
              </div>
              <div className="text-left w-9 pl-3.5 font-semibold p-2 opacity-0">
                N°
              </div>
            </div>

            {/* All field headers */}
            {visibleFields?.map((field, i: number) => {
              if (field.visible === false) return null;

              const { transform, ...fieldPropsWithoutTransform } =
                field?.props || {};
              const { transform: ts, ...headPropsWithoutTransform } =
                field?.headProps || {};

              // First visible field: sticky
              if (i === 0) {
                return (
                  <div
                    key={uuid4()}
                    {...{
                      ...fieldPropsWithoutTransform,
                      ...headPropsWithoutTransform,
                    }}
                    onClick={(e) => field.headProps?.onClick?.(data, field, e)}
                    onMouseEnter={(e) =>
                      field.headProps?.onMouseEnter?.(data, field, e)
                    }
                    onMouseLeave={(e) =>
                      field.headProps?.onMouseLeave?.(data, field, e)
                    }
                    className={twMerge(
                      " bg-zinc-50 truncate text-left font-semibold flex items-center px-1 gap-1 w-96",
                      field.props?.className,
                      field.headProps?.className
                    )}
                  >
                    {field.headProps?.transform
                      ? field.headProps?.transform(data, field)
                      : `${field.label} (${total})`}
                  </div>
                );
              }

              // Remaining fields: only if included in selectedOptions
              if (!selectedOptions?.includes(field.name)) return null;

              return (
                <div
                  key={field.name}
                  {...{
                    ...fieldPropsWithoutTransform,
                    ...headPropsWithoutTransform,
                  }}
                  onClick={(e) => field.headProps?.onClick?.(data, field, e)}
                  onMouseEnter={(e) =>
                    field.headProps?.onMouseEnter?.(data, field, e)
                  }
                  onMouseLeave={(e) =>
                    field.headProps?.onMouseLeave?.(data, field, e)
                  }
                  className={twMerge(
                    "truncate text-left font-semibold flex items-center p-2 w-40 flex-shrink-0",
                    i === visibleFields.length - 1 ? "flex-1" : "",
                    field.props?.className,
                    field.headProps?.className
                  )}
                >
                  {field.headProps?.transform
                    ? field.headProps?.transform(data, field)
                    : field.label}
                </div>
              );
            })}

            {/* Sticky right: actions header */}
            <div className="sticky right-0  bg-zinc-50 rounded-tr-lg flex items-center">
              <div className="truncate text-left font-semibold flex items-center p-2 py-[9.5px] px-4">
                <SquareMousePointerIcon size={18} />
              </div>
            </div>
          </div>

          {/* Data rows */}
          {data.map((item, i) => (
            <div
              key={item.id || uuid4()}
              data-selected={
                selectedItemToOpen?.id === item.id || hoveredRow?.id === item.id
              }
              data-is-last={i === data.length - 1}
              onMouseEnter={() => setHoveredRow(item)}
              onMouseLeave={() => setHoveredRow(null)}
              className="text-zinc-700 font-base flex items-center border-t min-w-fit hover:bg-sky-100 bg-white data-[selected=true]:bg-sky-100 data-[is-last=true]:rounded-b-md"
            >
              {/* Sticky left: checkbox + row number */}
              <div className="sticky left-0  bg-inherit flex items-center pl-4">
                <div className="flex items-center justify-center py-2">
                  {deleteMutationResult.isLoading &&
                  deleteMutationResult.originalArgs === item.id ? (
                    <div>
                      <LoaderCircleIcon className="animate-spin" />
                    </div>
                  ) : (
                    <input
                      type="checkbox"
                      disabled
                      value={selectedItem?.id}
                      onChange={(e) =>
                        setSelectedItem(e.target.checked ? item : {})
                      }
                      checked={selectedItem?.id === item.id}
                      name="item-to-take-action"
                      className="size-4 cursor-pointer"
                    />
                  )}
                </div>
                <div className="text-center w-9 p-2">
                  {i + 1 + (page * limit - limit)}
                </div>
              </div>

              {/* All field data cells */}
              {visibleFields?.map((field, j: number) => {
                if (field.visible === false) return null;

                if (j === 0) {
                  return (
                    <TableData
                      index={j}
                      key={item.id}
                      field={field}
                      selectedOptions={selectedOptions}
                      availableFields={fields!}
                      item={item}
                      className={twMerge(
                        " bg-inherit w-96 p-2",
                        field.props?.className,
                        field.dataProps?.className
                      )}
                    />
                  );
                }

                return (
                  <TableData
                    index={j}
                    key={field.name}
                    field={field}
                    availableFields={fields!}
                    item={item}
                    selectedOptions={selectedOptions}
                    className={twMerge(
                      j === visibleFields.length - 1 ? "flex-1" : "",
                      field.props?.className,
                      field?.dataProps?.className
                    )}
                  />
                );
              })}

              {/* Sticky right: actions */}
              <div className="sticky right-0  bg-inherit flex items-center px-2 data-[is-last=true]:rounded-br-md">
                <Popover
                  open={selectedItemToOpen?.id === item.id}
                  onOpenChange={(val: boolean) =>
                    !val && setSelectedItemToOpen(null)
                  }
                  trigger={
                    <button
                      id={item.id}
                      data-selected={
                        selectedItemToOpen?.id === item.id ||
                        hoveredRow?.id === item.id
                      }
                      onClick={() =>
                        selectedItemToOpen?.id === item.id
                          ? setSelectedItemToOpen(null)
                          : setSelectedItemToOpen(item)
                      }
                      className="px-2 py-[9px] text-zinc-700 active:opacity-50 h-auto rounded-full data-[selected=true]:bg-zinc-10 option-menu-trigger"
                    >
                      <EllipsisVerticalIcon size={18} />
                    </button>
                  }
                  contentProps={{
                    side: "left",
                    align: "start",
                    sideOffset: -12,
                    alignOffset: 12,
                    className: "px-0 w-fit",
                  }}
                >
                  {defaultActionButtons?.edit?.hidden !== false && (
                    <ActionButton
                      Icon={PencilIcon}
                      {...defaultActionButtons?.edit}
                      href={
                        !defaultActionButtons?.edit?.onClick && !onClickUpdate
                          ? `${pathname}/${item?.id}/update`
                          : undefined
                      }
                      onClick={(actionItem, e: any) => {
                        closeActionHoverCard(actionItem);
                        if (defaultActionButtons?.edit?.onClick) {
                          defaultActionButtons.edit.onClick(actionItem as T, e);
                        } else if (onClickUpdate) {
                          onClickUpdate(e, actionItem as T);
                        }
                      }}
                      item={item}
                    >
                      {defaultActionButtons?.edit?.children ?? "Editar"}
                    </ActionButton>
                  )}

                  {(Array.isArray(actionButtons)
                    ? actionButtons
                    : actionButtons?.(item)
                  )?.map((btn) => (
                    <ActionButton
                      item={item}
                      key={uuid4()}
                      {...btn}
                      onClick={(actionItem, e: any) => {
                        closeActionHoverCard(actionItem);
                        btn?.onClick?.(actionItem, e);
                      }}
                    >
                      {btn.children}
                    </ActionButton>
                  ))}

                  {defaultActionButtons?.delete?.hidden !== false && (
                    <ActionButton
                      Icon={Trash2Icon}
                      {...defaultActionButtons?.delete}
                      onClick={(actionItem, e: any) => {
                        if (defaultActionButtons?.delete?.onClick) {
                          defaultActionButtons.delete.onClick(
                            actionItem as T,
                            e
                          );
                        } else {
                          setConfirmDeleteModalOpen(true);
                        }
                      }}
                      item={item}
                    >
                      {defaultActionButtons?.delete?.children ?? "Deletar"}
                    </ActionButton>
                  )}

                  {defaultActionButtons?.cancel?.hidden !== false && (
                    <ActionButton
                      Icon={XIcon}
                      {...defaultActionButtons?.cancel}
                      onClick={(actionItem, e: any) => {
                        setSelectedItemToOpen(null);
                        defaultActionButtons?.cancel?.onClick?.(
                          actionItem as T,
                          e
                        );
                      }}
                      item={item}
                    >
                      {defaultActionButtons?.cancel?.children ?? "Cancelar"}
                    </ActionButton>
                  )}
                </Popover>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
