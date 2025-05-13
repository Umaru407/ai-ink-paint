import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import recognizeHandwriting from '../utils/recognizeHandwriting';
// import { Stroke } from '../types';

import { useImageContext } from '../contexts/ImageContext';
import { useP5Ink } from '../contexts/p5InkContext';
import { Switch } from '@heroui/react';
import { usePageNavigation } from '../contexts/PageContext';

const CalligraphyPoemCanva = ({ canvasWidth, canvasHeight, isEraser }) => {
    const { recognizeStrokes, setRecognizeStrokes, buttons, setButtons } = useImageContext();
    const strokeMax = 11;
    // const [isEraser, setIsEraser] = useState(false);
    const eraserRef = useRef(false);

    // Sync ref for p5 sketch
    useEffect(() => {
        eraserRef.current = isEraser;
    }, [isEraser]);

    const { currentPage } = usePageNavigation();
    const isOnPage = useRef(false);

    // Control loop based on page
    useEffect(() => {
        isOnPage.current = currentPage === 2;
        if (!isOnPage.current) {
            p5InstanceRef.current?.noLoop();
        } else {
            p5InstanceRef.current?.loop();
        }
    }, [currentPage]);

    const setting = {
        distance: 8,
        spring: 0.3,
        friction: 0.5,
        size: strokeMax + 2,
        diff: (strokeMax + 2) / 8,
    };

    const canvasRef = useRef(null);
    const p5InstanceRef = useRef(null);
    const { p5InkInstance, setP5InkReady, setInkImageData } = useP5Ink();

    // Trigger handwriting recognition on strokes update
    // useEffect(() => {
    //     recognizeHandwriting(
    //         { width: canvasWidth, height: canvasHeight },
    //         recognizeStrokes,
    //         10,
    //         saveResult
    //     );
    // }, [recognizeStrokes]);

    // Initialize p5 sketch
    useEffect(() => {
        if (typeof window !== 'undefined' && canvasRef.current) {
            const sketch = (p) => {
                let canvas;
                let currentStroke = [[], [], []];
                let strokes = [];

                let { distance, spring, friction, size, diff } = setting;
                let x = 0,
                    y = 0,
                    ax = 0,
                    ay = 0,
                    a = 0,
                    r = 0,
                    f = 0;
                let oldR = 0;
                let isMax = false;
                const eraserSize = 30;

                let drawing = false;
                let drawStartTime;
                let strokeFrame = 0;

                p.setup = () => {
                    p.pixelDensity(1);
                    canvas = p.createCanvas(canvasWidth, canvasHeight);
                    canvas.parent(canvasRef.current);
                    p.noLoop();

                };

                p.draw = () => {




                    oldR = r;
                    if (
                        p.mouseIsPressed &&
                        p.mouseX >= 0 &&
                        p.mouseX <= p.width &&
                        p.mouseY >= 0 &&
                        p.mouseY <= p.height
                    ) {
                        drawing = true;
                    }
                    if (p.mouseIsPressed && drawing) {
                        // Toggle erase mode
                        if (isEraser) p.erase(); else p.noErase();

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
                            strokeFrame = 0;
                        }

                        // spring physics
                        ax += (mX - x) * spring;
                        ay += (mY - y) * spring;
                        ax *= friction;
                        ay *= friction;
                        a += p.sqrt(ax * ax + ay * ay) - a;
                        a *= 0.8;

                        strokeFrame++;
                        if (isMax) {
                            const targetR = size - a * 1.5;
                            r = p.lerp(r, targetR, 0.2);
                        } else {
                            const maxFrames = 10;
                            const t = Math.min(strokeFrame / maxFrames, 1);
                            const threshold = 0.7;
                            const startRatio = 0.6;
                            let easedT;
                            if (t < threshold) easedT = startRatio * (t / threshold);
                            else {
                                const tt = (t - threshold) / (1 - threshold);
                                easedT = startRatio + (1 - startRatio) * tt * tt;
                            }
                            r = (strokeMax - 2) * easedT;
                            diff = r / 8;
                            if (t > 0.9) isMax = true;
                        }

                        // Draw or erase
                        for (let i = 0; i < distance; i++) {
                            const oldX = x;
                            const oldY = y;
                            x += ax / distance;
                            y += ay / distance;
                            oldR += ((r - oldR) / distance) * 2;
                            if (oldR < 1) oldR = 1;

                            if (eraserRef.current) {
                                // 進入擦除模式
                                p.erase();
                                p.strokeWeight(eraserSize);
                                p.line(x, y, oldX, oldY);
                                // 離開擦除模式
                                p.noErase();
                            } else {
                                p.strokeWeight(oldR + diff);
                                p.line(x, y, oldX, oldY);
                                p.strokeWeight(oldR);
                                p.line(x + diff * 2, y + diff * 2, oldX + diff * 2, oldY + diff * 2);
                                p.line(x - diff, y - diff, oldX - diff, oldY - diff);
                            }
                        }

                        if (eraserRef.current) p.noErase();
                    } else if (f) {
                        ax = ay = a = f = 0;
                        isMax = false;
                        r = 0;
                        strokeFrame = 0;
                    }
                };

                // ... rest of methods unchanged ...
                // p.drawStroke = (stroke) => { /* ... */ };
                p.mouseReleased = (e) => p.endDraw(e);
                p.touchEnded = (e) => p.endDraw(e);
                p.clearCanvas = () => { p.clear(); };
                p.endDraw = (e) => { if (drawing) drawing = false; };
                // p.saveStrokeStep = () => { /* ... */ };
                // p.undoLastStroke = () => { /* ... */ };
                p.getMillsecondFromStrokeStart = () => {
                    if (drawStartTime !== undefined) {
                        return new Date().getTime() - drawStartTime;
                    }
                    drawStartTime = new Date().getTime();
                    return 0;
                };
                p.getCanvasSize = () => ({ width: canvasWidth, height: canvasHeight });
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

            p5InstanceRef.current = new p5(sketch);
            p5InkInstance.current = p5InstanceRef.current;
            return () => p5InstanceRef.current?.remove();
        }
    }, [canvasWidth]);

    const saveResult = (result) => setButtons(result);

    return (

        <div ref={canvasRef} className="canvas-container absolute" />

    );
};

export default CalligraphyPoemCanva;
