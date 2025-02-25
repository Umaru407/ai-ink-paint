import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/react";
import { TANG_POEMS, useSelectPoetryContext } from '../contexts/SelectPoetryContext';
// 唐詩數據庫


const PoetryList = () => {
  const { selectPoetry, setSelectPoetry } = useSelectPoetryContext();


  return (
    <div className="container mx-auto ">
      {/* 詩歌內容 */}
      <Card >
        
        {/* <CardHeader className='text-3xl justify-center gap-6 [writing-mode:tb-rl]'>
          
        </CardHeader> */}
        <CardBody className='[writing-mode:vertical-rl] text-3xl/loose tracking-[8px] text-center justify-center '>
        <div className='border-2 border-black rounded-lg p-2'>
        <p className='text-4xl'>{selectPoetry.title}</p>
        <p className='text-2xl'>{selectPoetry.poet}</p>
        </div>
          
          <p className="whitespace-pre-wrap mt-4">
            {selectPoetry.content}
          </p>
        </CardBody>
        {/* <Button color="primary">Primary</Button>className='bg-blue-500 w-full' */}
      </Card>
      {/* <Button radius="sm" color='primary' fullWidth >選擇詩詞</Button> */}

    </div>

  );
};

export default PoetryList;