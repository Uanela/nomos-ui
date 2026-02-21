import React from "react";
import { Dispatch, SetStateAction, useState } from "react";
import SidebarItem, { SidebarItemProps } from "./item";
import { twMerge } from "tailwind-merge";
import { Input } from "@nomos-ui/form";

export type GroupSidebarItemConfig = {
  title: string;
  items: Omit<SidebarItemProps, "active">[];
};

export type SidebarItemConfig =
  | GroupSidebarItemConfig
  | Omit<SidebarItemProps, "active">;

/**
 * DashboardSidebar - A responsive dashboard sidebar with search functionality and collapsible sections
 *
 * This component provides a comprehensive sidebar navigation system with support for grouped menu items,
 * search/filtering capabilities, and responsive behavior. It can be controlled externally or manage its
 * own open state internally.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Dispatch<SetStateAction<boolean>>} [props.setIsOpen] - External state setter for controlling sidebar open state
 * @param {boolean} [props.isOpen] - External controlled open state
 * @param {string} [props.className] - Additional CSS classes to apply to the sidebar
 * @param {React.ReactNode} [props.logo] - Logo component to display at the top of the sidebar
 * @param {SidebarItemConfig[]} [props.items] - Array of sidebar items or grouped item configurations
 * @param {string} [props.activeItemText] - Text of the currently active menu item for highlighting
 *
 * @returns {JSX.Element} A fully-featured dashboard sidebar with navigation and search
 *
 * @example
 * // Basic usage with controlled state
 * const [isSidebarOpen, setIsSidebarOpen] = useState(true);
 *
 * <DashboardSidebar
 *   isOpen={isSidebarOpen}
 *   setIsOpen={setIsSidebarOpen}
 *   logo={<img src="/logo.png" alt="Logo" />}
 *   activeItemText="Dashboard"
 *   items={[
 *     { text: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
 *     { text: "Profile", href: "/profile", icon: <ProfileIcon /> },
 *     {
 *       title: "Settings",
 *       items: [
 *         { text: "General", href: "/settings/general", icon: <GeneralIcon /> },
 *         { text: "Security", href: "/settings/security", icon: <SecurityIcon /> }
 *       ]
 *     }
 *   ]}
 * />
 *
 * @example
 * // Uncontrolled usage (sidebar manages its own state)
 * <DashboardSidebar
 *   logo={<div>My App</div>}
 *   activeItemText="Users"
 *   items={[
 *     { text: "Dashboard", href: "/dashboard" },
 *     { text: "Users", href: "/users" },
 *     { text: "Reports", href: "/reports" }
 *   ]}
 * />
 *
 * @example
 * // With custom styling
 * <DashboardSidebar
 *   className="bg-gray-900 border-r-0"
 *   logo={<CustomLogo />}
 *   items={navigationItems}
 *   activeItemText={currentPath}
 * />
 *
 * @remarks
 * Features:
 * - **Controlled/Uncontrolled modes**: Can be controlled externally or manage its own state
 * - **Search functionality**: Filter menu items in real-time
 * - **Grouped navigation**: Support for categorized menu sections with titles
 * - **Responsive design**: Collapsible on mobile, fixed positioning
 * - **Active state highlighting**: Visual indication of current page
 * - **Hide details mode**: Option to collapse sidebar to icons only
 *
 * State Management:
 * - `isOpen`: Controls sidebar visibility (for mobile/responsive)
 * - `hideSidebarDetails`: Controls expanded/collapsed state of sidebar
 * - `itemsSearchTerm`: Search input value for filtering menu items
 *
 * Styling:
 * - Uses Tailwind CSS for styling
 * - Supports custom classes via `className` prop
 * - Includes transitions for smooth animations
 * - Data attributes for conditional styling (`data-hide-details`, `data-hidden`)
 */
export default function DashboardSidebar({
  isOpen: externalIsOpen,
  setIsOpen: setIsExternalOpen,
  className,
  logo,
  items,
  activeItemText,
  ...props
}: {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  isOpen?: boolean;
  className?: string;
  logo?: React.ReactNode;
  items?: SidebarItemConfig[];
  activeItemText?: string;
}): React.JSX.Element {
  const [hideSidebarDetails, setHideSidebarDetails] = useState(() => false);
  const [internalIsOpen, setIsInternalOpen] = useState(false);
  const isOpen = externalIsOpen ?? internalIsOpen;
  const [itemsSearchTerm, setItemsSearchTerm] = useState("");

  function setIsOpen(val: boolean) {
    const fn = setIsExternalOpen ?? setIsInternalOpen;
    fn(val);
  }

  return (
    <aside
      data-hide-details={hideSidebarDetails}
      {...props}
      className={twMerge(
        "group data-[hide-details=true]:w-auto border-r border-zinc-200/70 fixed top-0 left-0 z-40 w-64 lg:w-64 h-screen bg-white -translate-x-full data-[hidden=true]:translate-x-0  lg:translate-x-0 transition-all peer ",
        className
      )}
    >
      <div className="h-full p-2 pb-4 overflow-hidden  overflow-x-hidden">
        {logo}
        <div className="flex justify-between items-start mb-3 group-data-[hide-details=true]:ml-0 flex-row lg:pt-0 pt-12">
          <div className="max-w-80 flex-1">
            <Input
              className=" w-full small-sm:mb-4 mb-4 flex "
              inputClassName="h-7 w-full "
              inputContainerClassName="items-center flex-row-reverse pr-2"
              placeholder="Pesquisar menus"
              type="search"
              value={itemsSearchTerm}
              onChange={setItemsSearchTerm}
            />
          </div>
        </div>
        <ul className="font-medium -mt-4 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-280px)] h-full">
          {items?.map((item: any, i) => {
            const showMenu = itemsSearchTerm
              ? JSON.stringify(item)
                  .toLowerCase()
                  .includes(itemsSearchTerm?.toLowerCase() || "")
              : true;

            if (showMenu)
              if ((item as GroupSidebarItemConfig).title)
                return (
                  <div key={item.title} className="space-y-0 mt-2">
                    <h2 className="font-semibold  ml-2 pt-2 mb-2 group-data-[hide-details=true]:hidden text-zinc-700">
                      {item.title}
                    </h2>
                    {i !== 0 && (
                      <div className="hidden group-data-[hide-details=true]:block w-full py-1">
                        <div className="h-[2px] w-[70%] mx-auto bg-zinc-200 " />
                      </div>
                    )}
                    {item.items.map(
                      (item: Omit<SidebarItemProps, "active">) => (
                        <SidebarItem
                          onClick={() => setIsOpen(false)}
                          key={item.href}
                          active={activeItemText === item.text}
                          {...item}
                        />
                      )
                    )}
                  </div>
                );
              else
                return (
                  <SidebarItem
                    onClick={() => setIsOpen(false)}
                    key={item.href}
                    active={activeItemText === item.text}
                    {...item}
                  />
                );
          })}
          {itemsSearchTerm &&
            !JSON.stringify(items)
              .toLowerCase()
              .includes(itemsSearchTerm?.toLowerCase() || "") && (
              <li className="text-zinc-400 text-sm text-center mt-8">
                Nenhum Resultado para "{itemsSearchTerm}"
              </li>
            )}
        </ul>
      </div>
    </aside>
  );
}
