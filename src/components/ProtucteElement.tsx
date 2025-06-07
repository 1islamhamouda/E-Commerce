import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User } from '../context/UserContext';

interface ProtectedElementProps {
  children: React.ReactNode;
}

const ProtectedElement: React.FC<ProtectedElementProps> = ({ children }) => {
  const userContext = useContext(User);
  const [isLoading, setIsLoading] = useState(true);
  
  if (!userContext) {
    throw new Error("UserContext is not provided");
  }
  
  const { user, token } = userContext;

  useEffect(() => {
    // Check if we have either user state or token in localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken || storedUser) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return null; // or a loading spinner
  }

  // If we have either user state or token, allow access
  if (user || token || localStorage.getItem('token')) {
    return <>{children}</>;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedElement;

 