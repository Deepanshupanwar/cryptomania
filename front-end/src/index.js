import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter} from 'react-router-dom';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import { UserContextProvider } from './userContext';
import MainPage from './Components/MainPage/MainPage';
import Profile from './Components/Profile/Profile';
import Chats from './Components/Chats/Chats';
import MobliePrice from './Components/MobliePrice/MobliePrice';
import MoblieNews from './Components/MoblieNews/MoblieNews';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';


const router = createBrowserRouter([
  {path:"/",
  element:  <MainPage/>
  },
  {path:"/login",
  element: <Login/>
  },
  {path:"/register",
  element: <Register/>
  },
  {path:"/profile/:id",
  element: <Profile/>
  },
  {path:"/chats",
  element: <Chats/>
  },
  {path:"/prices",
  element:<MobliePrice/> 
  },
  {path:"/news",
  element: <MoblieNews/>
  },
  {path:"/forgotpassword",
  element: <ForgotPassword/>
  },
  {
    path: "/resetpassword/:id/:token",
    element: <ResetPassword/>
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} /> 
    </UserContextProvider>
  </React.StrictMode>
 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
