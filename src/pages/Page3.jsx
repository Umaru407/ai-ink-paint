
import React, { useEffect, useRef, useState } from 'react';
import { useSelectImageContext } from '../contexts/SelectImageContext';
import p5 from 'p5';
import ImageColor from '../components/ImageColor';
import TestFabric from '../components/TestFabric';
import { useP5Paint } from '../contexts/p5PaintContext';
import { usePageNavigation } from '../contexts/PageContext';



export default function Page3() {

    const { paintImageData } = useP5Paint()
    return (
        <div className="paper-container flex flex-col p-8 h-full">
            <h1 className='text-6xl mb-2 text-center'>完成作品</h1>
            <div className="min-h-0">

                {paintImageData ? (
                    <img src={paintImageData} alt="預覽畫布" className='w-full h-full object-contain'/>
                ) : (
                    <p>目前沒有圖片。</p>
                )}
            </div>

        </div>
    );
}