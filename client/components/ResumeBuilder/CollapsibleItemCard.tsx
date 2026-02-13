"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react";

interface CollapsibleItemCardProps {
  title: string;
  subtitle: string;
  expanded: boolean;
  onToggle: () => void;
  onDelete: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  borderClassName?: string;
}

export function CollapsibleItemCard({
  title,
  subtitle,
  expanded,
  onToggle,
  onDelete,
  children,
  borderClassName = "border-border",
}: CollapsibleItemCardProps) {
  return (
    <div
      className={`border rounded-lg overflow-hidden ${
        expanded ? "border-primary" : borderClassName
      }`}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 bg-muted/30 cursor-pointer"
        onClick={onToggle}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
        {expanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </div>
      {expanded && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}
