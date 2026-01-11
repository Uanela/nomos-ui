"use client";

import React, { useState } from "react";
import ListPageTemplate, { ListPageTemplateProps } from "./template";
import { TableField } from "./table/types";
import PageTitleAndDescription from "../components/page-title-and-description";

export type ListPageProps<T> = {
  /** Name of the tag the queried in camelCase and singular. */
  name: string;
  title: string;
  description: string;
  CreateDataModal?: React.ElementType;
  UpdateDataModal?: React.ElementType;
  fields: TableField<T>[];
  params?: Record<string, any>;
};

export default function ListPage<T extends { id: string }>({
  name,
  title,
  description,
  CreateDataModal,
  UpdateDataModal,
  fields,
  onDeleteSuccess = (item: any) => {},
  cleanDataForTemplate,
  params = {},
}: ListPageProps<T> & ListPageTemplateProps<T>) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [idToUpdate, setIdToUpdate] = useState("");

  return (
    <>
      <div className="flex flex-col gap-4">
        <PageTitleAndDescription title={title} description={description} />
        <ListPageTemplate
          name={name}
          description={description}
          fields={fields}
          onDeleteSuccess={onDeleteSuccess}
          cleanDataForTemplate={cleanDataForTemplate}
          params={params}
          {...(UpdateDataModal && {
            onClickUpdate: (
              e:
                | React.MouseEvent<HTMLButtonElement>
                | React.MouseEvent<HTMLAnchorElement>,
              data: Partial<T>
            ) => {
              e.preventDefault();
              setUpdateModalIsOpen(true);
              setIdToUpdate(data.id!);
            },
          })}
          {...(CreateDataModal && {
            onClickCreate: (
              e:
                | React.MouseEvent<HTMLButtonElement>
                | React.MouseEvent<HTMLAnchorElement>
            ) => {
              e.preventDefault();
              setModalIsOpen(true);
            },
          })}
        />
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
      </div>
    </>
  );
}
