import React from 'react';
import HandwritingCanvas from '../components/HandwritingCanvas';
import ImageSelectArea from '../components/ImageSelectArea';
// import { PromptInput } from '../components/PromptInput';
import TextRecongnizeArea from '../components/TextRecongnizeArea';
import { GenerateButton } from '../components/GenerateButton';
import Poetry from '../components/Poetry';


import { TANG_POEMS } from '../contexts/SelectPoetryContext';
import PoetryList from '../components/PoetryList';
import { Button } from '@heroui/react';
import { usePageNavigation } from '../contexts/PageContext';

// import { PromptInput } from './ImageGenerator';
export default function Select_Poetry_Page() {
    const { goToPage } = usePageNavigation();
    return (
        // 1024px
        <div className='flex flex-col h-full px-8 '>

            <PoetryList />
            <Poetry />
            <Button color='primary' fullWidth size='lg' className='text-4xl' onPress={() => {
                goToPage(1);
            }}>選擇詩詞</Button>
        </div>


    );
}