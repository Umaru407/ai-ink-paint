import React, { createContext, useContext, useRef, useState } from "react";

//讓他的名字讓他的名字符合p5的命名規範  
//將版本給為命名的版本
const P5ColorContext = createContext();

export const P5ColorProvider = ({ children }) => {
  const p5ColorInstance = useRef(null); // 儲存 p5 實例
  const [p5ColorReady, setP5ColorReady] = useState(false);
  const [colorImageData, setColorImageData] = useState(null); // 用於存儲圖片的 Base64 數據

  return (
    <P5ColorContext.Provider value={{ p5ColorInstance, p5ColorReady, setP5ColorReady, colorImageData, setColorImageData }}>
      {children}
    </P5ColorContext.Provider>
  );
};

export const useP5Color = () => {
  return useContext(P5ColorContext);
};

// const P5ColorContext = createContext();

// export const P5PaintProvider = ({ children }) => {
//   const p5PaintInstance = useRef(null); // 儲存 p5 實例
//   const [p5PaintReady, setP5PaintReady] = useState(false);
//   const [paintImageData, setPaintImageData] = useState(null); // 用於存儲圖片的 Base64 數據

//   return (
//     <P5PaintContext.Provider value={{ p5PaintInstance, p5PaintReady, setP5PaintReady,paintImageData,setPaintImageData }}>
//       {children}
//     </P5PaintContext.Provider>
//   );
// };

// export const useP5Paint = () => {
//   return useContext(P5PaintContext);
// };

