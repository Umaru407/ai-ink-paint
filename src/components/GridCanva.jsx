import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import { usePageNavigation } from '../contexts/PageContext';




const GridCanva = ({ canvasWidth, canvasHeight, showGrid }) => {
    const GRID_COLS = 4;
    const GRID_ROWS = 5;
    const canvasRef = useRef(null);
    const p5InstanceRef = useRef(null);
    const showGridRef = useRef(showGrid);

    useEffect(() => {
        showGridRef.current = showGrid;
        if (p5InstanceRef.current) {
            p5InstanceRef.current.redraw();
        }
    }, [showGrid]);

    const { currentPage } = usePageNavigation();
    const isOnPage = useRef(false);
    useEffect(() => {
        isOnPage.current = currentPage === 2;

        if (!isOnPage.current) {
            p5InstanceRef.current?.noLoop()
        } else {
            p5InstanceRef.current?.loop()
        }

    }, [currentPage]);

    useEffect(() => {
        if (typeof window !== 'undefined' && canvasRef.current) {
            const sketch = (p) => {
                // let show = showGridRef.current;

                p.setup = () => {
                    p.pixelDensity(1);
                    const canvas = p.createCanvas(canvasWidth, canvasHeight);
                    canvas.parent(canvasRef.current);
                    p.noLoop();
                    console.log(canvas.width, canvas.height, '234')
                    console.log(p, p.canvas.width, p.canvas.height, 'p.canvas')
                };

                p.draw = () => {
                    p.background(255);
                    if (showGridRef.current) {
                        drawGrid(p);
                    }
                };
            };

            const drawGrid = (p) => {
                // const padding = 20;
                // const gridWidth = canvasWidth - 2 * padding;
                // const gridHeight = canvasHeight - 2 * padding;

                // 設置外邊距
                const padding = 20; // 你可以根據需要調整這個值
                const gridWidth = canvasWidth - 2 * padding; // 格線的寬度
                const gridHeight = canvasHeight - 2 * padding; // 格線的高度

                // 繪製格子的邊框（2px）
                p.stroke('red');
                p.strokeWeight(3); // 設置邊框線條寬度為 2px

                // 垂直線
                for (let i = 0; i <= GRID_COLS; i++) {
                    const x = padding + i * gridWidth / GRID_COLS;
                    p.line(x, padding, x, padding + gridHeight);
                }

                // 水平線
                for (let i = 0; i <= GRID_ROWS; i++) {
                    const y = padding + i * gridHeight / GRID_ROWS;
                    p.line(padding, y, padding + gridWidth, y);
                }

                // 繪製每個格子的「米」字線（1px）
                p.strokeWeight(1); // 設置「米」字線條寬度為 1px
                for (let col = 0; col < GRID_COLS; col++) {
                    for (let row = 0; row < GRID_ROWS; row++) {
                        const x1 = padding + col * gridWidth / GRID_COLS; // 格子左邊界
                        const x2 = padding + (col + 1) * gridWidth / GRID_COLS; // 格子右邊界
                        const y1 = padding + row * gridHeight / GRID_ROWS; // 格子上邊界
                        const y2 = padding + (row + 1) * gridHeight / GRID_ROWS; // 格子下邊界

                        // 十字線（垂直和水平線）
                        const midX = (x1 + x2) / 2; // 格子中間的垂直線
                        const midY = (y1 + y2) / 2; // 格子中間的水平線
                        p.line(midX, y1, midX, y2); // 垂直線
                        p.line(x1, midY, x2, midY); // 水平線

                        // 對角線（左上到右下，右上到左下）
                        p.line(x1, y1, x2, y2); // 左上到右下
                        p.line(x2, y1, x1, y2); // 右上到左下
                    }
                }
            };

            p5InstanceRef.current = new p5(sketch);
            return () => p5InstanceRef.current?.remove();
        }
    }, [canvasWidth]);

    return <div ref={canvasRef} className="canvas-container absolute" />;
};

export default GridCanva;