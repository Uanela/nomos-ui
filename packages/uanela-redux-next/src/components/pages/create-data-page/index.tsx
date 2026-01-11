import React from "react";
import { z } from "zod";
import { usePathname } from "next/navigation";
import CreateDataWrapper from "../../data-manipulation/create-data-wrapper";
import PageTitleAndDescription from "../components/page-title-and-description";

type CreateDataPageProps<DataType> = {
  id?: string;
  name: string;
  Form: (props: any) => React.JSX.Element;
  createMutation?: string;
  title: string;
  description: string;
  keepIsLoading?: boolean;
  requiredData?: Record<string, any>;
  showAlertAfterSuccessCreate?: boolean;
  doAfterSuccessCreate?: (x: any) => Promise<any> | void;
  cleanDataBeforeCreate?: (data: any) => void;
  className?: string;
  schema: z.ZodObject<any>
  topButtons?: any;
  formProps: {
    buttonLabel: string;
    className?: string;
  };
};

export default function CreateDataPage<DataType>({
  name,
  title,
  description,
  keepIsLoading,
  requiredData,
  schema,
  formProps,
  topButtons,
  ...props
}: CreateDataPageProps<DataType>) {
  const pathname = usePathname();

  const listHref = pathname.split("/");
  listHref.pop();

  return (
    <div className="grid md:gap-4 gap-2">
      <div className="flex justify-between items-center">
        <PageTitleAndDescription title={title} description={description} />

        {/* <div className="md:block hidden"> */}
        {/*   {!topButtons ? ( */}
        {/*     <Button href={`${listHref.join("/")}`}> */}
        {/*       <ListIcon size={18} /> */}
        {/*       <span>Listar {plural(kebabCase(name))}</span> */}
        {/*     </Button> */}
        {/*   ) : ( */}
        {/*     topButtons.map((button: React.ReactNode, i: number) => ( */}
        {/*       <div key={i}>{button}</div> */}
        {/*     )) */}
        {/*   )} */}
        {/* </div> */}
      </div>
      <div className="bg-background rounded-lg lg:h-[calc(100vh-154px)] h-[calc(100vh-140px)] md:p-4 p-2 border-input border ">
        <div className="main-container-content">
          <CreateDataWrapper
            {...props}
            name={name}
            formProps={{
              ...formProps,
              keepIsLoading: keepIsLoading,
              requiredData: requiredData,
              schema: schema,
            }}
          />
        </div>
      </div>
    </div>
  );
}
