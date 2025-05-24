import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { User } from '../context/UserContext';

interface ProtectedElementProps {
  children: React.ReactNode;
}

const ProtectedElement: React.FC<ProtectedElementProps> = ({ children }) => {
  const userContext = useContext(User);
  
  if (!userContext) {
    throw new Error("UserContext is not provided");
  }
  
  const { user } = userContext;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedElement;

 