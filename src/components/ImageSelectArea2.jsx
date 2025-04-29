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
        console.log('圖片數量:', images.length);
    }, [images])

    useEffect(() => {
        setImages(['/一隻熊貓吃竹子_3_灰階.png', '一隻熊貓吃竹子_2_灰階.png', '/白日依山盡黃河入海流_2_灰階.png', '/白日依山盡黃河入海流_3_灰階.png'])
    }, [])


    //    const testImages = ['/1.png','/2.png','/3.png','/4.png']
    // https://picsum.photos/seed/picsum/200/300

    // console.log(images,'    images');

    return (
        <div className="image-select-area w-full flex-1 grid grid-cols-2 gap-4">
            {images.map((image, index) => (
                <div key={index} className="relative w-full h-full ">
                    <img
                        src={image}
                        alt={`Image ${index + 1}`}
                        className="absolute w-full h-full object-contain"
                        onClick={() => {
                            setSelectImage(image)
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

// <Image
//                         alt="HeroUI hero Image"
//                         src={image}
//                         className="absolute w-full h-full object-contain"
//                         onClick={() => {
//                             setSelectImage(image)
//                             goToPage(1)
//                             console.log(image, 'image')
//                         }}
//                     />