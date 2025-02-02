import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import { usePageNavigation } from '../contexts/PageContext';
import { useP5Paint } from '../contexts/p5PaintContext';
import { useP5Ink } from '../contexts/p5InkContext';
import { useSelectImageContext } from '../contexts/SelectImageContext';

const ImageColor = ({ maxCanvasHeight, sharedGraphics, sharedColorGraphics, editMode }) => {
    const canvasRef = useRef(null);
    const { currentPage, goToPage } = usePageNavigation();
    const { p5PaintInstance, setPaintImageData } = useP5Paint()
    const p5InstanceRef = useRef(null);
    const isOnPage = useRef(false);
    const edit_mode = useRef(editMode)
    useEffect(() => {
        edit_mode.current = editMode
    }, [editMode])

    const { selectImage } = useSelectImageContext();
    // const { p5PaintInstance, setPaintImageData } = useP5Paint()
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
            let inkImage

            let canvasWidth
            let canvasHeight
            // let edit_mode.current = true

            let dragging = false; // Is the object being dragged?
            let resizing = false; // Is the object being resized?
            let rollover = false; // Is the mouse over the object?
            // let edit_mode.current = true; // Is the object in edit mode?

            let x, y, w, h; // Location and size
            let editSize = { x: 0, y: 0, w: 0, h: 0 }
            let offsetX, offsetY; // Mouseclick offset
            let aspectRatio; // Aspect ratio of the image

            let handleSize = 20; // Size of resize handle

            let scale = 6;

            // p.changeedit_mode.current = (mode) => {
            //     edit_mode.current = mode
            //     console.log(edit_mode.current, 'edit_mode.current')
            // }

            p.preload = () => {
                bgImage = p.loadImage(selectImage);
                inkImage = p.loadImage(inkImageData);
                // stampImage = p.loadImage(inkImageData);
            };

            const calculateCanvasSize = () => {
                // const windowHeight = window.innerHeight * 4 / 6;
                // console.log(maxCanvasHeight, 'maxCanvasHeight')
                const aspectRatio = bgImage.width / bgImage.height;
                canvasHeight = maxCanvasHeight;
                canvasWidth = maxCanvasHeight * aspectRatio;
                // console.log(canvasWidth, canvasHeight, 'canvasWidth, canvasHeight')
            };



            p.setup = () => {

                // Starting location
                x = 100;
                y = 100;

                // Dimensions
                w = inkImage.width / scale
                h = inkImage.height / scale
                // x - sharedGraphics.width / scale, y, w + sharedGraphics.width / scale, sharedGraphics.height / scale + sharedGraphics.height / scale / 2
                // editSize.x = x - sharedGraphics.width / scale;
                // editSize.y = y;
                // editSize.w =
                // Calculate initial aspect ratio
                aspectRatio = w / h;
                calculateCanvasSize();
                const canvas = p.createCanvas(canvasWidth, canvasHeight);
                canvas.parent(canvasRef.current);
                // p.image(sharedColorGraphics, 0, 0, canvasWidth, canvasHeight);
                //初始化繪圖圖層
                // calculateCanvasSize();
                // p.resizeCanvas(canvasWidth, canvasHeight);
                // p.image(bgImage, 0, 0, canvasWidth, canvasHeight);

            };

            p.draw = () => {
                // console.log(edit_mode.current)
                p.clear()
                p.image(bgImage, 0, 0, canvasWidth, canvasHeight);
                // console.log(sharedColorGraphics)
                p.blendMode(p.SOFT_LIGHT);
                p.image(sharedColorGraphics, 0, 0, canvasWidth, canvasHeight);
                p.blendMode(p.BLEND);


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

                    // let scale = newW / originalW;
                    w = newW;
                    h = newH;
                    scale = inkImage.width / w
                    // x = x - sharedGraphics.width / scale
                }
                // Draw the image
                p.image(inkImage, x, y, w, h);



                if (sharedGraphics) {


                    const img = sharedGraphics.get(); // 獲取畫布的像素數據

                    img.loadPixels(); // 加載像素數據

                    // 遍歷每個像素
                    for (let i = 0; i < img.pixels.length; i += 4) {
                        const r = img.pixels[i];
                        const g = img.pixels[i + 1];
                        const b = img.pixels[i + 2];

                        // 判斷是否為白色（或接近白色）
                        if (r > 240 && g > 240 && b > 240) {
                            img.pixels[i + 3] = 0; // 將 alpha 值設為 0（透明）
                        }
                    }
                    // console.log('saveCanvasToBuffer')

                    img.updatePixels(); // 更新像素數據
                    // p.image(img, 0, 0); // 將修改後的像素數據放回畫布
                    //印章位置
                    p.image(img, x - img.width / scale / 2, y + h - img.height / scale / 2 / 2, img.width / scale / 2, img.height / scale / 2); // 縮放並繪製共享畫布
                }

                // Draw bounding box and handle only if in edit mode
                if (edit_mode.current) {
                    p.noFill();
                    p.stroke(0);
                    p.rect(
                        x - sharedGraphics.width / scale / 2,
                        y,
                        w + sharedGraphics.width / scale / 2,
                        h + sharedGraphics.height / scale / 2 / 2
                        // sharedGraphics.height / scale * 3 / 2
                    );

                    // Draw resize handle
                    p.fill(0);
                    p.noStroke();
                    p.rect(x + w - handleSize / 2, y + h + sharedGraphics.height / scale / 2 / 2 - handleSize / 2, handleSize, handleSize);
                }


            };

            p.mousePressed = () => {
                // console.log('mousepress')
                // Check if mouse is over the resize handle
                if (
                    edit_mode.current &&
                    p.mouseX > x + w - handleSize / 2 &&
                    p.mouseX < x + w + handleSize / 2 &&
                    p.mouseY > y + h + sharedGraphics.height / scale / 2 / 2 - handleSize / 2 &&
                    p.mouseY < y + h + sharedGraphics.height / scale / 2 / 2 + handleSize / 2
                ) {
                    resizing = true;
                }
                // Check if mouse is over the image
                else if (p.mouseX > x && p.mouseX < x + w && p.mouseY > y && p.mouseY < y + h && edit_mode.current) {
                    dragging = true;
                    offsetX = x - p.mouseX;
                    offsetY = y - p.mouseY;
                    // edit_mode.current = true; // Enter edit mode
                    // p.changeedit_mode.current(true)
                } else {
                    // edit_mode.current = false; // Exit edit mode
                    // p.changeedit_mode.current(false)
                }
            }

            p.mouseReleased = () => {
                // Quit dragging or resizing
                dragging = false;
                resizing = false;
                // 當鼠標釋放時，將當前筆劃保存到 strokes 數組中
                console.log('release reszing')

            };

            p.touchStarted = () => {
                console.log('touchstart')

                // console.log('mousepress')
                // Check if mouse is over the resize handle
                if (
                    edit_mode.current &&
                    p.mouseX > x + w - handleSize / 2 &&
                    p.mouseX < x + w + handleSize / 2 &&
                    p.mouseY > y + h + sharedGraphics.height / scale / 2 / 2 - handleSize / 2 &&
                    p.mouseY < y + h + sharedGraphics.height / scale / 2 / 2 + handleSize / 2
                ) {
                    resizing = true;
                }
                // Check if mouse is over the image
                // x - sharedGraphics.width / scale, y + sharedGraphics.height / scale / 2, sharedGraphics.width / scale, sharedGraphics.height / scale
                else if (p.mouseX > x - sharedGraphics.width / scale && p.mouseX < x + w && p.mouseY > y && p.mouseY < y + h + sharedGraphics.height / scale / 2 / 2 && edit_mode.current) {
                    dragging = true;
                    offsetX = x - p.mouseX;
                    offsetY = y - p.mouseY;
                    // edit_mode.current = true; // Enter edit mode
                    // p.changeedit_mode.current(true)
                } else {
                    // edit_mode.current = false; // Exit edit mode
                    // p.changeedit_mode.current(false)
                }
            }

            p.touchEnded = () => {
                dragging = false;
                resizing = false;
            }

            // 自定義方法，將畫布保存為 Base64 圖片數據
            p.saveCanvasToBuffer = () => {
                const canvas = p.canvas; // 獲取 HTML Canvas 元素
                const dataUrl = canvas.toDataURL("image/png"); // 將畫布轉為 Base64
                // console.log(dataUrl,'777')
                setPaintImageData(dataUrl); // 將 Base64 數據存入 Context
            };

        };

        // Create new p5 instance
        p5InstanceRef.current = new p5(sketch);
        p5PaintInstance.current = p5InstanceRef.current
        // Cleanup
        return () => {
            p5InstanceRef.current?.remove();
        };
    }, [selectImage, sharedColorGraphics, maxCanvasHeight]);

    return <div ref={canvasRef} />;
};

export default ImageColor;