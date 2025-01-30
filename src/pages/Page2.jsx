
import React, { useEffect, useRef, useState } from 'react';
import { useSelectImageContext } from '../contexts/SelectImageContext';
import p5 from 'p5';
import ImageColor from '../components/ImageColor';

import { useP5Paint } from '../contexts/p5PaintContext';
import { usePageNavigation } from '../contexts/PageContext';
import SignCanvas from '../components/SignCanvas';
import ColorCanva from '../components/ColorCanva';

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
    '#9d2933', '#f36838', '#ffb61e', '#16a951', '#1685a9', '#003472',
    '#ff4777', '#FFA07A', '#c89b40', '#549688', '#20B2AA', '#30dff3',
    '#8d4bbb', '#815476', '#845a33', '#778899', '#fff2df', '#E9E7EF'

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
        <div className='grid grid-cols-2 gap-4  place-items-center' >
            {
                brushSizes.map((size, index) => (
                    <div key={index}
                        className='border-white w-full h-full flex items-center justify-center'
                    >
                        <div className='rounded-full flex items-center justify-center' style={{ backgroundColor: selectedColor, width: `${size}px`, height: `${size}px` }}
                            onClick={() => {
                                console.log('size', size)
                                setBrushSize(size)
                            }}>{size}</div>
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
    const [sharedColorGraphics, setSharedColorGraphics] = useState(null); // 共享畫布數據
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [brushSize, setBrushSize] = useState(20);
    const [editMode, setEditMode] = useState(false)
    return (
        <div className="paper-container flex flex-col h-full justify-between gap-8">
            <div className='px-8 flex flex-col flex-grow'>
                <div className='flex'>

                    <div>
                        <ColorCanva setSharedColorGraphics={setSharedColorGraphics} selectedColor={selectedColor} brushSize={brushSize} editMode={editMode} setEditMode={setEditMode} />
                        <ImageColor editMode={editMode} setEditMode={setEditMode} sharedColorGraphics={sharedColorGraphics} setSharedGraphics={setSharedGraphics} sharedGraphics={sharedGraphics} selectedColor={selectedColor} brushSize={brushSize} />
                    </div>
                    <SignCanvas setSharedGraphics={setSharedGraphics} sharedGraphics={sharedGraphics} editMode={editMode} setEditMode={setEditMode} />
                </div>


                <div className='my-auto'>
                    <h2 className='text-6xl text-center mb-2'>
                        顏彩
                    </h2>

                    <div className="flex justify-center gap-8">

                        {/* <BrushSizeSlector selectedColor={selectedColor} setBrushSize={setBrushSize} /> */}
                        {/* <TestFabric selectedColor={selectedColor}> </TestFabric> */}
                        <ColorPalette setSelectedColor={setSelectedColor} />
                    </div>
                </div>

            </div>

            <DoneButton />
        </div>
    );
}