import React, { createContext, useContext, useRef, useState } from "react";

const P5PaintContext = createContext();

export const P5PaintProvider = ({ children }) => {
  const p5PaintInstance = useRef(null); // 儲存 p5 實例
  const [p5PaintReady, setP5PaintReady] = useState(false);
  const [paintImageData, setPaintImageData] = useState(null); // 用於存儲圖片的 Base64 數據

  return (
    <P5PaintContext.Provider value={{ p5PaintInstance, p5PaintReady, setP5PaintReady,paintImageData,setPaintImageData }}>
      {children}
    </P5PaintContext.Provider>
  );
};

export const useP5Paint = () => {
  return useContext(P5PaintContext);
};