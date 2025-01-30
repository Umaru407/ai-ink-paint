import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/react";
import { TANG_POEMS, useSelectPoetryContext } from '../contexts/SelectPoetryContext';
// 唐詩數據庫


const PoetryList = () => {
  const { selectPoetry, setSelectPoetry } = useSelectPoetryContext();


  return (
    <div className="container mx-auto my-2">
      {/* 詩歌內容 */}
      <Card >
        <CardHeader className='text-5xl justify-center gap-6'>
          {selectPoetry.title}
          <p className="text-gray-600">作者：{selectPoetry.poet}</p>
        </CardHeader>
        <CardBody className='[writing-mode:vertical-rl] text-5xl/loose tracking-[1rem] justify-center '>
          <pre className="whitespace-pre-wrap font-sans">
            {selectPoetry.content}
          </pre>
        </CardBody>
        {/* <Button color="primary">Primary</Button>className='bg-blue-500 w-full' */}
      </Card>
      {/* <Button radius="sm" color='primary' fullWidth >選擇詩詞</Button> */}

    </div>

  );
};

export default PoetryList;