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
export default function Calligraphy_Page() {
    const { p5InkInstance } = useP5Ink();
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [showGrid, setShowGrid] = useState(true);
    const [useEraser, setUseEraser] = useState(false);
    const { goToPage } = usePageNavigation();

    useEffect(() => {
        if (!containerRef.current) return;
        const { offsetWidth: width, offsetHeight: height } = containerRef.current;
        setDimensions({ width, height });
    }, [containerRef.current]);

    return (
        <div className='flex flex-col h-full p-8'>
            <Text type='title'>書法練習</Text>
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
                />
            </div>
            <div className="canvas-controls flex justify-between mb-6">
                <div className="flex items-center space-x-4">
                    {/* <Button color='primary' size='lg' onPress={() => p5InkInstance.current?.clearCanvas()}>
                        <DeleteIcon fontSize='large' /><Text type="heading">清除</Text>
                    </Button> */}
                    {/* <Button color='primary' size='lg' onPress={() => p5InkInstance.current?.undoLastStroke()}>
                        <UndoIcon fontSize='large' /><Text type="heading">回上一筆</Text>
                    </Button> */}
                    {/* 橡皮擦切換 */}
                    <IconSwitch
                        Icon={<AutoFixNormalIcon fontSize='large' />}
                        setOn={setUseEraser}
                        isOn={useEraser}
                    >橡皮擦</IconSwitch>
                </div>
                <IconSwitch Icon={<GridOnIcon fontSize='large' />} setOn={setShowGrid} isOn={showGrid}>格線</IconSwitch>
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