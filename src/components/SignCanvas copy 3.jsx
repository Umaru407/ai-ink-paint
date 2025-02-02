import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';

import { useP5Sign } from '../contexts/p5SignContext';
import { useP5Paint } from '../contexts/p5PaintContext';
import { usePageNavigation } from '../contexts/PageContext';
import IconSwitch from './IconSwitch';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import Text from './Text';
import Button from './Button';

const stampStyles = [
    {
        id: 1,
        name: 'stamp1',
        image: '/stamps/stamp1.png'
    },
    {
        id: 2,
        name: 'stamp2',
        image: '/stamps/stamp2.png'
    },
    {
        id: 3,
        name: 'stamp3',
        image: '/stamps/stamp3.png'
    },
    {
        id: 4,
        name: 'stamp4',
        image: '/stamps/stamp4.png'
    }
];
const SignCanvas = ({ setSharedGraphics, editMode, setEditMode, selectedStamp }) => {
    const { p5PaintInstance } = useP5Paint()


    // const [mode, setEditMode] = useState(false);
    const { stamp, setStamp } = useP5Sign()
    // let bgImage;

    const { currentPage, goToPage } = usePageNavigation();
    const isOnPage = useRef(false);

    const selectStamp = useRef('stamp1')





    useEffect(() => {
        isOnPage.current = currentPage === 4;

        if (!isOnPage.current) {
            p5InstanceRef.current?.noLoop()
        } else {
            p5InstanceRef.current?.loop()
        }

    }, [currentPage]);
    // const { recognizeStrokes, setRecognizeStrokes, buttons, setButtons } = useImageContext();
    // let recognizeStrokes: [number[], number[], number[]][] = [];

    const setting = {
        distance: 10,
        spring: 0.3,
        friction: 0.5,
        size: 18,
        diff: 18 / 8
    }
    const canvasRef = useRef();
    const graphicsRef = useRef(); // 保存 graphics 對象
    const p5InstanceRef = useRef(null);
    const { p5SignInstance, setP5SignReady, setSignImageData } = useP5Sign();
    useEffect(() => {
        // console.log(stamp, 'stamp')
        selectStamp.current = stamp.name
        // console.log(p5InstanceRef.current)
        // p5InstanceRef.current?.clearCanvas()
        // console.log(selectStamp.current, 'selectStamp')
    }, [stamp])


    let canvasHeight = 800
    let canvasWidth = 280;



    useEffect(() => {
        // Ensure we're only creating the p5 instance on the client side
        if (typeof window !== 'undefined' && canvasRef.current) {
            // Sketch function for p5
            const sketch = (p) => {
                let canvas
                let currentStroke = [[], [], []]; // 0: [Samples of position X], 1: [Samples of position Y], 2: [millseconds since first stroke start] <optional>
                let strokes = [];
                let bgImage = {}
                let { distance, spring, friction, size, diff } = setting;
                let x, y, ax, ay, a, r, f //: number
                let oldR //: number;

                /* Draw status */
                let drawing = false;
                let drawStartTime = undefined; // Timestamp of first interaction

                p.preload = () => {
                    bgImage = {
                        'stamp1': p.loadImage('/stamps/stamp1.png'),
                        'stamp2': p.loadImage('/stamps/stamp2.png'),
                        'stamp3': p.loadImage('/stamps/stamp3.png'),
                        'stamp4': p.loadImage('/stamps/stamp4.png'),
                    }
                }

                p.setup = () => {
                    canvas = p.createCanvas(canvasWidth, canvasHeight);

                    // p.createCanvas(400, 400);
                    graphicsRef.current = p.createGraphics(canvasWidth, canvasHeight); // 初始化 graphics
                    setSharedGraphics(graphicsRef.current); // 傳遞給父組件

                    canvas.parent(canvasRef.current);

                    if (bgImage[selectStamp.current]) {
                        // console.log('bgImage', bgImage.current)
                        graphicsRef.current.image(bgImage[selectStamp.current], 0, 0, canvasWidth, canvasHeight); // 将 SVG 图像拉伸到画布大小
                    }

                    // graphicsRef.current.background('red')
                    graphicsRef.current.stroke('#ffffff')
                    x = y = ax = ay = a = r = f = 0;
                    // p.noLoop()
                };

                p.draw = () => {
                    // console.log('印章draw')
                    // This method is left empty as we'll handle drawing in mousePressed and mouseDragged
                    oldR = r;
                    if (p.mouseIsPressed && p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                        drawing = true

                    }
                    if (p.mouseIsPressed && drawing) {
                        // console.log("8888")
                        // console.log(currentStroke)
                        const ms = p.getMillsecondFromStrokeStart();
                        const mX = p.mouseX;
                        const mY = p.mouseY;
                        currentStroke[0].push(mX);
                        currentStroke[1].push(mY);
                        currentStroke[2].push(ms);

                        if (!f) {
                            f = 1;
                            x = mX;
                            y = mY;
                        }

                        ax += (mX - x) * spring;
                        ay += (mY - y) * spring;
                        ax *= friction;
                        ay *= friction;
                        a += p.sqrt(ax * ax + ay * ay) - a;
                        a *= 0.6;
                        r = size - a;

                        for (let i = 0; i < distance; ++i) {
                            const oldX = x;
                            const oldY = y;
                            x += ax / distance;
                            y += ay / distance;
                            oldR += (r - oldR) / distance;

                            if (oldR < 1) oldR = 1;

                            graphicsRef.current.strokeWeight(oldR + diff);
                            graphicsRef.current.line(x, y, oldX, oldY);

                            graphicsRef.current.strokeWeight(oldR);
                            graphicsRef.current.line(x + diff * 2, y + diff * 2, oldX + diff * 2, oldY + diff * 2);
                            graphicsRef.current.line(x - diff, y - diff, oldX - diff, oldY - diff);
                        }
                    } else if (f) {
                        ax = ay = f = 0;
                    }

                    // p.clear()
                    // graphicsRef.current.clear()

                    // p.image(bgImage[selectStamp.current], 0, 0, canvasWidth, canvasHeight);

                    p.image(graphicsRef.current, 0, 0);
                };


                p.mouseReleased = (event) => {
                    p.endDraw(event)
                };

                p.touchEnded = (event) => {
                    p.endDraw(event)
                };

                // Clear canvas method
                p.clearCanvas = () => {
                    // console.log('clearCanvas', bgImage[selectStamp.current.name])
                    // p.background('red');
                    p.clear()
                    graphicsRef.current.clear()
                    graphicsRef.current.image(bgImage[selectStamp.current], 0, 0, canvasWidth, canvasHeight);
                    // p.image(graphicsRef.current, 0, 0, canvasWidth, canvasHeight);  
                    strokes = [];
                };

                p.endDraw = (event) => {
                    // Code to run that uses the event.    
                    if (drawing) {
                        // console.log("release");
                        p.saveStrokeStep();

                    }
                    drawing = false;
                }



                p.saveStrokeStep = () => {
                    const newStroke = [...currentStroke];
                    // console.log('1', currentStroke);
                    strokes.push(newStroke); // 使用淺拷貝

                    // setRecognizeStrokes((prev) => {
                    //     // console.log('2', currentStroke); 
                    //     return [...prev, newStroke]; // 確保每次都傳入新副本
                    // });

                    currentStroke = [[], [], []]; // 清空 currentStroke
                };

                // Undo last stroke method
                // p.undoLastStroke = () => {
                //     if (strokes.length > 0) {
                //         // Remove the last stroke
                //         strokes.pop();
                //         // recognizeStrokes.pop();
                //         // setRecognizeStrokes((prev) => prev.slice(0, -1)); // 函數式更新
                //         // Redraw all remaining strokes
                //         //     graphicsRef.current.clear()

                //         //     graphicsRef.current.background('red')
                //         // graphicsRef.current.stroke('#ffffff')
                //         // graphicsRef.current.strokeWeight(15); // 設定邊框寬度為 2 像素
                //         // graphicsRef.current.noFill(); // 設定內部不填充

                //         graphicsRef.current.image(bgImage, 0, 0, canvasWidth, canvasHeight);


                //         // 畫一個只有白色邊框的長方形
                //         // graphicsRef.current.rect(30, 30, canvasWidth - 60, canvasHeight - 60);

                //         strokes.forEach((stroke) => {
                //             ax = ay = f = 0;
                //             p5InstanceRef.current.drawStroke(stroke);
                //         });
                //     }
                // };

                p.undoLastStroke = () => {
                    if (strokes.length > 0) {
                        // Remove the last stroke
                        strokes.pop();
                        p.clear()
                        graphicsRef.current.clear()
                        // recognizeStrokes.pop();
                        // setRecognizeStrokes((prev) => prev.slice(0, -1)); // 函數式更新
                        // Redraw all remaining strokes
                        //     graphicsRef.current.clear()

                        //     graphicsRef.current.background('red')
                        // graphicsRef.current.stroke('#ffffff')
                        // graphicsRef.current.strokeWeight(15); // 設定邊框寬度為 2 像素
                        // graphicsRef.current.noFill(); // 設定內部不填充

                        graphicsRef.current.image(bgImage[selectStamp.current], 0, 0, canvasWidth, canvasHeight);


                        // 畫一個只有白色邊框的長方形
                        // graphicsRef.current.rect(30, 30, canvasWidth - 60, canvasHeight - 60);

                        strokes.forEach((stroke) => {
                            ax = ay = f = 0;
                            p5InstanceRef.current.drawStroke(stroke);
                        });
                    }
                };

                p.getMillsecondFromStrokeStart = () => {
                    if (drawStartTime !== undefined) {
                        return new Date().getTime() - drawStartTime;
                    }

                    drawStartTime = new Date().getTime();

                    return 0;
                };

                p.getCanvasSize = () => ({
                    width: canvasWidth,
                    height: canvasHeight
                });

                p.drawStroke = (stroke) => {
                    const [xPoints, yPoints, timePoints] = stroke;
                    if (xPoints.length === 0) return;
                    const minLength = Math.min(xPoints.length, yPoints.length, timePoints.length);
                    // 遍歷並處理每組資料
                    for (let i = 0; i < minLength; i++) {
                        // console.log(`第 ${i + 1} 組: x=${xPoints[i]}, y=${yPoints[i]}, time=${timePoints[i]}`);
                        const mX = xPoints[i];
                        const mY = yPoints[i];
                        if (!f) {
                            f = 1;
                            x = xPoints[0];
                            y = yPoints[0];
                        }
                        ax += (mX - x) * spring;
                        ay += (mY - y) * spring;
                        ax *= friction;
                        ay *= friction;
                        a += p.sqrt(ax * ax + ay * ay) - a;
                        a *= 0.6;
                        r = size - a;

                        for (let i = 0; i < distance; ++i) {
                            const oldX = x;
                            const oldY = y;
                            x += ax / distance;
                            y += ay / distance;
                            oldR += (r - oldR) / distance;

                            if (oldR < 1) oldR = 1;

                            graphicsRef.current.strokeWeight(oldR + diff);
                            graphicsRef.current.line(x, y, oldX, oldY);

                            graphicsRef.current.strokeWeight(oldR);
                            graphicsRef.current.line(x + diff * 2, y + diff * 2, oldX + diff * 2, oldY + diff * 2);
                            graphicsRef.current.line(x - diff, y - diff, oldX - diff, oldY - diff);
                        }
                    }

                };

                // p.getRecognizeStrokes = () => (recognizeStrokes.length ? recognizeStrokes : [[[], [], []]]);
                // p.resetRecognizeStrokes = () => {
                //     // recognizeStrokes = [];
                //     setRecognizeStrokes([])
                // }
                ;
                // 自定義方法，將畫布保存為 Base64 圖片數據
                p.saveCanvasToBuffer = () => {
                    const canvas = p.canvas; // 獲取 HTML Canvas 元素
                    const img = p.get(); // 獲取畫布的像素數據

                    img.loadPixels(); // 加載像素數據

                    // 遍歷每個像素
                    for (let i = 0; i < img.pixels.length; i += 4) {
                        const r = img.pixels[i];
                        const g = img.pixels[i + 1];
                        const b = img.pixels[i + 2];

                        // 判斷是否為白色（或接近白色）
                        if (r > 240 && g > 240 && b > 240) {
                            img.pixels[i + 3] = 0; // 將 alpha 值設為 0（透明）
                        }
                    }
                    console.log('saveCanvasToBuffer')

                    img.updatePixels(); // 更新像素數據
                    p.image(img, 0, 0); // 將修改後的像素數據放回畫布

                    const dataUrl = canvas.toDataURL("image/png"); // 將畫布轉為 Base64
                    setSignImageData(dataUrl); // 將 Base64 數據存入 Context
                };
            };

            // Create p5 instance
            p5InstanceRef.current = new p5(sketch);

            p5SignInstance.current = p5InstanceRef.current;
            // console.log(p5SignInstance,'789')
            // Cleanup function
            return () => {
                p5InstanceRef.current?.remove();
            };
        }
    }, []);



    const clearCanvas = () => {
        p5InstanceRef.current?.clearCanvas();
    };



    // Method to undo last stroke from outside
    const undoLastStroke = () => {
        p5InstanceRef.current?.undoLastStroke();
        // recognizeHandwriting(p5InstanceRef.current?.getCanvasSize(), p5InstanceRef.current?.getRecognizeStrokes(), 10, saveResult);
    };


    return (
        <div className="paper flex flex-col justify-center items-center">
            <div ref={canvasRef} className="canvas-container w-min" ></div>
            <div className="canvas-controls flex flex-col mt-12">
                <div>
                    <Button fullWidth onPress={clearCanvas} size='lg' color="primary">
                        <DeleteIcon fontSize='large' /><Text type="heading" >清除</Text>
                    </Button>
                    <Button fullWidth onPress={undoLastStroke} size='lg' color="primary">
                        <UndoIcon fontSize='large' /><Text type="heading" >回上一筆</Text>
                    </Button>

                    {/* <Button fullWidth onPress={() => {
                        selectStamp.current = 'stamp2'
                        p5InstanceRef.current?.clearCanvas()

                    }} size='lg' color="primary">
                        <UndoIcon fontSize='large' /><Text type="heading" >回上一筆</Text>
                    </Button> */}

                </div>
                <IconSwitch Icon={<ZoomOutMapIcon fontSize='large' />} fullWidth={true} setOn={setEditMode} isOn={editMode}>縮放移動</IconSwitch>
            </div>

            <div className='mx-12  my-6 flex flex-col justify-end '>

                <Text type="subtitle">印章選擇區域</Text>
                <StampSelector clearCanvas={clearCanvas} stamp={stamp} setStamp={setStamp} />

            </div>
            {/* <TextRecongnizeArea buttonLabels = {buttons} setButtons = {setButtons} resetRecognizeStrokes = {resetRecognizeStrokes}  /> */}
        </div>
    );
}


export default SignCanvas;

function StampSelector({ stamp, setStamp }) {
    const { p5SignInstance } = useP5Sign()
    return (
        <div className="grid grid-cols-3 gap-4 mt-4">
            {stampStyles.map((s) => (
                <div
                    key={s.id}
                    onClick={() => {
                        setStamp(s);
                        setTimeout(() => {
                            p5SignInstance?.current?.clearCanvas()
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
                            className="w-20 h-20 mx-auto object-contain"
                        />
                    </div>
                    <Text type="body">{s.name}</Text>
                </div>
            ))}
        </div>
    );
}