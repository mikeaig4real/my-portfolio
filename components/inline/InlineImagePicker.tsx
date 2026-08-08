'use client';

import React, { useRef, useState } from 'react';
import { Camera, Trash2, UploadCloud, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface InlineImagePickerProps {
  imageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
  isEditingActive?: boolean;
  className?: string;
  alt?: string;
  placeholderText?: string;
  priority?: boolean;
}

export const InlineImagePicker: React.FC<InlineImagePickerProps> = ({
  imageUrl,
  onImageUploaded,
  onImageRemoved,
  isEditingActive = false,
  className = '',
  alt = 'Portfolio Image',
  placeholderText = 'Upload Image',
  priority = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        onImageUploaded(data.url);
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch {
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!isEditingActive) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await uploadFile(file);
    }
  };

  if (!isEditingActive) {
    if (!imageUrl) return null;
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={imageUrl}
          alt={alt}
          fill
          unoptimized
          priority={priority}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`group relative overflow-hidden transition-all ${
        isDragOver ? 'ring-4 ring-yellow-400 scale-[1.02]' : ''
      } ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          unoptimized
          priority={priority}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className="w-full h-full min-h-25 bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-400 dark:border-slate-600 flex flex-col items-center justify-center p-3 text-center">
          <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
          <span className="font-mono text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
            {placeholderText}
          </span>
        </div>
      )}

      {/* Hover Action Overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 z-20">
        {isUploading ? (
          <div className="flex items-center gap-2 text-yellow-300 font-mono text-xs font-bold">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Uploading...</span>
          </div>
        ) : (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              title={imageUrl ? 'Replace Image' : 'Upload Image'}
              className="p-2 bg-yellow-300 text-black border-2 border-black hover:bg-yellow-400 cursor-pointer shadow-[2px_2px_0px_0px_#000] flex items-center justify-center"
            >
              <Camera className="w-4 h-4 stroke-[2.5]" />
            </button>

            {imageUrl && onImageRemoved && (
              <button
                onClick={onImageRemoved}
                title="Remove Image"
                className="p-2 bg-red-500 text-white border-2 border-black hover:bg-red-600 cursor-pointer shadow-[2px_2px_0px_0px_#000] flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
