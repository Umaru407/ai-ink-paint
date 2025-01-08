
import './App.css';


import { ImageProvider } from './contexts/ImageContext';

import { SelectImageProvider } from './contexts/SelectImageContext';
import { PageProvider, usePageNavigation } from './contexts/PageContext';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import { P5InkProvider } from './contexts/p5InkContext';
import { P5PaintProvider } from './contexts/p5PaintContext';
import Page3 from './pages/Page3';
import { P5SignProvider } from './contexts/p5SignContext';



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
  return (
    <div className="relative overflow-hidden h-screen">
      {pages.map((pageContent, index) => (
        <Page key={index} position={(index - currentPage) * 100}>
          {pageContent}
        </Page>
      ))}

      {currentPage > 0 && (
        <button
          onClick={() => goToPage(-1)}
          className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-white/20 p-2 rounded-full hover:bg-white/30 z-10"
        >
          back
        </button>
      )}

      {currentPage < pages.length - 1 && (
        <button
          onClick={() => goToPage(1)}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-white/20 p-2 rounded-full hover:bg-white/30 z-10"
        >
          next
        </button>
      )}
    </div>
  );
};


export default function Home() {
  const pages = [
    <Page1 />,
    <Page2></Page2>
    , <Page3 />,

    <div key="2" className="bg-green-500 h-full flex items-center justify-center">
      <h1>自訂頁面 3</h1>
    </div>,
    <div key="2" className="bg-green-500 h-full flex items-center justify-center">
      <h1>自訂頁面 4</h1>
    </div>
  ];

  return (
    <PageProvider totalPages={pages.length}>
      <ImageProvider>
        <P5InkProvider>
          <P5PaintProvider>
            <P5SignProvider><SelectImageProvider>
              <FullscreenPages pages={pages} />
            </SelectImageProvider></P5SignProvider>

          </P5PaintProvider>
        </P5InkProvider>

      </ImageProvider>
    </PageProvider>
  )
}

