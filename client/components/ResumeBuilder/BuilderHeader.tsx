"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText, Pencil, Save } from "lucide-react";

interface BuilderHeaderProps {
  name: string;
  onNameChange: (value: string) => void;
}

export function BuilderHeader({ name, onNameChange }: BuilderHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);

  return (
    <header className="border-b border-border shrink-0 dither-gradient">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <div className="h-4 w-px bg-border" />
          {isEditingName ? (
            <Input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) =>
                e.key === "Enter" && setIsEditingName(false)
              }
              className="h-8 w-64"
              autoFocus
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingName(true)}
              className="flex items-center gap-2 text-sm font-medium hover:text-primary"
            >
              {name}
              <Pencil className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            size="sm"
            onClick={async () => {
              const safe = name
                .trim()
                .replace(/[/\\?%*:|"<>]/g, "-")
                .replace(/\s+/g, "_");
              // TODO: generate PDF / export
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate
          </Button>
        </div>
      </div>
    </header>
  );
}
