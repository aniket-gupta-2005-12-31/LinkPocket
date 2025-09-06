"use client";

import type { Link, Collection } from "@/lib/types";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Copy,
  Edit,
  ExternalLink,
  Folder,
  MoreVertical,
  Trash,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface LinkCardProps {
  link: Link;
  collection?: Collection;
  onDelete: (linkId: string) => void;
  onEdit: (link: Link) => void;
  onToggleFavorite: (linkId: string) => void;
}

export function LinkCard({
  link,
  collection,
  onDelete,
  onEdit,
  onToggleFavorite,
}: LinkCardProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(link.url);
    toast({
      title: "Link Copied!",
      description: "The URL has been copied to your clipboard.",
    });
  };

  const getFaviconUrl = (url: string) => {
    try {
      const { hostname } = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    } catch (error) {
      return null;
    }
  };

  const favicon = getFaviconUrl(link.url);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-3 text-lg">
            {favicon ? (
              <img
                src={favicon}
                alt="favicon"
                className="h-6 w-6"
                width={24}
                height={24}
              />
            ) : (
              <ExternalLink className="h-6 w-6 text-muted-foreground" />
            )}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline line-clamp-1"
            >
              {link.title}
            </a>
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onToggleFavorite(link.id)}>
                <Bookmark className="mr-2 h-4 w-4" />
                {link.isFavorite ? "Unfavorite" : "Favorite"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(link)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(link.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2">
          {link.description || "No description provided."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {link.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {link.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
        {collection && (
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            <span>{collection.name}</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleFavorite(link.id)}
          className={cn(
            "h-8 w-8",
            link.isFavorite && "text-primary hover:text-primary"
          )}
        >
          <Bookmark
            className={cn(
              "h-4 w-4",
              link.isFavorite && "fill-current text-primary"
            )}
          />
        </Button>
      </CardFooter>
    </Card>
  );
}
