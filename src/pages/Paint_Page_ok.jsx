import React, { useEffect, useRef, useState } from 'react';
import { useSelectImageContext } from '../contexts/SelectImageContext';
import p5 from 'p5';
import ImageColor from '../components/ImageColor';

import { useP5Paint } from '../contexts/p5PaintContext';
import { usePageNavigation } from '../contexts/PageContext';
import SignCanvas from '../components/SignCanvas';
import ColorCanva from '../components/ColorCanva';
import Text from '../components/Text';
import Button from '../components/Button';

import IconSwitch from '../components/IconSwitch';

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
    '#9d2933', '#f36838', '#ffb61e', '#40de5a', '#16a951', '#815476',
    '#ff4777', '#f9906f', '#ae7000', '#789262', '#057748', '#845a33',
    '#30dff3', '#1685a9', '#003472', '#161823', '#50616d', '#fff2df'

];

const brushSizes = [
    20, 40, 60, 80
]

function ColorPalette({ setSelectedColor }) {
    return (
        <div className='grid grid-cols-6 gap-4 w-full '>
            {colors.map((color, index) => (
                <div
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className="aspect-square  border border-black rounded cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: color }}
                ></div>
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
        <Button fullWidth onPress={() => {
            p5PaintInstance.current?.saveCanvasToBuffer()
            goToPage(1)
        }}>
            <Text type="heading" > 完成作品 </Text>
        </Button>
    )
}

// interface Stroke {
//     color: string;
//     size: number;
//     points: { x: number; y: number }[];
// }

export default function PaintPage() {
    const ColorContainer = useRef(null);
    const [colorDimensions, setColorDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!ColorContainer.current) return;
        //get the height of the color container
        const height = ColorContainer.current.offsetHeight;
        //get the width of the color container
        const width = ColorContainer.current.offsetWidth;

        console.log(width, height, 'width, height')

        setColorDimensions({ width, height });
    }, [ColorContainer.current?.offsetHeight]);

    // const { selectImage } = useSelectImageContext();
    const [sharedGraphics, setSharedGraphics] = useState(null); // 共享畫布數據
    const [sharedColorGraphics, setSharedColorGraphics] = useState(null); // 共享畫布數據
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [brushSize, setBrushSize] = useState(20);
    const [editMode, setEditMode] = useState(false)
    return (
        <div className="paper-container flex flex-col h-full justify-between">
            <div className='px-8 flex flex-col flex-1'>
                <div className='flex gap-6 flex-1' >
                    <div className='h-full flex flex-col '>
                        <Text type="title">上色</Text>
                        <div ref={ColorContainer} className='flex-1'>
                            <ColorCanva maxCanvasHeight={colorDimensions.height} setSharedColorGraphics={setSharedColorGraphics} selectedColor={selectedColor} brushSize={brushSize} editMode={editMode} setEditMode={setEditMode} />
                            <ImageColor maxCanvasHeight={colorDimensions.height} editMode={editMode} setEditMode={setEditMode} sharedColorGraphics={sharedColorGraphics} setSharedGraphics={setSharedGraphics} sharedGraphics={sharedGraphics} selectedColor={selectedColor} brushSize={brushSize} />
                        </div>
                    </div>

                    <div>
                        <Text type="title">落款</Text>
                        <SignCanvas setSharedGraphics={setSharedGraphics} sharedGraphics={sharedGraphics} editMode={editMode} setEditMode={setEditMode} />
                    </div>
                </div>


                <div className='mx-12  my-6 flex flex-col justify-end '>

                    <Text type="subtitle">顏彩</Text>
                    <ColorPalette setSelectedColor={setSelectedColor} />
                </div>

            </div>

            <div className="px-8 pb-4 ">
                <DoneButton />
            </div>
        </div>
    );
}