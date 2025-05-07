import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import { usePageNavigation } from '../contexts/PageContext';
import { useP5Color } from '../contexts/p5ColorContext';
import { useP5Ink } from '../contexts/p5InkContext';
import { useSelectImageContext } from '../contexts/SelectImageContext';

const ImageColor = ({ maxCanvasHeight, sharedColorGraphics, editMode }) => {
    const canvasRef = useRef(null);
    const { currentPage, goToPage } = usePageNavigation();
    // console.log(useP5Color(), 'useP5Color')
    const { p5ColorInstance, setColorImageData } = useP5Color()
    const p5InstanceRef = useRef(null);



    const isOnPage = useRef(false);
    const edit_mode = useRef(editMode)
    useEffect(() => {
        edit_mode.current = editMode
    }, [editMode])

    const { selectImage } = useSelectImageContext();
    // const { p5ColorInstance, setColorImageData } = useP5Color()
    const { inkImageData } = useP5Ink()

    useEffect(() => {
        isOnPage.current = currentPage === 4;
        console.log(isOnPage.current, 'isOnPage.current')

        if (!isOnPage.current) {
            p5InstanceRef.current?.noLoop()
            // console.log('noloop')
        } else {
            p5InstanceRef.current?.loop()
            // console.log('loop')
        }

    }, [currentPage]);

    useEffect(() => {
        // console.log('@@@@@@@@@@@@@@')

        if (!selectImage && !p5InstanceRef.current) return;
        // console.log('@@@@@@@@@@@@@@222')
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


            let x, y, w, h; // Location and size

            let aspectRatio; // Aspect ratio of the image

            let scale = 6;

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

                // Calculate initial aspect ratio
                aspectRatio = w / h;
                calculateCanvasSize();
                const canvas = p.createCanvas(canvasWidth, canvasHeight);
                canvas.parent(canvasRef.current);


            };

            p.draw = () => {
                console.log('imagecolor draw')
                // console.log(edit_mode.current)
                if (!isOnPage.current) return;

                p.clear()
                p.image(bgImage, 0, 0, canvasWidth, canvasHeight);
                // console.log(sharedColorGraphics)
                p.blendMode(p.SOFT_LIGHT);



                if (sharedColorGraphics) {
                    try {
                        p.image(sharedColorGraphics, 0, 0, canvasWidth, canvasHeight);
                    } catch (error) {
                        console.log(error, 'error')
                        // console.log(sharedColorGraphics, 'sharedColorGraphics', canvasWidth, canvasHeight)
                    }
                }
                p.blendMode(p.BLEND);
            };

            // 自定義方法，將畫布保存為 Base64 圖片數據
            p.saveCanvasToBuffer = () => {
                const canvas = p.canvas; // 獲取 HTML Canvas 元素
                const dataUrl = canvas.toDataURL("image/png"); // 將畫布轉為 Base64
                // console.log(dataUrl,'777')
                setColorImageData(dataUrl); // 將 Base64 數據存入 Context
            };

        };

        // Create new p5 instance
        p5InstanceRef.current = new p5(sketch);
        p5ColorInstance.current = p5InstanceRef.current
        // Cleanup
        return () => {
            p5InstanceRef.current?.remove();
        };
    }, [sharedColorGraphics, maxCanvasHeight]);

    return <div ref={canvasRef} />;
};

export default ImageColor;