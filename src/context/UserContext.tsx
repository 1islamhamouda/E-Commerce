import { createContext,  useEffect,  useState } from "react"



interface UserContextType {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  setUser: React.Dispatch<React.SetStateAction<{ id: string; name: string; email: string } | null>>;
  removeToken: () => void;
}

export const User = createContext<UserContextType | null>(null);

const UserContext = ({children}:any) => {
const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

useEffect(() => {
  const token = localStorage.getItem("token");
   if(token){
     const parseToken= JSON.parse(token);
    setUser(parseToken);
   }
}, []);

const removeToken = () => {
  setUser(null);
  localStorage.removeItem("token");
};


  return (
    <>
      <User.Provider value={{ user, setUser,removeToken }}>
        {children}
        </User.Provider>
    </>
  )
}

export default UserContext

// export const UserToken = ()=>{
//    const Token = useContext(User);
//    if(!Token)  throw new Error('UserContext must be used within a UserProvider') ;
//     return Token;
// }



