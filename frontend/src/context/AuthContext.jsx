import {createContext,useContext,useEffect,useState} from 'react';import api from '../services/api';
const C=createContext(null);
export function AuthProvider({children}){const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem('user')||'null'));const [loading,setLoading]=useState(!!localStorage.getItem('token'));
useEffect(()=>{if(localStorage.getItem('token'))api.get('/auth/me').then(r=>setUser(r.data.user)).catch(()=>{localStorage.clear();setUser(null)}).finally(()=>setLoading(false));},[]);
const login=async(email,password)=>{const r=await api.post('/auth/login',{email,password});localStorage.setItem('token',r.data.token);localStorage.setItem('user',JSON.stringify(r.data.user));setUser(r.data.user)};
const logout=()=>{localStorage.clear();setUser(null)};return <C.Provider value={{user,login,logout,loading}}>{children}</C.Provider>}
export const useAuth=()=>useContext(C);
