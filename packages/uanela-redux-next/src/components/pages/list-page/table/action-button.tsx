import { type ReactElement } from "react";
import { BaseData } from "./table";
import { LucideProps } from "lucide-react";
import { twMerge } from "tailwind-merge";

export type ActionButtonProps<T extends BaseData> = {
  item: T;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  children: React.ReactNode;
  onClick?: (item?: T, e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
} & Omit<React.ComponentProps<"button">, "onClick">;

export default function ActionButton<T extends BaseData>({
  item,
  Icon,
  children,
  onClick,
  className,
  ...props
}: ActionButtonProps<T>): ReactElement {
  return (
    <button
      {...props}
      className={twMerge(
        "bg-transparent hover:bg-zinc-100/80 text-zinc-700 justify-start flex items-center p-1.5 px-4 gap-4 w-[200px]",
        className
      )}
      {...(onClick && {
        onClick: (e) => {
          e.preventDefault();
          if (onClick) onClick(item as T, e);
        },
      })}
    >
      <Icon size={16} />
      <span>{children}</span>
    </button>
  );
}
