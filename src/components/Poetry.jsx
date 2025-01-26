import React, { useState } from 'react';
import {Card, CardHeader, CardBody, CardFooter} from "@heroui/card";
import {Button} from "@heroui/react";
// 唐詩數據庫
const TANG_POEMS = [
  {
    id: 1,
    title: '靜夜思',
    poet: '李白',
    content: `床前明月光，\n疑是地上霜。\n舉頭望明月，\n低頭思故鄉。`
  },
  {
    id: 2,
    title: '登鸛雀樓', 
    poet: '王之渙',
    content: `白日依山盡，\n黃河入海流。\n欲窮千里目，\n更上一層樓。`
  },
  {
    id: 3,
    title: '春曉',
    poet: '孟浩然',
    content: `春眠不覺曉，\n處處聞啼鳥。\n夜來風雨聲，\n花落知多少。`
  }
];

const Poetry = () => {
  const [currentPoem, setCurrentPoem] = useState(TANG_POEMS[0]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-6xl">唐詩集</h1>
      
      <div className="flex flex-col gap-4">
        {/* 詩歌列表 */}
        <div className="w-full">
          <Card className='text-4xl'>
            <CardHeader>
              唐詩目錄
            </CardHeader>
            <CardBody>
              {TANG_POEMS.map((poem) => (
                <button 
                  key={poem.id}
                  className={`w-full text-left p-2 hover:bg-gray-100 ${
                    currentPoem.id === poem.id ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => setCurrentPoem(poem)}
                >
                  {poem.title} - {poem.poet}
                </button>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* 詩歌內容 */}
        <div className="w-full">
          <Card >
            <CardHeader className='text-6xl justify-center gap-6'>
              {currentPoem.title}
              <p className="text-gray-600">作者：{currentPoem.poet}</p>
            </CardHeader>
            <CardBody className='[writing-mode:vertical-rl] text-6xl/loose tracking-[1rem] justify-center '>
              <pre className="whitespace-pre-wrap font-sans">
                {currentPoem.content}
              </pre>
            </CardBody>
            {/* <Button color="primary">Primary</Button>className='bg-blue-500 w-full' */}
          </Card>
          <Button radius="sm" color='primary' fullWidth isLoading>產生詩境水墨畫</Button>
        </div>
      </div>
    </div>
  );
};

export default Poetry;