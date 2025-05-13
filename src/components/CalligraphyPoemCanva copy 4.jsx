
import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import recognizeHandwriting from '../utils/recognizeHandwriting';
// import { Stroke } from '../types';

// type p5ContextType = p5 | null;
import { useImageContext } from '../contexts/ImageContext';
import { useP5Ink } from '../contexts/p5InkContext';
import { Switch } from '@heroui/react';
import { usePageNavigation } from '../contexts/PageContext';



const CalligraphyPoemCanva = ({ canvasWidth, canvasHeight }) => {
    const { recognizeStrokes, setRecognizeStrokes, buttons, setButtons } = useImageContext();
    const strokeMax = 10;
    const { currentPage } = usePageNavigation();
    const isOnPage = useRef(false);


    // console.log(canvasWidth, canvasHeight, 'canvasWidth, canvasHeight!!!')

    useEffect(() => {
        isOnPage.current = currentPage === 2;

        if (!isOnPage.current) {
            p5InstanceRef.current?.noLoop()
        } else {
            p5InstanceRef.current?.loop()
        }

    }, [currentPage]);

    const setting = {
        distance: 10,
        spring: 0.3,
        friction: 0.5,
        size: strokeMax,
        diff: strokeMax + 2 / 8
    }

    // const setting = {
    //     distance: 10,
    //     spring: 0.3,
    //     friction: 0.5,
    //     size: strokeMax + 2,
    //     diff: strokeMax + 2 / 8
    // }
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
                let canvas
                let currentStroke = [[], [], []]; // 0: [Samples of position X], 1: [Samples of position Y], 2: [millseconds since first stroke start] <optional>
                let strokes = [];

                let { distance, spring, friction, size, diff } = setting;
                let x, y, ax, ay, a, r, f //: number
                let oldR //: number;
                let isMax = false

                /* Draw status */
                let drawing = false;
                let drawStartTime = undefined; // Timestamp of first interaction


                p.setup = () => {
                    // 創建主畫布
                    p.pixelDensity(1);
                    canvas = p.createCanvas(canvasWidth, canvasHeight);
                    canvas.parent(canvasRef.current);
                    x = y = ax = ay = a = r = f = 0;
                    p.noLoop()
                };

                p.draw = () => {
                    // console.log('書法draw')
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
                        a *= 1;

                        let targetR;

                        if (isMax) {
                            targetR = size - a * 1.5;
                            // 使用 lerp 讓 r 平滑接近 targetR，0.15 是調整速度的參數
                            r = p.lerp(r, targetR, 0.1);
                        } else {
                            r = r + 0.8;
                            diff = r / 8;
                            if (r >= strokeMax-2) {
                                isMax = true;
                            }
                        }

                        // if (isMax) {
                        //     r = size - a*1.4;

                        // } else {
                        //     r = r + 0.4
                        //     diff = r / 8;
                        //     if (r >= strokeMax) {
                        //         isMax = true
                        //     }
                        // }

                        for (let i = 0; i < distance; ++i) {
                            const oldX = x;
                            const oldY = y;
                            x += ax / distance;
                            y += ay / distance;

                            oldR += (r - oldR) / distance * 2;

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

                p.drawStroke = (stroke) => {
                    oldR = r;
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

                        if (isMax) {
                            r = size - a * 1.4;

                        } else {
                            r = r + 0.4
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
                            oldR += (r - oldR) / distance * 2;


                            if (oldR < 1) oldR = 1;

                            p.strokeWeight(oldR + diff);
                            p.line(x, y, oldX, oldY);
                            p.strokeWeight(oldR);
                            p.line(x + diff * 2, y + diff * 2, oldX + diff * 2, oldY + diff * 2);
                            p.line(x - diff, y - diff, oldX - diff, oldY - diff);
                        }
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
                    // p.background(255);
                    p.clear()
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
                            x = y = ax = ay = a = r = f = 0;
                            isMax = false
                            // r = 0
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



                p.getRecognizeStrokes = () => (recognizeStrokes.length ? recognizeStrokes : [[[], [], []]]);
                p.resetRecognizeStrokes = () => {
                    // recognizeStrokes = [];
                    setRecognizeStrokes([])
                }
                    ;
                p.saveCanvasToBuffer = () => {
                    const canvas = p.canvas;
                    // console.log(canvas.width, canvas.height, 'canvas!!!')
                    const img = p.get(); // 取得當前畫布影像
                    img.loadPixels();

                    let left = canvas.width;
                    let right = 0;
                    let top = canvas.height;
                    let bottom = 0;

                    // 掃描所有像素找出邊界
                    for (let y = 0; y < canvas.height; y++) {
                        for (let x = 0; x < canvas.width; x++) {
                            const idx = (y * canvas.width + x) * 4;
                            if (img.pixels[idx + 3] > 0) { // 檢查 alpha 通道
                                if (x < left) left = x;
                                if (x > right) right = x;
                                if (y < top) top = y;
                                if (y > bottom) bottom = y;
                            }
                        }
                    }

                    // 處理完全空白畫布的情況
                    if (left > right || top > bottom) {
                        left = top = 0;
                        right = bottom = 1;
                    }

                    // 計算裁切範圍
                    const width = right - left + 1;
                    const height = bottom - top + 1;

                    // 建立新畫布並複製內容
                    const buffer = p.createGraphics(width, height);
                    buffer.image(img, -left, -top);
                    // console.log(buffer,width, height, 'buffer')
                    // 轉換為 Base64
                    const dataUrl = buffer.elt.toDataURL("image/png");
                    //show image in blank website
                    // window.open(dataUrl, '_blank');
                    // console.log(dataUrl, 'dataUrl')
                    setInkImageData(dataUrl);
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

        <div ref={canvasRef} className="canvas-container absolute" ></div>

    );
}


export default CalligraphyPoemCanva;