
"use client";

import type { Note } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, Trash } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onDelete: (noteId: string) => void;
  onEdit: (note: Note) => void;
}

export function NoteCard({
  note,
  onDelete,
  onEdit,
}: NoteCardProps) {
  const updatedAt = new Date(note.updatedAt);
  const timeAgo = formatDistanceToNow(updatedAt, { addSuffix: true });

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-1">
            {note.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(note)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(note.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-4">{note.content}</p>
      </CardContent>
      <CardFooter className="flex justify-end items-center text-xs text-muted-foreground">
        <span>Edited {timeAgo}</span>
      </CardFooter>
    </Card>
  );
}
