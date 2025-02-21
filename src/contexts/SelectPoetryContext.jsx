
import { createContext, useState, useContext } from 'react';

export const TANG_POEMS = [
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
  },
  {
    id: 4,
    title: '獨坐敬亭山',
    poet: '李白',
    content: `眾鳥高飛盡，\n孤雲獨去閒。\n相看兩不厭，\n只有敬亭山。`
  },
  
  {
    id: 6,
    title: '送靈澈',
    poet: '劉長卿',
    content: `蒼蒼竹林寺，\n杳杳鐘聲晚。\n荷笠帶斜陽，\n青山獨歸遠。`
  },
  {
    id: 8,
    title: '相思',
    poet: '王維',
    content: `紅豆生南國，\n春來發幾枝。\n怨君多採擷，\n此物最相思。`
  },
  {
    id: 10,
    title: '登岳陽樓',
    poet: '杜甫',
    content: `昔聞洞庭水，\n今上岳陽樓。\n吳楚東南坼，\n乾坤日夜浮。\n親朋無一字，\n老病有孤舟。\n戎馬關山北，\n憑軒涕泗流。`
  },
  {
    id: 11,
    title: '終南別業',
    poet: '王維',
    content: `中歲頗好道，\n晚家南山陲。\n興來每獨往，\n勝事空自知。\n行到水窮處，\n坐看雲起時。\n偶然值林叟，\n談笑無還期。`
  },
  {
    id: 12,
    title: '草',
    poet: '白居易',
    content: `離離原上草，\n一歲一枯榮。\n野火燒不盡，\n春風吹又生。\n遠芳侵古道，\n晴翠接荒城。\n又送王孫去，\n萋萋滿別情。`
  },{
    id: 5,
    title: '山居秋暝',
    poet: '王維',
    content: `空山新雨後，\n天氣晚來秋。\n明月松間照，\n清泉石上流。\n竹喧歸浣女，\n蓮動下漁舟。\n隨意春芳歇，\n王孫自可留。`
  },
  {
    id: 13,
    title: '登樂遊原',
    poet: '李商隱',
    content: `向晚意不適，\n驅車登古原。\n夕陽無限好，\n只是近黃昏。`
  },
];


const SelectPoetryContext = createContext();

export function SelectPoetryProvider({ children }) {
  const [selectPoetry, setSelectPoetry] = useState(TANG_POEMS[0]);
  const value= {
    selectPoetry,setSelectPoetry
  };

  return (
    <SelectPoetryContext.Provider value={value}>
      {children}
    </SelectPoetryContext.Provider>
  );
}

export function useSelectPoetryContext() {
  const context = useContext(SelectPoetryContext);
  if (!context) {
    throw new Error('usePoetryContext must be used within an PoetryProvider');
  }
  return context;
}