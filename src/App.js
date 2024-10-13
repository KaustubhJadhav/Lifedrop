import './App.css';
import Navbar from './Components/navbar';
import React, { createContext, useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'

// Contexts for login state
export const IsLoggedinContext = createContext();
export const SetIsLoggedinContext = createContext();


// Lazy load components
const FindDonors = lazy(() => import('./Components/FindDonors'));
const About = lazy(() => import('./About'));
const RequestBlood = lazy(() => import('./Components/RequestBlood'));
const ContactUs = lazy(() => import('./Components/ContactUs'));
const HomePage = lazy(() => import('./Components/HomePage'));
const MainDashboard = lazy(() => import('./Components/MainDashboard'));
const Login = lazy(() => import('./Components/Login'));
const SignUp = lazy(() => import('./Components/SignUp'));

const ProtectedRoute = ({ element }) => {
  const isLoggedin = React.useContext(IsLoggedinContext);

  if (isLoggedin === null) {
    return <div>Loading...</div>; // Show loading while checking login status
  }

  return isLoggedin ? element : <Navigate to="/login" />;
};

function App() {
  const [isLoggedin, setIsLoggedin] = useState(null);

  // Check login status on initial load
  useEffect(() => {
    const storedIsLoggedin = window.localStorage.getItem("isLoggedin");

    if (storedIsLoggedin === "true") {
      axios.get('http://localhost:3001/user', { withCredentials: true })
        .then(response => {
          if (response.status === 200 && response.data.user) {
            setIsLoggedin(true);
          } else {
            setIsLoggedin(false);
            window.localStorage.setItem("isLoggedin", "false");
          }
        })
        .catch(error => {
          setIsLoggedin(false);
          window.localStorage.setItem("isLoggedin", "false");
        });
    } else {
      setIsLoggedin(false);
    }
  }, []);

  return (
    <IsLoggedinContext.Provider value={isLoggedin}>
      <SetIsLoggedinContext.Provider value={setIsLoggedin}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={<ProtectedRoute element={<Suspense fallback={<div>Loading...</div>}><HomePage /></Suspense>} />} />
            <Route path='/home' element={<ProtectedRoute element={<Suspense fallback={<div>Loading...</div>}><HomePage /></Suspense>} />} />
            <Route path='/login' element={<Suspense fallback={<div>Loading...</div>}><Login /></Suspense>} />
            <Route path='/signup' element={<Suspense fallback={<div>Loading...</div>}><SignUp /></Suspense>} />
            <Route path='/contactus' element={<ProtectedRoute element={<Suspense fallback={<div>Loading...</div>}><ContactUs /></Suspense>} />} />
            <Route path='/request' element={<ProtectedRoute element={<Suspense fallback={<div>Loading...</div>}><RequestBlood /></Suspense>} />} />
            <Route path='/about' element={<ProtectedRoute element={<Suspense fallback={<div>Loading...</div>}><About /></Suspense>} />} />
            <Route path='/findDonors' element={<ProtectedRoute element={<Suspense fallback={<div>Loading...</div>}><FindDonors /></Suspense>} />} />
            <Route path='/dashboard' element={<ProtectedRoute element={<Suspense fallback={<div>Loading...</div>}><MainDashboard /></Suspense>} />} />
          </Routes>
        </BrowserRouter>
      </SetIsLoggedinContext.Provider>
    </IsLoggedinContext.Provider>
  );
}

export default App;
