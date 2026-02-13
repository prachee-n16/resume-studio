"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  BulletOption,
  Education,
  Experience,
  Project,
  Resume,
  Skill,
} from "@/lib/types";
import { defaultResume } from "@/lib/mock-data";
import { generateId } from "../utils/ids";
import { switchSelectedVariant, removeSelectedBullet } from "../utils/bullets";

export function useResumeBuilder(initial: Resume = defaultResume) {
  const [resume, setResume] = useState<Resume>(initial);
  const [expandedExperience, setExpandedExperience] = useState<string | null>(
    () => initial.experiences[0]?.id ?? null,
  );
  const [expandedProject, setExpandedProject] = useState<string | null>(
    () => initial.projects[0]?.id ?? null,
  );
  const activePanel: "project" | "experience" | null = expandedProject
    ? "project"
    : expandedExperience
      ? "experience"
      : null;

  const selectExperience = useCallback((id: string | null) => {
    setExpandedExperience(id);
    if (id) setExpandedProject(null);
  }, []);

  const selectProject = useCallback((id: string | null) => {
    setExpandedProject(id);
    if (id) setExpandedExperience(null);
  }, []);

  const updateField = useCallback(
    <K extends keyof Resume>(field: K, value: Resume[K]) => {
      setResume((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const addExperience = useCallback(() => {
    const newExp: Experience = {
      id: generateId("exp"),
      company: "",
      title: "",
      startDate: "",
      endDate: "",
      tags: [],
      selectedBullets: [],
      bulletOptions: [],
    };
    setResume((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExp],
    }));
    setExpandedExperience(newExp.id);
    setExpandedProject(null);
  }, []);

  const updateExperience = useCallback(
    (id: string, updates: Partial<Experience>) => {
      setResume((prev) => ({
        ...prev,
        experiences: prev.experiences.map((e) =>
          e.id === id ? { ...e, ...updates } : e,
        ),
      }));
    },
    [],
  );

  const removeExperience = useCallback((id: string) => {
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
    setExpandedExperience((prev) => (prev === id ? null : prev));
  }, []);

  const addBulletToExperience = useCallback(
    (expId: string, conceptId: string, variantId: string) => {
      setResume((prev) => {
        const exp = prev.experiences.find((e) => e.id === expId);
        if (!exp) return prev;
        const selectedBullets = [
          ...exp.selectedBullets,
          { optionId: conceptId, variantId },
        ];
        return {
          ...prev,
          experiences: prev.experiences.map((e) =>
            e.id === expId ? { ...e, selectedBullets } : e,
          ),
        };
      });
    },
    [],
  );

  const removeBulletFromExperience = useCallback(
    (expId: string, optionId: string, variantId: string) => {
      setResume((prev) => {
        const exp = prev.experiences.find((e) => e.id === expId);
        if (!exp) return prev;
        const selectedBullets = removeSelectedBullet(
          exp.selectedBullets,
          optionId,
          variantId,
        );
        return {
          ...prev,
          experiences: prev.experiences.map((e) =>
            e.id === expId ? { ...e, selectedBullets } : e,
          ),
        };
      });
    },
    [],
  );

  const switchExperienceBulletVariant = useCallback(
    (expId: string, optionId: string, currentVariantId: string) => {
      setResume((prev) => {
        const exp = prev.experiences.find((e) => e.id === expId);
        if (!exp) return prev;
        const selectedBullets = switchSelectedVariant(
          exp.selectedBullets,
          exp.bulletOptions,
          optionId,
          currentVariantId,
        );
        return {
          ...prev,
          experiences: prev.experiences.map((e) =>
            e.id === expId ? { ...e, selectedBullets } : e,
          ),
        };
      });
    },
    [],
  );

  const setExperienceBulletOptions = useCallback(
    (expId: string, bulletOptions: BulletOption[]) => {
      updateExperience(expId, { bulletOptions });
    },
    [updateExperience],
  );

  const copyConceptToExperience = useCallback(
    (targetExpId: string, concept: BulletOption) => {
      setResume((prev) => {
        const exp = prev.experiences.find((e) => e.id === targetExpId);
        if (!exp) return prev;
        const newConcept: BulletOption = {
          ...concept,
          id: generateId(concept.id),
          variants: concept.variants.map((v) => ({
            ...v,
            id: generateId("v"),
          })),
        };
        return {
          ...prev,
          experiences: prev.experiences.map((e) =>
            e.id === targetExpId
              ? { ...e, bulletOptions: [...e.bulletOptions, newConcept] }
              : e,
          ),
        };
      });
    },
    [],
  );

  const addProject = useCallback(() => {
    const newProj: Project = {
      id: generateId("proj"),
      title: "",
      url: "",
      tags: [],
      selectedBullets: [],
      bulletOptions: [],
    };
    setResume((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj],
    }));
    setExpandedProject(newProj.id);
    setExpandedExperience(null);
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      ),
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
    setExpandedProject((prev) => (prev === id ? null : prev));
  }, []);

  const addBulletToProject = useCallback(
    (projId: string, conceptId: string, variantId: string) => {
      setResume((prev) => {
        const proj = prev.projects.find((p) => p.id === projId);
        if (!proj) return prev;
        const selectedBullets = [
          ...proj.selectedBullets,
          { optionId: conceptId, variantId },
        ];
        return {
          ...prev,
          projects: prev.projects.map((p) =>
            p.id === projId ? { ...p, selectedBullets } : p,
          ),
        };
      });
    },
    [],
  );

  const removeBulletFromProject = useCallback(
    (projId: string, optionId: string, variantId: string) => {
      setResume((prev) => {
        const proj = prev.projects.find((p) => p.id === projId);
        if (!proj) return prev;
        const selectedBullets = removeSelectedBullet(
          proj.selectedBullets,
          optionId,
          variantId,
        );
        return {
          ...prev,
          projects: prev.projects.map((p) =>
            p.id === projId ? { ...p, selectedBullets } : p,
          ),
        };
      });
    },
    [],
  );

  const setProjectBulletOptions = useCallback(
    (projId: string, bulletOptions: BulletOption[]) => {
      updateProject(projId, { bulletOptions });
    },
    [updateProject],
  );

  const copyConceptToProject = useCallback(
    (targetProjId: string, concept: BulletOption) => {
      setResume((prev) => {
        const proj = prev.projects.find((p) => p.id === targetProjId);
        if (!proj) return prev;
        const newConcept: BulletOption = {
          ...concept,
          id: generateId(concept.id),
          variants: concept.variants.map((v) => ({
            ...v,
            id: generateId("v"),
          })),
        };
        return {
          ...prev,
          projects: prev.projects.map((p) =>
            p.id === targetProjId
              ? { ...p, bulletOptions: [...p.bulletOptions, newConcept] }
              : p,
          ),
        };
      });
    },
    [],
  );

  const switchProjectBulletVariant = useCallback(
    (projId: string, optionId: string, currentVariantId: string) => {
      setResume((prev) => {
        const proj = prev.projects.find((p) => p.id === projId);
        if (!proj) return prev;
        const selectedBullets = switchSelectedVariant(
          proj.selectedBullets,
          proj.bulletOptions,
          optionId,
          currentVariantId,
        );
        return {
          ...prev,
          projects: prev.projects.map((p) =>
            p.id === projId ? { ...p, selectedBullets } : p,
          ),
        };
      });
    },
    [],
  );

  const addEducation = useCallback(() => {
    const education: Education = {
      id: generateId("edu"),
      school: "",
      degree: "",
      description: "",
      field: "",
      graduationDate: "",
    };
    setResume((prev) => ({
      ...prev,
      education: [...prev.education, education],
    }));
  }, []);

  const updateEducation = useCallback(
    (id: string, updates: Partial<Education>) => {
      setResume((prev) => ({
        ...prev,
        education: prev.education.map((e) =>
          e.id === id ? { ...e, ...updates } : e,
        ),
      }));
    },
    [],
  );

  const removeEducation = useCallback((id: string) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  }, []);

  const addSkill = useCallback((category: keyof Skill, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setResume((prev) => {
      if (prev.skills[category].includes(trimmed)) return prev;
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], trimmed],
        },
      };
    });
  }, []);

  const removeSkill = useCallback((category: keyof Skill, index: number) => {
    setResume((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index),
      },
    }));
  }, []);

  const setSkillCategory = useCallback(
    (category: keyof Skill, items: string[]) => {
      setResume((prev) => ({
        ...prev,
        skills: { ...prev.skills, [category]: items },
      }));
    },
    [],
  );

  const selectedExperience = useMemo(
    () => resume.experiences.find((e) => e.id === expandedExperience) ?? null,
    [resume.experiences, expandedExperience],
  );

  const selectedProject = useMemo(
    () => resume.projects.find((p) => p.id === expandedProject) ?? null,
    [resume.projects, expandedProject],
  );

  return {
    resume,
    updateField,
    expandedExperience,
    expandedProject,
    activePanel,
    selectExperience,
    selectProject,
    selectedExperience,
    selectedProject,
    experience: {
      list: resume.experiences,
      add: addExperience,
      update: updateExperience,
      remove: removeExperience,
      addBullet: addBulletToExperience,
      removeBullet: removeBulletFromExperience,
      switchBulletVariant: switchExperienceBulletVariant,
      setBulletOptions: setExperienceBulletOptions,
      copyConcept: copyConceptToExperience,
    },
    project: {
      list: resume.projects,
      add: addProject,
      update: updateProject,
      remove: removeProject,
      addBullet: addBulletToProject,
      removeBullet: removeBulletFromProject,
      switchBulletVariant: switchProjectBulletVariant,
      setBulletOptions: setProjectBulletOptions,
      copyConcept: copyConceptToProject,
    },
    education: {
      list: resume.education,
      add: addEducation,
      update: updateEducation,
      remove: removeEducation,
    },
    skills: {
      data: resume.skills,
      add: addSkill,
      remove: removeSkill,
      setCategory: setSkillCategory,
    },
    header: {
      name: resume.name,
      onNameChange: (value: string) => updateField("name", value),
    },
  };
}
