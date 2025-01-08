// import React, { useEffect, useRef } from 'react';
// import { fabric } from 'fabric';

// const TestFabric = () => {
//   const mainCanvasRef = useRef(null); // 主畫布的容器
//   const brushCanvasRef = useRef(null); // 畫筆畫布（離屏）
//   const mainCanvas = useRef(null); // 主畫布實例
//   const brushCanvas = useRef(null); // 畫筆畫布實例

//   useEffect(() => {
//     // 初始化主畫布
//     mainCanvas.current = new fabric.Canvas(mainCanvasRef.current, {
//       width: 800,
//       height: 600,
//     });

//     // 設置主畫布的背景
//     const bgRect = new fabric.Rect({
//       left: 0,
//       top: 0,
//       width: 800,
//       height: 600,
//       fill: 'lightblue', // 底圖顏色
//     });
//     mainCanvas.current.add(bgRect);

//     // 初始化畫筆畫布
//     brushCanvas.current = new fabric.Canvas(brushCanvasRef.current, {
//       width: 800,
//       height: 600,
//     });
//     brushCanvas.current.isDrawingMode = true;
//     brushCanvas.current.freeDrawingBrush.color = 'rgba(255, 0, 0, 0.5)'; // 畫筆顏色
//     brushCanvas.current.freeDrawingBrush.width = 10; // 畫筆寬度

//     // 當畫筆畫布更新時，將畫筆內容與底圖混合
//     brushCanvas.current.on('mouse:move', () => {
//       const brushDataURL = brushCanvas.current.toDataURL();

//       // 將畫筆圖層作為圖像添加到主畫布
//       fabric.Image.fromURL(brushDataURL, (brushImage) => {
//         brushImage.globalCompositeOperation = 'multiply'; // 設置混合模式
//         mainCanvas.current.remove(mainCanvas.current.item(mainCanvas.current.size() - 1)); // 移除舊的畫筆圖層
//         mainCanvas.current.add(brushImage); // 添加新的畫筆圖層
//         mainCanvas.current.renderAll(); // 更新主畫布
//       });

//       // 清除畫筆畫布以準備新的繪製
//       brushCanvas.current.clear();
//     });
//   }, []);

//   return (
//     <div style={{ position: 'relative', width: '800px', height: '600px' }}>
//       {/* 主畫布 */}
//       <canvas ref={mainCanvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
//       {/* 畫筆畫布（重疊在主畫布上） */}
//       <canvas ref={brushCanvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }} />
//     </div>
//   );
// };

// export default TestFabric;
