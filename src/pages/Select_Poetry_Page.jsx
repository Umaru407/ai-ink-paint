import React from 'react';
import HandwritingCanvas from '../components/HandwritingCanvas';
import ImageSelectArea from '../components/ImageSelectArea';
// import { PromptInput } from '../components/PromptInput';
import TextRecongnizeArea from '../components/TextRecongnizeArea';
import { GenerateButton } from '../components/GenerateButton';
import Poetry from '../components/Poetry';

import { useImageGeneration } from '../hooks/useImageGeneration';
import { TANG_POEMS } from '../contexts/SelectPoetryContext';
import PoetryList from '../components/PoetryList';
// import { Button } from '@heroui/react';
import { usePageNavigation } from '../contexts/PageContext';
import Text from '../components/Text';
import Button from '../components/Button';

// import { PromptInput } from './ImageGenerator';
export default function Select_Poetry_Page() {

    const {
        prompt,
        setPrompt,
        images,
        error,
        generateNewImage
    } = useImageGeneration();
    const { goToPage } = usePageNavigation();
    return (
        // 1024px
        <div className='flex flex-col p-8 '>

            <PoetryList setPrompt={setPrompt} />
            <Poetry />
            <Button color='primary' fullWidth size='lg' onPress={() => {
                generateNewImage()
                goToPage(1);
            }}> <Text type="heading">選擇詩詞</Text></Button>
        </div>


    );
}