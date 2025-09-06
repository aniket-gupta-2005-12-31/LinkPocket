"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import type { Collection } from "@/lib/types";
import { Bookmark, Folder, Inbox } from "lucide-react";

interface MainSidebarProps {
  collections: Collection[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export function MainSidebar({
  collections,
  activeFilter,
  setActiveFilter,
}: MainSidebarProps) {
  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveFilter("all")}
              isActive={activeFilter === "all"}
              tooltip="All Links"
            >
              <Inbox />
              <span>All Links</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveFilter("favorites")}
              isActive={activeFilter === "favorites"}
              tooltip="Favorites"
            >
              <Bookmark />
              <span>Favorites</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Collections</SidebarGroupLabel>
        <SidebarMenu>
          {collections.map((collection) => (
            <SidebarMenuItem key={collection.id}>
              <SidebarMenuButton
                onClick={() => setActiveFilter(collection.id)}
                isActive={activeFilter === collection.id}
                tooltip={collection.name}
              >
                <Folder />
                <span>{collection.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
