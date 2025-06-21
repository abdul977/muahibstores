import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { imageService } from '../../services/imageService';
import { ProductMedia } from '../../types/Product';
import { supabase } from '../../lib/supabase';

interface MediaUploadProps {
  value: ProductMedia;
  onChange: (media: ProductMedia) => void;
  onError?: (error: string) => void;
  className?: string;
  required?: boolean;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  value,
  onChange,
  onError,
  className = '',
  required = false
}) => {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const imageInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(async (file: File, index: number) => {
    // Validate image file
    const validation = imageService.validateImageFile(file);
    if (!validation.valid) {
      onError?.(validation.error || 'Invalid image file');
      return;
    }

    try {
      setUploading(prev => ({ ...prev, [`image-${index}`]: true }));
      
      // If there's an existing image at this index, delete it first
      if (value.images[index]) {
        try {
          await imageService.deleteImage(value.images[index]);
        } catch (error) {
          console.error('Failed to delete old image:', error);
          // Continue with upload even if deletion fails
        }
      }

      // Upload to Supabase Storage
      const result = await imageService.uploadImage(file, 'products');
      
      // Update the media object
      const newImages = [...value.images];
      newImages[index] = result.url;
      
      onChange({
        ...value,
        images: newImages
      });
      
      onError?.(''); // Clear any previous errors
    } catch (error) {
      console.error('Image upload error:', error);
      onError?.(error instanceof Error ? error.message : 'Image upload failed');
    } finally {
      setUploading(prev => ({ ...prev, [`image-${index}`]: false }));
    }
  }, [value, onChange, onError]);

  const handleVideoUpload = useCallback(async (file: File) => {
    // Validate video file
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];

    if (!allowedTypes.includes(file.type)) {
      onError?.('Invalid video type. Please upload MP4, WebM, or OGG videos.');
      return;
    }

    if (file.size > maxSize) {
      onError?.('Video file too large. Please upload videos smaller than 50MB.');
      return;
    }

    try {
      setUploading(prev => ({ ...prev, video: true }));

      // If there's an existing video, delete it first
      if (value.video) {
        try {
          await imageService.deleteVideo(value.video);
        } catch (error) {
          console.error('Failed to delete old video:', error);
          // Continue with upload even if deletion fails
        }
      }
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Video upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(data.path);
      
      onChange({
        ...value,
        video: urlData.publicUrl
      });
      
      onError?.(''); // Clear any previous errors
    } catch (error) {
      console.error('Video upload error:', error);
      onError?.(error instanceof Error ? error.message : 'Video upload failed');
    } finally {
      setUploading(prev => ({ ...prev, video: false }));
    }
  }, [value, onChange, onError]);

  const removeImage = useCallback(async (index: number) => {
    try {
      // First remove from UI immediately for better UX
      const newImages = value.images.filter((_, i) => i !== index);
      onChange({
        ...value,
        images: newImages
      });

      // Then try to delete from storage (don't block UI if this fails)
      if (value.images[index]) {
        try {
          await imageService.deleteImage(value.images[index]);
        } catch (deleteError) {
          console.warn('Failed to delete image from storage:', deleteError);
          // Don't show error to user since image is already removed from UI
        }
      }

      onError?.(''); // Clear any previous errors
    } catch (error) {
      console.error('Failed to remove image:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to remove image');
    }
  }, [value, onChange, onError]);

  const removeVideo = useCallback(async () => {
    try {
      // First remove from UI immediately for better UX
      onChange({
        ...value,
        video: undefined
      });

      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }

      // Then try to delete from storage (don't block UI if this fails)
      if (value.video) {
        try {
          await imageService.deleteVideo(value.video);
        } catch (deleteError) {
          console.warn('Failed to delete video from storage:', deleteError);
          // Don't show error to user since video is already removed from UI
        }
      }

      onError?.(''); // Clear any previous errors
    } catch (error) {
      console.error('Failed to remove video:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to remove video');
    }
  }, [value, onChange, onError]);

  const handleDragOver = useCallback((e: React.DragEvent, target: string) => {
    e.preventDefault();
    setDragTarget(target);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragTarget(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, target: string, index?: number) => {
    e.preventDefault();
    setDragTarget(null);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (!file) return;

    if (target === 'image' && typeof index === 'number') {
      if (file.type.startsWith('image/')) {
        handleImageUpload(file, index);
      } else {
        onError?.('Please drop an image file');
      }
    } else if (target === 'video') {
      if (file.type.startsWith('video/')) {
        handleVideoUpload(file);
      } else {
        onError?.('Please drop a video file');
      }
    }
  }, [handleImageUpload, handleVideoUpload, onError]);

  const openImageDialog = (index: number) => {
    imageInputRefs.current[index]?.click();
  };

  const openVideoDialog = () => {
    videoInputRef.current?.click();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Images Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Product Images (up to 3)
          {required && value.images.length === 0 && <span className="text-red-500 ml-1">*</span>}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="relative">
              {value.images[index] ? (
                // Existing image preview
                <div className="relative group">
                  <img
                    src={value.images[index]}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  {/* Delete button - positioned to avoid overlap */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                    title="Delete image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {/* Replace button - positioned to avoid delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openImageDialog(index);
                    }}
                    className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                    title="Replace image"
                  >
                    <div className="flex items-center space-x-1">
                      <Upload className="h-4 w-4" />
                      <span className="text-xs font-medium">Replace</span>
                    </div>
                  </button>
                </div>
              ) : (
                // Upload area
                <div
                  onDragOver={(e) => handleDragOver(e, 'image')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'image', index)}
                  onClick={() => openImageDialog(index)}
                  className={`
                    relative border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 h-48 flex flex-col items-center justify-center
                    ${dragTarget === 'image' 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
                    ${uploading[`image-${index}`] ? 'pointer-events-none opacity-50' : ''}
                  `}
                >
                  {uploading[`image-${index}`] ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Image {index + 1}
                      </p>
                      <p className="text-xs text-gray-500 text-center">
                        Click or drag to upload<br />
                        PNG, JPG, WebP (max 5MB)
                      </p>
                    </>
                  )}
                </div>
              )}
              
              {/* Hidden file input */}
              <input
                ref={(el) => imageInputRefs.current[index] = el}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, index);
                }}
                className="hidden"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Video Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Product Video (optional)
        </h3>
        
        {value.video ? (
          // Existing video preview
          <div className="relative group">
            <video
              src={value.video}
              controls
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
            {/* Delete button - positioned to avoid overlap */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeVideo();
              }}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
              title="Delete video"
            >
              <X className="h-4 w-4" />
            </button>
            {/* Replace button - positioned to avoid delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openVideoDialog();
              }}
              className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
              title="Replace video"
            >
              <div className="flex items-center space-x-1">
                <Upload className="h-4 w-4" />
                <span className="text-xs font-medium">Replace</span>
              </div>
            </button>
          </div>
        ) : (
          // Upload area
          <div
            onDragOver={(e) => handleDragOver(e, 'video')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'video')}
            onClick={openVideoDialog}
            className={`
              relative border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 h-48 flex flex-col items-center justify-center
              ${dragTarget === 'video' 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }
              ${uploading.video ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            {uploading.video ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Uploading video...</p>
              </div>
            ) : (
              <>
                <Video className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Upload Video
                </p>
                <p className="text-xs text-gray-500 text-center">
                  Click or drag to upload<br />
                  MP4, WebM, OGG (max 50MB)
                </p>
              </>
            )}
          </div>
        )}
        
        {/* Hidden video input */}
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleVideoUpload(file);
          }}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default MediaUpload;
