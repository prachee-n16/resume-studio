"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import type { Experience } from "@/lib/types";
import { CollapsibleItemCard } from "./CollapsibleItemCard";
import { SelectedBulletsList } from "./SelectedBulletsList";

interface ExperienceSectionProps {
  experiences: Experience[];
  expandedId: string | null;
  onSelect: (id: string | null) => void;
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Experience>) => void;
  onRemove: (id: string) => void;
  onRemoveBullet: (expId: string, optionId: string, variantId: string) => void;
  onSwitchBulletVariant: (
    expId: string,
    optionId: string,
    currentVariantId: string
  ) => void;
}

export function ExperienceSection({
  experiences,
  expandedId,
  onSelect,
  onAdd,
  onUpdate,
  onRemove,
  onRemoveBullet,
  onSwitchBulletVariant,
}: ExperienceSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium">Experience</CardTitle>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {experiences.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No experience added. Click &quot;Add&quot; to get started.
          </p>
        ) : (
          experiences.map((exp) => (
            <CollapsibleItemCard
              key={exp.id}
              title={
                exp.title
                  ? `${exp.title}${exp.company ? ` at ${exp.company}` : ""}`
                  : "Untitled"
              }
              subtitle={`${exp.selectedBullets.length} bullets | ${exp.bulletOptions.length} concepts`}
              expanded={expandedId === exp.id}
              onToggle={() => onSelect(expandedId === exp.id ? null : exp.id)}
              onDelete={() => onRemove(exp.id)}
            >
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => onUpdate(exp.id, { title: e.target.value })}
                />
                <Input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) =>
                    onUpdate(exp.id, { company: e.target.value })
                  }
                />
                <Input
                  placeholder="Start Date"
                  value={exp.startDate}
                  onChange={(e) =>
                    onUpdate(exp.id, { startDate: e.target.value })
                  }
                />
                <Input
                  placeholder="End Date"
                  value={exp.endDate}
                  onChange={(e) =>
                    onUpdate(exp.id, { endDate: e.target.value })
                  }
                />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  SELECTED BULLETS
                </p>
                <SelectedBulletsList
                  selectedBullets={exp.selectedBullets}
                  bulletOptions={exp.bulletOptions}
                  onRemove={(optionId, variantId) =>
                    onRemoveBullet(exp.id, optionId, variantId)
                  }
                  onSwitchVariant={(optionId, currentVariantId) =>
                    onSwitchBulletVariant(exp.id, optionId, currentVariantId)
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
