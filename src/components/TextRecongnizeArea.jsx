// components/DraggableButtonContainer.tsx

import React, { useRef, useState, MouseEvent, TouchEvent } from 'react';

import { useImageContext } from '../contexts/ImageContext';
import { PromptInput } from './PromptInput';



// interface DraggableButtonContainerProps {
//     // buttonLabels: string[];
//     // setButtons: Function
//     // resetRecognizeStrokes: Function
//     // setImages: React.Dispatch<React.SetStateAction<never[]>>;
//     // images: string[];
//     // prompt: string;
//     // setPrompt: React.Dispatch<React.SetStateAction<string>>;
//     //   onButtonClick?: (label: string) => void;
// }

const TextRecongnizeArea = () => {
    const { prompt, setPrompt, images, setImages, setRecognizeStrokes, buttons,setButtons } = useImageContext();
    // console.log('buttons',buttons)
    const containerRef = useRef(null);
    const promptRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // const [prompt, setPrompt] = useState('');

    const handleMouseDown = (e) => {
        if (!containerRef.current) return;

        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return;

        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e) => {
        if (!containerRef.current) return;

        const touch = e.touches[0];
        setStartX(touch.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!containerRef.current) return;

        const touch = e.touches[0];
        const x = touch.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleButtonClick = (e, label) => {
        if (isDragging) return;
        // if (!promptRef.current) return;
        setPrompt(prompt + label)
        // promptRef.current.value += label
        // resetRecognizeStrokes()
        setRecognizeStrokes([])
        setButtons([])
    };

    // console.log(`max-w-[640px]`)

    return (
        <div className={`max-w-[480px]`}>
            <div
                ref={containerRef}
                className={`w-full overflow-hidden cursor-grab select-none ${isDragging ? 'cursor-grabbing' : ''
                    }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
            >
                <div className="inline-flex gap-3">
                    {buttons.map((label, index) => (
                        <button
                            key={index}
                            className="px-5 py-3 bg-blue-500 text-white text-4xl border-none rounded-md 
                     cursor-pointer whitespace-nowrap transition-colors duration-300 
                     hover:bg-blue-600"
                            onClick={(e) => handleButtonClick(e, label)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <PromptInput />

        </div>

    );
};

export default TextRecongnizeArea;