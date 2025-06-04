import React, { useEffect, useRef } from "react";
import p5, { Color } from "p5";
import { usePageNavigation } from "../contexts/PageContext";
import { useP5Paint } from "../contexts/p5PaintContext";
import { useP5Ink } from "../contexts/p5InkContext";
import { useSelectImageContext } from "../contexts/SelectImageContext";

const ColorCanva = ({
  maxCanvasHeight,
  setSharedColorGraphics,
  selectedColor,
  brushSize,
  editMode,
}) => {
  const canvasRef = useRef(null);

  const p5InstanceRef = useRef(null);
  const select_color = useRef(selectedColor);
  const brush_size = useRef(brushSize );
  const edit_mode = useRef(editMode);

  useEffect(() => {
    select_color.current = selectedColor;
    brush_size.current = brushSize;
    edit_mode.current = editMode;
  }, [selectedColor, brushSize, editMode]);
  // setSharedGraphics(graphicsRef.current); // 傳遞給父組件

  const { selectImage } = useSelectImageContext();
  let canvasWidth;
  let canvasHeight;

  const { currentPage, goToPage } = usePageNavigation();
  const isOnPage = useRef(false);
  useEffect(() => {
    isOnPage.current = currentPage === 4;
    if (!isOnPage.current) {
      p5InstanceRef.current?.noLoop();
    } else {
      p5InstanceRef.current?.loop();
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
      let defaultTime = 0.04;
      let runnyColors = false;
      let backgrd = 0;
      // let state;
      // let brush_size.current = 8;
      let dryTime = defaultTime;
      let prevMouseX, prevMouseY;
      // let sliderDrops, buttonDry, buttonWet, buttonDefault;
      // let colorPicker;
      let colorPicked =0;
      let paint = [];
      let tempPaint1 = [];
      let tempPaint2 = [];
      let bgPixels = [];
      let paintDrop = 25; //混色程度
      let isDrawing = false;

      // let editMode = false; // Is the object in edit mode?

      const calculateCanvasSize = () => {
        // const windowHeight = window.innerHeight * 4 / 6;
        // console.log(maxCanvasHeight, 'maxCanvasHeight')
        const aspectRatio = bgImage.width / bgImage.height;
        canvasHeight = maxCanvasHeight;
        canvasWidth = maxCanvasHeight * aspectRatio;
        // console.log(canvasWidth, canvasHeight, 'canvasWidth, canvasHeight')
      };

      const getScaledMouse = () => {
        return {
          x: p.mouseX / 2,
          y: p.mouseY / 2,
        };
      };

      p.preload = () => {
        bgImage = p.loadImage(selectImage);
        // stampImage = p.loadImage(inkImageData);
      };

      p.setup = () => {
        //初始化繪圖圖層
        calculateCanvasSize();
        p.pixelDensity(1);
        let adjustedWidth =
          Math.floor(canvasWidth) - (Math.floor(canvasWidth) % 2);
        let adjustedHeight =
          Math.floor(canvasHeight) - (Math.floor(canvasHeight) % 2);

        let resultWidth = adjustedWidth / 2;
        let resultHeight = adjustedHeight / 2;
        const canvas = p.createCanvas(resultWidth, resultHeight);
        canvas.parent(canvasRef.current);
        setSharedColorGraphics(p); // 傳遞給父組件

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
        let currentMouse = getScaledMouse();
        // colorPicked = p.color(select_color.current);
        if (
          isDrawing &&
          p.mouseX >= 0 &&
          p.mouseX <= canvasWidth &&
          p.mouseY >= 0 &&
          p.mouseY <= canvasHeight &&
          !edit_mode.current
        ) {
          addPaint(currentMouse);
          p._lastDrawTime = p.millis(); // Record the last draw time
          // console.log('update and render');
        }

        if (!isOnPage.current || p.millis() - (p._lastDrawTime || 0) > 3000)
          return;

        //   console.log('drawing on canvas');
        p.background(0);

        update();

        render();
      };

      p.touchStarted = () => {
        // console.log('start touch')
        isDrawing = true;
      };

      p.touchEnded = () => {
        // console.log('touch end')
        isDrawing = false;
        prevMouseX = undefined;
        prevMouseY = undefined;
      };

      p.mousePressed = () => {
        // console.log('start mouse')

        isDrawing = true;
      };

      p.mouseReleased = () => {
        // console.log('mouse release')
        isDrawing = false;
        prevMouseX = undefined;
        prevMouseY = undefined;
      };

      const addPaint = (currentMouse) => {
        if (p.mouseIsPressed && isDrawing) {
          // console.log('mosue is presss')
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
          renderPoints(
            p.constrain(x, 0, p.width - 1),
            p.constrain(y, 0, p.height - 1)
          );
        }
      };

      const renderPoints = (x, y) => {
        // console.log(x,y)
        x = p.round(x);
        y = p.round(y);
        for (let dx = -brush_size.current; dx <= brush_size.current; dx++) {
          for (let dy = -brush_size.current; dy <= brush_size.current; dy++) {
            let px = x + dx;
            let py = y + dy;
            if (px < 0 || px >= p.width || py < 0 || py >= p.height) continue;

            let distance = p.dist(x, y, px, py);
            if (distance <= brush_size.current) {
              let arrayPos = (px + py * p.width) * 4;
              let newR = (paint[arrayPos + 0] + p.color(select_color.current).levels[0]) / 2;
              let newG = (paint[arrayPos + 1] + p.color(select_color.current).levels[1]) / 2;
              let newB = (paint[arrayPos + 2] + p.color(select_color.current).levels[2]) / 2;
              let falloff = p.map(distance, 0, brush_size.current, 1, 0.2);
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
        } else {
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
              paint[arrayPos] =
                (tempPaint1[arrayPos] + tempPaint2[arrayPos]) / 2;
            }
          }
        }

        // console.log(paint, 'paint',tempPaint1,tempPaint2)
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

            if (
              paint[idx] === 0 &&
              paint[idx + 1] === 0 &&
              paint[idx + 2] === 0
            ) {
              p.pixels[idx + 3] = 0;
            } else {
              p.pixels[idx + 3] = p.pixels[idx + 3] * 0.85; //透明度
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
  }, [selectImage, maxCanvasHeight]);

  return (
    <div ref={canvasRef} id="inkWashPainting" className="absolute opacity-0" />
  );
};

export default ColorCanva;
