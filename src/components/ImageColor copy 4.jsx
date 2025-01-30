import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import { usePageNavigation } from '../contexts/PageContext';
import { useP5Paint } from '../contexts/p5PaintContext';
import { useP5Ink } from '../contexts/p5InkContext';
import { useSelectImageContext } from '../contexts/SelectImageContext';

const ImageColor = ({ sharedGraphics, sharedColorGraphics }) => {
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


            let canvasWidth
            let canvasHeight


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
                inkImage = p.loadImage(inkImageData);
                stampImage = p.loadImage(inkImageData);
            };

            const calculateCanvasSize = () => {
                const windowHeight = window.innerHeight * 4 / 6;
                const aspectRatio = bgImage.width / bgImage.height;
                canvasHeight = windowHeight;
                canvasWidth = windowHeight * aspectRatio;
            };



            p.setup = () => {
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
                p.clear()
                p.image(bgImage, 0, 0, canvasWidth, canvasHeight);
                // console.log(sharedColorGraphics)
                p.blendMode(p.SOFT_LIGHT);
                p.image(sharedColorGraphics, 0, 0, canvasWidth, canvasHeight);
                p.blendMode(p.BLEND);

                // Draw the image
                p.image(img2, x, y, w, h);
                if (sharedGraphics) {
                    // console.log(sharedGraphics)
                    p.image(sharedGraphics, x - w / 5, y + h - h / 5, w / 5, h / 5); // 縮放並繪製共享畫布
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

        };

        // Create new p5 instance
        p5InstanceRef.current = new p5(sketch);

        // Cleanup
        return () => {
            p5InstanceRef.current?.remove();
        };
    }, [selectImage, sharedColorGraphics]);

    return <div ref={canvasRef} className='flex-1' />;
};

export default ImageColor;