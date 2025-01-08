import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric'; // v6
import { PencilBrush ,Canvas} from 'fabric'; // v5

export const TestFabric = () => {
    const canvasEl = useRef(null);
    useEffect(() => {
        // const options = { ... };

         const canvas = new Canvas('fabric-canvas', {
                        isDrawingMode: true,
                        enableRetinaScaling: true
                    });
        // const canvas = new fabric.Canvas(canvasEl.current);

        canvas.isDrawingMode = true
        const brush = new PencilBrush(canvas);
        brush.width = 20;
        brush.color =  '#cccccc';
        brush.shadow = {
            blur: 6,
            offsetX: 0,
            offsetY: 0,
            color: '#cccccc'
        };

        canvas.freeDrawingBrush = brush;
        canvas.renderAll();
        // canvas.backgroundColor()
        return () => {
            //   updateCanvasContext(null);
            canvas.dispose();
        }
    }, []);

    return <canvas width="800" height="1000" ref={canvasEl} />;
};

export default TestFabric