import React from "react";
import { z } from "zod";
import { useParams, usePathname } from "next/navigation";
import UpdateDataWrapper from "../../data-manipulation/update-data-wrapper";
import PageTitleAndDescription from "../components/page-title-and-description";

type UpdateDataComponentProps = {
  id?: string | number;
  name: string;
  Form: (props: any) => React.JSX.Element;
  updateMutation?: string;
  title: string;
  description: string;
  keepIsLoading?: boolean;
  requiredData?: Record<string, any>;
  showAlertAfterSuccessUpdate?: boolean;
  doAfterSuccessUpdate?: (x: any) => Promise<any> | any;
  cleanDataBeforeUpdate?: (data: any) => any;
  className?: string;
  schema: z.ZodObject<any>;
  topButtons?: any;
  formProps: {
    buttonLabel: string;
    className?: string;
  };
};

export default function UpdateDataPage({
  name,
  title,
  description,
  keepIsLoading,
  requiredData,
  schema,
  formProps,
  topButtons,
  ...props
}: UpdateDataComponentProps) {
  const { id } = useParams();
  const pathname = usePathname();
  const listHref = pathname.split("/");
  listHref.pop();
  listHref.pop();

  return (
    <div className="grid md:gap-4 gap-2">
      <div className="flex justify-between items-center">
        <PageTitleAndDescription title={title} description={description} />
        {/* <div> */}
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
      <div className="bg-background rounded-lg lg:h-[calc(100vh-154px)] h-[calc(100vh-140px)] md:p-4 p-2 border-input border">
        <div className="main-container-content">
          <UpdateDataWrapper
            {...props}
            id={id as string}
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
