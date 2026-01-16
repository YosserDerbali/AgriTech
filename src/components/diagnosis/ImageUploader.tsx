import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
}

export function ImageUploader({ onImageSelect, selectedImage, onClear }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (file: File) => {
      if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    },
    [onImageSelect]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileChange(file);
    },
    [handleFileChange]
  );

  const handleClear = () => {
    onClear();
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  if (previewUrl) {
    return (
      <div className="relative rounded-lg overflow-hidden animate-scale-in">
        <img
          src={previewUrl}
          alt="Selected plant"
          className="w-full aspect-[4/3] object-cover"
        />
        <button
          onClick={handleClear}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors shadow-soft"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
          <p className="text-sm font-medium truncate">{selectedImage?.name}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-xl p-8 transition-all',
        isDragOver
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <ImageIcon className="w-8 h-8 text-primary" />
        </div>
        
        <h3 className="font-semibold mb-1">Upload Plant Image</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Take a photo or select from gallery
        </p>

        <div className="flex gap-3">
          <Button
            variant="default"
            onClick={() => cameraInputRef.current?.click()}
            className="gap-2"
          >
            <Camera className="w-4 h-4" />
            Camera
          </Button>
          
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Gallery
          </Button>
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleInputChange}
          className="hidden"
        />
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
