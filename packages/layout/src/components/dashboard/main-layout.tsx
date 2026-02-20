import React, { JSX } from "react";

/**
 * DashboardMainLayout - A responsive layout component for dashboard interfaces
 *
 * This component provides a flexible layout structure with optional sidebar and navbar.
 * It automatically adjusts spacing and dimensions based on the presence of these elements.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.children] - Main content to be rendered in the layout
 * @param {React.ReactNode} [props.sidebar] - Optional sidebar component
 * @param {React.ReactNode} [props.navbar] - Optional navbar component
 *
 * @returns {JSX.Element} A structured dashboard layout with responsive behavior
 *
 * @example
 * // Basic usage with all elements
 * <DashboardMainLayout
 *   sidebar={<Sidebar />}
 *   navbar={<Navbar />}
 * >
 *   <div>Main dashboard content</div>
 * </DashboardMainLayout>
 *
 * @example
 * // Without sidebar
 * <DashboardMainLayout navbar={<Navbar />}>
 *   <div>Content with navbar only</div>
 * </DashboardMainLayout>
 *
 * @example
 * // Without navbar
 * <DashboardMainLayout sidebar={<Sidebar />}>
 *   <div>Content with sidebar only</div>
 * </DashboardMainLayout>
 *
 * @example
 * // Minimal usage (no sidebar or navbar)
 * <DashboardMainLayout>
 *   <div>Standalone content</div>
 * </DashboardMainLayout>
 *
 * @remarks
 * Layout Behavior:
 * - When sidebar is present: main content has left margin of 16rem (ml-64) on large screens
 * - When navbar is present: main content has top padding of 72px (pt-[72px]) and minimum height adjusts
 * - Responsive padding: small screens (p-2), medium screens and up (sm:p-4)
 * - Background: zinc-100 (light gray)
 * - Grid layout: single column for content organization
 */
export default function DashboardMainLayout({
  children,
  sidebar,
  navbar,
}: {
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
  navbar?: React.ReactNode;
}): JSX.Element {
  return (
    <>
      {sidebar}
      <div
        data-has-sidebar={!!sidebar}
        className="data-[has-sidebar=true]:lg:ml-64 min-h-screen peer-data-[hide-details=true]:ml-24"
      >
        {navbar}

        <main
          data-has-navbar={!!navbar}
          className="sm:p-4 p-2 pt-[72px] lg:mt-0 overflow-hidden bg-zinc-100 data-[has-navbar=true]:min-h-[calc(100vh-56px)] grid grid-cols-1"
        >
          {children}
        </main>
      </div>
    </>
  );
}
