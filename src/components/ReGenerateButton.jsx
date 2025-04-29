
// components/ImageGenerator.tsx
import { useEffect } from 'react';

import { useWebSocketImageGenerator } from '../hooks/useWebSocketImageGenerator';
import { useImageContext } from '../contexts/ImageContext';
import ink_paint_v2 from '../assets/ink_paint_v2.json'
import Button from './Button';
import Text from './Text';
import { useImageGeneration } from '../hooks/useImageGeneration';
// import { Button } from '@heroui/react';
// import { useImageGeneration } from './hooks/useImageGeneration';

// import TextRecongnizeArea from './TextRecongnizeArea';
let api = ink_paint_v2

export const ReGenerateButton = () => {
    // const { images, setImages, prompt, setPrompt } = useImageContext();
    const {
        prompt,
        setPrompt,
        images,
        error,
        generateNewImage
    } = useImageGeneration();
    



    // useEffect(() => {
    //     api['1'].inputs.text = prompt;
    // }, [prompt])

    // const [prompt, setPrompt] = useState('');
    // const { isConnected, error, imageUrl, connectWebSocket, generateImage } = useWebSocketImageGenerator();

    const handleGenerate = async () => {
        generateNewImage()
        // console.log(data);
    };

    // useEffect(() => {
    //     if (imageUrl) {
    //         setImages([...images, imageUrl]);
    //     }
    // }, [imageUrl])

    return (

        <Button
            color='primary'
            onPress={handleGenerate}
            disabled={!prompt}
            fullWidth
            size='lg'
            className='mt-4'
        ><Text type='heading'>重新生成</Text>
        </Button >

        // {error && <p className="text-red-500 mt-2">{error}</p>}
        // {/* {imageUrl && <img src={imageUrl} alt="Generated" className="mt-4" />} */}

    );
};