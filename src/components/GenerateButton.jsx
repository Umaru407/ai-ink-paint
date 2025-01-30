
// components/ImageGenerator.tsx
import { useEffect } from 'react';

import { useWebSocketImageGenerator } from '../hooks/useWebSocketImageGenerator';
import { useImageContext } from '../contexts/ImageContext';
import ink_paint_v2 from '../assets/ink_paint_v2.json'
import { Button } from '@heroui/react';


// import TextRecongnizeArea from './TextRecongnizeArea';
let api = ink_paint_v2

export const GenerateButton = () => {
  const { images, setImages, prompt, setPrompt } = useImageContext();
  useEffect(() => {
    api['1'].inputs.text = prompt;
  }, [prompt])

  // const [prompt, setPrompt] = useState('');
  const { isConnected, error, imageUrl, connectWebSocket, generateImage } = useWebSocketImageGenerator();

  const handleGenerate = async () => {
    setImages([]);
    connectWebSocket({ prompt, api });
    // console.log(data);
  };

  useEffect(() => {
    if (imageUrl) {
      setImages([...images, imageUrl]);
    }
  }, [imageUrl])

  return (

    <Button
      color='primary'
      onPress={handleGenerate}
      disabled={!prompt}
      fullWidth
      size='lg'
      className='text-4xl'
    >產生水墨畫
    </Button >

    // {error && <p className="text-red-500 mt-2">{error}</p>}
    // {/* {imageUrl && <img src={imageUrl} alt="Generated" className="mt-4" />} */}

  );
};