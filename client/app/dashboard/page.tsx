"use client";
import { DitherBackground } from "@/components/DitheringBackground";
import { useState } from "react";
import { Resume } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Plus,
  MoreVertical,
  Eye,
  Pencil,
  Copy,
  Trash2,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface DashboardProps {}

export default function DashboardPage({}: DashboardProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredResumes = resumes.filter(
    (resume) =>
      resume.name.toLowerCase().includes(search.toLowerCase()) ||
      resume.tags.some((tag) =>
        tag.toLowerCase().includes(search.toLowerCase()),
      ),
  );

  function renderEmptyState() {
    return (
      <div className="border border-dashed border-border rounded-lg p-12 text-center">
        <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-medium mb-1">No resumes found</h3>
        <p className="text-sm text-muted-foreground">
          {search
            ? "Try a different search term."
            : "Create your first resume to get started."}
        </p>
      </div>
    );
  }

  function renderGridResumes() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResumes.map((resume) => (
          <div
            key={resume.id}
            className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0">
                <p className="font-medium truncate">{resume.name}</p>
                <p className="text-sm text-muted-foreground">
                  Edited {formatDate(resume.lastEdited)}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {resume.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderListResumes() {
    return (
      <div className="space-y-2">
        {filteredResumes.map((resume) => (
          <div
            key={resume.id}
            className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">{resume.name}</p>
                <p className="text-sm text-muted-foreground">
                  Edited {formatDate(resume.lastEdited)}
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1.5">
              {resume.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
              {resume.tags.length > 3 && (
                <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                  +{resume.tags.length - 3}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderResumes() {
    if (filteredResumes.length === 0) return renderEmptyState();
    return viewMode === "grid" ? renderGridResumes() : renderListResumes();
  }

  return (
    <>
      <DitherBackground />
      <div className="min-h-screen bg-background dither-overlay">
        <header className="border-b border-border dither-gradient">
          <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <span className="font-semibold">Resume Builder</span>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold">Your Resumes</h1>
              <p className="text-muted-foreground mt-1">
                {resumes.length} resume{resumes.length !== 1 ? "s" : ""} saved
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Resume
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resumes..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center border border-border rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {renderResumes()}
        </main>
      </div>
    </>
  );
}
