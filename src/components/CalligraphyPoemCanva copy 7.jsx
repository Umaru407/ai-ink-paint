import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import { useImageContext } from '../contexts/ImageContext';
import { useP5Ink } from '../contexts/p5InkContext';
import { Switch } from '@heroui/react';
import { usePageNavigation } from '../contexts/PageContext';

const CalligraphyPoemCanva = ({ canvasWidth, canvasHeight }) => {
  const { recognizeStrokes, setRecognizeStrokes, buttons, setButtons } = useImageContext();
  const strokeMax = 14;
  const { currentPage } = usePageNavigation();
  const isOnPage = useRef(false);
  const canvasRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const { p5InkInstance, setP5InkReady, setInkImageData } = useP5Ink();

  // Eraser toggle state
  const [isErasing, setIsErasing] = useState(false);
  const eraserRef = useRef(isErasing);
  useEffect(() => { eraserRef.current = isErasing; }, [isErasing]);

  useEffect(() => {
    isOnPage.current = currentPage === 2;
    if (!isOnPage.current) {
      p5InstanceRef.current?.noLoop();
    } else {
      p5InstanceRef.current?.loop();
    }
  }, [currentPage]);

  // Handwriting recognition (optional)
//   useEffect(() => {
//     recognizeHandwriting({ width: canvasWidth, height: canvasHeight }, recognizeStrokes, 10, saveResult);
//   }, [recognizeStrokes]);

  useEffect(() => {
    if (typeof window !== 'undefined' && canvasRef.current) {
      const sketch = (p) => {
        let canvas;
        let x = 0, y = 0, ax = 0, ay = 0, a = 0, r = 0;
        let oldR = 0;
        let f = 0;
        let isMax = false;
        let drawing = false;
        let drawStartTime;
        let strokeFrame = 0;
        const { distance, spring, friction, size } = { distance: 8, spring: 0.3, friction: 0.5, size: strokeMax + 2 };

        p.setup = () => {
          p.pixelDensity(1);
          canvas = p.createCanvas(canvasWidth, canvasHeight);
          canvas.parent(canvasRef.current);
          p.noLoop();
        };

        p.draw = () => {
          oldR = r;
          if (p.mouseIsPressed && p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
            drawing = true;
          }

          if (p.mouseIsPressed && drawing) {
            const mX = p.mouseX;
            const mY = p.mouseY;

            if (!f) {
              f = 1;
              x = mX;
              y = mY;
              strokeFrame = 0;
              drawStartTime = new Date().getTime();
            }
            strokeFrame++;

            // Physics
            ax += (mX - x) * spring;
            ay += (mY - y) * spring;
            ax *= friction;
            ay *= friction;
            a += p.sqrt(ax * ax + ay * ay) - a;
            a *= 0.8;

            // Growth
            if (isMax) {
              const targetR = size - a * 1.5;
              r = p.lerp(r, targetR, 0.2);
            } else {
              const maxFrames = 10;
              const t = Math.min(strokeFrame / maxFrames, 1);
              const threshold = 0.7;
              const startRatio = 0.6;
              let easedT;
              if (t < threshold) {
                easedT = startRatio * (t / threshold);
              } else {
                const tt = (t - threshold) / (1 - threshold);
                easedT = startRatio + (1 - startRatio) * tt * tt;
              }
              r = (strokeMax - 2) * easedT;
              if (t > 0.9) isMax = true;
            }

            // Eraser or draw
            if (eraserRef.current) {
              p.erase();
            } else {
              p.noErase();
            }

            // Draw line segments
            for (let i = 0; i < distance; i++) {
              const oldX = x;
              const oldY = y;
              x += ax / distance;
              y += ay / distance;
              oldR += ((r - oldR) / distance) * 2;
              if (oldR < 1) oldR = 1;

              p.strokeWeight(oldR);
              p.line(x, y, oldX, oldY);
            }

          } else if (f) {
            // Reset
            ax = ay = f = 0;
            isMax = false;
            r = 0;
            strokeFrame = 0;
            drawing = false;
          }
        };

        // Utility to save final canvas
        p.saveCanvasToBuffer = () => {
          const img = p.get();
          img.loadPixels();
          let left = img.width, right = 0, top = img.height, bottom = 0;
          for (let yy = 0; yy < img.height; yy++) {
            for (let xx = 0; xx < img.width; xx++) {
              const idx = (yy * img.width + xx) * 4;
              if (img.pixels[idx + 3] > 0) {
                left = Math.min(left, xx);
                right = Math.max(right, xx);
                top = Math.min(top, yy);
                bottom = Math.max(bottom, yy);
              }
            }
          }
          if (left > right || top > bottom) {
            left = top = 0;
            right = bottom = 1;
          }
          const width = right - left + 1;
          const height = bottom - top + 1;
          const buffer = p.createGraphics(width, height);
          buffer.image(img, -left, -top);
          const dataUrl = buffer.elt.toDataURL('image/png');
          setInkImageData(dataUrl);
        };
      };

      p5InstanceRef.current = new p5(sketch);
      p5InkInstance.current = p5InstanceRef.current;
      return () => p5InstanceRef.current?.remove();
    }
  }, [canvasWidth]);

  const saveResult = (result) => setButtons(result);

  return (
    <>
      <div className="toolbar absolute top-2 left-2 z-10">
        <Switch checked={isErasing} onChange={() => setIsErasing(!isErasing)}>橡皮擦</Switch>
      </div>
      <div ref={canvasRef} className="canvas-container absolute"></div>
    </>
  );
};

export default CalligraphyPoemCanva;
