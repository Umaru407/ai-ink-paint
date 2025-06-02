// --- Calligraphy_Page.js ---
import React, { useEffect, useRef, useState } from 'react';
import Poetry from '../components/Poetry';
import CalligraphyPoemCanva from '../components/CalligraphyPoemCanva';
import { useP5Ink } from '../contexts/p5InkContext';
import { Spacer } from '@heroui/react';
import GridCanva from '../components/GridCanva';
import { usePageNavigation } from '../contexts/PageContext';
import Button from '../components/Button';
import Text from '../components/Text';
import IconSwitch from '../components/IconSwitch';
import GridOnIcon from '@mui/icons-material/GridOn';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import BrushIcon from '@mui/icons-material/Brush';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import IconButton from '@mui/material/IconButton';
import Slider from '../components/Slider';


export default function Calligraphy_Page() {
    const { p5InkInstance } = useP5Ink();
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [showGrid, setShowGrid] = useState(true);
    const [useEraser, setUseEraser] = useState(false);
    const { goToPage } = usePageNavigation();
 const [strokeMax, setStrokeMax] = useState(12);


 useEffect(() => {
        console.log(strokeMax, 'strokeMax');
    }, [strokeMax]);

    useEffect(() => {
        if (!containerRef.current) return;
        const { offsetWidth: width, offsetHeight: height } = containerRef.current;
        setDimensions({ width, height });
    }, [containerRef.current]);

    return (
        <div className='flex flex-col h-full p-8 relative'>

            <div className='absolute left-20'>
                <IconButton sx={{
                    color: '#ffffff', // Custom color
                    '&:hover': {
                        color: '#ffffff' // Hover color
                    }
                }} aria-label="Example" onClick={() => p5InkInstance.current?.clearCanvas()}>
                    <DeleteIcon fontSize='large' />
                </IconButton>
            </div>

            <Text type='title'>書法練習2</Text>



            <Poetry />
            <div ref={containerRef} className="flex-1 w-full self-center flex justify-center m-6">
                <GridCanva
                    canvasWidth={dimensions.height * 4 / 5}
                    canvasHeight={dimensions.height}
                    showGrid={showGrid}
                    useEraser={useEraser}
                />
                <CalligraphyPoemCanva
                    canvasWidth={dimensions.height * 4 / 5}
                    canvasHeight={dimensions.height}
                    showGrid={showGrid}
                    isEraser={useEraser}
                    eraserSize={40}
                    strokeMax={strokeMax}
                />
            </div>
            <div className="canvas-controls flex justify-between gap-12 mb-6">
                <div className="flex items-center space-x-4">

                   
                    <IconSwitch
                        Icon={<AutoFixNormalIcon fontSize='large' />}
                        setOn={setUseEraser}
                        isOn={useEraser}
                    >橡皮擦</IconSwitch>
                </div>

                <Slider min={8} max={30} value={strokeMax} onChange={(e)=>{
                    setStrokeMax(parseFloat(e.target.value));
                    // console.log(e)
                }}/>


  <div className="flex items-center space-x-4">

                <IconSwitch Icon={<GridOnIcon fontSize='large' />} setOn={setShowGrid} isOn={showGrid}>格線</IconSwitch>
            </div>
            </div>
            <Button
                color='primary'
                fullWidth
                size='lg'
                onPress={() => {
                    goToPage(1);
                    p5InkInstance.current?.saveCanvasToBuffer();
                }}
            >
                <Text type='heading'>產生水墨畫</Text>
            </Button>
        </div>
    );
}