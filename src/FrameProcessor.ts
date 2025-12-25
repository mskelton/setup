import { Frame } from 'react-native-vision-camera';
import { CardDetector, DetectedCard } from './CardDetector';
import type { ImageData } from './CardDetector';

export const processFrame = (
  frame: Frame,
  detector: CardDetector,
): DetectedCard[] => {
  try {
    const imageData = frameToImageData(frame);
    return detector.detectCards(imageData);
  } catch (error) {
    console.warn('Frame processing error:', error);
    return [];
  }
};

const frameToImageData = (frame: Frame): ImageData => {
  const width = frame.width;
  const height = frame.height;
  const data = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const gray = Math.floor(Math.random() * 255);
    data[i * 4] = gray;
    data[i * 4 + 1] = gray;
    data[i * 4 + 2] = gray;
    data[i * 4 + 3] = 255;
  }

  return { data, width, height };
};
