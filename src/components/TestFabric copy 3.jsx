import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { useSelectImageContext } from "../contexts/SelectImageContext";
// import "./styles.css";
// useSelectImageContext
export default function TestFabric() {
  const { editor, onReady } = useFabricJSEditor();
    const {selectImage} = useSelectImageContext()
  const history = [];
  const [color, setColor] = useState("#35363a");
  const [cropImage, setCropImage] = useState(true);

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }

    if (cropImage) {
      editor.canvas.__eventListeners = {};
      return;
    }

    if (!editor.canvas.__eventListeners["mouse:wheel"]) {
      editor.canvas.on("mouse:wheel", function (opt) {
        var delta = opt.e.deltaY;
        var zoom = editor.canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        editor.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });
    }

    if (!editor.canvas.__eventListeners["mouse:down"]) {
      editor.canvas.on("mouse:down", function (opt) {
        var evt = opt.e;
        if (evt.ctrlKey === true) {
          this.isDragging = true;
          this.selection = false;
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;
        }
      });
    }

    if (!editor.canvas.__eventListeners["mouse:move"]) {
      editor.canvas.on("mouse:move", function (opt) {
        if (this.isDragging) {
          var e = opt.e;
          var vpt = this.viewportTransform;
          vpt[4] += e.clientX - this.lastPosX;
          vpt[5] += e.clientY - this.lastPosY;
          this.requestRenderAll();
          this.lastPosX = e.clientX;
          this.lastPosY = e.clientY;
        }
      });
    }

    if (!editor.canvas.__eventListeners["mouse:up"]) {
      editor.canvas.on("mouse:up", function (opt) {
        // on mouse up we want to recalculate new interaction
        // for all objects, so we call setViewportTransform
        this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
        this.selection = true;
      });
    }

    editor.canvas.renderAll();
  }, [editor]);

  const addBackground = () => {
    if (!editor || !fabric) {
      return;
    }

    fabric.Image.fromURL(
      selectImage,
      (image) => {
        editor.canvas.setBackgroundImage(
          image,
          editor.canvas.renderAll.bind(editor.canvas)
        );
      }
    );
  };

//   const fromSvg = () => {
//     fabric.loadSVGFromString(
//       `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
//     <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
//     <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="500" height="500" viewBox="0 0 500 500" xml:space="preserve">
//     <desc>Created with Fabric.js 5.3.0</desc>
//     <defs>
//     </defs>
//     <g transform="matrix(1 0 0 1 662.5 750)"  >
//       <image style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  xlink:href="https://thegraphicsfairy.com/wp-content/uploads/2019/02/Anatomical-Heart-Illustration-Black-GraphicsFairy.jpg" x="-662.5" y="-750" width="1325" height="1500"></image>
//     </g>
//     <g transform="matrix(1 0 0 1 120.5 120.5)"  >
//     <circle style="stroke: rgb(53,54,58); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-opacity: 0; fill-rule: nonzero; opacity: 1;"  cx="0" cy="0" r="20" />
//     </g>
//     <g transform="matrix(1 0 0 1 245.5 200.5)"  >
//     <line style="stroke: rgb(53,54,58); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  x1="-75" y1="-50" x2="75" y2="50" />
//     </g>
//     <g transform="matrix(1 0 0 1 141.4 220.03)" style=""  >
//         <text xml:space="preserve" font-family="Arial" font-size="16" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(53,54,58); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-16.9" y="-5.46" >inset</tspan><tspan x="-16.9" y="15.51" >text</tspan></text>
//     </g>
//     <g transform="matrix(1 0 0 1 268.5 98.5)"  >
//     <rect style="stroke: rgb(53,54,58); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-opacity: 0; fill-rule: nonzero; opacity: 1;"  x="-20" y="-20" rx="0" ry="0" width="40" height="40" />
//     </g>
//     </svg>`,
//       (objects, options) => {
//         editor.canvas._objects.splice(0, editor.canvas._objects.length);
//         editor.canvas.backgroundImage = objects[0];
//         const newObj = objects.filter((_, index) => index !== 0);
//         newObj.forEach((object) => {
//           editor.canvas.add(object);
//         });

//         editor.canvas.renderAll();
//       }
//     );
//   };

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    // editor.canvas.setHeight(500);
    // editor.canvas.setWidth(500);
    addBackground();
    editor.canvas.renderAll();
  }, [editor?.canvas.backgroundImage,selectImage]);


  
  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.setHeight(1000);
    editor.canvas.setWidth(500);
    editor.canvas.getContext().globalCompositeOperation = 'soft-light';
    // addBackground();
    // editor.canvas.renderAll();
  }, [editor]);


  const toggleSize = () => {
    editor.canvas.freeDrawingBrush.width === 12
      ? (editor.canvas.freeDrawingBrush.width = 5)
      : (editor.canvas.freeDrawingBrush.width = 12);
  };

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.freeDrawingBrush.color = color;
    editor.setStrokeColor(color);
  }, [color]);

  const toggleDraw = () => {
    editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
  };
  const undo = () => {
    if (editor.canvas._objects.length > 0) {
      history.push(editor.canvas._objects.pop());
    }
    editor.canvas.renderAll();
  };
  const redo = () => {
    if (history.length > 0) {
      editor.canvas.add(history.pop());
    }
  };

  const clear = () => {
    editor.canvas._objects.splice(0, editor.canvas._objects.length);
    history.splice(0, history.length);
    editor.canvas.renderAll();
  };

  const removeSelectedObject = () => {
    editor.canvas.remove(editor.canvas.getActiveObject());
  };

  const onAddCircle = () => {
    editor.addCircle();
    editor.addLine();
  };
  const onAddRectangle = () => {
    editor.addRectangle();
  };
  const addText = () => {
    editor.addText("inset text");
  };

  const exportSVG = () => {
    const svg = editor.canvas.toSVG();
    console.info(svg);
  };

  return (
    <div className="App">
      <h1>FabricJS React Sample</h1>
      
     
      <button onClick={toggleDraw} disabled={!cropImage}>
        Toggle draw
      </button>
      <button onClick={clear} disabled={!cropImage}>
        Clear
      </button>
      <button onClick={undo} disabled={!cropImage}>
        Undo
      </button>
      <button onClick={redo} disabled={!cropImage}>
        Redo
      </button>
      <button onClick={toggleSize} disabled={!cropImage}>
        ToggleSize
      </button>
      <button onClick={removeSelectedObject} disabled={!cropImage}>
        Delete
      </button>
      <button onClick={(e) => setCropImage(!cropImage)}>Crop</button>
      <label disabled={!cropImage}>
        <input
          disabled={!cropImage}
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </label>
      

      <div
        style={{
          border: `3px ${!cropImage ? "dotted" : "solid"} Green`,
          width: "500px",
          height: "500px"
        }}
      >
        <FabricJSCanvas className="sample-canvas" onReady={onReady} />
      </div>
    </div>
  );
}


// import React, { useEffect, useRef } from 'react';
// import * as fabric from 'fabric'; // v6
// import { PencilBrush, Canvas } from 'fabric'; // v5
// import { useSelectImageContext } from '../contexts/SelectImageContext';



// export const TestFabric = () => {
//     let canvas
//     const { selectImage } = useSelectImageContext();
//     // const canvasEl = useRef(null);
//     useEffect(() => {
//         // const options = { ... };

//         canvas = new Canvas('fabric-canvas', {
//             isDrawingMode: true,
//             enableRetinaScaling: true
//         });

//         canvas.width = 600
//         canvas.height = 1000
//         canvas.backgroundImage = 
//         // console.log('@@@',img)

//         // const windowHeight = window.innerHeight * 4 / 6;
//         // const aspectRatio = img.width / img.height;
//         // const canvasHeight = windowHeight;
//         // const canvasWidth = windowHeight * aspectRatio;

//         // canvas.setDimensions({ width: canvasWidth, height: canvasHeight });
//         // img.scaleToWidth(canvasWidth);
//         // img.scaleToHeight(canvasHeight);
//         // console.log(canvas)
//         // const canvas = new fabric.Canvas(canvasEl.current);

//         canvas.isDrawingMode = true
//         const brush = new PencilBrush(canvas);
//         brush.width = 20;
//         brush.color = '#cccccc';
//         brush.shadow = {
//             blur: 6,
//             offsetX: 0,
//             offsetY: 0,
//             color: '#cccccc'
//         };

//         canvas.freeDrawingBrush = brush;
//         canvas.renderAll();
//         // canvas.backgroundColor()
//         return () => {
//             //   updateCanvasContext(null);
//             canvas.dispose();
//         }
//     }, []);

//     useEffect(() => {
//         if (selectImage) {
//             console.log('img import')
//             fabric.Image.fromURL('https://thegraphicsfairy.com/wp-content/uploads/2019/02/Anatomical-Heart-Illustration-Black-GraphicsFairy.jpg', function (img) {
//                 console.log('add')
//                 canvas.set
//             });
//         }
//         // if(selectImage){
//         //     console.log('img import')

//         // }
//     }, [selectImage])

//     return <canvas id="fabric-canvas"></canvas>
// };

// export default TestFabric