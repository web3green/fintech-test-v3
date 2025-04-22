import { Area } from 'react-easy-crop';

/**
 * Creates an Image element from a URL.
 * @param {string} url - The image URL.
 * @returns {Promise<HTMLImageElement>} - A promise that resolves with the Image element.
 */
export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    // Needed to avoid cross-origin issues on `toBlob` if using external URLs
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

/**
 * Crops an image using Canvas.
 * @param {string} imageSrc - The source image URL (or base64 string).
 * @param {Area} pixelCrop - The pixel coordinates and dimensions for cropping.
 * @returns {Promise<Blob | null>} - A promise that resolves with the cropped image Blob or null if error.
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob | null> {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      return null;
    }

    // Set canvas size to match the cropped area dimensions
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the cropped image area onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x, // source x
      pixelCrop.y, // source y
      pixelCrop.width, // source width
      pixelCrop.height, // source height
      0, // destination x
      0, // destination y
      pixelCrop.width, // destination width
      pixelCrop.height // destination height
    );

    // Convert canvas to Blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty or failed to create blob');
          reject(new Error('Canvas is empty or failed to create blob'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg', 0.9); // Output as JPEG with 90% quality
    });
  } catch (error) {
    console.error('Error cropping image:', error);
    return null;
  }
} 