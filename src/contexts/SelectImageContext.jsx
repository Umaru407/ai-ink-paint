
import { createContext, useState, useContext } from 'react';


// interface SelectImageContextType {
//   selectImage: string
//   setSelectImage: (selectImage: string) => void;
// }

// interface SelectImageProviderProps {
//   children: ReactNode;
// }

const SelectImageContext = createContext  ();

export function SelectImageProvider({ children }) {
  const [selectImage, setSelectImage] = useState('');



  const value= {
    selectImage,setSelectImage

  };

  return (
    <SelectImageContext.Provider value={value}>
      {children}
    </SelectImageContext.Provider>
  );
}

export function useSelectImageContext() {
  const context = useContext(SelectImageContext);
  if (!context) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
}