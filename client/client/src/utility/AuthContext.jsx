import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      const decoded = jwtDecode(token);
      setUser(decoded);
      localStorage.setItem('user', JSON.stringify(decoded));
    } else {
      const storedUser = localStorage.getItem('user');
      const storedRole = localStorage.getItem('role');
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedRole) setRole(JSON.parse(storedRole));
    }
    setLoading(false);
  }, []);

// Periodically check if the cookie has expired
useEffect(() => {
  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/auth-me', { withCredentials: true });
      const data = await response.json();
      if (!data.authenticated) {
        setUser(null);
        setRole(null);
        localStorage.removeItem('user');
        localStorage.removeItem('role');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  const interval = setInterval(checkAuth, 60000); // Check every 60 seconds

  return () => clearInterval(interval);
}, []);



  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
      console.log(response);

      const userData = response.data.message.user;
      const userRole = response.data.message.role;

      setUser(userData);
      setRole(userRole);

      // Use useEffect to log updated state instead of logging immediately
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', JSON.stringify(userRole));

      // if(userRole === 'student') {
      //   window.location.href = '/student';
      // } else if(userRole === 'company') {
      //   window.location.href = '/company';
      // }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.warn('User is already unauthorized, proceeding with logout.');
      } else {
        console.error('Logout failed:', error);
      }
    } finally {
      setUser(null);
      setRole(null);
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
