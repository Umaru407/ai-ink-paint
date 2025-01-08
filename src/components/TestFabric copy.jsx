import React, { useEffect, useRef } from 'react';
import { useSelectImageContext } from '../contexts/SelectImageContext';
import * as fabric from 'fabric'; // v6
import { Canvas, PencilBrush } from 'fabric';

export default function ImageColor({ selectedColor }) {
    const { selectImage } = useSelectImageContext();
    const canvasRef = useRef(null);
    const fabricRef = useRef(null);
    
    useEffect(() => {
        if (!selectImage) return;
        
        const initCanvas = async () => {
            if (fabricRef.current) {
                fabricRef.current.dispose();
            }

            const canvas = new Canvas('fabric-canvas', {
                isDrawingMode: true,
                enableRetinaScaling: true
            });
            fabricRef.current = canvas;

            const img = await new Promise((resolve) => {
                fabric.FabricImage.fromURL(selectImage, (img) => resolve(img));
            });

            const windowHeight = window.innerHeight * 4 / 6;
            const aspectRatio = img.width / img.height;
            const canvasHeight = windowHeight;
            const canvasWidth = windowHeight * aspectRatio;

            canvas.setDimensions({ width: canvasWidth, height: canvasHeight });
            img.scaleToWidth(canvasWidth);
            img.scaleToHeight(canvasHeight);
            
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

            const brush = new PencilBrush(canvas);
            brush.width = 20;
            brush.color = selectedColor;
            brush.shadow = {
                blur: 6,
                offsetX: 0,
                offsetY: 0,
                color: selectedColor
            };

            canvas.freeDrawingBrush = brush;
            canvas.renderAll();

            canvas.getContext().globalCompositeOperation = 'soft-light';
        };

        initCanvas();

        return () => {
            if (fabricRef.current) {
                fabricRef.current.dispose();
            }
        };
    }, [selectImage]);

    useEffect(() => {
        if (fabricRef.current?.freeDrawingBrush) {
            fabricRef.current.freeDrawingBrush.color = selectedColor;
            fabricRef.current.freeDrawingBrush.shadow.color = selectedColor;
        }
    }, [selectedColor]);

    return (
        <div id="canvas-container">
            <canvas id="fabric-canvas"></canvas>
        </div>
    );
}