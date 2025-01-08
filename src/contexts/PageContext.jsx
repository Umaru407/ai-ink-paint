
import { createContext, useContext, useState} from 'react';



export const PageContext = createContext();



export const PageProvider = ({ children, totalPages }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const goToPage = (direction) => {
    const newPage = currentPage + direction;
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <PageContext.Provider value={{ currentPage, goToPage, totalPages }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageNavigation = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePageNavigation must be used within a PageProvider');
  }
  return context;
};