// hooks/useWebSocketImageGenerator.ts
import { useState, useCallback, useEffect } from 'react';
// import sharp from 'sharp';
import { useImageContext } from '../contexts/ImageContext';
import { Image } from 'image-js';
// import { VITE_WS_URL } from '../env';
const WS_URL = process.env.REACT_APP_WS_URL

// interface UseWebSocketImageGeneratorProps {
//   clientId?: string;
//   wsUrl?: string;
// }



export const useWebSocketImageGenerator = ({
  clientId = crypto.randomUUID(),
  wsUrl = WS_URL
} = {}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const { images, setImages, prompt, setPrompt } = useImageContext();

  const connectWebSocket = useCallback(async ({ prompt, api }) => {
    try {
      console.log('正在連接 WebSocket...');
      const ws = new WebSocket(`${wsUrl}?clientId=${clientId}`);
      setSocket(ws);
      console.log('ws', ws);

      ws.onopen = () => {
        console.log('WebSocket 已連接');
        generateImage(prompt, api);
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = async (event) => {
        if (typeof event.data !== 'string') {
          // 處理二進制數據
          // 從事件中獲取 PNG 資料並創建 Blob
          const pngData = event.data.slice(8);
          const blob = new Blob([pngData], { type: 'image/png' });
          const url = URL.createObjectURL(blob);
          // console.log('Received Image URL:', url);

          // 將 Blob 轉換為 ArrayBuffer
          const arrayBuffer = await blob.arrayBuffer();

          // console.log('Received Image ArrayBuffer:', arrayBuffer);

          // 使用 image-js 讀取圖像
          const image = await Image.load(arrayBuffer);

          // console.log('Image:', image);

          // 將圖像轉為灰階
          const greyImage = image.grey();

          // 將灰階圖像導出為 Buffer
          // const outputBuffer = Buffer.from(greyImage.toBuffer());

          // 將 Buffer 轉回 Blob
          // const outputBlob = new Blob([outputBuffer], { type: 'image/png' });

          // 使用 URL.createObjectURL 生成新 URL
          const outputURL = greyImage.toDataURL();
          console.log('Processed Image URL:', outputURL);

          setImages(prevImages => [...prevImages, outputURL]);

          // setImageUrl(outputURL);



        } else {
          try {
            const data = JSON.parse(event.data);
            if (data.type !== 'crystools.monitor') {
              console.log("data", data, data.type);
            }
          } catch (error) {
            console.log('處理消息時出錯: ' + error.message);
          }
        }
      };

      ws.onerror = (error) => {
        console.log('WebSocket 錯誤:', error);
        setError('WebSocket connection error');
      };

      ws.onclose = () => {
        console.log('WebSocket 已斷開');
        setIsConnected(false);
        setSocket(null);
      };


    } catch (error) {
      setError('Failed to connect to WebSocket');
      console.error(error);
    }
  }, [wsUrl, clientId]);

  const generateImage = async (prompt, api) => {
    console.log('generateImage', prompt, api, socket);
    // if (!socket || socket.readyState !== WebSocket.OPEN) {
    //   console.log('WebSocket 未連接2');
    //   setError('WebSocket 未連接');
    //   return;
    // }

    if (!prompt) {
      console.log('請輸入提示詞');
      setError('請輸入提示詞');
      return;
    }

    try {
      const payload = {
        client_id: clientId,
        prompt: api
      };

      const response = await fetch('/api/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',

        },
        body: JSON.stringify(payload),
      });

      console.log('response', response);

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setError('生成圖片時出錯');
      console.error('生成圖片時出錯:', error);
    }
  };

  // 清理 effect
  // useEffect(() => {
  //   return () => {
  //     if (socket) {
  //       socket.close();
  //     }
  //     if (imageUrl) {
  //       URL.revokeObjectURL(imageUrl);
  //     }
  //   };
  // }, [socket, imageUrl]);

  return {
    isConnected,
    error,
    imageUrl,
    connectWebSocket,
    generateImage
  };
};