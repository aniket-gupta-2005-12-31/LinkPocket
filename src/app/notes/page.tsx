
"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { MainSidebar } from "@/components/sidebar/main-sidebar";
import { mockNotes, mockCollections } from "@/lib/data";
import type { Note, Collection } from "@/lib/types";
import { AddEditNoteSheet } from "@/components/notes/add-edit-note-sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NoteList } from "@/components/notes/note-list";
import { AddCollectionDialog } from "@/components/collections/add-collection-dialog";
import { useAuth } from "@/context/auth-context";

export default function NotesPage() {
  const { user, loading } = useAuth();
  const [notes, setNotes] = React.useState<Note[]>(mockNotes);
  const [collections, setCollections] = React.useState<Collection[]>(mockCollections);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<string>("all");
  const [isNoteSheetOpen, setNoteSheetOpen] = React.useState(false);
  const [editingNote, setEditingNote] = React.useState<Note | null>(null);
  const [isCollectionDialogOpen, setCollectionDialogOpen] = React.useState(false);

  const filteredNotes = React.useMemo(() => {
    let filtered = notes;

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(lowercasedTerm) ||
          note.content.toLowerCase().includes(lowercasedTerm)
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [notes, searchTerm]);

  const handleAddNote = (newNoteData: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    const newNote: Note = {
      ...newNoteData,
      id: (notes.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setNoteSheetOpen(false);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(
      notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
    setNoteSheetOpen(false);
    setEditingNote(null);
  };
  
  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteSheetOpen(true);
  };

  const handleAddNewNote = () => {
    setEditingNote(null);
    setNoteSheetOpen(true);
  }

  const handleAddCollection = (newCollectionData: Omit<Collection, "id" | "linkCount">) => {
    const newCollection: Collection = {
      ...newCollectionData,
      id: (collections.length + 1).toString(),
      linkCount: 0,
    };
    setCollections([...collections, newCollection]);
    setCollectionDialogOpen(false);
  };

  const headerActions = (
    <Button onClick={handleAddNewNote}>
      <Plus className="-ml-2 h-4 w-4" />
      Add Note
    </Button>
  )

  if (loading || !user) {
    return null;
  }

  return (
    <AppLayout
      sidebar={
        <MainSidebar
          collections={collections}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onAddCollection={() => setCollectionDialogOpen(true)}
          isNotesPage={true}
        />
      }
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      headerActions={headerActions}
    >
      <NoteList
        notes={filteredNotes}
        onDelete={handleDeleteNote}
        onEdit={handleEditNote}
      />
      <AddEditNoteSheet
        isOpen={isNoteSheetOpen}
        setIsOpen={(open) => {
          if (!open) setEditingNote(null);
          setNoteSheetOpen(open);
        }}
        onSave={(data) => {
            if(editingNote) {
                handleUpdateNote({ ...editingNote, ...data, updatedAt: new Date().toISOString() });
            } else {
                handleAddNote(data);
            }
        }}
        note={editingNote}
      />
       <AddCollectionDialog
        isOpen={isCollectionDialogOpen}
        setIsOpen={setCollectionDialogOpen}
        onSave={handleAddCollection}
      />
    </AppLayout>
  );
}
