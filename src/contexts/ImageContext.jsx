import { createContext, useState, useContext} from 'react';


const ImageContext = createContext(undefined);

export function ImageProvider({ children }) {
  const [images, setImages] = useState([]); //string[]
  const [prompt, setPrompt] = useState('');
  const [recognizeStrokes, setRecognizeStrokes] = useState([]); //Stroke[]

  const [buttons, setButtons] = useState([]); //string[]

  const value =  {
    images,
    setImages,
    prompt,
    setPrompt,
    recognizeStrokes,
    setRecognizeStrokes,
    buttons, setButtons
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
}

export function useImageContext() {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
}