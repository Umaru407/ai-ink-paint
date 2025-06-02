import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import { usePageNavigation } from '../contexts/PageContext';

const GridCanva = ({ canvasWidth, canvasHeight, showGrid, useEraser }) => {
  const GRID_COLS = 4;
  const GRID_ROWS = 5;
  const canvasRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const showGridRef = useRef(showGrid);
  const useEraserRef = useRef(useEraser);
  const eraserImgRef = useRef(null); // Add this ref for the eraser image
  // 當 showGrid 變動時重繪
  useEffect(() => {
    showGridRef.current = showGrid;
    p5InstanceRef.current?.redraw();
  }, [showGrid]);

  // 當 useEraser 變動時更新 flag
  useEffect(() => {
    useEraserRef.current = useEraser;
    // p5InstanceRef.current?.redraw();
  }, [useEraser]);

  // 頁面切換控制 p5.loop / noLoop
  const { currentPage } = usePageNavigation();
  const isOnPage = useRef(false);
  useEffect(() => {
    isOnPage.current = currentPage === 2;
    if (isOnPage.current) p5InstanceRef.current?.loop();
    else p5InstanceRef.current?.noLoop();
  }, [currentPage]);

  // 建立 p5 實例
  useEffect(() => {
    if (!canvasRef.current) return;

    const sketch = (p) => {
      p.setup = () => {
        p.pixelDensity(1);
        p.createCanvas(canvasWidth, canvasHeight).parent(canvasRef.current);
        p.noLoop();
      };

      p.preload = () => {
        // Load the eraser image - adjust the path to your eraser image
        eraserImgRef.current = p.loadImage('/eraser.png');
      };

      p.draw = () => {
        // 背景＋格線
        p.background(255);
        if (showGridRef.current) drawGrid(p);

        // 只有在 useEraser 開啟且按下時畫圓
        console.log(useEraserRef.current)
        if (
          useEraserRef.current &&
          p.mouseIsPressed &&
          p.mouseX >= 0 && p.mouseX <= canvasWidth &&
          p.mouseY >= 0 && p.mouseY <= canvasHeight
        ) {
          p.push();
          p.noStroke();
          p.fill(0, 102, 204, 150);
          p.ellipse(p.mouseX , p.mouseY, 40, 40);
          //  p.rotate(-p.PI / 4); // 逆時針旋轉 45 度
           p.imageMode(p.CENTER);
          p.image(eraserImgRef.current, p.mouseX+35, p.mouseY+35, 100, 100);
          p.pop();
        }
      };
    };

    // 格線繪製函式不變
    const drawGrid = (p) => {
      const padding = 20;
      const gw = canvasWidth - padding * 2;
      const gh = canvasHeight - padding * 2;

      p.stroke('red');
      p.strokeWeight(3);
      for (let i = 0; i <= GRID_COLS; i++) {
        const x = padding + (i * gw) / GRID_COLS;
        p.line(x, padding, x, padding + gh);
      }
      for (let i = 0; i <= GRID_ROWS; i++) {
        const y = padding + (i * gh) / GRID_ROWS;
        p.line(padding, y, padding + gw, y);
      }

      p.strokeWeight(1);
      for (let col = 0; col < GRID_COLS; col++) {
        for (let row = 0; row < GRID_ROWS; row++) {
          const x1 = padding + (col * gw) / GRID_COLS;
          const x2 = padding + ((col + 1) * gw) / GRID_COLS;
          const y1 = padding + (row * gh) / GRID_ROWS;
          const y2 = padding + ((row + 1) * gh) / GRID_ROWS;
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          p.line(midX, y1, midX, y2);
          p.line(x1, midY, x2, midY);
          p.line(x1, y1, x2, y2);
          p.line(x2, y1, x1, y2);
        }
      }
    };

    p5InstanceRef.current = new p5(sketch);
    return () => p5InstanceRef.current?.remove();
  }, [canvasWidth, canvasHeight]);

  return <div ref={canvasRef} className="canvas-container absolute" />;
};

export default GridCanva;
