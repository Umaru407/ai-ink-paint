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
import ImageStamp from '../components/ImageStamp';
import { useP5Sign } from '../contexts/p5SignContext';
// import { s } from 'framer-motion/client';

// Import stampStyles from context instead
import { useStampStyles } from '../contexts/stampStyleContext';


function DoneButton() {
    const { p5PaintInstance } = useP5Paint()
    const { goToPage } = usePageNavigation();
    return (
        <Button fullWidth onPress={() => {
            p5PaintInstance.current?.saveCanvasToBuffer()
            goToPage(1)
        }}>
            <Text type="heading" >完成作品</Text>
        </Button>
    )
}



// interface Stroke {
//     color: string;
//     size: number;
//     points: { x: number; y: number }[];
// }

export default function StampPage() {
    const ColorContainer = useRef(null);
    const [colorDimensions, setColorDimensions] = useState({ width: 0, height: 0 });
    // const [selectedStamp, setSelectedStamp] = useState(stampStyles[0]);
    const { stamp, setStamp } = useP5Sign()

    useEffect(() => {
        if (!ColorContainer.current) return;
        //get the height of the color container
        const height = ColorContainer.current.offsetHeight;
        //get the width of the color container
        const width = ColorContainer.current.offsetWidth;

        // console.log(width, height, 'width, height')

        setColorDimensions({ width, height });
    }, [ColorContainer.current?.offsetHeight]);

    // const { selectImage } = useSelectImageContext();
    const [sharedGraphics, setSharedGraphics] = useState(null); // 共享畫布數據
    const [sharedColorGraphics, setSharedColorGraphics] = useState(null); // 共享畫布數據
    // const [selectedColor, setSelectedColor] = useState(colors[0]);
    // const [brushSize, setBrushSize] = useState(20);
    const [editMode, setEditMode] = useState(false)
    return (
        <div className="paper-container flex flex-col h-full  p-8">
            <div className='px-8 flex flex-col flex-1'>
                <Text type="title">落款</Text>
                <div className='flex gap-6 ' >
                    <div className='h-full flex flex-col flex-1'>

                        <div ref={ColorContainer} className='flex-1 '>
                            {/* <ColorCanva maxCanvasHeight={colorDimensions.height} setSharedColorGraphics={setSharedColorGraphics} selectedColor={selectedColor} brushSize={brushSize} editMode={editMode} setEditMode={setEditMode} /> */}
                            <ImageStamp maxCanvasHeight={colorDimensions.height} maxCanvasWidth={colorDimensions.width} editMode={editMode} setEditMode={setEditMode} sharedColorGraphics={sharedColorGraphics} setSharedGraphics={setSharedGraphics} sharedGraphics={sharedGraphics} />
                        </div>
                    </div>

                   

                        {/* <StampBackgroundCanvas selectedStamp={selectedStamp} /> */}
                        <SignCanvas selectedStamp={stamp} setSharedGraphics={setSharedGraphics} sharedGraphics={sharedGraphics} editMode={editMode} setEditMode={setEditMode} />
                    
                </div>

                <div className='mx-12 my-6 flex flex-col justify-end shrink'>
                    <Text type="subtitle">落款樣式</Text>
                    <StampSelector stamp={stamp} setStamp={setStamp} />
                </div>
            </div>

            <div className="px-8 shrink">
                <DoneButton />
            </div>
        </div>
    );
}




function StampSelector({ stamp, setStamp }) {
    const { p5SignInstance } = useP5Sign()
    const stampStyles = useStampStyles()
    return (
        <div className="grid grid-cols-4 gap-4 mt-4">
            {stampStyles.map((s) => (
                <div
                    key={s.id}
                    onClick={() => {
                        setStamp(s);
                        setTimeout(() => {
                            p5SignInstance?.current?.clearCanvas()
                            // p5SignInstance?.current?.resizeCanvas( 280, 280*stamp.aspectRatio )
                        }, 0)
                    }}
                    className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all
                        ${stamp.id === s.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                >
                    <div className="mb-2">
                        <img
                            src={s.image}
                            alt={s.name}
                            className="w-20 h-16 mx-auto object-contain"
                        />
                    </div>
                    {/* <Text type="body">{s.name}</Text> */}
                </div>
            ))}
        </div>
    );
}