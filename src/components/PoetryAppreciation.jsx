import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/react";
import { TANG_POEMS, useSelectPoetryContext } from '../contexts/SelectPoetryContext';
// 唐詩數據庫


const PoetryAppreciation = () => {
  const { selectPoetry, setSelectPoetry } = useSelectPoetryContext();


  return (
    <div className="w-full mx-auto flex-[1] overflow-scroll my-4">
      {/* 詩歌內容 */}
      <Card >    
        {/* <CardHeader className='text-3xl justify-center gap-6 [writing-mode:tb-rl]'>
          
        </CardHeader> */}
        <CardBody className='text-3xl  justify-center'>
        
        <p>{selectPoetry.appreciation}</p>
       
        </CardBody>
        {/* <Button color="primary">Primary</Button>className='bg-blue-500 w-full' */}
      </Card>
      {/* <Button radius="sm" color='primary' fullWidth >選擇詩詞</Button> */}

    </div>

  );
};

export default PoetryAppreciation;