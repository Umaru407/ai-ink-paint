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
    generateImage,
    isLoading
  } = useWebSocketImageGenerator();

  // useEffect(() => {
  //   if (imageUrl) {
  //     setImages(prevImages => [...prevImages, imageUrl]);
  //     console.log('rrrrrr2r,',imageUrl)
  //   }
  // }, [imageUrl]);

  const generateNewImage = async () => {
    const api = ink_paint_v2;
    api['2'].inputs.text = `.\n---\n把上面的唐詩翻譯成英文，只輸出翻譯结果，不要輸出其他内容。\n---\ntimestamp: ${Math.floor(Math.random() * 1000000000000)}`;
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
    , isLoading
  };
};