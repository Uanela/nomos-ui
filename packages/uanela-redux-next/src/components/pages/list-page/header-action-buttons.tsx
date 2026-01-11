"use client";

import { PlusIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "@nomos-ui/common";
import { ListPageProps } from "./list-page";
import { ListPageTemplateProps } from "./template";

type HeaderActionButtonsProps<T> = Partial<ListPageTemplateProps<T>>;

export default function HeaderActionButtons<T>({
  topButtons,
  onClickCreate,
}: HeaderActionButtonsProps<T> & Partial<ListPageProps<T>>) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className=" flex items-center justify-between small-sm:mb-2 overflow-auto ">
      <div className="flex items-center gap-2">
        <Button
          onClick={(e) => {
            if (!onClickCreate) router.push(`${pathname}/create`);
            else onClickCreate(e);
          }}
        >
          <PlusIcon size={16} />
          <span className="hidden sm:inline">Adicionar </span>
        </Button>

        {topButtons &&
          topButtons.map((button: React.ReactNode, i: number) => (
            <div key={i}>{button}</div>
          ))}
      </div>
    </div>
  );
}
