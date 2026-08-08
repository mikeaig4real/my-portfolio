"use client";

import React from "react";
import { motion } from "framer-motion";
import { nanoid } from "nanoid";
import { SkillGroup } from "@/types/portfolio";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { InlineText } from "@/components/inline/InlineText";
import {
  DeleteEdgeControl,
  AddEdgeControl,
} from "@/components/inline/ItemEdgeControls";

interface TechStackCardProps {
  skills: SkillGroup[];
  accentColor?: string;
  cardTitle?: string;
  onUpdateCardTitle?: (newTitle: string) => void;
  isEditingActive?: boolean;
  onUpdateSkills?: (skills: SkillGroup[]) => void;
}

export const TechStackCard: React.FC<TechStackCardProps> = ({
  skills,
  accentColor = "#facc15",
  cardTitle,
  onUpdateCardTitle,
  isEditingActive = false,
  onUpdateSkills,
}) => {
  const handleUpdateCategory = (groupId: string, newCat: string) => {
    if (!onUpdateSkills) return;
    onUpdateSkills(
      skills.map((s) => (s.id === groupId ? { ...s, category: newCat } : s)),
    );
  };

  const handleUpdateSkill = (groupId: string, sIdx: number, val: string) => {
    if (!onUpdateSkills) return;
    onUpdateSkills(
      skills.map((group) => {
        if (group.id !== groupId) return group;
        const newSkills = [...group.skills];
        newSkills[sIdx] = val;
        return { ...group, skills: newSkills };
      }),
    );
  };

  const handleDeleteSkill = (groupId: string, sIdx: number) => {
    if (!onUpdateSkills) return;
    onUpdateSkills(
      skills.map((group) => {
        if (group.id !== groupId) return group;
        return {
          ...group,
          skills: group.skills.filter((_, idx) => idx !== sIdx),
        };
      }),
    );
  };

  const handleAddSkillToGroup = (groupId: string) => {
    if (!onUpdateSkills) return;
    onUpdateSkills(
      skills.map((group) => {
        if (group.id !== groupId) return group;
        return { ...group, skills: [...group.skills, "New Skill"] };
      }),
    );
  };

  const handleAddGroup = () => {
    if (!onUpdateSkills) return;
    const newGroup: SkillGroup = {
      id: `group_${nanoid()}`,
      category: "New Category",
      skills: ["Skill 1", "Skill 2"],
      badgeColor: "#facc15",
    };
    onUpdateSkills([...skills, newGroup]);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (!onUpdateSkills) return;
    onUpdateSkills(skills.filter((g) => g.id !== groupId));
  };

  return (
    <BrutalCard
      accentColor={accentColor}
      title={cardTitle || "Skills & AI Ecosystem"}
      badge="TECH STACK"
      isEditingActive={isEditingActive}
      onUpdateTitle={onUpdateCardTitle}
      className="h-full flex flex-col justify-between overflow-hidden"
    >
      <div className="overflow-y-auto max-h-95 md:max-h-110 pr-1.5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((group) => (
          <div key={group.id} className="space-y-1.5 relative group/cat">
            {isEditingActive && (
              <div className="absolute -top-2 -right-2 hidden group-hover/cat:block">
                <DeleteEdgeControl
                  onDelete={() => handleDeleteGroup(group.id)}
                  title="Delete category"
                />
              </div>
            )}

            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 border border-black inline-block shrink-0"
                style={{ backgroundColor: group.badgeColor }}
              />
              <InlineText
                value={group.category}
                onChange={(val) => handleUpdateCategory(group.id, val)}
                isEditingActive={isEditingActive}
              />
            </h4>

            <div className="flex flex-wrap gap-1.5 items-center">
              {group.skills.map((skill, sIdx) => (
                <motion.div
                  key={sIdx}
                  whileHover={{ scale: 1.05 }}
                  className="relative group/skill inline-flex items-center"
                >
                  <span
                    className="px-2 py-1 text-xs font-mono font-bold text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
                    style={{ backgroundColor: group.badgeColor }}
                  >
                    <InlineText
                      value={skill}
                      onChange={(val) => handleUpdateSkill(group.id, sIdx, val)}
                      isEditingActive={isEditingActive}
                    />
                  </span>

                  {isEditingActive && (
                    <span className="ml-0.5 hidden group-hover/skill:inline-block">
                      <DeleteEdgeControl
                        onDelete={() => handleDeleteSkill(group.id, sIdx)}
                      />
                    </span>
                  )}
                </motion.div>
              ))}

              {isEditingActive && (
                <button
                  onClick={() => handleAddSkillToGroup(group.id)}
                  className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white text-black border border-black hover:bg-yellow-200 cursor-pointer"
                >
                  + Skill
                </button>
              )}
            </div>
          </div>
        ))}
        </div>
      </div>

      {isEditingActive && (
        <div className="pt-2">
          <AddEdgeControl onAdd={handleAddGroup} label="Add Skill Category" />
        </div>
      )}
    </BrutalCard>
  );
};
