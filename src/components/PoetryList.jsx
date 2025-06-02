import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/react";
import { TANG_POEMS, useSelectPoetryContext } from '../contexts/SelectPoetryContext';


// 唐詩數據庫



const PoetryList = ({ setPrompt }) => {
    const { selectPoetry, setSelectPoetry } = useSelectPoetryContext();

    useEffect(() => {
        setPrompt(selectPoetry.translation || selectPoetry.content);
    }, [selectPoetry])
    // const [currentPoem, setCurrentPoem] = useState(TANG_POEMS[0]);
    // const { prompt, setPrompt } = useImageContext();

    return (
        <div className="w-full ">
            


            {/* 詩歌列表 */}
            <div className="w-full">
                <Card className='text-4xl'>
                    <CardHeader>
                        目錄
                    </CardHeader>
                    <CardBody>
                        {TANG_POEMS.map((poem) => (
                            <button
                                key={poem.id}
                                className={`w-full text-left p-2 hover:bg-gray-100 ${selectPoetry.id === poem.id ? 'bg-blue-100' : ''
                                    }`}
                                onClick={() => {
                                    setSelectPoetry(poem)
                                    setPrompt(poem.content)

                                }}
                            >
                                {poem.title} - {poem.poet}
                            </button>
                        ))}
                    </CardBody>
                </Card>
            </div>

            {/* 詩歌內容 */}
        </div>

    );
};

export default PoetryList;