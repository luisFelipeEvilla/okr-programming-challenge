"use client";
import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "./ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";
import { usePathname } from "next/navigation";
import { routeGroups } from "@/routes";

export default function Header() {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");

  const routeGroup = routeGroups.find((routeGroup) =>
    routeGroup.routes.some((route) => route.url === pathname)
  );

  const breadcrumbItems = routeGroup?.routes.filter((route) => {
    return pathnameParts.includes(route.url);
  });


  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-white shadow-sm">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={routeGroup?.initialRoute.url}>
                {routeGroup?.initialRoute.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {breadcrumbItems?.map((item) => (
                  <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
                ))}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
