
"use client";

import * as React from "react";
import type { Note } from "@/lib/types";
import { NoteCard } from "./note-card";
import { Card, CardContent } from "../ui/card";
import { StickyNote } from "lucide-react";

interface NoteListProps {
  notes: Note[];
  onDelete: (noteId: string) => void;
  onEdit: (note: Note) => void;
}

export function NoteList({
  notes,
  onDelete,
  onEdit,
}: NoteListProps) {
  if (notes.length === 0) {
    return (
      <Card className="flex h-64 w-full items-center justify-center">
        <CardContent className="flex flex-col items-center gap-4 text-center">
            <StickyNote className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold">No Notes Found</h3>
            <p className="text-muted-foreground">
                Add a new note to get started.
            </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
