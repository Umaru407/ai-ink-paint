import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';

import { useP5Paint } from '../contexts/p5PaintContext';
import { usePageNavigation } from '../contexts/PageContext';

const SignCanvas = ({ selectedStamp = '/印章.png', setSharedGraphics, editMode, setEditMode }) => {
    const { p5PaintInstance } = useP5Paint()
    // const [mode, setEditMode] = useState(false);
    let bgImage;

    const { currentPage, goToPage } = usePageNavigation();
    const isOnPage = useRef(false);

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

    const canvasRef = useRef();
    const graphicsRef = useRef(); // 保存 graphics 對象
    const p5InstanceRef = useRef(null);


    let canvasHeight = 800
    let canvasWidth = 280;

    useEffect(() => {
        // Ensure we're only creating the p5 instance on the client side
        if (typeof window !== 'undefined' && canvasRef.current) {
            // Sketch function for p5
            const sketch = (p) => {
                let canvas

                p.preload = () => {
                    bgImage = p.loadImage('/印章.png'); // 替换为你的 SVG 文件路径
                    // console.log(bgImage, 'bgImage')
                }

                p.setup = () => {
                    canvas = p.createCanvas(canvasWidth, canvasHeight);
                    graphicsRef.current = p.createGraphics(canvasWidth, canvasHeight); // 初始化 graphics
                    canvas.parent(canvasRef.current);
                    if (bgImage) {
                        graphicsRef.current.image(bgImage, 0, 0, canvasWidth, canvasHeight); // 将 SVG 图像拉伸到画布大小
                    }

                    p.noLoop()
                };
            }

            // Create p5 instance
            p5InstanceRef.current = new p5(sketch);

            // p5SignInstance.current = p5InstanceRef.current;
            // console.log(p5SignInstance,'789')
            // Cleanup function
            return () => {
                p5InstanceRef.current?.remove();
            };
        }
    }, []);


    return (
        <div ref={canvasRef} className="canvas-container bg-white w-min absolute" ></div>
    );
}

export default SignCanvas;