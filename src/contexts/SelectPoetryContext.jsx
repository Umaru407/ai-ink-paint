
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
  }
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