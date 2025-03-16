"use client";

import * as React from "react";

import { NavMain } from "@/components/AppSidebar/NavMain";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { routeGroups } from "@/routes";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { removeClientSideCookie } from "@/lib/utils";
import { redirect } from "next/navigation";
import { cc_access_token_cookie_name } from "@/config";
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  function handleLogout() {
    removeClientSideCookie(cc_access_token_cookie_name);
    redirect("/login");
  }
  return (
    <Sidebar collapsible="icon" {...props} className="">
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
      <SidebarFooter className="py-8">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              variant="destructive"
              onClick={handleLogout}
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
