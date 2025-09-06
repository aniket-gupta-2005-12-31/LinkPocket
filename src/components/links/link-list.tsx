"use client";

import * as React from "react";
import type { Link, Collection } from "@/lib/types";
import { LinkCard } from "./link-card";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileText } from "lucide-react";

interface LinkListProps {
  links: Link[];
  collections: Collection[];
  onDelete: (linkId: string) => void;
  onEdit: (link: Link) => void;
  onToggleFavorite: (linkId: string) => void;
}

export function LinkList({
  links,
  collections,
  onDelete,
  onEdit,
  onToggleFavorite,
}: LinkListProps) {
  if (links.length === 0) {
    return (
      <Card className="flex h-64 w-full items-center justify-center">
        <CardContent className="flex flex-col items-center gap-4 text-center">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold">No Links Found</h3>
            <p className="text-muted-foreground">
                Add a new link to get started.
            </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          collection={collections.find((c) => c.id === link.collectionId)}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
