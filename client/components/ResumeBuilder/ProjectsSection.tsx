"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import type { Project } from "@/lib/types";
import { CollapsibleItemCard } from "./CollapsibleItemCard";
import { SelectedBulletsList } from "./SelectedBulletsList";

interface ProjectsSectionProps {
  projects: Project[];
  expandedId: string | null;
  onSelect: (id: string | null) => void;
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onRemove: (id: string) => void;
  onRemoveBullet: (
    projId: string,
    optionId: string,
    variantId: string
  ) => void;
  onSwitchBulletVariant: (
    projId: string,
    optionId: string,
    currentVariantId: string
  ) => void;
}

export function ProjectsSection({
  projects,
  expandedId,
  onSelect,
  onAdd,
  onUpdate,
  onRemove,
  onRemoveBullet,
  onSwitchBulletVariant,
}: ProjectsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium">Projects</CardTitle>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No projects added. Click &quot;Add&quot; to get started.
          </p>
        ) : (
          projects.map((proj) => (
            <CollapsibleItemCard
              key={proj.id}
              title={proj.title || "Untitled Project"}
              subtitle={`${proj.selectedBullets.length} bullets | ${proj.bulletOptions.length} concepts`}
              expanded={expandedId === proj.id}
              onToggle={() => onSelect(expandedId === proj.id ? null : proj.id)}
              onDelete={() => onRemove(proj.id)}
            >
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Project Title"
                  value={proj.title}
                  onChange={(e) =>
                    onUpdate(proj.id, { title: e.target.value })
                  }
                />
                <Input
                  placeholder="URL"
                  value={proj.url}
                  onChange={(e) =>
                    onUpdate(proj.id, { url: e.target.value })
                  }
                />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  SELECTED BULLETS
                </p>
                <SelectedBulletsList
                  selectedBullets={proj.selectedBullets}
                  bulletOptions={proj.bulletOptions}
                  onRemove={(optionId, variantId) =>
                    onRemoveBullet(proj.id, optionId, variantId)
                  }
                  onSwitchVariant={(optionId, currentVariantId) =>
                    onSwitchBulletVariant(
                      proj.id,
                      optionId,
                      currentVariantId
                    )
                  }
                />
              </div>
            </CollapsibleItemCard>
          ))
        )}
      </CardContent>
    </Card>
  );
}
