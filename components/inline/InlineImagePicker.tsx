'use client';

import React, { useRef, useState } from 'react';
import { Camera, Trash2, UploadCloud, Loader2, Link2 } from 'lucide-react';
import Image from 'next/image';
import { showBentoToast } from '@/components/ui/BentoToast';
import { BentoUrlPromptModal } from '@/components/ui/BentoUrlPromptModal';
import { logger } from '@/lib/logger';

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
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    const toastId = showBentoToast.loading(`Uploading ${file.name}...`, 'UPLOADING IMAGE');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      logger.debug('Upload completed API returned data:', data);
      showBentoToast.dismiss(toastId);

      if (data.success && data.url) {
        onImageUploaded(data.url);
        showBentoToast.success('Image uploaded successfully!', 'IMAGE UPLOADED');
      } else {
        showBentoToast.error(data.error || 'Failed to upload image', 'UPLOAD FAILED');
      }
    } catch (err) {
      logger.error('Error during file upload:', err);
      showBentoToast.dismiss(toastId);
      showBentoToast.error('An unexpected error occurred while uploading image.', 'ERROR');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAttachLink = (url: string) => {
    logger.debug('Direct image link attached:', url);
    onImageUploaded(url);
    setIsUrlModalOpen(false);
    showBentoToast.success('Image link attached successfully!', 'LINK ATTACHED');
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
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  return (
    <>
      <BentoUrlPromptModal
        isOpen={isUrlModalOpen}
        title="🔗 Attach Direct Image Link"
        subtitle="Paste an absolute URL link (e.g. Unsplash, Cloudinary, Imgur, or CDN image link) for this card asset."
        placeholder="https://images.unsplash.com/photo-..."
        onClose={() => setIsUrlModalOpen(false)}
        onSubmit={handleAttachLink}
      />

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
            className="object-cover object-top"
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

        {/* Action Overlay: Always visible on mobile/touch screens, hover on desktop */}
        <div className="absolute inset-0 bg-black/60 sm:bg-black/65 backdrop-blur-xs opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 z-10">
          {isUploading ? (
            <div className="flex items-center gap-2 text-yellow-300 font-mono text-xs font-bold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading...</span>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title={imageUrl ? 'Upload File from Disk' : 'Upload Image File'}
                className="p-2 bg-yellow-300 text-black border-2 border-black hover:bg-yellow-400 cursor-pointer shadow-[2px_2px_0px_0px_#000] flex items-center justify-center"
              >
                <Camera className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={() => setIsUrlModalOpen(true)}
                title="Attach Direct Image URL Link"
                className="p-2 bg-cyan-300 text-black border-2 border-black hover:bg-cyan-400 cursor-pointer shadow-[2px_2px_0px_0px_#000] flex items-center justify-center"
              >
                <Link2 className="w-4 h-4 stroke-[2.5]" />
              </button>

              {imageUrl && onImageRemoved && (
                <button
                  type="button"
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
    </>
  );
};
