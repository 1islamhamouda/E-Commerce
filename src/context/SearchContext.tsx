import { createContext, useState } from "react"
type SearchType ={
    isSearch: boolean,
    setIsSearch: React.Dispatch<React.SetStateAction<boolean>>,
}
 export const SesrchProvider = createContext<SearchType>({
   isSearch: false,
   setIsSearch: () => {}
 });
 export default function SearchContext({ children }: { children: React.ReactNode }) {
    const [isSearch, setIsSearch] = useState<boolean>(false);
   return (
     <>
       <SesrchProvider.Provider value={{ isSearch, setIsSearch }}>
        {children}
       </SesrchProvider.Provider>
     </>
   )
 }
 