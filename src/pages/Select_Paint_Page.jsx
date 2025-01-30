
import React, { useEffect, useRef, useState } from 'react';
import { useSelectImageContext } from '../contexts/SelectImageContext';
import p5 from 'p5';
import ImageColor from '../components/ImageColor';
import TestFabric from '../components/TestFabric';
import { useP5Paint } from '../contexts/p5PaintContext';
import { usePageNavigation } from '../contexts/PageContext';
import Piece from '../components/Piece';
import ImageSelectArea from '../components/ImageSelectArea2';



export default function Select_Paint_Page() {

    const { paintImageData } = useP5Paint()
    return (
        <div className="paper-container flex flex-col p-8 h-full">
            <h1 className='text-6xl mb-2 text-center'>選擇水墨畫</h1>
            <ImageSelectArea />

        </div>
    );
}