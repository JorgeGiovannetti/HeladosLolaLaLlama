import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext({ user: null });
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  // const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    // TODO: Connect to backend

    setUser({ email }); // Placeholder
    // setLoading(false);
  };

  const logout = async () => {
    // TODO: Connect to backend
    setUser(null);
    // setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
