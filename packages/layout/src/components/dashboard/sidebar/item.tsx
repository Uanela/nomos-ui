import { LucideProps } from "lucide-react";
import { useProvider } from "@nomos-ui/core";
import {
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
} from "react";
import { twMerge } from "tailwind-merge";

export type SidebarItemProps = {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  text: string;
  href: string;
  className?: string;
  active?: boolean;
};

export default function SidebarItem({
  Icon,
  text,
  href = "/",
  className,
  active,
  ...props
}: SidebarItemProps & HTMLAttributes<HTMLLIElement>) {
  const { components } = useProvider();
  const Link = components?.Link?.component || components?.Link || "a";

  return (
    <li
      data-selected={active}
      {...props}
      className={twMerge(
        "pr-0 ml-0 relative group/sidebar-item z-50 group",
        className
      )}
    >
      <div className="h-full absolute w-[3px] bg-primary-300 rounded-l-md hidden group-data-[selected=true]:block"></div>
      <Link
        {...{ [components?.Link?.hrefKey || "href"]: href }}
        aria-label={text}
        className="flex items-center py-[4px] px-3 text-primary-500 rounded-md hover:bg-primary-50 group transition-all w-full group-data-[selected=true]:bg-primary-50  group-data-[selected=true]:text-primary-500 mb-1"
      >
        <Icon strokeWidth={2.5} width={20} absoluteStrokeWidth />
        <span className="ms-2 text-zinc-800 group-data-[selected=true]:text-primary-600 group-data-[hide-details=true]:hidden">
          {text}
        </span>
        <span className="ms-3 group-data-[hide-details=false]:hidden group-hover/sidebar-item:block hidden fixed left-[52px] z-50 bg-white text-zinc-800 text-sm p-1 px-2 rounded-md w-fit text-nowrap  card">
          {text}
        </span>
      </Link>
    </li>
  );
}
