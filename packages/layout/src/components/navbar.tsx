import React from "react";
import { twMerge } from "tailwind-merge";

export type NavbarProps = {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
} & React.ComponentProps<"div">;

/**
 * A sticky navigation bar with left, center, and right sections.
 *
 * @param left - Content for left section (logo, menu button)
 * @param center - Content for center section (title, search)
 * @param right - Content for right section (user menu, actions)
 * @param className - Additional CSS classes
 *
 * @example
 * <Navbar
 *   left={<Logo />}
 *   center={<h1>Dashboard</h1>}
 *   right={<UserMenu />}
 * />
 */
export default function Navbar({
  left,
  center,
  right,
  className,
  ...props
}: NavbarProps) {
  return (
    <nav
      aria-label="Main navigation"
      className={twMerge(
        "sticky top-0 z-50 w-full border-b border-zinc-200 p-0 px-2 bg-white",
        className
      )}
      {...props}
    >
      <div className="py-2">
        <div className="flex items-center justify-between h-[36px]">
          {left && <div className="flex-1 h-full">{left}</div>}
          {center && <div className="flex-1 h-full">{center}</div>}
          {right && <div className="flex-1 h-full">{right}</div>}
        </div>
      </div>
    </nav>
  );
}
