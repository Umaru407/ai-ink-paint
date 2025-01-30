import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import { usePageNavigation } from '../contexts/PageContext';
import { useP5Paint } from '../contexts/p5PaintContext';
import { useP5Ink } from '../contexts/p5InkContext';
import { useSelectImageContext } from '../contexts/SelectImageContext';

const ImageColor = ({ sharedGraphics }) => {
    const canvasRef = useRef(null);
    const { currentPage, goToPage } = usePageNavigation();
    const p5InstanceRef = useRef(null);
    const isOnPage = useRef(false);

    const { selectImage } = useSelectImageContext();
    const { p5PaintInstance, setPaintImageData } = useP5Paint()
    const { inkImageData } = useP5Ink()

    useEffect(() => {
        isOnPage.current = currentPage === 3;

        if (!isOnPage.current) {
            p5InstanceRef.current?.noLoop()
        } else {
            p5InstanceRef.current?.loop()
        }

    }, [currentPage]);

    useEffect(() => {

        if (!selectImage) return;
        // if (p5InstanceRef.current) {
        //     p5InstanceRef.current.remove();
        // }

        // Create new p5 instance
        const sketch = (p) => {
            let bgImage;
            let stampImage;
            let defaultTime = 0.08;
            let runnyColors = false;
            let backgrd = 0;
            let state;
            let brushSize = 3;
            let dryTime = defaultTime;
            let prevMouseX, prevMouseY;
            let sliderDrops, buttonDry, buttonWet, buttonDefault;
            let colorPicker;
            let colorPicked;
            let paint = [];
            let tempPaint1 = [];
            let tempPaint2 = [];
            let bgPixels = [];
            let paintDrop
            let isDrawing = false;

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

            p.changeEditMode = (mode) => {
                editMode = mode
                console.log(editMode, 'editMode')
            }

            p.preload = () => {
                bgImage = p.loadImage(selectImage);
                stampImage = p.loadImage(inkImageData);
            };

            const calculateCanvasSize = () => {
                const windowHeight = window.innerHeight * 4 / 6;
                const aspectRatio = bgImage.width / bgImage.height;
                canvasHeight = windowHeight;
                canvasWidth = windowHeight * aspectRatio;
            };

            const getScaledMouse = () => {
                // console.log('first')
                const canvas = p.canvas;
                // console.log(p.mouseX, 'mouseX')
                // console.log('first',canvas)
                const rect = canvas.getBoundingClientRect();
                return {
                    x: (p.mouseX - rect.left) * (p.width / rect.width),
                    y: (p.mouseY - rect.top) * (p.height / rect.height)
                };
            };

            p.setup = () => {

                // Starting location
                x = 100;
                y = 100;

                // Dimensions

                w = stampImage.width / scale;
                h = stampImage.height / scale;

                // Calculate initial aspect ratio
                aspectRatio = w / h;



                p.pixelDensity(1);
                const canvas = p.createCanvas(bgImage.width/4, bgImage.height/4);
                canvas.parent(canvasRef.current);

                // 初始化繪圖圖層
                // calculateCanvasSize();
                // p.resizeCanvas(canvasWidth, canvasHeight);

                bgImage.resize(p.width, p.height);
                bgImage.loadPixels();
                bgPixels = bgImage.pixels.slice();

                colorPicker = p.createColorPicker("#ed225dff");
                colorPicker.position(0, p.height + 5);
                sliderDrops = p.createSlider(5, 100, 20);
                sliderDrops.position(70, p.height + 5);
                buttonDry = p.createButton("Dry All");
                buttonDry.position(210, p.height + 5);
                buttonWet = p.createButton("Keep Wet");
                buttonWet.position(270, p.height + 5);
                buttonDefault = p.createButton("Default Dry");
                buttonDefault.position(350, p.height + 5);
                state = p.createElement("state", "Default");
                state.position(450, p.height + 5);

                for (let x = 0; x < p.width; x++) {
                    for (let y = 0; y < p.height; y++) {
                        paint.push(backgrd, backgrd, backgrd, 0);
                    }
                }
                tempPaint1 = paint;
                tempPaint2 = paint;
                // p.noLoop();
            };

            p.draw = () => {
                // if (currentPage !== 3) return;
                // console.log('水墨draw')
                // 获取缩放后的鼠标坐标
                let currentMouse = getScaledMouse();
                // console.log(prevMouseX, prevMouseY, currentMouse)

                buttonDry.mousePressed(dry);
                buttonWet.mousePressed(wet);
                buttonDefault.mousePressed(defaultDry);
                paintDrop = sliderDrops.value();
                colorPicked = colorPicker.color();

                if (isDrawing) {
                    addPaint(currentMouse);
                }

                update();
                render();
                p.blendMode(p.SOFT_LIGHT);
                p.image(bgImage, 0, 0);
                p.blendMode(p.BLEND);

                //----------------------------------------------
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

                    scale = stampImage.width / newW;
                    w = newW;
                    h = newH;
                }
                //----------------------------------------------
                p.image(stampImage, x, y, w, h);
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

            };

            function dry() {
                dryTime = 1000;
                state.html("Dry");
            }
            function wet() {
                dryTime = 0.0001;
                state.html("Wet");
            }
            function defaultDry() {
                dryTime = defaultTime;
                state.html("Default");
            }

            p.touchStarted = () => {
                // console.log('start touch')
                isDrawing = true;
            }

            p.touchEnded = () => {
                // console.log('start end')
                isDrawing = false;
                prevMouseX = undefined;
                prevMouseY = undefined;
            }

            p.mousePressed = () => {
                // console.log('start mouse')
                isDrawing = true;
            }

            p.mouseReleased = () => {
                // console.log('start release')
                isDrawing = false;
                prevMouseX = undefined;
                prevMouseY = undefined;
            }

            const addPaint = (currentMouse) => {



                if (p.mouseIsPressed && !editMode) {
                    // console.log('mouseIsPressed',currentMouse)
                    let mx = p.constrain(currentMouse.x, 0, p.width - 1);
                    let my = p.constrain(currentMouse.y, 0, p.height - 1);

                    let distance = p.dist(prevMouseX, prevMouseY, mx, my);
                    let numPoints = p.floor(distance / 1);
                    drawLinePoints(prevMouseX, prevMouseY, mx, my, numPoints);

                    if (mx === prevMouseX && my === prevMouseY) {
                        // console.log('===')
                        renderPoints(mx, my);
                    }
                }


                prevMouseX = currentMouse.x;
                prevMouseY = currentMouse.y;






                // console.log(prevMouseX)
            };

            const drawLinePoints = (x1, y1, x2, y2, points) => {
                for (let i = 0; i < points; i++) {
                    let t = p.map(i, 0, points, 0.0, 1.0);
                    let x = p.round(p.lerp(x1, x2, t));
                    let y = p.round(p.lerp(y1, y2, t));
                    renderPoints(p.constrain(x, 0, p.width - 1), p.constrain(y, 0, p.height - 1));
                }
            };

            const renderPoints = (x, y) => {
                // console.log(x,y)
                x = p.round(x);
                y = p.round(y);
                for (let dx = -brushSize; dx <= brushSize; dx++) {
                    for (let dy = -brushSize; dy <= brushSize; dy++) {
                        let px = x + dx;
                        let py = y + dy;
                        if (px < 0 || px >= p.width || py < 0 || py >= p.height) continue;

                        let distance = p.dist(x, y, px, py);
                        if (distance <= brushSize) {
                            let arrayPos = (px + py * p.width) * 4;
                            let newR = (paint[arrayPos + 0] + colorPicked.levels[0]) / 2;
                            let newG = (paint[arrayPos + 1] + colorPicked.levels[1]) / 2;
                            let newB = (paint[arrayPos + 2] + colorPicked.levels[2]) / 2;
                            let falloff = p.map(distance, 0, brushSize, 1, 0.2);
                            let newN = paint[arrayPos + 3] + paintDrop * falloff;

                            paint.splice(arrayPos, 4, newR, newG, newB, newN);
                        }
                    }
                }
            };

            const update = () => {
                // First pass
                for (let x = 0; x < p.width; x++) {
                    for (let y = 0; y < p.height; y++) {
                        let arrayPos = (x + y * p.width) * 4;
                        if (paint[arrayPos + 3] > 4) {
                            tempPaint1[arrayPos + 3] = paint[arrayPos + 3] - 4;

                            // mix pixel to right
                            if (x < p.width - 1) {
                                tempPaint1[arrayPos + 4] =
                                    (paint[arrayPos + 4] + paint[arrayPos]) / 2;
                                tempPaint1[arrayPos + 5] =
                                    (paint[arrayPos + 5] + paint[arrayPos + 1]) / 2;
                                tempPaint1[arrayPos + 6] =
                                    (paint[arrayPos + 6] + paint[arrayPos + 2]) / 2;
                                tempPaint1[arrayPos + 7] = paint[arrayPos + 7] + 1;
                            }

                            // mix pixel to left
                            if (x > 0) {
                                tempPaint1[arrayPos - 4] =
                                    (paint[arrayPos - 4] + paint[arrayPos]) / 2;
                                tempPaint1[arrayPos - 3] =
                                    (paint[arrayPos - 3] + paint[arrayPos + 1]) / 2;
                                tempPaint1[arrayPos - 2] =
                                    (paint[arrayPos - 2] + paint[arrayPos + 2]) / 2;
                                tempPaint1[arrayPos - 1] = paint[arrayPos - 1] + 1;
                            }

                            // mix pixel below
                            tempPaint1[arrayPos + p.width * 4] =
                                (paint[arrayPos + p.width * 4] + paint[arrayPos]) / 2;
                            tempPaint1[arrayPos + p.width * 4 + 1] =
                                (paint[arrayPos + p.width * 4 + 1] + paint[arrayPos + 1]) / 2;
                            tempPaint1[arrayPos + p.width * 4 + 2] =
                                (paint[arrayPos + p.width * 4 + 2] + paint[arrayPos + 2]) / 2;
                            tempPaint1[arrayPos + p.width * 4 + 3] =
                                paint[arrayPos + p.width * 4 + 3] + 1;

                            // mix pixel above
                            tempPaint1[arrayPos - p.width * 4] =
                                (paint[arrayPos - p.width * 4] + paint[arrayPos]) / 2;
                            tempPaint1[arrayPos - p.width * 4 + 1] =
                                (paint[arrayPos - p.width * 4 + 1] + paint[arrayPos + 1]) / 2;
                            tempPaint1[arrayPos - p.width * 4 + 2] =
                                (paint[arrayPos - p.width * 4 + 2] + paint[arrayPos + 2]) / 2;
                            tempPaint1[arrayPos - p.width * 4 + 3] =
                                paint[arrayPos - p.width * 4 + 3] + 1;
                        }

                        // gradually dry paint
                        tempPaint1[arrayPos + 3] = paint[arrayPos + 3] - dryTime;
                        if (tempPaint1[arrayPos + 3] < 0) {
                            tempPaint1[arrayPos + 3] = 0;
                        }
                    }
                }

                if (runnyColors == true) {
                    paint = tempPaint1;
                }
                else {
                    for (let x = p.width; x > 0; x--) {
                        for (let y = p.height; y > 0; y--) {
                            let arrayPos = (x + y * p.width) * 4;
                            if (paint[arrayPos + 3] > 4) {
                                tempPaint2[arrayPos + 3] = paint[arrayPos + 3] - 4;

                                // mix pixel to right
                                if (x < p.width - 1) {
                                    tempPaint2[arrayPos + 4] =
                                        (paint[arrayPos + 4] + paint[arrayPos]) / 2;
                                    tempPaint2[arrayPos + 5] =
                                        (paint[arrayPos + 5] + paint[arrayPos + 1]) / 2;
                                    tempPaint2[arrayPos + 6] =
                                        (paint[arrayPos + 6] + paint[arrayPos + 2]) / 2;
                                    tempPaint2[arrayPos + 7] = paint[arrayPos + 7] + 1;
                                }

                                // mix pixel to left
                                if (x > 0) {
                                    tempPaint2[arrayPos - 4] =
                                        (paint[arrayPos - 4] + paint[arrayPos]) / 2;
                                    tempPaint2[arrayPos - 3] =
                                        (paint[arrayPos - 3] + paint[arrayPos + 1]) / 2;
                                    tempPaint2[arrayPos - 2] =
                                        (paint[arrayPos - 2] + paint[arrayPos + 2]) / 2;
                                    tempPaint2[arrayPos - 1] = paint[arrayPos - 1] + 1;
                                }

                                // mix pixel below
                                tempPaint2[arrayPos + p.width * 4] =
                                    (paint[arrayPos + p.width * 4] + paint[arrayPos]) / 2;
                                tempPaint2[arrayPos + p.width * 4 + 1] =
                                    (paint[arrayPos + p.width * 4 + 1] + paint[arrayPos + 1]) / 2;
                                tempPaint2[arrayPos + p.width * 4 + 2] =
                                    (paint[arrayPos + p.width * 4 + 2] + paint[arrayPos + 2]) / 2;
                                tempPaint2[arrayPos + p.width * 4 + 3] =
                                    paint[arrayPos + p.width * 4 + 3] + 1;

                                // mix pixel above
                                tempPaint2[arrayPos - p.width * 4] =
                                    (paint[arrayPos - p.width * 4] + paint[arrayPos]) / 2;
                                tempPaint2[arrayPos - p.width * 4 + 1] =
                                    (paint[arrayPos - p.width * 4 + 1] + paint[arrayPos + 1]) / 2;
                                tempPaint2[arrayPos - p.width * 4 + 2] =
                                    (paint[arrayPos - p.width * 4 + 2] + paint[arrayPos + 2]) / 2;
                                tempPaint2[arrayPos - p.width * 4 + 3] =
                                    paint[arrayPos - p.width * 4 + 3] + 1;
                            }

                            // gradually dry paint
                            tempPaint2[arrayPos + 3] = paint[arrayPos + 3] - dryTime;
                            if (tempPaint2[arrayPos + 3] < 0) {
                                tempPaint2[arrayPos + 3] = 0;
                            }
                        }
                    }
                    for (let x = 0; x < p.width; x++) {
                        for (let y = 0; y < p.height; y++) {
                            let arrayPos = (x + y * p.width) * 4;
                            paint[arrayPos] = (tempPaint1[arrayPos] + tempPaint2[arrayPos]) / 2;
                        }
                    }
                }
            };



            const render = () => {
                // console.log(paint)
                p.loadPixels();
                for (let x = 0; x < p.width; x++) {
                    for (let y = 0; y < p.height; y++) {
                        const idx = (x + y * p.width) * 4;

                        p.pixels[idx] = paint[idx];
                        p.pixels[idx + 1] = paint[idx + 1];
                        p.pixels[idx + 2] = paint[idx + 2];

                        if (paint[idx] === 0 && paint[idx + 1] === 0 && paint[idx + 2] === 0) {
                            p.pixels[idx + 3] = 0;
                        } else {
                            p.pixels[idx + 3] = p.pixels[idx + 3] * 0.3;
                        }
                    }
                }
                p.updatePixels();
            };

        };

        // Create new p5 instance
        p5InstanceRef.current = new p5(sketch);

        // Cleanup
        return () => {
            p5InstanceRef.current?.remove();
        };
    }, [selectImage]);

    return <div ref={canvasRef} id='inkWashPainting' className='flex-1' />;
};

export default ImageColor;