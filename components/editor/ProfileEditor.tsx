'use client';

import React, { useState } from 'react';
import { Profile } from '@/types/portfolio';
import { BrutalInput, BrutalTextarea } from '@/components/ui/BrutalInput';
import { Upload } from 'lucide-react';

interface ProfileEditorProps {
  profile: Profile;
  onChange: (updatedProfile: Profile) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleTextChange = (field: keyof Profile, value: string) => {
    onChange({ ...profile, [field]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        onChange({ ...profile, avatar: data.url });
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-mono font-extrabold uppercase border-b-2 border-black dark:border-white pb-2 text-black dark:text-white flex items-center justify-between">
        <span>⚡ Edit Hero Profile</span>
        <span className="text-xs text-yellow-600 font-normal">Live Sync</span>
      </h3>

      {/* Avatar Image & Upload */}
      <div className="flex items-center gap-4 bg-yellow-100 dark:bg-slate-800 p-3 border-2 border-black dark:border-white">
        <div className="w-16 h-16 border-2 border-black dark:border-white overflow-hidden shrink-0 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-1.5">
          <label className="block text-xs font-mono font-bold uppercase text-black dark:text-white">
            Display Picture
          </label>
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              id="avatar-upload"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="avatar-upload"
              className="px-3 py-1 bg-black text-white text-xs font-mono font-bold uppercase cursor-pointer border border-black shadow-[2px_2px_0px_0px_#facc15] hover:bg-yellow-400 hover:text-black transition-all flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </label>
          </div>
        </div>
      </div>

      <BrutalInput
        label="Avatar Image URL (Optional Direct Link)"
        value={profile.avatar}
        onChange={(e) => handleTextChange('avatar', e.target.value)}
        placeholder="https://..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <BrutalInput
          label="Full Name"
          value={profile.name}
          onChange={(e) => handleTextChange('name', e.target.value)}
        />
        <BrutalInput
          label="Title / Role"
          value={profile.title}
          onChange={(e) => handleTextChange('title', e.target.value)}
        />
      </div>

      <BrutalTextarea
        label="Bio Summary"
        value={profile.bio}
        onChange={(e) => handleTextChange('bio', e.target.value)}
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <BrutalInput
          label="Location"
          value={profile.location}
          onChange={(e) => handleTextChange('location', e.target.value)}
        />
        <BrutalInput
          label="Availability Badge"
          value={profile.availability}
          onChange={(e) => handleTextChange('availability', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <BrutalInput
          label="Email Address"
          value={profile.email}
          onChange={(e) => handleTextChange('email', e.target.value)}
        />
        <BrutalInput
          label="GitHub Profile Link"
          value={profile.githubUrl || ''}
          onChange={(e) => handleTextChange('githubUrl', e.target.value)}
          placeholder="https://github.com/..."
        />
        <BrutalInput
          label="Resume / CV URL"
          value={profile.resumeUrl}
          onChange={(e) => handleTextChange('resumeUrl', e.target.value)}
          placeholder="Uploaded CV URL"
        />
      </div>
    </div>
  );
};
