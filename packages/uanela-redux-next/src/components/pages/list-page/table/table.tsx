import {
  TypedMutationTrigger,
  TypedUseMutationResult,
} from "@reduxjs/toolkit/query/react";
import { usePathname, useSearchParams } from "next/navigation";
import { HoverCard } from "@nomos-ui/common";
import {
  EllipsisVerticalIcon,
  LoaderCircleIcon,
  PencilIcon,
  SquareMousePointerIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import uuid4 from "uuid4";
import { useRouter } from "next/navigation";
import TableData from "./table-data";
import ActionButton from "./action-button";
import ConfirmDeleteModal from "./confirm-delete.modal";
import { ListPageTemplateProps } from "../template";
import { SuccessComponentProps } from "../../../query-boundary";
import { twMerge } from "tailwind-merge";

export type TableProps<T> = {
  name: string;
  handleDelete: () => void;
  selectedItem: BaseData | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<BaseData | null>>;
  isDeleting: boolean;
  deleteMutationResult: TypedUseMutationResult<T, any, any>;
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
  deleteData: TypedMutationTrigger<{ id: string }, any, any>;
} & Partial<ListPageTemplateProps<T>>;

export type BaseData = {
  id?: string;
  [x: string]: any;
};

export default function Table<T extends BaseData>({
  data: responseData,
  onClickUpdate,
  onClickCreate,
  fields,
  selectedItem,
  setSelectedItem,
  deleteMutationResult,
  selectedOptions,
  name,
  setTriggerReloadAgain,
  setResponseData,
  triggerRefetch,
  onDeleteSuccess,
  cleanDataForTemplate,
  deleteData,
}: SuccessComponentProps<T[], TableProps<T>>) {
  const pathname = usePathname();
  const { data, total } = responseData;
  const router = useRouter();

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

  return (
    <>
      <ConfirmDeleteModal
        isOpen={confirmDeleteModalOpen}
        setIsOpen={setConfirmDeleteModalOpen}
        onChoose={(choice) => {
          if (choice)
            deleteData(selectedItemToOpen)
              .unwrap()
              .then((res) => onDeleteSuccess?.(selectedItemToOpen as T, res));
        }}
      />
      <div className="flex relative border rounded-lg overflow-hidden">
        <div className="">
          <div className="bg-zinc-50 text-zinc-500 rounded-b-none overflow-hidden flex items-center px-4">
            <div className="flex items-center justify-center">
              <input
                disabled
                type="checkbox"
                name=""
                id=""
                className="size-4  cursor-pointer"
              />
            </div>
            <div className={`text-left w-9 pl-3.5 font-semibold p-2 opacity-0`}>
              N°
            </div>
            {fields?.map((field, i: number) => {
              if (i === 0)
                return (
                  <div
                    key={field.name}
                    {...{ ...field.props, ...field.headProps }}
                    onClick={(e) => field.headProps?.onClick?.(data, field, e)}
                    onMouseEnter={(e) =>
                      field.headProps?.onMouseEnter?.(data, field, e)
                    }
                    onMouseLeave={(e) =>
                      field.headProps?.onMouseLeave?.(data, field, e)
                    }
                    className={twMerge(
                      "truncate text-left font-semibold flex items-center px-1 gird gap-1",
                      field.props?.className,
                      field.headProps?.className
                    )}
                  >
                    {field.headProps?.transform
                      ? field.headProps?.transform(data, field)
                      : `${field.label} (${total})`}
                  </div>
                );
            })}
          </div>
          {data.map((item, i) => (
            <div
              key={i}
              data-selected={
                selectedItemToOpen?.id === item.id || hoveredRow?.id === item.id
              }
              onMouseEnter={() => setHoveredRow(item)}
              onMouseLeave={() => setHoveredRow(null)}
              data-is-last={i === data.length - 1}
              className=" text-zinc-700 font-base  overflow-hidden flex items-center gap- border-t  pl-4 data-[is-last=true]:rounded-bl-md  hover:bg-sky-100  bg-white  data-[selected=true]:bg-sky-100"
            >
              <>
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
                <div className="text-center w-9 p-2 ">
                  {i + 1 + (page * limit - limit)}
                </div>
              </>
              {fields?.map((field, j: number) => {
                if (j === 0)
                  return (
                    <TableData
                      index={j}
                      key={j}
                      field={field}
                      selectedOptions={selectedOptions}
                      availableFields={fields}
                      item={item}
                      className="w-96 p-2"
                    />
                  );
              })}
            </div>
          ))}
        </div>
        <div className="overflow-x-auto flex-1 min-w-[600px] mr-[0px]">
          <div className="bg-zinc-50 text-zinc-500 rounded-b-none overflow-hidden flex  min-w-fit ">
            {fields?.map(
              (field, i) =>
                i > 0 &&
                selectedOptions?.includes(field.name) && (
                  <div
                    key={field.name}
                    {...{ ...field.props, ...field.headProps }}
                    onClick={(e) => field.headProps?.onClick?.(data, field, e)}
                    onMouseEnter={(e) =>
                      field.headProps?.onMouseEnter?.(data, field, e)
                    }
                    onMouseLeave={(e) =>
                      field.headProps?.onMouseLeave?.(data, field, e)
                    }
                    className={twMerge(
                      "truncate text-left font-semibold flex items-center p-2  w-40 flex-shrink-0",
                      field.props?.className,
                      field.headProps?.className
                    )}
                  >
                    {field.headProps?.transform
                      ? field.headProps?.transform(data, field)
                      : field.label}
                  </div>
                )
            )}
          </div>
          {data.map((item, i) => (
            <div
              key={i}
              data-selected={
                selectedItemToOpen?.id === item.id || hoveredRow?.id === item.id
              }
              onMouseEnter={() => setHoveredRow(item)}
              onMouseLeave={() => setHoveredRow(null)}
              className={` text-zinc-700  overflow-hidden flex items-center gap- ${
                selectedOptions?.length > 0 && " border-t"
              } border-l-0 data-[is-last=true]:rounded-br-md min-w-fit  hover:bg-sky-100  even:bg-white data-[selected=true]:bg-sky-100`}
            >
              {fields?.map(
                (field, i: number) =>
                  i > 0 && (
                    <TableData
                      index={i}
                      key={field.name}
                      field={field}
                      availableFields={fields}
                      item={item}
                      selectedOptions={selectedOptions}
                      className={twMerge(
                        field.props?.className,
                        field?.dataProps?.className
                      )}
                    />
                  )
              )}
            </div>
          ))}
        </div>

        <div className="sticky right-[0px] bg-background">
          <div className="bg-zinc-50 text-zinc-500    rounded-tr-lg rounded-b-none overflow-hidden flex items-center gap-   ">
            <div className="truncate text-left font-semibold flex items-center p-2 py-[9px] px-4">
              <SquareMousePointerIcon size={18} />
            </div>
          </div>
          {data.map((item, i) => (
            <div
              data-selected={
                selectedItemToOpen?.id === item.id || hoveredRow?.id === item.id
              }
              onMouseEnter={() => setHoveredRow(item)}
              onMouseLeave={() => setHoveredRow(null)}
              key={uuid4()}
              data-is-last={i === data.length - 1}
              className=" text-zinc-700 font-  overflow-hidden flex px-2 items-center gap- border-t data-[is-last=true]:rounded-br-md hover:bg-sky-100 py-0  data-[selected=true]:bg-sky-100"
            >
              {fields?.map((_, j: number) => {
                if (j === 0)
                  return (
                    <div key={uuid4()} className="">
                      <button
                        id={item.id}
                        ref={optionsMenuTrigger}
                        data-selected={
                          selectedItemToOpen?.id === item.id ||
                          hoveredRow?.id === item.id
                        }
                        onClick={() => {
                          selectedItemToOpen?.id === item.id
                            ? setSelectedItemToOpen(null)
                            : setSelectedItemToOpen(item);
                        }}
                        className="px-2 py-[9px] text-zinc-700 active:opacity-50 h-auto rounded-full data-[selected=true]:bg-zinc-10 option-menu-trigger"
                      >
                        <EllipsisVerticalIcon size={18} />
                      </button>
                      <HoverCard
                        open={selectedItemToOpen?.id === item.id}
                        onOpenChange={(val) => !val && setSelectedItem(null)}
                        showArrow={false}
                        contentProps={{
                          className: "mr-8 -mt-2 px-0 rounded-lg w-fit",
                        }}
                      >
                        <ActionButton
                          onClick={(item, e: any) => {
                            selectedItemToOpen?.id === item?.id ||
                            hoveredRow?.id === item?.id
                              ? setSelectedItemToOpen(null)
                              : setSelectedItemToOpen(item);

                            if (onClickUpdate) onClickUpdate(e, item as T);
                            else router.push(`${pathname}/${item?.id}/update`);
                          }}
                          Icon={PencilIcon}
                          item={item}
                        >
                          Editar
                        </ActionButton>
                        <ActionButton
                          onClick={(item) => {
                            selectedItemToOpen?.id === item?.id ||
                            hoveredRow?.id === item?.id
                              ? setSelectedItemToOpen(item)
                              : setSelectedItemToOpen(null);
                            console.log("theitem", item, selectedItemToOpen);
                            setConfirmDeleteModalOpen(true);
                          }}
                          Icon={Trash2Icon}
                          item={item}
                        >
                          Deletar
                        </ActionButton>
                        <ActionButton
                          onClick={() => {
                            setSelectedItemToOpen(null);
                          }}
                          Icon={XIcon}
                          item={item}
                        >
                          Cancelar
                        </ActionButton>
                      </HoverCard>
                    </div>
                  );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
