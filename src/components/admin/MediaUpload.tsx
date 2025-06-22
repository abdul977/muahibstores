import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Video, Plus, GripVertical, Youtube, Link } from 'lucide-react';
import { imageService } from '../../services/imageService';
import { EnhancedProductMedia, MediaItem, MediaUtils } from '../../types/Product';

interface EnhancedMediaUploadProps {
  value: EnhancedProductMedia;
  onChange: (media: EnhancedProductMedia) => void;
  onError?: (error: string) => void;
  className?: string;
  required?: boolean;
}

const EnhancedMediaUpload: React.FC<EnhancedMediaUploadProps> = ({
  value,
  onChange,
  onError,
  className = '',
  required = false
}) => {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add new media item
  const addMediaItem = useCallback((type: 'image' | 'video' | 'youtube') => {
    const newItem: MediaItem = {
      id: MediaUtils.generateMediaId(),
      type,
      url: '',
      order: value.items.length
    };

    const updatedMedia: EnhancedProductMedia = {
      ...value,
      items: [...value.items, newItem]
    };

    onChange(updatedMedia);
  }, [value, onChange]);

  // Remove media item
  const removeMediaItem = useCallback(async (itemId: string) => {
    const item = value.items.find(i => i.id === itemId);
    if (item && (item.type === 'image' || item.type === 'video')) {
      try {
        if (item.type === 'image') {
          await imageService.deleteImage(item.url);
        } else {
          await imageService.deleteVideo(item.url);
        }
      } catch (error) {
        console.error('Failed to delete media:', error);
      }
    }

    const updatedItems = value.items
      .filter(i => i.id !== itemId)
      .map((item, index) => ({ ...item, order: index }));

    onChange({
      ...value,
      items: updatedItems
    });
  }, [value, onChange]);

  // Handle file upload (image or video)
  const handleFileUpload = useCallback(async (file: File, itemId: string) => {
    const item = value.items.find(i => i.id === itemId);
    if (!item) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      onError?.('Please upload an image or video file');
      return;
    }

    try {
      setUploading(prev => ({ ...prev, [itemId]: true }));

      let result;
      if (isImage) {
        const validation = imageService.validateImageFile(file);
        if (!validation.valid) {
          onError?.(validation.error || 'Invalid image file');
          return;
        }
        result = await imageService.uploadImage(file, 'products');
      } else {
        result = await imageService.uploadVideo(file, 'products');
      }

      // Update the media item
      const updatedItems = value.items.map(i =>
        i.id === itemId
          ? { ...i, url: result.url, type: isImage ? 'image' as const : 'video' as const }
          : i
      );

      onChange({
        ...value,
        items: updatedItems
      });

      onError?.(''); // Clear any previous errors
    } catch (error) {
      console.error('File upload error:', error);
      onError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(prev => ({ ...prev, [itemId]: false }));
    }
  }, [value, onChange, onError]);

  // Handle YouTube URL addition
  const handleYouTubeAdd = useCallback(() => {
    if (!youtubeUrl.trim()) {
      onError?.('Please enter a YouTube URL');
      return;
    }

    const validation = imageService.validateYouTubeUrl(youtubeUrl);
    if (!validation.valid) {
      onError?.(validation.error || 'Invalid YouTube URL');
      return;
    }

    const newItem: MediaItem = {
      id: MediaUtils.generateMediaId(),
      type: 'youtube',
      url: youtubeUrl,
      order: value.items.length,
      thumbnail: validation.thumbnailUrl
    };

    onChange({
      ...value,
      items: [...value.items, newItem]
    });

    setYoutubeUrl('');
    setShowYoutubeInput(false);
    onError?.(''); // Clear any previous errors
  }, [youtubeUrl, value, onChange, onError]);

  // Reorder media items
  const reorderItems = useCallback((fromIndex: number, toIndex: number) => {
    const items = [...value.items];
    const [movedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, movedItem);

    // Update order values
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    onChange({
      ...value,
      items: reorderedItems
    });
  }, [value, onChange]);

  // Handle drag and drop for reordering
  const handleDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    e.stopPropagation();
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedItem) {
      e.dataTransfer.dropEffect = 'move';
    }
  }, [draggedItem]);

  const handleDrop = useCallback((e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem || draggedItem === targetItemId) {
      setDraggedItem(null);
      return;
    }

    const fromIndex = value.items.findIndex(item => item.id === draggedItem);
    const toIndex = value.items.findIndex(item => item.id === targetItemId);

    if (fromIndex !== -1 && toIndex !== -1) {
      reorderItems(fromIndex, toIndex);
    }

    setDraggedItem(null);
  }, [draggedItem, value.items, reorderItems]);

  // Handle drag and drop for file uploads
  const handleFileDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragTarget('file');
  }, []);

  const handleFileDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragTarget(null);
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragTarget(null);

    // Only handle file drops, not item reordering
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      handleFileUpload(file, itemId);
    }
  }, [handleFileUpload]);

  // Open file dialog
  const openFileDialog = useCallback((itemId: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.dataset.itemId = itemId;
      fileInputRef.current.click();
    }
  }, []);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, itemId);
    }
    // Reset the input
    e.target.value = '';
  }, [handleFileUpload]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Product Media
          {required && value.items.length === 0 && <span className="text-red-500 ml-1">*</span>}
        </h3>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => addMediaItem('image')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Image
          </button>
          <button
            type="button"
            onClick={() => addMediaItem('video')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Video
          </button>
          <button
            type="button"
            onClick={() => setShowYoutubeInput(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add YouTube
          </button>
        </div>
      </div>

      {/* YouTube URL Input */}
      {showYoutubeInput && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <Youtube className="h-5 w-5 text-red-600" />
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Enter YouTube video URL..."
              className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={handleYouTubeAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowYoutubeInput(false);
                setYoutubeUrl('');
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Media Items */}
      <div className="space-y-4">
        {value.items.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No media added</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding images, videos, or YouTube links
            </p>
          </div>
        ) : (
          value.items
            .sort((a, b) => a.order - b.order)
            .map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item.id)}
                className={`
                  relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200
                  ${draggedItem === item.id ? 'opacity-50' : ''}
                `}
              >
                {/* Drag Handle */}
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-move">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                </div>

                <div className="ml-8 flex items-center space-x-4">
                  {/* Media Preview */}
                  <div className="flex-shrink-0">
                    {item.url ? (
                      <div className="relative group">
                        {item.type === 'image' && (
                          <img
                            src={item.url}
                            alt="Media preview"
                            className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                          />
                        )}
                        {item.type === 'video' && (
                          <video
                            src={item.url}
                            className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                          />
                        )}
                        {item.type === 'youtube' && (
                          <div className="h-20 w-20 bg-red-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <Youtube className="h-8 w-8 text-red-600" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          // Only handle file drag over if we're not dragging a media item
                          if (!draggedItem) {
                            handleFileDragOver(e);
                          }
                        }}
                        onDragLeave={(e) => {
                          if (!draggedItem) {
                            handleFileDragLeave(e);
                          }
                        }}
                        onDrop={(e) => {
                          // Only handle file drops if we're not reordering
                          if (!draggedItem && e.dataTransfer.files.length > 0) {
                            handleFileDrop(e, item.id);
                          }
                        }}
                        onClick={() => openFileDialog(item.id)}
                        className={`
                          h-20 w-20 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center transition-colors duration-200
                          ${dragTarget === 'file' && !draggedItem ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}
                          ${uploading[item.id] ? 'pointer-events-none opacity-50' : ''}
                        `}
                      >
                        {uploading[item.id] ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                        ) : (
                          <>
                            {item.type === 'image' && <ImageIcon className="h-6 w-6 text-gray-400" />}
                            {item.type === 'video' && <Video className="h-6 w-6 text-gray-400" />}
                            {item.type === 'youtube' && <Youtube className="h-6 w-6 text-gray-400" />}
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Media Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {item.type}
                      </span>
                      <span className="text-sm text-gray-500">Position {index + 1}</span>
                    </div>
                    {item.url ? (
                      <p className="mt-1 text-sm text-gray-900 truncate">{item.url}</p>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">
                        {item.type === 'youtube' ? 'Click to add YouTube URL' : 'Click or drag to upload'}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {item.url && (
                      <button
                        type="button"
                        onClick={() => openFileDialog(item.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Replace
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeMediaItem(item.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          const itemId = e.target.dataset.itemId;
          if (file && itemId) {
            handleFileInputChange(e, itemId);
          }
        }}
        className="hidden"
      />
    </div>
  );
};

export default EnhancedMediaUpload;
