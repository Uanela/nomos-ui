import { type ReactElement } from "react";
import { BaseData } from "./table";
import { LucideProps } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Link } from "@nomos-ui/core";

export type ActionButtonProps<T extends BaseData> = {
  item: T;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  children: React.ReactNode;
  onClick?: (item?: T, e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  href?: string;
} & Omit<React.ComponentProps<"button">, "onClick">;

export default function ActionButton<T extends BaseData>({
  item,
  Icon,
  children,
  onClick,
  className,
  href,
  ...props
}: ActionButtonProps<T>): ReactElement {
  const content = (
    <>
      <Icon size={16} />
      <span>{children}</span>
    </>
  );

  const commonClassName = twMerge(
    "bg-transparent hover:bg-zinc-100/80 text-zinc-700 justify-start flex items-center p-1.5 px-4 gap-4 w-[200px] disabled:bg-zinc-100",
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        className={commonClassName}
        {...(onClick && {
          onClick: (e: any) => {
            onClick(item as T, e);
          },
        })}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      {...props}
      className={commonClassName}
      {...(onClick && {
        onClick: (e) => {
          e.preventDefault();
          onClick(item as T, e);
        },
      })}
    >
      {content}
    </button>
  );
}
