import React, { useState, useEffect } from 'react';
import { useImageContext } from '../contexts/ImageContext';
import { useSelectImageContext } from '../contexts/SelectImageContext';
import { usePageNavigation } from '../contexts/PageContext';
import { useP5Ink } from '../contexts/p5InkContext';
import { Image } from "@heroui/react";
const ImageSelectArea = () => {
    const { goToPage } = usePageNavigation();
    const { prompt, setPrompt, images, setImages } = useImageContext();
    const { setSelectImage } = useSelectImageContext()
    const { p5InkInstance, inkImageData, setInkImageData } = useP5Ink()

    useEffect(() => {
        setImages(['/一隻熊貓吃竹子_3_灰階.png', '一隻熊貓吃竹子_2_灰階.png', '/白日依山盡黃河入海流_2_灰階.png', '/白日依山盡黃河入海流_3_灰階.png'])


    }, [])


    //    const testImages = ['/1.png','/2.png','/3.png','/4.png']
    // https://picsum.photos/seed/picsum/200/300

    // console.log(images,'    images');

    return (
        <div className="image-select-area w-full h-full p-2 grid grid-cols-2 gap-6">
            {images.map((image, index) => (
                <div key={index} className="aspect-square"> {/* 新增外層容器 */}
                    <Image
                        alt="HeroUI hero Image"
                        src={image}
                        className="w-full h-full object-cover" // 修改這裡
                        onClick={() => {
                            setSelectImage(image)
                            p5InkInstance.current?.saveCanvasToBuffer()
                            goToPage(1)
                            console.log(image, 'image')
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default ImageSelectArea;