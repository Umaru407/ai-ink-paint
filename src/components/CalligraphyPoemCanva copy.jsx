
import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import recognizeHandwriting from '../utils/recognizeHandwriting';
// import { Stroke } from '../types';

// type p5ContextType = p5 | null;
import { useImageContext } from '../contexts/ImageContext';
import { useP5Ink } from '../contexts/p5InkContext';
import { Switch } from '@heroui/react';



const CalligraphyPoemCanva = ({ canvasWidth, canvasHeight, showGrid }) => {
    const { recognizeStrokes, setRecognizeStrokes, buttons, setButtons } = useImageContext();
    // console.log(showGrid, 'showGrid')
    // const [isSelected, setIsSelected] = React.useState(true);
    const strokeMax = 16;
    const GRID_COLS = 4;
    const GRID_ROWS = 5;

    let strokes = [];
    // console.log(canvasWidth, canvasHeight, '@@')
    // let recognizeStrokes: [number[], number[], number[]][] = [];

    const setting = {
        distance: 10,
        spring: 0.3,
        friction: 0.5,
        size: strokeMax,
        diff: strokeMax / 8
    }
    const canvasRef = useRef(null);
    const p5InstanceRef = useRef(null);
    const { p5InkInstance, setP5InkReady, setInkImageData } = useP5Ink();

    useEffect(() => {
        recognizeHandwriting({
            width: canvasWidth,
            height: canvasHeight
        }, recognizeStrokes, 10, saveResult);
    }, [recognizeStrokes]); // 監測 state 的變化


    useEffect(() => {
        // Ensure we're only creating the p5 instance on the client side
        if (typeof window !== 'undefined' && canvasRef.current) {
            // Sketch function for p5
            const sketch = (p) => {
                let canvas, grid_layer;
                let currentStroke = [[], [], []]; // 0: [Samples of position X], 1: [Samples of position Y], 2: [millseconds since first stroke start] <optional>


                let { distance, spring, friction, size, diff } = setting;
                let x, y, ax, ay, a, r, f //: number
                let oldR //: number;
                let isMax = false

                /* Draw status */
                let drawing = false;
                let drawStartTime = undefined; // Timestamp of first interaction

                p.setup = () => {
                    // 創建主畫布
                    canvas = p.createCanvas(canvasWidth, canvasHeight);
                    write_layer = p.createGraphics(canvasWidth, canvasHeight);
                    grid_layer = p.createGraphics(canvasWidth, canvasHeight);
                    canvas.parent(canvasRef.current);
                    x = y = ax = ay = a = r = f = 0;

                    p.drawGrid();

                };

                p.draw = () => {
                    // p.drawGrid();
                    p.image(grid_layer);
                    // p.image(grid_layer);
                    oldR = r;
                    if (p.mouseIsPressed && p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                        drawing = true
                    }
                    if (p.mouseIsPressed && drawing) {

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

                            write_layer.strokeWeight(oldR + diff);
                            write_layer.line(x, y, oldX, oldY);

                            write_layer.strokeWeight(oldR);
                            write_layer.line(x + diff * 2, y + diff * 2, oldX + diff * 2, oldY + diff * 2);
                            write_layer.line(x - diff, y - diff, oldX - diff, oldY - diff);
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
                    p.clear();
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
                p.saveCanvasToBuffer = () => {
                    const canvas = p.canvas; // 獲取 HTML Canvas 元素
                    const dataUrl = canvas.toDataURL("image/png"); // 將畫布轉為 Base64
                    setInkImageData(dataUrl); // 將 Base64 數據存入 Context
                };


                p.drawGrid = () => {
                    // console.log('drawGrid!!!')
                    // if (grid_layer == null) return
                    // grid_layer.current?.clear(); // 清除之前的繪製內容
                    // if (grid_layer == null) return

                    console.log('is showGrid!!!')
                    // 設置外邊距
                    const padding = 20; // 你可以根據需要調整這個值
                    const gridWidth = canvasWidth - 2 * padding; // 格線的寬度
                    const gridHeight = canvasHeight - 2 * padding; // 格線的高度

                    // 繪製格子的邊框（2px）
                    grid_layer.current.stroke('red');
                    grid_layer.current.strokeWeight(2); // 設置邊框線條寬度為 2px

                    // 垂直線
                    for (let i = 0; i <= GRID_COLS; i++) {
                        const x = padding + i * gridWidth / GRID_COLS;
                        grid_layer.line(x, padding, x, padding + gridHeight);
                    }

                    // 水平線
                    for (let i = 0; i <= GRID_ROWS; i++) {
                        const y = padding + i * gridHeight / GRID_ROWS;
                        grid_layer.line(padding, y, padding + gridWidth, y);
                    }

                    // 繪製每個格子的「米」字線（1px）
                    grid_layer.strokeWeight(1); // 設置「米」字線條寬度為 1px
                    for (let col = 0; col < GRID_COLS; col++) {
                        for (let row = 0; row < GRID_ROWS; row++) {
                            const x1 = padding + col * gridWidth / GRID_COLS; // 格子左邊界
                            const x2 = padding + (col + 1) * gridWidth / GRID_COLS; // 格子右邊界
                            const y1 = padding + row * gridHeight / GRID_ROWS; // 格子上邊界
                            const y2 = padding + (row + 1) * gridHeight / GRID_ROWS; // 格子下邊界

                            // 十字線（垂直和水平線）
                            const midX = (x1 + x2) / 2; // 格子中間的垂直線
                            const midY = (y1 + y2) / 2; // 格子中間的水平線
                            grid_layer.line(midX, y1, midX, y2); // 垂直線
                            grid_layer.line(x1, midY, x2, midY); // 水平線

                            // 對角線（左上到右下，右上到左下）
                            grid_layer.line(x1, y1, x2, y2); // 左上到右下
                            grid_layer.line(x2, y1, x1, y2); // 右上到左下
                        }

                    }

                    // 將格線畫到主畫布上
                    // p.stroke(0);

                    


                };

            };

            // Create p5 instance
            p5InstanceRef.current = new p5(sketch);

            p5InkInstance.current = p5InstanceRef.current;
            return () => {
                p5InstanceRef.current?.remove();
            };
        }
    }, [canvasWidth]);


    useEffect(() => {
        if (!showGrid) {
            p5InstanceRef.current?.clear();
        }
        p5InstanceRef.current?.drawGrid();
    }, [showGrid]);

    //   useEffect(() => {
    //         if (p5Instance.current) {

    //             if (p5Instance.current.drawingLayer) {  
    //                 p5Instance.current.changeColor(selectedColor);
    //                 p5Instance.current.changeSize(brushSize);
    //             }
    //         }
    //     }, [selectedColor,brushSize]);

    // Method to clear canvas from outside
    const clearCanvas = () => {
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
            <div ref={canvasRef} className="canvas-container bg-white" ></div>
        </div>
    );
}


export default CalligraphyPoemCanva;