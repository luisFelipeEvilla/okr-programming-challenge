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
import { LogOut, Settings2, HelpCircle } from "lucide-react";
import { removeClientSideCookie } from "@/lib/utils";
import { redirect } from "next/navigation";
import { cc_access_token_cookie_name } from "@/config";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  function handleLogout() {
    removeClientSideCookie(cc_access_token_cookie_name);
    redirect("/login");
  }
  return (
    <Sidebar 
      collapsible="icon" 
      {...props} 
      className="bg-sidebar border-r border-sidebar-border/10"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-center p-2 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-blue-500/10 rounded-2xl">
          <Image
            src="/logo.png"
            alt="Social Good Software"
            width={48}
            height={48}
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain 
          title={routeGroups[0].title} 
          items={routeGroups[0].routes} 
        />
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4">
        <nav className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/10 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
              >
                <Settings2 className="mr-3 h-4 w-4 group-data-[collapsible=icon]:mr-0" />
                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Configure your preferences
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/10 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
                asChild
              >
                <a 
                  href="https://socialgoodsoftware.com/support" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <HelpCircle className="mr-3 h-4 w-4 group-data-[collapsible=icon]:mr-0" />
                  <span className="group-data-[collapsible=icon]:hidden">Support</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Get help and documentation
            </TooltipContent>
          </Tooltip>

          <Separator className="my-3 opacity-10" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-red-500/70 hover:text-red-500 hover:bg-red-500/10 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-4 w-4 group-data-[collapsible=icon]:mr-0" />
                <span className="group-data-[collapsible=icon]:hidden">Sign out</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Sign out of your account
            </TooltipContent>
          </Tooltip>
        </nav>
      </SidebarFooter>

      <SidebarRail className="border-sidebar-border/10" />
    </Sidebar>
  );
}
