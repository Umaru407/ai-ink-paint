import React from 'react';
import HandwritingCanvas from '../components/HandwritingCanvas';
import ImageSelectArea from '../components/ImageSelectArea';
// import { PromptInput } from '../components/PromptInput';
import TextRecongnizeArea from '../components/TextRecongnizeArea';
import { GenerateButton } from '../components/GenerateButton';

// import { PromptInput } from './ImageGenerator';
export default function Page1() {

    return (

        <div className='flex flex-col h-full px-8 justify-between '>
            <div className="flex min-h-0 flex-shrink">

                <div className='flex flex-col justify-between '>
                    <HandwritingCanvas />
                    <TextRecongnizeArea />

                    {/* <PromptInput /> */}
                </div>
                <ImageSelectArea />
            </div>
            <GenerateButton />

        </div>


    );
}