"use client";

import React from "react";
import { motion } from "framer-motion";
import { nanoid } from "nanoid";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MessageSquare,
  Plus,
  Trash2,
} from "lucide-react";
import { SocialLink } from "@/types/portfolio";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { InlineText } from "@/components/inline/InlineText";
import { InlineLinkPopover } from "@/components/inline/InlineLinkPopover";
import { trackSocialClick } from "@/lib/analyticsTracker";

interface SocialsCardProps {
  socials: SocialLink[];
  accentColor?: string;
  cardTitle?: string;
  onUpdateCardTitle?: (newTitle: string) => void;
  isEditingActive?: boolean;
  onUpdateSocials?: (updated: SocialLink[]) => void;
}

export const SocialsCard: React.FC<SocialsCardProps> = ({
  socials,
  accentColor = "#d8b4fe",
  cardTitle,
  onUpdateCardTitle,
  isEditingActive = false,
  onUpdateSocials,
}) => {
  const updateSocialItem = (
    id: string,
    field: keyof SocialLink,
    val: string,
  ) => {
    if (onUpdateSocials) {
      onUpdateSocials(
        socials.map((s) => (s.id === id ? { ...s, [field]: val } : s)),
      );
    }
  };

  const handleAddSocialLink = () => {
    if (!onUpdateSocials) return;
    const newSocial: SocialLink = {
      id: `soc_${nanoid()}`,
      platform: "Website",
      username: "@myhandle",
      url: "https://",
    };
    onUpdateSocials([...socials, newSocial]);
  };

  const handleDeleteSocialLink = (id: string) => {
    if (!onUpdateSocials) return;
    onUpdateSocials(socials.filter((s) => s.id !== id));
  };

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return <Github className="w-4 h-4 stroke-[2.5]" />;
      case "linkedin":
        return <Linkedin className="w-4 h-4 stroke-[2.5]" />;
      case "twitter":
      case "x":
        return <Twitter className="w-4 h-4 stroke-[2.5]" />;
      case "email":
        return <Mail className="w-4 h-4 stroke-[2.5]" />;
      default:
        return <MessageSquare className="w-4 h-4 stroke-[2.5]" />;
    }
  };

  const getBg = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return "bg-yellow-300";
      case "linkedin":
        return "bg-cyan-300";
      case "twitter":
      case "x":
        return "bg-pink-300";
      case "email":
        return "bg-lime-300";
      default:
        return "bg-purple-300";
    }
  };

  return (
    <BrutalCard
      accentColor={accentColor}
      title={cardTitle || "Connect & Links"}
      isEditingActive={isEditingActive}
      onUpdateTitle={onUpdateCardTitle}
      className="h-full flex flex-col justify-between overflow-hidden"
    >
      <div className="overflow-y-auto max-h-95 md:max-h-110 pr-1.5 flex-1 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {socials.map((soc) => (
            <div key={soc.id} className="relative group/soc">
              <motion.a
                href={isEditingActive ? undefined : soc.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => !isEditingActive && trackSocialClick(soc.platform, soc.url)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 p-2 border-2 border-black dark:border-white text-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] transition-all ${getBg(
                  soc.platform,
                )}`}
              >
                {getIcon(soc.platform)}
                <div className="overflow-hidden flex-1">
                  <span className="block text-xs font-mono font-extrabold uppercase">
                    <InlineText
                      value={soc.platform}
                      onChange={(val) =>
                        updateSocialItem(soc.id, "platform", val)
                      }
                      isEditingActive={isEditingActive}
                    />
                  </span>
                  <span className="block text-[10px] font-mono truncate font-medium">
                    <InlineText
                      value={soc.username}
                      onChange={(val) =>
                        updateSocialItem(soc.id, "username", val)
                      }
                      isEditingActive={isEditingActive}
                    />
                  </span>
                </div>
              </motion.a>

              {isEditingActive && (
                <div className="mt-1 flex items-center justify-between gap-1">
                  <InlineLinkPopover
                    label={soc.platform}
                    url={soc.url}
                    variant="yellow"
                    isEditingActive={isEditingActive}
                    onUpdateLink={(newLabel, newUrl) => {
                      if (onUpdateSocials) {
                        onUpdateSocials(
                          socials.map((s) =>
                            s.id === soc.id
                              ? {
                                  ...s,
                                  platform: newLabel || s.platform,
                                  url: newUrl,
                                }
                              : s,
                          ),
                        );
                      }
                    }}
                  />
                  {socials.length > 1 && (
                    <button
                      onClick={() => handleDeleteSocialLink(soc.id)}
                      className="p-1 bg-red-500 text-white border border-black hover:bg-red-600 cursor-pointer shadow-[1px_1px_0px_0px_#000]"
                      title="Delete Social Link"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {isEditingActive && (
          <button
            onClick={handleAddSocialLink}
            className="w-full py-1.5 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black font-mono text-xs font-extrabold uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-3" />Add Social / Contact Link
          </button>
        )}
      </div>
    </BrutalCard>
  );
};
