import React, { useEffect, useRef, useState } from 'react';
import Poetry from '../components/Poetry';
import CalligraphyPoemCanva from '../components/CalligraphyPoemCanva';
import { useP5Ink } from '../contexts/p5InkContext';
import { Spacer, Switch } from '@heroui/react';
import { GenerateButton } from '../components/GenerateButton';
import GridCanva from '../components/GridCanva';
import { usePageNavigation } from '../contexts/PageContext';
import Button from '../components/Button';
import Text from '../components/Text';
import IconSwitch from '../components/IconSwitch';
import GridOnIcon from '@mui/icons-material/GridOn';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';

// import { PromptInput } from './ImageGenerator';
export default function Calligraphy_Page() {
    const { p5InkInstance } = useP5Ink();
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [isSelected, setIsSelected] = React.useState(true);
    const { goToPage } = usePageNavigation();

    // const { currentPage, goToPage } = usePageNavigation();

    // console.log(currentPage, 'currentPage')
    useEffect(() => {
        if (!containerRef.current) return;

        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        setDimensions({ width, height });
        // console.log(width, height)

    }, [containerRef.current]);



    return (
        <div className='flex flex-col h-full p-8'>
            <Text type='title'>書法練習</Text>
            <Poetry />
            <div ref={containerRef} className="flex-1 w-full self-center flex justify-center m-6">

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
            <div className="canvas-controls flex justify-between mb-6">


                {/* <Switch isSelected={isSelected} onValueChange={setIsSelected}>
                </Switch> */}



                <div>
                    <Button color='primary' size='lg' onPress={() => {
                        p5InkInstance.current?.clearCanvas()
                    }}> <DeleteIcon fontSize='large' /><Text type="heading" >清除</Text></Button>
                    <Spacer x={4} className='inline-block' />
                    <Button color='primary' size='lg' onPress={() => {
                        p5InkInstance.current?.undoLastStroke()
                    }}><UndoIcon fontSize='large' /><Text type="heading" >回上一筆</Text></Button>
                </div>

                <IconSwitch Icon={<GridOnIcon fontSize='large' />} setOn={setIsSelected} isOn={isSelected} >格線</IconSwitch>
            </div>

            <Button
                color='primary'
                fullWidth
                size='lg'
                onPress={()=>{
                    goToPage(1)
                    p5InkInstance.current?.saveCanvasToBuffer()
                }}
            ><Text type='heading'>產生水墨畫</Text>
            </Button >
        </div>
    );
}