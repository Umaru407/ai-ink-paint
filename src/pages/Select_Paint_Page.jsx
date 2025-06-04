
import React, { useEffect, useRef, useState } from 'react';
import { useSelectImageContext } from '../contexts/SelectImageContext';
import p5 from 'p5';
import ImageColor from '../components/ImageColor';
import TestFabric from '../components/TestFabric';
import { useP5Paint } from '../contexts/p5PaintContext';
import { usePageNavigation } from '../contexts/PageContext';
import Piece from '../components/Piece';
import ImageSelectArea from '../components/ImageSelectArea2';
import { ReGenerateButton } from '../components/ReGenerateButton';
import { useImageContext } from '../contexts/ImageContext';
import { useSelectPoetryContext } from '../contexts/SelectPoetryContext';


export default function Select_Paint_Page() {
    const { prompt, setPrompt, images, setImages } = useImageContext();
    const { selectPoetry } = useSelectPoetryContext();
    
    return (
        <div className="paper-container flex flex-col p-8 h-full">
            <div className='left-20 w-4 h-4 border border-white rounded-full opacity-60 absolute'
                onClick={() => {
                    console.log(selectPoetry.title)
                    //const imageList = [`selectPoetry.title/${Math.random()}`, `selectPoetry.title/${Math.random()}`, `selectPoetry.title/${Math.random()}`,]
                    // 1. 生成 1~20 的数字数组
                    const nums = Array.from({ length: 20 }, (_, i) => i + 1)

                    // 2. 随机打乱
                    const shuffled = nums.sort(() => Math.random() - 0.5)

                    // 3. 取前 4 个
                    const selected = shuffled.slice(0, 4)

                    // 4. 拼成路径
                    const imageList = selected.map(n => `/sample/${selectPoetry.title}/${n}.png`)
                    // console.log(imageList)
                    setImages(imageList)
                }
                }
            ></div>
            <h1 className='text-6xl mb-2 text-center '>選擇水墨畫</h1>
            <ImageSelectArea />
            <ReGenerateButton />
        </div>
    );
}