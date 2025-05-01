import { createContext, useContext, useState } from "react"

let User = createContext({});
const UserContext = ({children}:any) => {
const [user, setUser] = useState<{}>( {});
  return (
    <>
      <User.Provider value={{user, setUser}}>
        {children}
        </User.Provider>
    </>
  )
}

export default UserContext

export const UserToken = ()=>{
   const Token = useContext(User);
   if(!Token)  throw new Error('UserContext must be used within a UserProvider') ;
    return Token;
}
