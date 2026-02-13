"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BuilderHeader,
  PersonalInfoCard,
  ExperienceSection,
  EducationSection,
  ProjectsSection,
  SkillsSection,
  BulletLibrary,
} from "@/components/ResumeBuilder";
import { useResumeBuilder } from "@/components/ResumeBuilder/hooks/useResumeBuilder";
import type { Experience, Project } from "@/lib/types";
import { Building2, FolderKanban } from "lucide-react";

export default function ResumeBuilderPage() {
  const builder = useResumeBuilder();

  return (
    <div className="min-h-screen bg-background flex flex-col dither-overlay">
      <BuilderHeader
        name={builder.header.name}
        onNameChange={builder.header.onNameChange}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto border-r border-border">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6 max-w-3xl">
              <PersonalInfoCard
                resume={builder.resume}
                onUpdate={builder.updateField}
              />
              <ExperienceSection
                experiences={builder.experience.list}
                expandedId={builder.expandedExperience}
                onSelect={builder.selectExperience}
                onAdd={builder.experience.add}
                onUpdate={builder.experience.update}
                onRemove={builder.experience.remove}
                onRemoveBullet={builder.experience.removeBullet}
                onSwitchBulletVariant={builder.experience.switchBulletVariant}
              />
              <ProjectsSection
                projects={builder.project.list}
                expandedId={builder.expandedProject}
                onSelect={builder.selectProject}
                onAdd={builder.project.add}
                onUpdate={builder.project.update}
                onRemove={builder.project.remove}
                onRemoveBullet={builder.project.removeBullet}
                onSwitchBulletVariant={builder.project.switchBulletVariant}
              />
              <EducationSection
                education={builder.education.list}
                onAdd={builder.education.add}
                onUpdate={builder.education.update}
                onRemove={builder.education.remove}
              />
              <SkillsSection skills={builder.skills} />
            </div>
          </ScrollArea>
        </div>

        <div className="w-[420px] shrink-0 overflow-hidden flex flex-col bg-muted/20 dither-pink">
          {builder.activePanel === "experience" ? (
            <BulletLibrary<Experience>
              selected={builder.selectedExperience ?? null}
              all={builder.resume.experiences}
              headerTitle="Role Bullet Library"
              getSubtitle={(e) => `${e.title} at ${e.company || "Company"}`}
              emptyState={{
                icon: (
                  <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                ),
                title: "Select a role to manage bullets",
                description:
                  "Click on an experience in the left panel to view and edit its bullet library.",
              }}
              onAddToResume={(conceptId, variantId) => {
                if (builder.expandedExperience) {
                  builder.experience.addBullet(
                    builder.expandedExperience,
                    conceptId,
                    variantId,
                  );
                }
              }}
              onUpdateConcepts={(concepts) => {
                if (builder.expandedExperience) {
                  builder.experience.setBulletOptions(
                    builder.expandedExperience,
                    concepts,
                  );
                }
              }}
              onCopyFromOther={(concept) => {
                if (builder.expandedExperience) {
                  builder.experience.copyConcept(
                    builder.expandedExperience,
                    concept,
                  );
                }
              }}
            />
          ) : builder.activePanel === "project" ? (
            <BulletLibrary<Project>
              selected={builder.selectedProject ?? null}
              all={builder.resume.projects}
              headerTitle="Project Bullet Library"
              getSubtitle={(p) => p.title || "Untitled Project"}
              emptyState={{
                icon: (
                  <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
                ),
                title: "Select a project to manage bullets",
                description:
                  "Click on a project in the left panel to view and edit its bullet library.",
              }}
              onAddToResume={(conceptId, variantId) => {
                if (builder.expandedProject) {
                  builder.project.addBullet(
                    builder.expandedProject,
                    conceptId,
                    variantId,
                  );
                }
              }}
              onUpdateConcepts={(concepts) => {
                if (builder.expandedProject) {
                  builder.project.setBulletOptions(
                    builder.expandedProject,
                    concepts,
                  );
                }
              }}
              onCopyFromOther={(concept) => {
                if (builder.expandedProject) {
                  builder.project.copyConcept(
                    builder.expandedProject,
                    concept,
                  );
                }
              }}
            />
          ) : (
            <div className="flex flex-col h-full items-center justify-center p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Select an experience or project to manage bullets.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
