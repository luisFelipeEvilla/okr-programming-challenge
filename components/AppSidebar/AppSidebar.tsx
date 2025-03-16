"use client";

import * as React from "react";

import { NavMain } from "@/components/AppSidebar/NavMain";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { routeGroups } from "@/routes";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar collapsible="icon" {...props} className="bg-[#1c1d2d]">
      <SidebarHeader className="py-4">
        <Image
          src="/logo.png"
          alt="logo"
          width={48}
          height={48}
          className="mx-auto"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain title={routeGroups[0].title} items={routeGroups[0].routes} />
      </SidebarContent>
      <SidebarFooter>
        <Button variant="destructive" className="w-full">
          <LogOut />
          Logout
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
