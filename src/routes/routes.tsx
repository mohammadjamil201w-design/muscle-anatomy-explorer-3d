import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import Home from '../pages/Home';
import Explorer from '../pages/Explorer';
import MuscleDetail from '../pages/MuscleDetail';
import Quiz from '../pages/Quiz';
import Glossary from '../pages/Glossary';
import Compare from '../pages/Compare';
import Favorites from '../pages/Favorites';
export const router = createBrowserRouter([{path:'/',element:<AppLayout/>,children:[
  {index:true,element:<Home/>},{path:'explorer',element:<Explorer/>},{path:'muscles/:id',element:<MuscleDetail/>},{path:'quiz',element:<Quiz/>},{path:'glossary',element:<Glossary/>},{path:'compare',element:<Compare/>},{path:'favorites',element:<Favorites/>}
]}]);
