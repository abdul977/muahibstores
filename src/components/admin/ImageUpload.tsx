import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { imageService } from '../../services/imageService';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
  className?: string;
  required?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onError,
  className = '',
  required = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file
    const validation = imageService.validateImageFile(file);
    if (!validation.valid) {
      onError?.(validation.error || 'Invalid file');
      return;
    }

    try {
      setUploading(true);
      
      // Create preview immediately
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // If there's an existing image, delete it first
      if (value) {
        try {
          await imageService.deleteImage(value);
        } catch (error) {
          console.error('Failed to delete old image:', error);
          // Continue with upload even if deletion fails
        }
      }

      // Upload to Supabase Storage
      const result = await imageService.uploadImage(file);
      
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
      
      // Set the actual uploaded URL
      setPreview(result.url);
      onChange(result.url);
      onError?.(''); // Clear any previous errors
    } catch (error) {
      console.error('Upload error:', error);
      onError?.(error instanceof Error ? error.message : 'Upload failed');
      setPreview(value || ''); // Revert to original value
    } finally {
      setUploading(false);
    }
  }, [onChange, onError, value]);

  const handleRemoveImage = useCallback(async () => {
    if (!preview) return;

    try {
      await imageService.deleteImage(preview);
      setPreview('');
      onChange('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onError?.(''); // Clear any previous errors
    } catch (error) {
      console.error('Failed to remove image:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to remove image');
    }
  }, [onChange, onError, preview]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    } else {
      onError?.('Please drop an image file');
    }
  }, [handleFileSelect, onError]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview */}
      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-sm"
          />
          {!uploading && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
          ${isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <div className="flex flex-col items-center justify-center py-8 px-4">
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-sm text-gray-600">Uploading image...</p>
            </>
          ) : (
            <>
              <div className="p-3 bg-gray-100 rounded-full mb-4">
                {preview ? (
                  <ImageIcon className="h-8 w-8 text-gray-600" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-600" />
                )}
              </div>
              
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {preview ? 'Change image' : 'Upload an image'}
                  {required && !preview && <span className="text-red-500 ml-1">*</span>}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Click to browse or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, WebP or GIF (max 5MB)
                </p>
              </div>
            </>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Upload Progress Indicator */}
      {uploading && (
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Uploading to cloud storage...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
