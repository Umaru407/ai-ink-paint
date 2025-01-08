
// components/ImageGenerator.tsx
import { useEffect } from 'react';

import { useWebSocketImageGenerator } from '../hooks/useWebSocketImageGenerator';
import { useImageContext } from '../contexts/ImageContext';
import ink_paint_v2 from '../assets/ink_paint_v2.json' 
// import TextRecongnizeArea from './TextRecongnizeArea';
let api  = ink_paint_v2

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
    <div className='w-full'>
      <button
        onClick={handleGenerate}
        disabled={!prompt}
        className="w-full px-4 py-2 text-4xl bg-blue-500 text-white rounded"
      >產生水墨畫
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {/* {imageUrl && <img src={imageUrl} alt="Generated" className="mt-4" />} */}
    </div>
  );
};