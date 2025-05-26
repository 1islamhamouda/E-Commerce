import { createContext, useEffect, useState } from "react"

interface UserData {
  name: string;
  email: string;
  role: string;
}

interface UserContextType {
  user: UserData | null;
  token: string | null;
  setUser: (userData: UserData) => void;
  setToken: (token: string) => void;
  removeToken: () => void;
}

export const User = createContext<UserContextType | null>(null);

const UserContext = ({children}:any) => {
const [user, setUser] = useState<UserData | null>(null);
const [token, setToken] = useState<string | null>(null);

useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  
  if (storedToken) {
    setToken(storedToken);
  }
  
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing stored user data:", error);
    }
  }
}, []);

const handleSetUser = (userData: UserData) => {
  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));
};

const handleSetToken = (newToken: string) => {
  setToken(newToken);
  localStorage.setItem("token", newToken);
};

const handleRemoveToken = () => {
  setUser(null);
  setToken(null);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

  return (
    <>
      <User.Provider value={{ user, token, setUser: handleSetUser, setToken: handleSetToken, removeToken: handleRemoveToken }}>
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



