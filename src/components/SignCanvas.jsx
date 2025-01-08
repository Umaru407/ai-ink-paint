import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';

import { useP5Sign } from '../contexts/p5SignContext';
import { useP5Paint } from '../contexts/p5PaintContext';
const SignCanvas = ({setSharedGraphics}) => {
    const {p5PaintInstance} = useP5Paint()
      const [mode, setEditMode] = useState(false);
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

    let canvasHeight = 800
    let canvasWidth = 280;

    // useEffect(() => {
    //     // console.log('recognizeHandwriting!!!!!!!!!!!!!');
    //     recognizeHandwriting({
    //         width: canvasWidth,
    //         height: canvasHeight
    //     }, recognizeStrokes, 10, saveResult);
    // }, [recognizeStrokes]); // 監測 state 的變化

    // const [buttons, setButtons] = useState<string[]>([]);

    useEffect(() => {
        // Ensure we're only creating the p5 instance on the client side
        if (typeof window !== 'undefined' && canvasRef.current) {
            // Sketch function for p5
            const sketch = (p) => {
                let canvas
                let currentStroke = [[], [], []]; // 0: [Samples of position X], 1: [Samples of position Y], 2: [millseconds since first stroke start] <optional>
                let strokes = [];

                let { distance, spring, friction, size, diff } = setting;
                let x, y, ax, ay, a, r, f //: number
                let oldR //: number;

                /* Draw status */
                let drawing = false;
                let drawStartTime = undefined; // Timestamp of first interaction


                p.setup = () => {
                    canvas = p.createCanvas(canvasWidth, canvasHeight);

                    // p.createCanvas(400, 400);
                    graphicsRef.current = p.createGraphics(canvasWidth, canvasHeight); // 初始化 graphics
                    setSharedGraphics(graphicsRef.current); // 傳遞給父組件

                    canvas.parent(canvasRef.current);
                    graphicsRef.current.background('red')
                    graphicsRef.current.stroke('#ffffff')
                    graphicsRef.current.strokeWeight(15); // 設定邊框寬度為 2 像素
                    graphicsRef.current.noFill(); // 設定內部不填充

                    // 畫一個只有白色邊框的長方形
                    graphicsRef.current.rect(30, 30, canvasWidth - 60, canvasHeight - 60);
                    x = y = ax = ay = a = r = f = 0;
                };

                p.draw = () => {
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
                    p.background('red');
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
                p.undoLastStroke = () => {
                    if (strokes.length > 0) {
                        // Remove the last stroke
                        strokes.pop();
                        // recognizeStrokes.pop();
                        // setRecognizeStrokes((prev) => prev.slice(0, -1)); // 函數式更新
                        // Redraw all remaining strokes
                        graphicsRef.current.clear()
                        strokes.forEach((stroke) => {
                            ax = ay = f = 0;
                            graphicsRef.current.drawStroke(stroke);
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
                    const dataUrl = canvas.toDataURL("image/png"); // 將畫布轉為 Base64
                    //console.log(dataUrl,'777')
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

    // Method to clear canvas from outside
    const clearCanvas = () => {
        // p5SignInstance.current?.saveCanvas("myCanvas", "png");
        // p5SignInstance.current?.saveCanvasToBuffer()
        p5InstanceRef.current?.clearCanvas();
    };



    // Method to undo last stroke from outside
    const undoLastStroke = () => {
        p5InstanceRef.current?.undoLastStroke();
        // recognizeHandwriting(p5InstanceRef.current?.getCanvasSize(), p5InstanceRef.current?.getRecognizeStrokes(), 10, saveResult);
    };

    // let mode = false
    const changeEditMode = () =>{
        setEditMode((prevState) => !prevState);
        
    }

    useEffect(() => {
        p5PaintInstance.current?.changeEditMode(mode)
    }, [mode])
    

    // const saveResult = (result) => {
    //     // console.log('result',result)
    //     setButtons(result)
    // };

    // const resetRecognizeStrokes = () => {
    //     p5InstanceRef.current?.resetRecognizeStrokes()
    // };

    return (
        <div className="paper">
            <div ref={canvasRef} className="canvas-container bg-white w-min" ></div>
            <div className="canvas-controls">
                <button onClick={clearCanvas} id='canvas-clear' className="bg-blue-500 hover:bg-blue-700 text-white text-4xl font-bold  py-2 px-4 rounded ">
                    清除
                </button>
                <button onClick={undoLastStroke} id='canvas-undo' className="bg-blue-500 hover:bg-blue-700 text-4xl text-white font-bold py-2 px-4 rounded  ">
                    回上一筆畫
                </button>
                <button onClick={changeEditMode} id='canvas-undo' className="bg-blue-500 hover:bg-blue-700 text-4xl text-white font-bold py-2 px-4 rounded  ">
                    {mode ? '編輯大小OFF' : '編輯大小ON'}
                </button>
            </div>
            {/* <TextRecongnizeArea buttonLabels = {buttons} setButtons = {setButtons} resetRecognizeStrokes = {resetRecognizeStrokes}  /> */}
        </div>
    );
}


export default SignCanvas;