import React, { useEffect, useRef } from 'react';
import { useSelectImageContext } from '../contexts/SelectImageContext';
import { fabric } from 'fabric';

export default function TestFabric({ selectedColor }) {
    const { selectImage } = useSelectImageContext();
    const canvasRef = useRef(null);
    const fabricRef = useRef(null);
    
    useEffect(() => {
        if (!selectImage) return;
        
        const initCanvas = async () => {
            // Clean up existing canvas
            if (fabricRef.current) {
                fabricRef.current.dispose();
            }

            // Create new canvas
            const container = document.getElementById('canvas-container');
            const canvas = new fabric.Canvas('fabric-canvas', {
                isDrawingMode: true
            });
            fabricRef.current = canvas;

            // Load background image
            fabric.Image.fromURL(selectImage, (img) => {
                const windowHeight = window.innerHeight * 4 / 6;
                const aspectRatio = img.width / img.height;
                const canvasHeight = windowHeight;
                const canvasWidth = windowHeight * aspectRatio;

                // Set canvas size
                canvas.setWidth(canvasWidth);
                canvas.setHeight(canvasHeight);

                // Scale image to fit canvas
                img.scaleToWidth(canvasWidth);
                img.scaleToHeight(canvasHeight);
                
                // Set image as background
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

                // Setup brush
                canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
                canvas.freeDrawingBrush.width = 20;
                canvas.freeDrawingBrush.color = selectedColor;

                // Apply blur effect
                canvas.freeDrawingBrush.shadow = new fabric.Shadow({
                    blur: 6,
                    offsetX: 0,
                    offsetY: 0,
                    color: selectedColor
                });

                // Set blend mode
                canvas.getContext().globalCompositeOperation = 'soft-light';
            });
        };

        initCanvas();

        // Cleanup
        return () => {
            if (fabricRef.current) {
                fabricRef.current.dispose();
            }
        };
    }, [selectImage]);

    // Update brush color when color changes
    useEffect(() => {
        if (fabricRef.current) {
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