
import './App.css';


import { ImageProvider } from './contexts/ImageContext';

import { SelectImageProvider } from './contexts/SelectImageContext';
import { PageProvider, usePageNavigation } from './contexts/PageContext';

import { P5InkProvider } from './contexts/p5InkContext';
import { P5PaintProvider } from './contexts/p5PaintContext';
import Complelte_Page from './pages/Complete_Page';
import { P5SignProvider } from './contexts/p5SignContext';
import Calligraphy_Page from './pages/Calligraphy_Page';
import { HeroUIProvider } from "@heroui/react";
import Select_Poetry_Page from './pages/Select_Poetry_Page';
import { SelectPoetryProvider } from './contexts/SelectPoetryContext';
import Select_Paint_Page from './pages/Select_Paint_Page';
import StampPage from './pages/Stamp_Page';
import PaintPage from './pages/Paint_Page';
import { P5ColorProvider } from './contexts/p5ColorContext';
import { StampStylesProvider } from './contexts/stampStyleContext';
import TutorialPage from './pages/Tutorial_Page';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useEffect } from 'react';
const Page = ({ position, children }) => (
  <div
    className="absolute w-screen h-screen transition-transform duration-500 ease-in-out"
    style={{ transform: `translateX(${position}%)` }}
  >
    {children}
  </div>
);




const FullscreenPages = ({ pages }) => {
  const { currentPage, goToPage } = usePageNavigation();


  const devMode = true;
  return (
    <div className="relative overflow-hidden h-screen">
      {pages.map((pageContent, index) => (
        <Page key={index} position={(index - currentPage) * 100}>
          {pageContent}
        </Page>
      ))}

      {devMode && currentPage > 0 && (
        <button
          onClick={() => goToPage(-1)}
          className="w-min h-min fixed left-4 top-12 transform -translate-y-1/2 bg-white/10 p-1 rounded-full hover:bg-white/10 z-10"
        >
          <NavigateBeforeIcon fontSize='small' />
        </button>
      )}

      {devMode && currentPage < pages.length - 1 && (
        <button
          onClick={() => goToPage(1)}
          className="w-min h-min fixed right-4 top-12 transform -translate-y-1/2 bg-white/10 p-1 rounded-full hover:bg-white/10 z-10"
        >
          <NavigateNextIcon fontSize='small' />
        </button>
      )}
    </div>
  );
};


export default function Home() {
  const pages = [
    // <ColorCanva/>,
    <TutorialPage />,
    <Select_Poetry_Page />,
    <Calligraphy_Page />,
    <Select_Paint_Page />,
    <PaintPage />,
    <StampPage />,
    <Complelte_Page />,


  ];

  useEffect(() => {
  const handleBeforeUnload = (e) => {
    e.preventDefault();
    e.returnValue = ''; // 必須設置這一行才能觸發提示框
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, []);


  return (
    <HeroUIProvider>


      <PageProvider totalPages={pages.length}>
        <ImageProvider>
          <P5InkProvider>
            <P5PaintProvider>
              <P5SignProvider>
                <P5ColorProvider>
                  <StampStylesProvider>
                    <SelectImageProvider>
                      <SelectPoetryProvider>
                        <FullscreenPages pages={pages} />
                      </SelectPoetryProvider>
                    </SelectImageProvider>
                  </StampStylesProvider>
                </P5ColorProvider>
              </P5SignProvider>
            </P5PaintProvider>
          </P5InkProvider>
        </ImageProvider>
      </PageProvider>
    </HeroUIProvider>

  )
}

