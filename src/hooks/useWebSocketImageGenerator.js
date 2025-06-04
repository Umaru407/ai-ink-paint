// hooks/useWebSocketImageGenerator.ts
import { useState, useCallback, useEffect } from "react";
// import sharp from 'sharp';
import { useImageContext } from "../contexts/ImageContext";
import { Image } from "image-js";
import { scopedCssBaselineClasses } from "@mui/material";
// import { VITE_WS_URL } from '../env';

import ink_paint_v2 from '../assets/ink_paint_v2.json';
const WS_URL = process.env.REACT_APP_WS_URL;

// interface UseWebSocketImageGeneratorProps {
//   clientId?: string;
//   wsUrl?: string;s
// }

export const useWebSocketImageGenerator = ({
  clientId = `${Math.floor(Math.random() * 1000000000000)}`,
  wsUrl = WS_URL,
} = {}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const { images, setImages, prompt, setPrompt } = useImageContext();


  useEffect(() => {
    console.log(isLoading, 'isLoading in useWebSocketImageGenerator');
  },[isLoading]);

  const connectWebSocket = useCallback(
    async () => {
      try {
        console.log("正在連接 WebSocket...");
        const ws = new WebSocket(`${wsUrl}?clientId=${clientId}`);
        setSocket(ws);
        // console.log('ws', ws);

        ws.onopen = () => {
          console.log("WebSocket 已連接");
          setIsConnected(true);
          setError(null);
          
        };

        ws.onmessage = async (event) => {
          if (event.data instanceof Blob) {
            // console.log(event, 'WebSocket 收到消息:', event.data);
            // 處理二進制數據
            // 從事件中獲取 PNG 資料並創建 Blob
            const pngData = event.data.slice(8);
            const blob = new Blob([pngData], { type: "image/png" });

            // 將 Blob 轉換為 ArrayBuffer
            const arrayBuffer = await blob.arrayBuffer();

            // 使用 image-js 讀取圖像
            const image = await Image.load(arrayBuffer);

            // 將圖像轉為灰階
            const greyImage = image.grey();

            // 使用 URL.createObjectURL 生成新 URL
            const outputURL = greyImage.toDataURL();
            // console.log('Processed Image URL:', outputURL);

            setImages((prevImages) => [...prevImages, outputURL]);
          } else {
            try {
              const data = JSON.parse(event.data);
              if (data.type == "execution_success") {
                // setIsLoading(false);
                // setIsLoading(false);
                ws.close();
               
                // console.log("data", data, data.type);
              }else {
                console.log(data.type)
              }
            } catch (error) {
              console.log("處理消息時出錯: " + error.message);
            }
          }
        };

        ws.onerror = (error) => {
          console.log("WebSocket 錯誤:", error);
          setError("WebSocket connection error");
        };

        ws.onclose = () => {
          console.log("WebSocket 已斷開");
          setIsLoading(false);
          setIsConnected(false);
          setSocket(null);
        };
      } catch (error) {
        setError("Failed to connect to WebSocket");
        console.error(error);
      }
    },
    [wsUrl, clientId]
  );

  const generateImage = async () => {
    // const { images, setImages, prompt, setPrompt } = useImageContext();
    // console.log('generateImage', prompt, api, socket);
    setIsLoading(true);
    const api = ink_paint_v2;
    api[
      "2"
    ].inputs.text = `.\n---\n把上面的唐詩翻譯成英文，只輸出翻譯结果，不要輸出其他内容。\n---\ntimestamp: ${Math.floor(
      Math.random() * 1000000000000
    )}`;
    api["15"].inputs.seed = Math.floor(Math.random() * 1000000000000);
    api["1"].inputs.text = prompt;
    setImages([]);
    connectWebSocket();


    if (!prompt) {
      console.log("請輸入提示詞");
      setError("請輸入提示詞");
      return;
    }
    try {
      // setIsLoading(true);
      const payload = {
        client_id: clientId,
        prompt: api,
      };

      const response = await fetch("/api/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(payload),
      });

      // console.log('response', response);

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setError("生成圖片時出錯");
      console.error("生成圖片時出錯:", error);
    } 
  };

  return {
    isConnected,
    error,
    imageUrl,
    connectWebSocket,
    generateImage,
    isLoading,
  };
};
