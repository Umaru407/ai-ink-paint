import React, { createContext, useContext, useRef, useState } from "react";

const P5InkContext = createContext();

export const P5InkProvider = ({ children }) => {
  const p5InkInstance = useRef(null); // 儲存 p5 實例
  const [p5InkReady, setP5InkReady] = useState(false);
  const [inkImageData, setInkImageData] = useState(null); // 用於存儲圖片的 Base64 數據

  return (
    <P5InkContext.Provider value={{ p5InkInstance, p5InkReady, setP5InkReady,inkImageData,setInkImageData }}>
      {children}
    </P5InkContext.Provider>
  );
};

export const useP5Ink = () => {
  return useContext(P5InkContext);
};