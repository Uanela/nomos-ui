import { PlusIcon } from "lucide-react";
import { usePathname, useNavigate } from "@nomos-ui/core/hooks";
import React from "react";
import { Button } from "@nomos-ui/common";
import { ListPageProps } from "./list-page";
import { ListPageTemplateProps } from "./template";
import { BaseData } from "./table/table";

/**
 * Props for the HeaderActionButtons component
 *
 * @template T - The type of data being listed
 */
type HeaderActionButtonsProps<T extends BaseData> = Partial<
  ListPageTemplateProps<T>
>;

/**
 * Renders the create button and optional top buttons in the list page header.
 * Navigates to the create page by default, or calls the provided onClickCreate callback.
 *
 * @template T - The type of data being listed
 */
export default function HeaderActionButtons<T extends BaseData>({
  topButtons,
  onClickCreate,
}: HeaderActionButtonsProps<T> & Partial<ListPageProps<T>>) {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between small-sm:mb-2 overflow-auto">
      <div className="flex items-center gap-2">
        <Button
          onClick={!onClickCreate ? undefined : onClickCreate}
          href={!onClickCreate ? `${pathname}/create` : undefined}
        >
          <PlusIcon size={16} />
          <span className="hidden sm:inline">Adicionar</span>
        </Button>
        {topButtons &&
          topButtons.map((button: React.ReactNode, i: number) => (
            <div key={i}>{button}</div>
          ))}
      </div>
    </div>
  );
}
