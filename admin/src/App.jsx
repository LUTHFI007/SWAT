import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar'
import Admin from './Pages/Admin/Admin'

const App = () => {
  return (
    <Router>
      <Navbar/>
        <Routes>
           <Route path="/*" element={<Admin/>}/>
        </Routes>
    </Router>
  );       
}

export default App
