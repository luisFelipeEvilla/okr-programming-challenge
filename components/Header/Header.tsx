"use client";
import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../ui/breadcrumb";
import { SidebarTrigger } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { routeGroups, type Route } from "@/routes";
import React from "react";

export default function Header() {
  const pathname = usePathname();
  
  // Find the current route group
  const routeGroup = routeGroups.find((group) =>
    group.routes.some((route) => pathname.startsWith(route.url))
  );

  // Build breadcrumb items by matching path segments
  const buildBreadcrumbItems = (): Route[] => {
    if (!routeGroup) return [];

    const pathSegments = pathname.split('/').filter(Boolean);
    const items: Route[] = [];
    let currentPath = '';

    // Add each path segment that matches a route
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const matchingRoute = routeGroup.routes.find(route => route.url === currentPath);
      if (matchingRoute && matchingRoute.url !== routeGroup.initialRoute.url) {
        items.push(matchingRoute);
      }
    });

    return items;
  };

  const breadcrumbItems = buildBreadcrumbItems();
  const allItems = routeGroup ? [routeGroup.initialRoute, ...breadcrumbItems] : [];

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-white shadow-sm">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {allItems.map((item, index) => {
              const isLast = index === allItems.length - 1;
              return (
                <React.Fragment key={item.url}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{item.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
