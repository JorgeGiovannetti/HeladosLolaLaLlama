import React, { createContext, useContext, useState } from "react";
import axios from 'axios';
import axiosClient from '../providers/AxiosClient';

export const AuthContext = createContext({ user: null });
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem('lolaToken'));

  const login = async (username, password) => {
    const response = await axios.post('https://lolalallama.herokuapp.com/api/admin/login', {}, { auth: { username, password } });
    console.log('server response on login', response.data);
    localStorage.setItem('lolaToken', response.data.value);
    axiosClient.defaults.headers.authorization = `Bearer ${response.data.value}`;
    setUser(response.data.user);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('lolaToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
