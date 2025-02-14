import React, { useEffect, useRef, useState } from 'react';
import { useSelectImageContext } from '../contexts/SelectImageContext';
import p5 from 'p5';
import ImageColor from '../components/ImageColor';
import TestFabric from '../components/TestFabric';
import { useP5Paint } from '../contexts/p5PaintContext';
import { usePageNavigation } from '../contexts/PageContext';
import Piece from '../components/Piece';
import Text from '../components/Text';
import { Skeleton } from '@heroui/react';


function ImageQRCode({ canvas, imageData }) {
    const [qrUrl, setQrUrl] = useState('');
    // const [isLoading, setIsLoading] = useState(true);

    console.log(imageData, 'imageData')

    useEffect(() => {
        if (!imageData) return;

        // 將 base64 圖片數據轉換為 URL
        const imageUrl = imageData

        // 創建 FormData 對象
        // const formData = new FormData();
        // formData.append('file', imageUrl);

        // 發送到後端
        fetch('https://ai-ink-paint-backend-git-main-umarus-projects-931fb619.vercel.app/upload-base64', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: imageUrl  // 這裡對應後端的 req.body.image
            })
        })
            .then(response => response.json())
            .then(data => {
                // 從後端獲取 QR Code URL

                const qrCodeUrl = data.qrCodeUrl;
                setQrUrl(qrCodeUrl);
            })
            .catch(error => {
                console.error('上傳圖片時發生錯誤:', error);
            });

        // 創建 QR Code URL
        // const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(imageUrl)}`;

        // setQrUrl(qrCodeUrl);
    }, [imageData]);

    return (
        <div className="flex justify-center mt-8 h-64">
            <div className="flex flex-col items-center">
                <Text type="subtitle">掃描 QR Code 下載作品</Text>
                {qrUrl ?  (<img src={qrUrl} alt="QR Code" className="mt-4" />) : (<Skeleton isLoaded={qrUrl} className="mt-4 w-[180px] h-[180px]" />)}
            </div>

        </div>
    );
}


export default function Complete_Page() {

    const { paintImageData, p5PaintInstance } = useP5Paint()
    return (
        <div className="paper-container flex flex-col p-8 h-full">
            <Text type='title'>完成作品</Text>


            <Piece image={paintImageData} />


            <ImageQRCode canvas={p5PaintInstance} imageData={paintImageData} />

        </div>
    );
}