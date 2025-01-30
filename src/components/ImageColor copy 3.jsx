import { useP5Ink } from '../contexts/p5InkContext';
import React, { useEffect, useRef, useState } from 'react';
import { useSelectImageContext } from '../contexts/SelectImageContext';

import p5 from 'p5';
import { useP5Paint } from '../contexts/p5PaintContext';


export default function ImageColor({sharedGraphics, selectedColor,brushSize }) {

    const { selectImage } = useSelectImageContext();
    const {p5PaintInstance,setPaintImageData} = useP5Paint()
   const {inkImageData} =  useP5Ink()
    // const [selectedColor, setSelectedColor] = useState(colors[0]);
    // const [brushSize, setBrushSize] = useState(20);
    const canvasRef = useRef(null);
    const p5Instance = useRef(null);

    let strokes = []; // 用來保存所有的筆劃
    let tempStroke = { color: selectedColor, size: brushSize, points: [] };  // 當前筆劃的暫存


    useEffect(() => {
        if (!selectImage) return;

        if (p5Instance.current) {
            p5Instance.current.remove();
        }

        const sketch = (p) => {
            let img
            let img2;
            // let stickyNote;
            let canvasWidth
            let canvasHeight
            let drawingLayer
            let scale = 6; // Scale factor for resizing

            let dragging = false; // Is the object being dragged?
            let resizing = false; // Is the object being resized?
            let rollover = false; // Is the mouse over the object?
            let editMode = false; // Is the object in edit mode?

            let x, y, w, h; // Location and size
            let offsetX, offsetY; // Mouseclick offset
            let aspectRatio; // Aspect ratio of the image

            let handleSize = 10; // Size of resize handle

            p.changeEditMode = (mode)=>{
                editMode = mode
            }

            p.changeColor = (color) => {    // 更改當前筆劃的顏色       
                tempStroke.color = color;
            }
            p.changeSize = (size)=>{
                tempStroke.size = size
            }


            p.preload = () => {
                img = p.loadImage(selectImage);
                img2 = p.loadImage(inkImageData);
            };

            const calculateCanvasSize = () => {
                const windowHeight = window.innerHeight * 4 / 6;
                const aspectRatio = img.width / img.height;
                canvasHeight = windowHeight;
                canvasWidth = windowHeight * aspectRatio;
            };

            p.setup = () => {

                // Starting location
                x = 100;
                y = 100;

                // Dimensions
                
                w = img2.width/scale;
                h = img2.height/scale;

                // Calculate initial aspect ratio
                aspectRatio = w / h;


                const container = document.getElementById('canvas-container');
                const canvas = p.createCanvas(img.width, img.height);
                if (container) {
                    canvas.parent(container);
                }

                // 初始化繪圖圖層
                calculateCanvasSize();
                p.resizeCanvas(canvasWidth, canvasHeight);
                drawingLayer = p.createGraphics(canvasWidth, canvasHeight);
                p.drawingLayer = drawingLayer
                drawingLayer.clear();  // 確保繪圖圖層一開始是透明的
                // drawingLayer.filter(p.BLUR, 3);
                drawingLayer.drawingContext.filter = 'blur(6px)';
                // 設置繪圖圖層的基本屬性
                drawingLayer.stroke(selectedColor);
                drawingLayer.strokeWeight(brushSize);
                drawingLayer.noFill();
            };

            p.windowResized = () => {
                // 重新計算尺寸
                calculateCanvasSize();
                p.resizeCanvas(canvasWidth, canvasHeight);

            };

            p.draw = () => {
                // 清除主畫布
                p.clear();
                p.image(img, 0, 0, canvasWidth, canvasHeight);



                // Check if mouse is over the image
                if (p.mouseX > x && p.mouseX < x + w && p.mouseY > y && p.mouseY < y + h) {
                    rollover = true;
                } else {
                    rollover = false;
                }

                // Adjust location if being dragged
                if (dragging) {
                    x = p.mouseX + offsetX;
                    y = p.mouseY + offsetY;
                }

                // Adjust size if being resized
                if (resizing) {
                    let newW = p.mouseX - x;
                    let newH = newW / aspectRatio;

                    // Ensure minimum size
                    newW = p.max(newW, 20);
                    newH = p.max(newH, 20 / aspectRatio);

                    scale =img2.width/ newW  ;
                    w = newW;
                    h = newH;
                }

                // Draw the image
                p.image(img2, x, y, w, h);
                if (sharedGraphics) {
                    // 獲取 sharedGraphics 的像素數據
                    sharedGraphics.loadPixels(); // 加載像素數據
                
                    // 遍歷每個像素
                    for (let i = 0; i < sharedGraphics.pixels.length; i += 4) {
                        const r = sharedGraphics.pixels[i];
                        const g = sharedGraphics.pixels[i + 1];
                        const b = sharedGraphics.pixels[i + 2];
                
                        // 判斷是否為白色（或接近白色）
                        if (r > 240 && g > 240 && b > 240) {
                            sharedGraphics.pixels[i + 3] = 0; // 將 alpha 值設為 0（透明）
                        }
                    }
                
                    sharedGraphics.updatePixels(); // 更新像素數據
                
                    // 將修改後的 sharedGraphics 繪製到主畫布上
                    p.image(sharedGraphics, x - w / 5, y + h - h / 5, sharedGraphics.width / scale * 0.7, sharedGraphics.height / scale * 0.7);
                }

                // Draw bounding box and handle only if in edit mode
                if (editMode) {
                    p.noFill();
                    p.stroke(0);
                    p.rect(x, y, w, h);

                    // Draw resize handle
                    p.fill(0);
                    p.noStroke();
                    p.rect(x + w - handleSize / 2, y + h - handleSize / 2, handleSize, handleSize);
                }




                if (!p.mouseIsPressed) {

                    for (let stroke of strokes) {
                        // console.log(stroke,'stroke')

                        drawingLayer.stroke(stroke.color);
                        drawingLayer.strokeWeight(stroke.size);
                        for (let i = 0; i < stroke.points.length - 1; i++) {
                            drawingLayer.line(stroke.points[i].x, stroke.points[i].y, stroke.points[i + 1].x, stroke.points[i + 1].y);
                        }
                        // drawingLayer.drawingContext.filter = 'none';
                    }


                    // drawingLayer.filter(p.NORMAL);

                }
                // 繪製所有已保存的筆劃

                if (p.mouseIsPressed && !editMode) {
                    // console.log('draw')
                    tempStroke.points.push({ x: p.mouseX, y: p.mouseY }); // 記錄鼠標位置

                    // 在臨時筆劃上繪製

                    drawingLayer.stroke(tempStroke.color);
                    // drawingLayer.strokeWeight(27);
                    if (tempStroke.points.length > 1) {
                        let lastPoint = tempStroke.points[tempStroke.points.length - 2];
                        // drawingLayer.drawingContext.filter = 'blur(1px)';
                        drawingLayer.line(lastPoint.x, lastPoint.y, p.mouseX, p.mouseY);
                        // drawingLayer.drawingContext.filter = 'none';
                    }

                }

                // 如果鼠標按下，記錄當前筆劃


                // 顯示繪圖圖層
                p.blendMode(p.SOFT_LIGHT);

                p.image(drawingLayer, 0, 0);
                // drawingLayer.filter(p.NORMAL, 1);
                p.blendMode(p.BLEND);


               


            };

            p.mousePressed = () => {
                console.log('mousepress')
                // Check if mouse is over the resize handle
                if (
                    editMode &&
                    p.mouseX > x + w - handleSize / 2 &&
                    p.mouseX < x + w + handleSize / 2 &&
                    p.mouseY > y + h - handleSize / 2 &&
                    p.mouseY < y + h + handleSize / 2
                ) {
                    resizing = true;
                }
                // Check if mouse is over the image
                else if (p.mouseX > x && p.mouseX < x + w &&p.mouseY > y && p.mouseY < y + h &&editMode) {
                    dragging = true;
                    offsetX = x - p.mouseX;
                    offsetY = y -p.mouseY;
                    // editMode = true; // Enter edit mode
                    // p.changeEditMode(true)
                } else {
                    // editMode = false; // Exit edit mode
                    // p.changeEditMode(false)
                }
            }

            p.mouseReleased = () => {
                // Quit dragging or resizing
                dragging = false;
                resizing = false;
                // 當鼠標釋放時，將當前筆劃保存到 strokes 數組中
                if (tempStroke.points.length > 1) {
                    // console.log(tempStroke, 'tempStroke!!!')
                    strokes.push(tempStroke);
                }
                tempStroke.points = []; // 初始化當前筆劃
                // tempStroke =  initTempStroke()
                // console.log(tempStroke,'!!!!!!')
            };

            p.touchStarted = ()=>{
                console.log('touchstart')

                // console.log('mousepress')
                // Check if mouse is over the resize handle
                if (
                    editMode &&
                    p.mouseX > x + w - handleSize / 2 &&
                    p.mouseX < x + w + handleSize / 2 &&
                    p.mouseY > y + h - handleSize / 2 &&
                    p.mouseY < y + h + handleSize / 2
                ) {
                    resizing = true;
                }
                // Check if mouse is over the image
                else if (p.mouseX > x && p.mouseX < x + w &&p.mouseY > y && p.mouseY < y + h && editMode) {
                    dragging = true;
                    offsetX = x - p.mouseX;
                    offsetY = y -p.mouseY;
                    // editMode = true; // Enter edit mode
                    // p.changeEditMode(true)
                } else {
                    // editMode = false; // Exit edit mode
                    // p.changeEditMode(false)
                }
            }

            p.touchEnded = () => {
                dragging = false;
                resizing = false;

                if (tempStroke.points.length > 1) {
                    // console.log(tempStroke, 'tempStroke!!!')
                    strokes.push(tempStroke);
                }
                tempStroke.points = []; // 初始化當前筆劃
            }

            // 自定義方法，將畫布保存為 Base64 圖片數據
            p.saveCanvasToBuffer = () => {
                const canvas = p.canvas; // 獲取 HTML Canvas 元素
                const dataUrl = canvas.toDataURL("image/png"); // 將畫布轉為 Base64
                // console.log(dataUrl,'777')
                setPaintImageData(dataUrl); // 將 Base64 數據存入 Context
            };

            // p.mousePressed = () => {

            //     // tempStroke = { color: selectedColor, size: brushSize, points: [] }; // 初始化當前筆劃
            //     // console.log(tempStroke,'tempStroke')
            // };
        };

        
        p5Instance.current = new p5(sketch);
        p5PaintInstance.current = p5Instance.current



        return () => {
            if (p5Instance.current) {
                p5Instance.current.remove()
            }
        };
    }, [selectImage]);

    

    // Update brush color when color changes
    useEffect(() => {
        if (p5Instance.current) {

            if (p5Instance.current.drawingLayer) {  
                p5Instance.current.changeColor(selectedColor);
                p5Instance.current.changeSize(brushSize);
            }
        }
    }, [selectedColor,brushSize]);


    return (
        <div>
            <h1 className='text-6xl text-center mb-4'>上色</h1>
            <div id='canvas-container' >
            </div>
        
        </div>);
}