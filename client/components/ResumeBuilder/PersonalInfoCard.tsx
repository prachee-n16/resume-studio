"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Resume } from "@/lib/types";

interface PersonalInfoCardProps {
  resume: Pick<
    Resume,
    "name" | "email" | "phone" | "location" | "linkedin" | "github"
  >;
  onUpdate: <K extends keyof Resume>(field: K, value: Resume[K]) => void;
}

export function PersonalInfoCard({ resume, onUpdate }: PersonalInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Input
          placeholder="Full Name"
          value={resume.name}
          onChange={(e) => onUpdate("name", e.target.value)}
        />
        <Input
          placeholder="Email"
          type="email"
          value={resume.email}
          onChange={(e) => onUpdate("email", e.target.value)}
        />
        <Input
          placeholder="Phone"
          value={resume.phone}
          onChange={(e) => onUpdate("phone", e.target.value)}
        />
        <Input
          placeholder="Location"
          value={resume.location}
          onChange={(e) => onUpdate("location", e.target.value)}
        />
        <Input
          placeholder="LinkedIn URL"
          value={resume.linkedin}
          onChange={(e) => onUpdate("linkedin", e.target.value)}
        />
        <Input
          placeholder="GitHub URL"
          value={resume.github}
          onChange={(e) => onUpdate("github", e.target.value)}
        />
      </CardContent>
    </Card>
  );
}
