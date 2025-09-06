
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
            <Link href="/" passHref legacyBehavior>
                <SidebarMenuButton
                asChild
                isActive={!isNotesPage && activeFilter === "all"}
                tooltip="All Links"
                >
                <a>
                    <Inbox />
                    <span>All Links</span>
                </a>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <Link href="/" passHref legacyBehavior>
                <SidebarMenuButton
                    asChild
                    onClick={() => setActiveFilter("favorites")}
                    isActive={!isNotesPage && activeFilter === "favorites"}
                    tooltip="Favorites"
                >
                    <a>
                        <Bookmark />
                        <span>Favorites</span>
                    </a>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <Link href="/notes" passHref legacyBehavior>
                <SidebarMenuButton
                asChild
                isActive={isNotesPage}
                tooltip="Notes"
                >
                <a>
                    <StickyNote />
                    <span>Notes</span>
                </a>
                </SidebarMenuButton>
            </Link>
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
                <Link href="/" passHref legacyBehavior>
                    <SidebarMenuButton
                        asChild
                        onClick={() => setActiveFilter(collection.id)}
                        isActive={!isNotesPage && activeFilter === collection.id}
                        tooltip={collection.name}
                    >
                        <a>
                            <Folder />
                            <span>{collection.name}</span>
                        </a>
                    </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
