"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skill } from "@/lib/types";

export interface SkillsSectionApi {
  data: Skill;
  add: (category: keyof Skill, value: string) => void;
  remove: (category: keyof Skill, index: number) => void;
  setCategory: (category: keyof Skill, items: string[]) => void;
}

export function SkillsSection({ skills }: { skills: SkillsSectionApi }) {
  const [newSkill, setNewSkill] = useState({
    languages: "",
    frameworks: "",
    tools: "",
    awards: "",
  });
  const [draggedItem, setDraggedItem] = useState<{
    category: keyof Skill;
    index: number;
  } | null>(null);

  const addSkill = (category: keyof Skill) => {
    const value = newSkill[category].trim();
    if (value) {
      skills.add(category, value);
      setNewSkill((prev) => ({ ...prev, [category]: "" }));
    }
  };

  const handleDragOver = (
    e: React.DragEvent,
    category: keyof Skill,
    index: number,
  ) => {
    e.preventDefault();
    if (
      !draggedItem ||
      draggedItem.category !== category ||
      draggedItem.index === index
    )
      return;

    const items = [...skills.data[category]];
    const [removed] = items.splice(draggedItem.index, 1);
    items.splice(index, 0, removed);
    skills.setCategory(category, items);
    setDraggedItem({ category, index });
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, category: keyof Skill) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(category);
    }
  };

  const categories: { key: keyof Skill; label: string }[] = [
    { key: "languages", label: "Languages" },
    { key: "frameworks", label: "Frameworks" },
    { key: "tools", label: "Tools" },
    { key: "awards", label: "Awards" },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map(({ key: category, label }) => (
          <div key={category} className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder={`Add ${label.toLowerCase()}...`}
                value={newSkill[category]}
                onChange={(e) =>
                  setNewSkill((prev) => ({ ...prev, [category]: e.target.value }))
                }
                onKeyDown={(e) => handleKeyDown(e, category)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSkill(category)}
              >
                Add
              </Button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {skills.data[category].map((item, index) => (
                <li
                  key={`${category}-${index}`}
                  draggable
                  onDragStart={() => setDraggedItem({ category, index })}
                  onDragOver={(e) => handleDragOver(e, category, index)}
                  onDragEnd={handleDragEnd}
                  className="px-2 py-1 text-sm bg-muted rounded-md cursor-grab"
                >
                  {item}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-1 align-middle"
                    onClick={() => skills.remove(category, index)}
                    aria-label={`Remove ${item}`}
                  >
                    ×
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
