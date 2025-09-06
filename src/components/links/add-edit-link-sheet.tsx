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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, Loader, PlusCircle } from "lucide-react";
import type { Link, Collection } from "@/lib/types";
import { getCollectionSuggestions, getLinkSummary } from "@/app/actions";
import { useDebounce } from "@/hooks/use-debounce";
import type { SuggestCollectionsForLinkOutput } from "@/ai/flows/suggest-collections-for-link";
import { useToast } from "@/hooks/use-toast";

const linkSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  collectionId: z.string().min(1, { message: "Please select a collection." }),
  isFavorite: z.boolean().default(false),
});

type LinkFormData = z.infer<typeof linkSchema>;

interface AddEditLinkSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (data: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onNewCollection: (name: string) => Promise<Collection | undefined>;
  collections: Collection[];
  link: Link | null;
}

export function AddEditLinkSheet({
  isOpen,
  setIsOpen,
  onSave,
  onNewCollection,
  collections,
  link,
}: AddEditLinkSheetProps) {
  const [currentTags, setCurrentTags] = React.useState<string[]>(link?.tags || []);
  const [tagInput, setTagInput] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<SuggestCollectionsForLinkOutput>({ suggestedExistingCollections: [], suggestedNewCollections: [] });
  const [isSuggesting, setIsSuggesting] = React.useState(false);
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      tags: [],
      collectionId: "",
      isFavorite: false,
    },
  });

  const formData = form.watch();
  const debouncedFormData = useDebounce({
      title: formData.title,
      description: formData.description,
      tags: formData.tags
  }, 500);

  React.useEffect(() => {
    if (link) {
      form.reset({
        url: link.url,
        title: link.title,
        description: link.description,
        tags: link.tags,
        collectionId: link.collectionId,
        isFavorite: link.isFavorite,
      });
      setCurrentTags(link.tags);
    } else {
      form.reset({
        url: "",
        title: "",
        description: "",
        tags: [],
        collectionId: "",
        isFavorite: false,
      });
      setCurrentTags([]);
    }
    setSuggestions({ suggestedExistingCollections: [], suggestedNewCollections: [] });
  }, [link, isOpen, form]);

  React.useEffect(() => {
      const fetchSuggestions = async () => {
          if (debouncedFormData.title || debouncedFormData.description || (debouncedFormData.tags && debouncedFormData.tags.length > 0)) {
              setIsSuggesting(true);
              const response = await getCollectionSuggestions({
                  title: debouncedFormData.title || '',
                  description: debouncedFormData.description || '',
                  tags: debouncedFormData.tags || [],
                  existingCollections: collections,
              });
              setSuggestions(response);
              setIsSuggesting(false);
          }
      };
      if (isOpen && !link) { // Only suggest for new links for now
        fetchSuggestions();
      }
  }, [debouncedFormData, collections, isOpen, link]);


  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !currentTags.includes(newTag)) {
        const newTags = [...currentTags, newTag];
        setCurrentTags(newTags);
        form.setValue("tags", newTags);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = currentTags.filter((tag) => tag !== tagToRemove);
    setCurrentTags(newTags);
    form.setValue("tags", newTags);
  };

  function onSubmit(data: LinkFormData) {
    onSave(data);
    form.reset();
    setCurrentTags([]);
  }

  const selectSuggestedCollection = (name: string) => {
    const collection = collections.find(c => c.name === name);
    if (collection) {
        form.setValue('collectionId', collection.id, { shouldValidate: true });
        setSuggestions(s => ({...s, suggestedExistingCollections: s.suggestedExistingCollections.filter(c => c !== name)}));
    }
  }

  const createAndSelectCollection = async (name: string) => {
    const newCollection = await onNewCollection(name);
    if (newCollection) {
        form.setValue('collectionId', newCollection.id, { shouldValidate: true });
        setSuggestions(s => ({...s, suggestedNewCollections: s.suggestedNewCollections.filter(c => c !== name)}));
        toast({
            title: "Collection Created!",
            description: `Successfully created and selected "${name}".`,
        });
    }
  }

  const handleGenerateSummary = async () => {
    const url = form.getValues('url');
    if(url) {
      setIsSummarizing(true);
      const summary = await getLinkSummary(url);
      if (summary) {
        form.setValue('description', summary, { shouldValidate: true });
      }
      setIsSummarizing(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>{link ? "Edit Link" : "Add New Link"}</SheetTitle>
          <SheetDescription>
            {link
              ? "Update the details of your link."
              : "Add a new link to your collection."}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-grow overflow-y-auto pr-6 pl-1 py-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Awesome Design System" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                    <div className="flex justify-between items-center">
                        <FormLabel>Description</FormLabel>
                        <Button type="button" variant="outline" size="sm" onClick={handleGenerateSummary} disabled={isSummarizing || !formData.url}>
                            {isSummarizing ? (
                                <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                            <span className="ml-2">Generate</span>
                        </Button>
                    </div>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of the link."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="collectionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a collection" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {collections.map((collection) => (
                        <SelectItem key={collection.id} value={collection.id}>
                          {collection.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(suggestions.suggestedExistingCollections.length > 0 || suggestions.suggestedNewCollections.length > 0) && !link && (
                <div className="space-y-3">
                    <FormLabel className="flex items-center gap-2 text-sm text-muted-foreground">
                        {isSuggesting ? (
                            <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                            <Sparkles className="w-4 h-4 text-primary" />
                        )}
                        <span>AI Suggestions</span>
                    </FormLabel>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.suggestedExistingCollections.map(name => (
                            <Button key={`exist-${name}`} type="button" variant="outline" size="sm" onClick={() => selectSuggestedCollection(name)}>
                                {name}
                            </Button>
                        ))}
                         {suggestions.suggestedNewCollections.map(name => (
                            <Button key={`new-${name}`} type="button" variant="outline" size="sm" onClick={() => createAndSelectCollection(name)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                {name}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {currentTags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <button
                        type="button"
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </FormControl>
              <Input
                placeholder="Add tags (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
            </FormItem>
          </form>
        </Form>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </SheetClose>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Save Link</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
