import React from 'react';
import { useImageContext } from '../contexts/ImageContext';
import { useSelectImageContext } from '../contexts/SelectImageContext';
import { usePageNavigation } from '../contexts/PageContext';
import { useP5Ink } from '../contexts/p5InkContext';

// interface ImageSelectAreaProps {}

const ImageSelectArea = () => {
    const { goToPage } = usePageNavigation();
    const { prompt, setPrompt, images, setImages } = useImageContext();
    const {setSelectImage} = useSelectImageContext()
    const {p5InkInstance,inkImageData,setInkImageData} = useP5Ink()
   const testImages = ['/1.png','/2.png','/3.png','/4.png']
    // https://picsum.photos/seed/picsum/200/300

    // console.log(images,'    images');

    return (
        <div className="image-select-area w-full h-full px-2 flex flex-col overflow-y-scroll scrollbar-hide">
                {testImages.map((image, index) => (
                    <div key={index} className="rounded-lg shadow-md pb-2 ">
                            <img 
                                src={image} 
                                alt={`generated ${index + 1}`}
                                className="h-full object-contain"
                                onClick={() => {setSelectImage(image)
                                    p5InkInstance.current?.saveCanvasToBuffer()
                                    goToPage(1)
                                    console.log(image,'image')
                                }}
                            />
                    </div>
                ))}
                {/* Fill empty slots with placeholder if less than 4 testImages */}
                {Array.from({ length: Math.max(0, 4 -  testImages.length) }).map((_, index) => (
                    <div 
                        key={`empty-${index}`} 
                        className="w-full rounded-lg bg-gray-100"
                    >
                    </div>
                ))}
           
        </div>
    );
};

export default ImageSelectArea;