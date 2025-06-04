
// components/ImageGenerator.tsx
import { useEffect } from 'react';

import { useWebSocketImageGenerator } from '../hooks/useWebSocketImageGenerator';
import Button from './Button';
import Text from './Text';
import { createRef } from 'react';


export const ReGenerateButton = () => {
    // const { images, setImages, prompt, setPrompt } = useImageContext();
    // const {
    //     prompt,
    
       
    //     generateNewImage,
    
    // } = useImageGeneration();
    

    const {
        isLoading,
        generateImage,
      } = useWebSocketImageGenerator();


      useEffect(() => {
        // console.log('ReGenerateButton mounted');
        console.log(isLoading, 'isLoading in ReGenerateButton');
        
      },[isLoading]);
    


    return (

        <Button
            color='primary'
            onPress={()=>{
                generateImage()
            }}
            // disabled={!prompt}
            fullWidth
            size='lg'
            className='mt-4'
            isDisabled={isLoading}
            isLoading={isLoading}
            // startIcon={isLoading ? <Spinner /> : <CheckCircleIcon />}
        ><Text type='heading'>{isLoading ? '生成中':'重新生成'}</Text>
        </Button >
    );
};