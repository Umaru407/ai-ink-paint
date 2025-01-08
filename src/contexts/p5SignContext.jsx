import React, { createContext, useContext, useRef, useState } from "react";

const P5SignContext = createContext();

export const P5SignProvider = ({ children }) => {
  const p5SignInstance = useRef(null); // 儲存 p5 實例
  const [p5SignReady, setP5SignReady] = useState(false);
  const [signImageData, setSignImageData] = useState(null); // 用於存儲圖片的 Base64 數據

  return (
    <P5SignContext.Provider value={{ p5SignInstance, p5SignReady, setP5SignReady,signImageData,setSignImageData }}>
      {children}
    </P5SignContext.Provider>
  );
};

export const useP5Sign = () => {
  return useContext(P5SignContext);
};