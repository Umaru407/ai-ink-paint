import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';

// import { useP5Sign } from '../contexts/p5SignContext';
// import { useP5Paint } from '../contexts/p5PaintContext';
const Piece = ({ image }) => {
    const canvasRef = useRef()

    // console.log(image,'@@@@@@@@@@@@')
    // const {p5PaintInstance} = useP5Paint()
    //   const [mode, setEditMode] = useState(false);

    useEffect(() => {
        // Ensure we're only creating the p5 instance on the client side
        if (typeof window !== 'undefined' && canvasRef.current) {
            // Sketch function for p5
            const sketch = (p) => {
                let canvas
                let canvasHeight
                let canvasWidth
                let img, img2

                const calculateCanvasSize = () => {
                    const windowHeight = window.innerHeight * 5.5 / 6;
                    const aspectRatio = img.width / img.height;
                    canvasHeight = windowHeight;
                    canvasWidth = windowHeight * aspectRatio;
                };


                p.preload = () => {
                    img = p.loadImage('/scroll.png');
                    if(image){
                        img2 = p.loadImage(image);
                    }
                    
                };

                p.setup = () => {

                    calculateCanvasSize()

                    const container = document.getElementById('piece-container');
                    const canvas = p.createCanvas(canvasWidth, canvasHeight,);
                    if (container) {
                        canvas.parent(container);
                    }



                    // p.background(255, 204, 0);
                    p.image(img, 0, 0, p.width, p.height, 0, 0, img.width, img.height, p.CONTAIN);
                    // 計算並繪製第二張圖片在中心位置
                    if (img2) {
                        // 計算 img2 的縮放尺寸（保持原比例）
                        const scale = Math.min(
                            p.width / img2.width * 0.8,
                            p.height / img2.height * 0.8
                        );

                        const newWidth = img2.width * scale;
                        const newHeight = img2.height * scale;

                        // 計算中心位置
                        const x = (p.width - newWidth) / 2;
                        const y = (p.height - newHeight) / 2;

                        // 設定邊框樣式
                        const borderWidth = 1; // 邊框寬度
                        const borderColor = '#6C695E'; // 黑色邊框

                        // 先繪製邊框（一個稍大的矩形）
                        p.noFill();
                        p.stroke(borderColor);
                        p.strokeWeight(borderWidth);
                        p.rect(
                            x - borderWidth / 2,
                            y - borderWidth / 2,
                            newWidth + borderWidth,
                            newHeight + borderWidth
                        );

                        // 在中心繪製 img2
                        p.image(img2, x, y, newWidth, newHeight);
                    }

                    // p.image
                    // p.createCanvas(400, 400);
                    // graphicsRef.current = p.createGraphics(canvasWidth, canvasHeight); // 初始化 graphics
                    // setSharedGraphics(graphicsRef.current); // 傳遞給父組件

                    // canvas.parent(canvasRef.current);
                    // graphicsRef.current.background('red')
                    // graphicsRef.current.stroke('#ffffff')
                    // graphicsRef.current.strokeWeight(15); // 設定邊框寬度為 2 像素
                    // graphicsRef.current.noFill(); // 設定內部不填充

                    // // 畫一個只有白色邊框的長方形
                    // graphicsRef.current.rect(30, 30, canvasWidth - 60, canvasHeight - 60);
                    // x = y = ax = ay = a = r = f = 0;
                };
            };
            const p5Instance = new p5(sketch);

            return () => {
                p5Instance.remove();
            };
        }
    }, [image]);

    // // Method to clear canvas from outside
    // const clearCanvas = () => {
    //     // p5SignInstance.current?.saveCanvas("myCanvas", "png");
    //     // p5SignInstance.current?.saveCanvasToBuffer()


    //     p5InstanceRef.current?.clearCanvas();

    //     graphicsRef.current.background('red')
    //                 graphicsRef.current.stroke('#ffffff')
    //                 graphicsRef.current.strokeWeight(15); // 設定邊框寬度為 2 像素
    //                 graphicsRef.current.noFill(); // 設定內部不填充

    //                 // 畫一個只有白色邊框的長方形
    //                 graphicsRef.current.rect(30, 30, canvasWidth - 60, canvasHeight - 60);
    // };




    return (
        <div ref={canvasRef} id='piece-container' className="paper flex flex-col justify-center items-center flex-grow ">

        </div>
    );
}


export default Piece;