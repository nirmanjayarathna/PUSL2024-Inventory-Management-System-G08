import { createContext, useContext, useState } from "react";

const PageTitleContext = createContext();

export const PageTitleProvider = ({ children }) => {
  const [pageTitle, setPageTitle] = useState("Dashboard");

  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
};

export const usePageTitle = () => useContext(PageTitleContext);
