"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  ChevronDown,
  Pencil,
  Trash2,
  Copy,
  Building2,
} from "lucide-react";
import type { BulletOption } from "@/lib/types";

type BulletOwner = {
  id: string;
  bulletOptions: BulletOption[];
};

interface BulletLibraryProps<T extends BulletOwner> {
  selected: T | null;
  all: T[];
  headerTitle?: string; // e.g. "Role Bullet Library" or "Project Bullet Library"
  getSubtitle: (item: T) => string; // renders the “{title} at {company}” line
  emptyState: {
    icon?: React.ReactNode;
    title: string;
    description: string;
  };
  onAddToResume: (conceptId: string, variantId: string) => void;
  onUpdateConcepts: (concepts: BulletOption[]) => void;
  onCopyFromOther: (concept: BulletOption) => void;
}

export function BulletLibrary<T extends BulletOwner>({
  selected,
  all,
  headerTitle = "Bullet Library",
  getSubtitle,
  emptyState,
  onAddToResume,
  onUpdateConcepts,
  onCopyFromOther,
}: BulletLibraryProps<T>) {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedConcepts, setExpandedConcepts] = useState<string[]>([]);
  const [crossRoleSearch, setCrossRoleSearch] = useState(false);
  const [isAddingConcept, setIsAddingConcept] = useState(false);
  const [editingConcept, setEditingConcept] = useState<BulletOption | null>(
    null,
  );
  const [newConceptSummary, setNewConceptSummary] = useState("");
  const [newConceptTags, setNewConceptTags] = useState("");
  const [newVariantText, setNewVariantText] = useState("");

  const BulletOptions = selected?.bulletOptions || [];

  const allTags = [...new Set(BulletOptions.flatMap((c) => c.tags))];

  const filteredConcepts = BulletOptions.filter((concept) => {
    const matchesSearch =
      search === "" ||
      concept.summary.toLowerCase().includes(search.toLowerCase()) ||
      concept.variants.some((v) =>
        v.text.toLowerCase().includes(search.toLowerCase()),
      ) ||
      concept.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => concept.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  // Cross-role search results
  const crossRoleResults =
    crossRoleSearch && search
      ? all
          .filter((item) => item.id !== selected?.id)
          .map((item) => ({
            item,
            concepts: item.bulletOptions.filter(
              (concept) =>
                concept.summary.toLowerCase().includes(search.toLowerCase()) ||
                concept.variants.some((v) =>
                  v.text.toLowerCase().includes(search.toLowerCase()),
                ) ||
                concept.tags.some((t) =>
                  t.toLowerCase().includes(search.toLowerCase()),
                ),
            ),
          }))
          .filter((result) => result.concepts.length > 0)
      : [];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const toggleExpanded = (conceptId: string) => {
    setExpandedConcepts((prev) =>
      prev.includes(conceptId)
        ? prev.filter((id) => id !== conceptId)
        : [...prev, conceptId],
    );
  };

  const handleAddConcept = () => {
    if (!newConceptSummary.trim() || !newVariantText.trim()) return;
    const newConcept: BulletOption = {
      id: `concept-${Date.now()}`,
      summary: newConceptSummary.trim(),
      tags: newConceptTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      variants: [
        {
          id: `variant-${Date.now()}`,
          text: newVariantText.trim(),
        },
      ],
    };
    onUpdateConcepts([...BulletOptions, newConcept]);
    setNewConceptSummary("");
    setNewConceptTags("");
    setNewVariantText("");
    setIsAddingConcept(false);
  };

  const handleDeleteConcept = (conceptId: string) => {
    onUpdateConcepts(BulletOptions.filter((c) => c.id !== conceptId));
  };

  const handleAddVariant = (conceptId: string, text: string) => {
    if (!text.trim()) return;
    onUpdateConcepts(
      BulletOptions.map((c) =>
        c.id === conceptId
          ? {
              ...c,
              variants: [
                ...c.variants,
                { id: `variant-${Date.now()}`, text: text.trim() },
              ],
            }
          : c,
      ),
    );
  };

  const handleDeleteVariant = (conceptId: string, variantId: string) => {
    onUpdateConcepts(
      BulletOptions.map((c) =>
        c.id === conceptId
          ? { ...c, variants: c.variants.filter((v) => v.id !== variantId) }
          : c,
      ),
    );
  };

  const handleUpdateConcept = (
    conceptId: string,
    updates: Partial<BulletOption>,
  ) => {
    onUpdateConcepts(
      BulletOptions.map((c) => (c.id === conceptId ? { ...c, ...updates } : c)),
    );
  };

  if (!selected) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 text-center">
        {emptyState.icon}
        <h3 className="font-medium mb-2">{emptyState.title}</h3>
        <p className="text-sm text-muted-foreground">
          {emptyState.description}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-sm">Role Bullet Library</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {getSubtitle(selected)}
            </p>
          </div>
          <Dialog open={isAddingConcept} onOpenChange={setIsAddingConcept}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs bg-transparent"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Concept
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Bullet Concept</DialogTitle>
                <DialogDescription>
                  Create a new bullet concept with an initial variant.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="summary">Concept Summary</Label>
                  <Input
                    id="summary"
                    placeholder="e.g., Performance Optimization"
                    value={newConceptSummary}
                    onChange={(e) => setNewConceptSummary(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g., React, Performance, Web Vitals"
                    value={newConceptTags}
                    onChange={(e) => setNewConceptTags(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="variant">Initial Variant</Label>
                  <Textarea
                    id="variant"
                    placeholder="Write your first bullet variant..."
                    value={newVariantText}
                    onChange={(e) => setNewVariantText(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingConcept(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddConcept}
                  disabled={!newConceptSummary.trim() || !newVariantText.trim()}
                >
                  Add Concept
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search bullets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>

        {/* Cross-role search toggle */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1 flex-1">
            {allTags.slice(0, 6).map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer text-xs px-2 py-0"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <Switch
            id="cross-role"
            checked={crossRoleSearch}
            onCheckedChange={setCrossRoleSearch}
            className="scale-75"
          />
          <Label
            htmlFor="cross-role"
            className="text-xs text-muted-foreground cursor-pointer"
          >
            Search across all roles
          </Label>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {filteredConcepts.length === 0 && !crossRoleSearch && (
            <div className="text-center py-6 text-sm text-muted-foreground">
              {search
                ? "No bullets found"
                : "No bullet concepts yet. Add one to get started."}
            </div>
          )}

          {/* Current role's concepts */}
          {filteredConcepts.map((concept) => (
            <ConceptCard
              key={concept.id}
              concept={concept}
              isExpanded={expandedConcepts.includes(concept.id)}
              onToggle={() => toggleExpanded(concept.id)}
              onAddToResume={onAddToResume}
              onDelete={() => handleDeleteConcept(concept.id)}
              onAddVariant={(text) => handleAddVariant(concept.id, text)}
              onDeleteVariant={(variantId) =>
                handleDeleteVariant(concept.id, variantId)
              }
              onUpdate={(updates) => handleUpdateConcept(concept.id, updates)}
            />
          ))}

          {/* Cross-role results */}
          {crossRoleSearch && crossRoleResults.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-3">
                FROM OTHER ROLES
              </p>
              {crossRoleResults.map((result) => (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {getSubtitle(result.item)}
                  </p>
                  {result.concepts.map((concept) => (
                    <div
                      key={concept.id}
                      className="border border-border rounded-lg p-3 mb-2 bg-card/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {concept.summary}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {concept.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs px-1.5 py-0"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {concept.variants[0]?.text}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs shrink-0 ml-2 bg-transparent"
                          onClick={() => onCopyFromOther(concept)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {crossRoleSearch &&
            search &&
            crossRoleResults.length === 0 &&
            filteredConcepts.length === 0 && (
              <div className="text-center py-6 text-sm text-muted-foreground">
                No bullets found across any roles
              </div>
            )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface ConceptCardProps {
  concept: BulletOption;
  isExpanded: boolean;
  onToggle: () => void;
  onAddToResume: (conceptId: string, variantId: string) => void;
  onDelete: () => void;
  onAddVariant: (text: string) => void;
  onDeleteVariant: (variantId: string) => void;
  onUpdate: (updates: Partial<BulletOption>) => void;
}

function ConceptCard({
  concept,
  isExpanded,
  onToggle,
  onAddToResume,
  onDelete,
  onAddVariant,
  onDeleteVariant,
  onUpdate,
}: ConceptCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editSummary, setEditSummary] = useState(concept.summary);
  const [editTags, setEditTags] = useState(concept.tags.join(", "));
  const [newVariantText, setNewVariantText] = useState("");
  const [isAddingVariant, setIsAddingVariant] = useState(false);

  const handleSaveEdit = () => {
    onUpdate({
      summary: editSummary.trim(),
      tags: editTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setIsEditing(false);
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <CollapsibleTrigger className="w-full px-3 py-2 flex items-start gap-2 hover:bg-muted/50 text-left">
          <ChevronDown
            className={`h-4 w-4 mt-0.5 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{concept.summary}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {concept.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs px-1.5 py-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {concept.variants.length}v
          </span>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-border">
            {/* Edit/Delete controls */}
            <div className="px-3 py-2 flex justify-end gap-1 border-b border-border bg-muted/30">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => {
                  setEditSummary(concept.summary);
                  setEditTags(concept.tags.join(", "));
                  setIsEditing(true);
                }}
              >
                <Pencil className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>

            {/* Edit concept dialog */}
            {isEditing && (
              <div className="px-3 py-3 border-b border-border bg-muted/20 space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Summary</Label>
                  <Input
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tags</Label>
                  <Input
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="Comma-separated tags"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 bg-transparent"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" className="h-7" onClick={handleSaveEdit}>
                    Save
                  </Button>
                </div>
              </div>
            )}

            {/* Variants */}
            {concept.variants.map((variant, index) => (
              <div
                key={variant.id}
                className="px-3 py-2 border-b border-border last:border-b-0 hover:bg-muted/30 group"
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs text-muted-foreground font-mono mt-0.5">
                    {index + 1}
                  </span>
                  <p className="flex-1 text-sm leading-relaxed">
                    {variant.text}
                  </p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => onAddToResume(concept.id, variant.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                    {concept.variants.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={() => onDeleteVariant(variant.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Add variant */}
            {isAddingVariant ? (
              <div className="px-3 py-3 bg-muted/20 space-y-2">
                <Textarea
                  placeholder="Write a new variant..."
                  value={newVariantText}
                  onChange={(e) => setNewVariantText(e.target.value)}
                  rows={2}
                  className="text-sm"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 bg-transparent"
                    onClick={() => {
                      setIsAddingVariant(false);
                      setNewVariantText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-7"
                    disabled={!newVariantText.trim()}
                    onClick={() => {
                      onAddVariant(newVariantText);
                      setNewVariantText("");
                      setIsAddingVariant(false);
                    }}
                  >
                    Add Variant
                  </Button>
                </div>
              </div>
            ) : (
              <button
                className="w-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 flex items-center justify-center gap-1"
                onClick={() => setIsAddingVariant(true)}
              >
                <Plus className="h-3 w-3" />
                Add variant
              </button>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
