
"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
} from "@/components/ui/sidebar";
import type { Collection } from "@/lib/types";
import { Bookmark, Folder, Inbox, Plus, StickyNote } from "lucide-react";
import Link from 'next/link';

interface MainSidebarProps {
  collections: Collection[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  onAddCollection: () => void;
  isNotesPage?: boolean;
}

export function MainSidebar({
  collections,
  activeFilter,
  setActiveFilter,
  onAddCollection,
  isNotesPage = false,
}: MainSidebarProps) {
  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={!isNotesPage && activeFilter === "all"}
              tooltip="All Links"
            >
              <Link href="/">
                <Inbox />
                <span>All Links</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              onClick={() => setActiveFilter("favorites")}
              isActive={!isNotesPage && activeFilter === "favorites"}
              tooltip="Favorites"
            >
               <Link href="/">
                <Bookmark />
                <span>Favorites</span>
               </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isNotesPage}
              tooltip="Notes"
            >
              <Link href="/notes">
                <StickyNote />
                <span>Notes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Collections</SidebarGroupLabel>
         <SidebarGroupAction onClick={onAddCollection} tooltip="Add Collection">
            <Plus />
        </SidebarGroupAction>
        <SidebarMenu>
          {collections.map((collection) => (
            <SidebarMenuItem key={collection.id}>
              <SidebarMenuButton
                asChild
                onClick={() => setActiveFilter(collection.id)}
                isActive={!isNotesPage && activeFilter === collection.id}
                tooltip={collection.name}
              >
                <Link href="/">
                    <Folder />
                    <span>{collection.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
