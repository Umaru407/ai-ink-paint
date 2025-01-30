import React, { useEffect, useRef, useState } from 'react';
import Poetry from '../components/Poetry';
import CalligraphyPoemCanva from '../components/CalligraphyPoemCanva';
import { useP5Ink } from '../contexts/p5InkContext';
import { Button, Switch } from '@heroui/react';
import { GenerateButton } from '../components/GenerateButton';
import GridCanva from '../components/GridCanva';
import { usePageNavigation } from '../contexts/PageContext';

// import { PromptInput } from './ImageGenerator';
export default function Calligraphy_Page() {
    const { p5InkInstance } = useP5Ink();
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [isSelected, setIsSelected] = React.useState(true);

    // const { currentPage, goToPage } = usePageNavigation();

    // console.log(currentPage, 'currentPage')
    useEffect(() => {
        if (!containerRef.current) return;

        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        setDimensions({ width, height });
        console.log(width, height)

    }, [containerRef.current]);



    return (
        <div className='flex flex-col h-full p-4'>
            <h1 className='text-6xl text-center'>書法練習</h1>
            <Poetry />
            <div ref={containerRef} className="flex-1 w-full self-center flex justify-center">

                <GridCanva
                    canvasWidth={dimensions.height * 4 / 5}
                    canvasHeight={dimensions.height}
                    showGrid={isSelected}
                   
                />

                <CalligraphyPoemCanva
                    canvasWidth={dimensions.height * 4 / 5}
                    canvasHeight={dimensions.height}
                    showGrid={isSelected}
                />


            </div>
            <div className="canvas-controls">


                <Switch isSelected={isSelected} onValueChange={setIsSelected}>
                </Switch>


                <Button color='primary' size='lg' className='text-4xl' onPress={() => {
                    p5InkInstance.current?.clearCanvas()
                }}>清除</Button>

                <Button color='primary' size='lg' className='text-4xl' onPress={() => {
                    p5InkInstance.current?.undoLastStroke()
                }}>回上一筆畫</Button>
            </div>

            <GenerateButton />
        </div>
    );
}