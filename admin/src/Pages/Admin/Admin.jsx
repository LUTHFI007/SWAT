import React from 'react'
import { Routes,Route } from 'react-router-dom'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import EditProduct from '../../Components/EditProduct/EditProduct'

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar/>
      <Routes>
        <Route path='/addproduct' element={<AddProduct/>} />
        <Route path='/listproduct' element={<ListProduct/>} />
        <Route path='/editproduct/:id' element={<EditProduct/>} />
      </Routes>
    </div>
  );
}

export default Admin
