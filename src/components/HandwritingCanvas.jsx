import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import recognizeHandwriting from '../utils/recognizeHandwriting';
// import { Stroke } from '../types';

// type p5ContextType = p5 | null;
import { useImageContext } from '../contexts/ImageContext';
import { useP5Ink } from '../contexts/p5InkContext';

// 擴展 p5 型別
// declare module 'p5' {
//     interface p5InstanceExtensions {
//         clearCanvas: () => void;
//         undoLastStroke: () => void;
//         getMillsecondFromStrokeStart: () => number;
//         saveStrokeStep: () => void;
//         endDraw: (event: object) => void;
//         drawStroke: (stroke: Stroke) => void;
//         getRecognizeStrokes: () => Stroke[];
//         getCanvasSize: () => object
//         resetRecognizeStrokes:()=>void
//     }
// }

// interface HandwritingCanvasProps {



//   }
//  const { images, setImages, prompt, setPrompt,setRecognizeStrokes,recognizeStrokes } = useImageContext();
// An array of Stroke objects



const HandwritingCanvas = () => {
    const { recognizeStrokes, setRecognizeStrokes, buttons, setButtons } = useImageContext();
    // let recognizeStrokes: [number[], number[], number[]][] = [];

    const setting = {
        distance: 10,
        spring: 0.3,
        friction: 0.5,
        size: 28,
        diff: 28 / 8
    }

    const canvasRef = useRef(null);
    const p5InstanceRef = useRef(null);
    const { p5InkInstance, setP5InkReady, setInkImageData } = useP5Ink();

    // let canvasHeight = window.innerHeight * 5 / 6
    // let canvasWidth = canvasHeight * 1 / 2.5;

    let canvasHeight = window.innerHeight * 5 / 6
    let canvasWidth = canvasHeight * 1 / 2.4;

    useEffect(() => {
        // console.log('recognizeHandwriting!!!!!!!!!!!!!');
        recognizeHandwriting({
            width: canvasWidth,
            height: canvasHeight
        }, recognizeStrokes, 10, saveResult);
    }, [recognizeStrokes]); // 監測 state 的變化

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
                let isMax = false
                let strokeMax = 20;
                /* Draw status */
                let drawing = false;
                let drawStartTime = undefined; // Timestamp of first interaction


                p.setup = () => {
                    canvas = p.createCanvas(canvasWidth, canvasHeight);
                    canvas.parent(canvasRef.current);
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
                        if (isMax) {
                            r = size - a;

                        } else {
                            r = r + 2
                            diff = r / 8;
                            if (r >= strokeMax) {
                                isMax = true
                            }
                        }

                        for (let i = 0; i < distance; ++i) {
                            const oldX = x;
                            const oldY = y;
                            x += ax / distance;
                            y += ay / distance;
                            oldR += (r - oldR) / distance;

                            if (oldR < 1) oldR = 1;

                            p.strokeWeight(oldR + diff);
                            p.line(x, y, oldX, oldY);

                            p.strokeWeight(oldR);
                            p.line(x + diff * 2, y + diff * 2, oldX + diff * 2, oldY + diff * 2);
                            p.line(x - diff, y - diff, oldX - diff, oldY - diff);
                        }
                    } else if (f) {
                        ax = ay = f = 0;
                        isMax = false
                        r = 0
                    }
                };


                p.mouseReleased = (event) => {
                    p.endDraw(event)
                };

                p.touchEnded = (event) => {
                    p.endDraw(event)
                };

                // Clear canvas method
                p.clearCanvas = () => {
                    p.background(255);
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

                    setRecognizeStrokes((prev) => {
                        // console.log('2', currentStroke); 
                        return [...prev, newStroke]; // 確保每次都傳入新副本
                    });

                    currentStroke = [[], [], []]; // 清空 currentStroke
                };

                // Undo last stroke method
                p.undoLastStroke = () => {
                    if (strokes.length > 0) {
                        // Remove the last stroke
                        strokes.pop();
                        // recognizeStrokes.pop();
                        setRecognizeStrokes((prev) => prev.slice(0, -1)); // 函數式更新
                        // Redraw all remaining strokes
                        p.clear()
                        strokes.forEach((stroke) => {
                            ax = ay = f = 0;
                            p.drawStroke(stroke);
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

                            p.strokeWeight(oldR + diff);
                            p.line(x, y, oldX, oldY);

                            p.strokeWeight(oldR);
                            p.line(x + diff * 2, y + diff * 2, oldX + diff * 2, oldY + diff * 2);
                            p.line(x - diff, y - diff, oldX - diff, oldY - diff);
                        }
                    }

                };

                p.getRecognizeStrokes = () => (recognizeStrokes.length ? recognizeStrokes : [[[], [], []]]);
                p.resetRecognizeStrokes = () => {
                    // recognizeStrokes = [];
                    setRecognizeStrokes([])
                }
                    ;
                // 自定義方法，將畫布保存為 Base64 圖片數據
                p.saveCanvasToBuffer = () => {
                    const canvas = p.canvas; // 獲取 HTML Canvas 元素
                    const dataUrl = canvas.toDataURL("image/png"); // 將畫布轉為 Base64
                    //console.log(dataUrl,'777')
                    setInkImageData(dataUrl); // 將 Base64 數據存入 Context
                };
            };

            // Create p5 instance
            p5InstanceRef.current = new p5(sketch);

            p5InkInstance.current = p5InstanceRef.current;
            // console.log(p5inkInstance,'789')
            // Cleanup function
            return () => {
                p5InstanceRef.current?.remove();
            };
        }
    }, []);

    // Method to clear canvas from outside
    const clearCanvas = () => {
        // p5inkInstance.current?.saveCanvas("myCanvas", "png");
        // p5inkInstance.current?.saveCanvasToBuffer()
        p5InstanceRef.current?.clearCanvas();
    };



    // Method to undo last stroke from outside
    const undoLastStroke = () => {
        p5InstanceRef.current?.undoLastStroke();
        recognizeHandwriting(p5InstanceRef.current?.getCanvasSize(), p5InstanceRef.current?.getRecognizeStrokes(), 10, saveResult);
    };

    const saveResult = (result) => {
        // console.log('result',result)
        setButtons(result)
    };

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
            </div>
            {/* <TextRecongnizeArea buttonLabels = {buttons} setButtons = {setButtons} resetRecognizeStrokes = {resetRecognizeStrokes}  /> */}
        </div>
    );
}


export default HandwritingCanvas;