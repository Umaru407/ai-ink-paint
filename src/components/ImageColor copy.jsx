
import React, { useEffect, useRef, useState } from 'react';
import { useSelectImageContext } from '../contexts/SelectImageContext';
import p5 from 'p5';


// type p5ContextType = p5 | null;


// 擴展 p5 型別
// declare module 'p5' {
//     interface p5InstanceExtensions {
//         changeColor: (color: string) => void;
//         drawingLayer: p5.Graphics;
//     }
// }


// pages/color-palette.tsx
const colors = [
    '#992b39', '#FF7F00', '#FFFF00', '#7FFF00', '#00FF00',
    '#00FF7F', '#00FFFF', '#007FFF', '#0000FF', '#7F00FF',
    '#FF00FF', '#FF007F', '#7F7F7F', '#BFBFBF', '#FFFFFF',
    '#FFA07A', '#20B2AA', '#778899',
];

function ColorPalette({ selectedColor, setSelectedColor }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '20px' }}>
            {colors.map((color, index) => (
                <div key={index} onClick={() => {
                    setSelectedColor(color)
                    // console.log(color,'color')

                }} style={{ backgroundColor: color, width: '50px', height: '50px', borderRadius: '4px', border: '1px solid #000' }}></div>
            ))}
        </div>
    );
}

export default function ImageColor({ selectedColor }) {

    const { selectImage } = useSelectImageContext();
    // const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [brushSize, setBrushSize] = useState(20);
    const canvasRef = useRef(null);
    const p5Instance = useRef(null);

    let strokes = []; // 用來保存所有的筆劃
    let tempStroke = { color: 'ffffff', size: brushSize, points: [] };  // 當前筆劃的暫存

    // function initTempStroke() { // 初始化當前筆劃   
    //     console.log(selectedColor, 'selectedColor2')
    //     tempStroke = { color: selectedColor, size: brushSize, points: [] };
    //     console.log(tempStroke, 'tempStroke')
    //     const newStroke = tempStroke
    //     return newStroke
    // }

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


            let dragging = false; // Is the object being dragged?
            let resizing = false; // Is the object being resized?
            let rollover = false; // Is the mouse over the object?
            let editMode = false; // Is the object in edit mode?

            let x, y, w, h; // Location and size
            let offsetX, offsetY; // Mouseclick offset
            let aspectRatio; // Aspect ratio of the image

            let handleSize = 10; // Size of resize handle

            p.changeColor = (color) => {    // 更改當前筆劃的顏色       
                tempStroke.color = color;
            }


            p.preload = () => {
                img = p.loadImage(selectImage);
                img2 = p.loadImage('3.png');
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
                w = 100;
                h = 100;
                // Calculate initial aspect ratio
                aspectRatio = w / h;

                // stickyNote = p.createDiv('Note');
                // stickyNote.position(500, 0);
                // stickyNote.size(80, 20);
                // stickyNote.style('font-size', '16px');
                // stickyNote.style('font-family', 'Comic Sans MS');
                // stickyNote.style('background', 'orchid');
                // stickyNote.style('padding', '5px');

                // // Make the note draggable.
                // stickyNote.draggable();


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

                if (p.mouseIsPressed) {
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

            p.mouseReleased = () => {
                // 當鼠標釋放時，將當前筆劃保存到 strokes 數組中
                if (tempStroke.points.length > 1) {
                    console.log(tempStroke, 'tempStroke!!!')
                    strokes.push(tempStroke);
                }
                tempStroke.points = []; // 初始化當前筆劃
                // tempStroke =  initTempStroke()
                // console.log(tempStroke,'!!!!!!')
            };

            p.touchEnded = () => {
                if (tempStroke.points.length > 1) {
                    console.log(tempStroke, 'tempStroke!!!')
                    strokes.push(tempStroke);
                }
                tempStroke.points = []; // 初始化當前筆劃
            }

            p.mousePressed = () => {

                // tempStroke = { color: selectedColor, size: brushSize, points: [] }; // 初始化當前筆劃
                // console.log(tempStroke,'tempStroke')
            };
        };

        p5Instance.current = new p5(sketch);

        return () => {
            if (p5Instance.current) {
                p5Instance.current.remove();
            }
        };
    }, [selectImage]);

    // Update brush color when color changes
    useEffect(() => {
        if (p5Instance.current) {

            if (p5Instance.current.drawingLayer) {
                // console.log(p5Instance.current.drawingLayer,'changecolor')
                console.log(selectedColor, 'selectedColor')
                p5Instance.current.drawingLayer.stroke(selectedColor);
                p5Instance.current.changeColor(selectedColor);
                // initTempStroke()

            }
        }
    }, [selectedColor]);


    return (
        <div id='canvas-container' >
        </div>
    );
}