'use client';

import React from 'react';
import { Plus, X, Palette } from 'lucide-react';

interface DeleteEdgeControlProps {
  onDelete: () => void;
  title?: string;
}

export const DeleteEdgeControl: React.FC<DeleteEdgeControlProps> = ({
  onDelete,
  title = 'Delete item',
}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      title={title}
      className="p-1 bg-red-500 text-white border border-black hover:bg-red-600 cursor-pointer shadow-[1px_1px_0px_0px_#000] z-20"
    >
      <X className="w-3.5 h-3.5 stroke-3" />
    </button>
  );
};

interface AddEdgeControlProps {
  onAdd: () => void;
  label?: string;
}

export const AddEdgeControl: React.FC<AddEdgeControlProps> = ({
  onAdd,
  label = 'Add Item',
}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onAdd();
      }}
      className="px-2 py-1 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black font-mono font-extrabold text-xs uppercase shadow-[2px_2px_0px_0px_#000] cursor-pointer flex items-center gap-1 my-2 z-20"
    >
      <Plus className="w-3.5 h-3.5 stroke-[3]" />
      <span>{label}</span>
    </button>
  );
};

interface ColorSwatchPickerProps {
  currentColor: string;
  onChangeColor: (color: string) => void;
}

const SWATCHES = ['#facc15', '#ff70a6', '#70d6ff', '#a7f3d0', '#d8b4fe', '#ff9f1c', '#18181b', '#064e3b'];

export const ColorSwatchPicker: React.FC<ColorSwatchPickerProps> = ({
  currentColor,
  onChangeColor,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative inline-block z-20">
      <button
        onClick={() => setOpen(!open)}
        title="Change Accent Color"
        className="p-1 border border-black text-black cursor-pointer shadow-[1px_1px_0px_0px_#000] flex items-center gap-1"
        style={{ backgroundColor: currentColor }}
      >
        <Palette className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>

      {open && (
        <div className="absolute right-0 top-7 bg-white dark:bg-slate-800 border-2 border-black p-1.5 flex gap-1 shadow-[3px_3px_0px_0px_#000] z-30">
          {SWATCHES.map((c) => (
            <button
              key={c}
              onClick={() => {
                onChangeColor(c);
                setOpen(false);
              }}
              className="w-4 h-4 border border-black cursor-pointer hover:scale-125 transition-all"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
