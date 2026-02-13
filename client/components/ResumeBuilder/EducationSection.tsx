"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import type { Education } from "@/lib/types";

interface EducationSectionProps {
  education: Education[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Education>) => void;
  onRemove: (id: string) => void;
}

export function EducationSection({
  education,
  onAdd,
  onUpdate,
  onRemove,
}: EducationSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium">Education</CardTitle>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {education.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No education added.
          </p>
        ) : (
          education.map((edu) => (
            <div
              key={edu.id}
              className="grid grid-rows-5 gap-3 items-start p-3 border border-border rounded-lg"
            >
              <Input
                placeholder="School"
                value={edu.school}
                onChange={(e) =>
                  onUpdate(edu.id, { school: e.target.value })
                }
              />
              <Input
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) =>
                  onUpdate(edu.id, { degree: e.target.value })
                }
              />
              <Input
                placeholder="Field"
                value={edu.field}
                onChange={(e) =>
                  onUpdate(edu.id, { field: e.target.value })
                }
              />
              <Input
                placeholder="Year"
                value={edu.graduationDate}
                onChange={(e) =>
                  onUpdate(edu.id, {
                    graduationDate: e.target.value,
                  })
                }
              />
              <Button
                variant="ghost"
                size="sm"
                className="justify-self-end"
                onClick={() => onRemove(edu.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
