"use client";

import * as React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
  SidebarContent,
} from "@/components/ui/sidebar";
import { LinkPocketLogo } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface AppLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  headerActions?: React.ReactNode;
}

export function AppLayout({
  children,
  sidebar,
  searchTerm,
  onSearchTermChange,
  headerActions,
}: AppLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="h-14 items-center border-b">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:-ml-1">
            <LinkPocketLogo className="size-6 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
              LinkPocket
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>{sidebar}</SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search links..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {headerActions}
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
