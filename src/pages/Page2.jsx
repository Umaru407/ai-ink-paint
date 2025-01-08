
import React, { useEffect, useRef, useState } from 'react';
import { useSelectImageContext } from '../contexts/SelectImageContext';
import p5 from 'p5';
import ImageColor from '../components/ImageColor';

import { useP5Paint } from '../contexts/p5PaintContext';
import { usePageNavigation } from '../contexts/PageContext';
import SignCanvas from '../components/SignCanvas';


// type p5ContextType = p5 | null;


// 擴展 p5 型別
// declare module 'p5' {
//     interface p5InstanceExtensions {
//         changeColor: (color: string) => void;
//         drawingLayer: p5.Graphics;
//     }
// }


// pages/color-palette.tsx
const colors = [
    '#992b39', '#FF7F00', '#FFFF00', '#7FFF00', '#00FF00',
    '#00FF7F', '#00FFFF', '#007FFF', '#0000FF', '#7F00FF',
    '#FF00FF', '#FF007F', '#7F7F7F', '#BFBFBF', '#FFFFFF',
    '#FFA07A', '#20B2AA', '#778899',
];

const brushSizes = [
    20, 40, 60, 80
]

function ColorPalette({ setSelectedColor }) {
    return (
        // <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', padding: '20px' }}>
        <div className='grid grid-cols-6 gap-2'>
            {colors.map((color, index) => (
                <div key={index} onClick={() => {
                    setSelectedColor(color)
                    // console.log(color,'color')

                }} style={{ backgroundColor: color, width: '80px', height: '80px', borderRadius: '4px', border: '1px solid #000' }}></div>
            ))}
        </div>
    );
}

function BrushSizeSlector({ selectedColor, setBrushSize }) {
    return (
        <div className='grid grid-cols-2 gap-4  place-items-center'>
            {
                brushSizes.map((size, index) => (
                    <div key={index} className='rounded-full flex items-center justify-center' style={{ backgroundColor: selectedColor, width: `${size}px`, height: `${size}px` }}
                        onClick={() => {
                            console.log('size', size)
                            setBrushSize(size)
                        }}
                    >
                        {size}
                    </div>
                ))
            }
        </div>
    )
}


function DoneButton() {
    const { p5PaintInstance } = useP5Paint()
    const { goToPage } = usePageNavigation();
    return (
        <button onClick={() => {
            p5PaintInstance.current?.saveCanvasToBuffer()
            goToPage(1)
        }} id='done project' className="bg-blue-500 hover:bg-blue-700 text-4xl text-white font-bold py-2 px-4 rounded  ">
            完成作品
        </button>
    )
}

// interface Stroke {
//     color: string;
//     size: number;
//     points: { x: number; y: number }[];
// }

export default function Page2() {


    // const { selectImage } = useSelectImageContext();
    const [sharedGraphics, setSharedGraphics] = useState(null); // 共享畫布數據
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [brushSize, setBrushSize] = useState(20);
    return (
        <div className="paper-container flex flex-col h-full justify-between">
            <div className='flex'>
                <ImageColor setSharedGraphics={setSharedGraphics} sharedGraphics={sharedGraphics} selectedColor={selectedColor} brushSize={brushSize} />
                <SignCanvas setSharedGraphics={setSharedGraphics} sharedGraphics={sharedGraphics} />
            </div>


            <div>
                <h2 className='text-4xl text-center mb-2'>
                        筆刷設定
                </h2>
    
                <div className="flex justify-around">
                    
                    <BrushSizeSlector selectedColor={selectedColor} setBrushSize={setBrushSize} />
                    {/* <TestFabric selectedColor={selectedColor}> </TestFabric> */}
                    <ColorPalette setSelectedColor={setSelectedColor} />
                </div>
            </div>


            <DoneButton />
        </div>
    );
}