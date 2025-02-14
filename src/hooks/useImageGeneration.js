// hooks/useImageGeneration.ts
import { useEffect } from 'react';
import { useWebSocketImageGenerator } from './useWebSocketImageGenerator';
import { useImageContext } from '../contexts/ImageContext';
import ink_paint_v2 from '../assets/ink_paint_v2.json';

export const useImageGeneration = () => {
  const { images, setImages, prompt, setPrompt } = useImageContext();
  const {
    isConnected,
    error,
    imageUrl,
    connectWebSocket,
    generateImage
  } = useWebSocketImageGenerator();

  useEffect(() => {
    if (imageUrl) {
      setImages(prevImages => [...prevImages, imageUrl]);
    }
  }, [imageUrl, setImages]);

  const generateNewImage = async () => {
    const api = ink_paint_v2;
    console.log('api', api);
    api['15'].inputs.seed = Math.floor(Math.random() * 1000000000000);
    api['1'].inputs.text = prompt;
    setImages([]);
    connectWebSocket({ prompt, api });

  };

  return {
    isConnected,
    error,
    imageUrl,
    prompt,
    setPrompt,
    images,
    generateNewImage
  };
};