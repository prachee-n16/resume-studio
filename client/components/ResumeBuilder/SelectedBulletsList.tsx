"use client";

import { Button } from "@/components/ui/button";
import { GripVertical, RefreshCw, X } from "lucide-react";
import type { BulletOption } from "@/lib/types";
import {
  getBulletText,
  getVariantCount,
  type SelectedBullet,
} from "./utils/bullets";

interface SelectedBulletsListProps {
  selectedBullets: SelectedBullet[];
  bulletOptions: BulletOption[];
  onRemove: (optionId: string, variantId: string) => void;
  onSwitchVariant: (optionId: string, currentVariantId: string) => void;
}

export function SelectedBulletsList({
  selectedBullets,
  bulletOptions,
  onRemove,
  onSwitchVariant,
}: SelectedBulletsListProps) {
  if (selectedBullets.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-3 border border-dashed border-border rounded-md">
        Add bullets from the library on the right
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {selectedBullets.map((bullet) => {
        const text = getBulletText(
          bulletOptions,
          bullet.optionId,
          bullet.variantId,
        );
        const variantCount = getVariantCount(bulletOptions, bullet.optionId);
        return (
          <div
            key={`${bullet.optionId}-${bullet.variantId}`}
            className="flex items-start gap-2 p-2 bg-muted/30 rounded-md group"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5 cursor-grab shrink-0" />
            <p className="flex-1 text-sm leading-relaxed">{text}</p>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              {variantCount > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() =>
                    onSwitchVariant(bullet.optionId, bullet.variantId)
                  }
                  title="Switch variant"
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onRemove(bullet.optionId, bullet.variantId)}
                title="Remove"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
