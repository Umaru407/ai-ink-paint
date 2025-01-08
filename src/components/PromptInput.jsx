
// components/ImageGenerator.tsx
import { useEffect } from 'react';

import { useWebSocketImageGenerator } from '../hooks/useWebSocketImageGenerator';
import { useImageContext } from '../contexts/ImageContext';
import ink_paint_v2 from '../assets/ink_paint_v2.json' 
// import TextRecongnizeArea from './TextRecongnizeArea';
let api  = ink_paint_v2

export const PromptInput = () => {
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
    <div>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="輸入創作"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-4xl leading-tight focus:outline-none focus:shadow-outline"
      />
      {/* <button
        onClick={handleGenerate}
        disabled={!prompt}
        className="px-4 py-2 text-4xl bg-blue-500 text-white rounded"
      >產生水墨畫
      </button> */}

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {/* {imageUrl && <img src={imageUrl} alt="Generated" className="mt-4" />} */}
    </div>
  );
};