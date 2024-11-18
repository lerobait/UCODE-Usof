import React, { useState, useEffect } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { Box, Skeleton } from '@mui/joy';
import AspectRatio from '@mui/joy/AspectRatio';

interface ImagePreviewProps {
  imagePreview: string | null;
  onRemoveImage: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imagePreview,
  onRemoveImage,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (imagePreview) {
      const img = new Image();
      img.src = imagePreview;
      img.onload = () => setLoading(false);
      img.onerror = () => setLoading(false);
    }
  }, [imagePreview]);

  if (!imagePreview) return null;

  return (
    <div
      className="mt-2 relative cursor-pointer w-full max-w-[400px] max-h-[400px] overflow-hidden"
      onClick={onRemoveImage}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onRemoveImage();
        }
      }}
    >
      <Box sx={{ m: 'auto' }}>
        <AspectRatio variant="plain" sx={{ width: '100%', height: 'auto' }}>
          <Skeleton loading={loading}>
            <img
              src={imagePreview}
              alt="Preview of the selected file"
              className="w-full h-auto object-contain rounded-xl transition-all duration-300"
              style={{ opacity: loading ? 0 : 1 }}
            />
          </Skeleton>
        </AspectRatio>
      </Box>
      <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 flex justify-center items-center transition-opacity duration-300">
        <RxCross1 className="text-white text-3xl" />
      </div>
    </div>
  );
};

export default ImagePreview;
