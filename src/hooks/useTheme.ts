import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
export function useTheme(){
  const [theme,setTheme]=useLocalStorage<'light'|'dark'>('mae-theme','light');
  useEffect(()=>{document.documentElement.classList.toggle('dark',theme==='dark')},[theme]);
  return {theme,toggleTheme:()=>setTheme(theme==='dark'?'light':'dark')};
}
