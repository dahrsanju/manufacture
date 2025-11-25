'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  X,
  Upload,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  onUpload?: (files: FileList) => void;
  onDelete?: (imageId: string) => void;
  onSetPrimary?: (imageId: string) => void;
  editable?: boolean;
}

export function ProductImageGallery({
  images,
  onUpload,
  onDelete,
  onSetPrimary,
  editable = false,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const selectedImage = images[selectedIndex];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload?.(e.target.files);
    }
  };

  if (images.length === 0) {
    return (
      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">No images available</p>
        {editable && (
          <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            <Upload className="h-4 w-4 mr-2" />
            Upload Images
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
        <img
          src={selectedImage?.url || '/placeholder.png'}
          alt={selectedImage?.alt || 'Product image'}
          className={`w-full h-full object-contain transition-transform ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="p-2 bg-background/80 rounded-full"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          {editable && (
            <button
              onClick={() => onDelete?.(selectedImage.id)}
              className="p-2 bg-background/80 rounded-full text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Primary Badge */}
        {selectedImage?.isPrimary && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Primary
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setSelectedIndex(index)}
            className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
              index === selectedIndex ? 'border-primary' : 'border-transparent'
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            {image.isPrimary && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <span className="text-[8px] text-primary font-bold">PRIMARY</span>
              </div>
            )}
          </button>
        ))}

        {editable && (
          <label className="flex-shrink-0 w-16 h-16 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:bg-muted">
            <Upload className="h-5 w-5 text-muted-foreground" />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Set Primary Button */}
      {editable && selectedImage && !selectedImage.isPrimary && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSetPrimary?.(selectedImage.id)}
        >
          Set as Primary Image
        </Button>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 p-2 text-white hover:bg-white/20 rounded-full"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <img
            src={selectedImage?.url}
            alt={selectedImage?.alt}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 p-2 text-white hover:bg-white/20 rounded-full"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="absolute bottom-4 text-white text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
