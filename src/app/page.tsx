"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { MainSidebar } from "@/components/sidebar/main-sidebar";
import { LinkList } from "@/components/links/link-list";
import { mockLinks, mockCollections } from "@/lib/data";
import type { Link, Collection } from "@/lib/types";
import { AddEditLinkSheet } from "@/components/links/add-edit-link-sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Filter = "all" | "favorites" | string; // collectionId

export default function Home() {
  const [links, setLinks] = React.useState<Link[]>(mockLinks);
  const [collections, setCollections] =
    React.useState<Collection[]>(mockCollections);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<Filter>("all");
  const [isSheetOpen, setSheetOpen] = React.useState(false);
  const [editingLink, setEditingLink] = React.useState<Link | null>(null);

  const filteredLinks = React.useMemo(() => {
    let filtered = links;

    if (activeFilter === "favorites") {
      filtered = filtered.filter((link) => link.isFavorite);
    } else if (activeFilter !== "all") {
      filtered = filtered.filter((link) => link.collectionId === activeFilter);
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (link) =>
          link.title.toLowerCase().includes(lowercasedTerm) ||
          link.description?.toLowerCase().includes(lowercasedTerm) ||
          link.url.toLowerCase().includes(lowercasedTerm) ||
          link.tags.some((tag) => tag.toLowerCase().includes(lowercasedTerm))
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [links, activeFilter, searchTerm]);

  const handleAddLink = (newLinkData: Omit<Link, "id" | "createdAt" | "updatedAt">) => {
    const newLink: Link = {
      ...newLinkData,
      id: (links.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLinks([newLink, ...links]);
    setSheetOpen(false);
  };

  const handleUpdateLink = (updatedLink: Link) => {
    setLinks(
      links.map((link) => (link.id === updatedLink.id ? updatedLink : link))
    );
    setSheetOpen(false);
    setEditingLink(null);
  };
  
  const handleDeleteLink = (linkId: string) => {
    setLinks(links.filter((link) => link.id !== linkId));
  };

  const handleToggleFavorite = (linkId: string) => {
    setLinks(
      links.map((link) =>
        link.id === linkId ? { ...link, isFavorite: !link.isFavorite } : link
      )
    );
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setSheetOpen(true);
  };

  const handleAddNew = () => {
    setEditingLink(null);
    setSheetOpen(true);
  }

  const headerActions = (
    <Button onClick={handleAddNew}>
      <Plus className="-ml-2 h-4 w-4" />
      Add Link
    </Button>
  )

  return (
    <AppLayout
      sidebar={
        <MainSidebar
          collections={collections}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      }
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      headerActions={headerActions}
    >
      <LinkList
        links={filteredLinks}
        collections={collections}
        onDelete={handleDeleteLink}
        onEdit={handleEditLink}
        onToggleFavorite={handleToggleFavorite}
      />
      <AddEditLinkSheet
        isOpen={isSheetOpen}
        setIsOpen={(open) => {
          if (!open) setEditingLink(null);
          setSheetOpen(open);
        }}
        onSave={(data) => {
            if(editingLink) {
                handleUpdateLink({ ...editingLink, ...data, updatedAt: new Date().toISOString() });
            } else {
                handleAddLink(data);
            }
        }}
        collections={collections}
        link={editingLink}
      />
    </AppLayout>
  );
}
