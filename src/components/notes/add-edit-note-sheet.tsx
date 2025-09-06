
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { Note } from "@/lib/types";

const noteSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(1, { message: "Content cannot be empty." }),
});

type NoteFormData = z.infer<typeof noteSchema>;
type SaveHandler = (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;

interface AddEditNoteSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: SaveHandler;
  note: Note | null;
}

export function AddEditNoteSheet({
  isOpen,
  setIsOpen,
  onSave,
  note,
}: AddEditNoteSheetProps) {
  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  React.useEffect(() => {
    if (note) {
      form.reset({
        title: note.title,
        content: note.content,
      });
    } else {
      form.reset({
        title: "",
        content: "",
      });
    }
  }, [note, isOpen, form]);

  function onSubmit(data: NoteFormData) {
    onSave(data);
    form.reset();
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>{note ? "Edit Note" : "Add New Note"}</SheetTitle>
          <SheetDescription>
            {note
              ? "Update the details of your note."
              : "Create a new note."}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-grow overflow-y-auto pr-6 pl-1 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Take a note..."
                      className="resize-y min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </SheetClose>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Save Note</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
