import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'

const ListProduct = () => {

  const [allproducts, setAllProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productIdToRemove, setProductIdToRemove] = useState(null);
  const history = useHistory();

  const fetchInfo = async ()=>{
    await fetch('http://localhost:4000/allproducts')
    .then((res)=>res.json())
    .then((data)=>{setAllProducts(data)});
  }

  useEffect(()=>{
    fetchInfo();
  },[])

  const remove_product = async (id)=>{
    await fetch('http://localhost:4000/removeproduct',{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json',
      },
      body:JSON.stringify({id:id})
    })
    await fetchInfo();
    setShowModal(false);
  }

  const handleRemoveClick = (id) => {
    setProductIdToRemove(id);
    setShowModal(true);
  }

  const handleConfirmRemove = () => {
    remove_product(productIdToRemove);
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setProductIdToRemove(null);
  }

  const handleEditClick = (product) => {
    history.push({
      pathname: `/editproduct/${product.id}`,
      state: { product }
    });
  };

  return (
    <div className='list-product'>
        <h1>All Products </h1>
        <div className="listproduct-format-main">
          <p>Products</p>
          <p>Title</p>
          <p>Price</p>
          <p>Offer Price</p>
          <p>Category</p>
          <p>Edit</p>
          <p>Remove</p>
        </div>
        <div className="listproduct-allproducts">
          <hr />
          {allproducts.map((product,index)=>{
              return <>
              <div key={index} className="listproduct-format-main listproduct-format">
                  <img src={product.image} alt="" className="listproduct-product-icon" />
                  <p>{product.name}</p>
                  <p>{product.old_price}</p>
                  <p>{product.new_price}</p>
                  <p>{product.category}</p>
                  <button className='btn btn-danger' onClick={() => handleEditClick(product)}>Edit</button>
                  <img className='listproduct-remove-icon' onClick={()=>{handleRemoveClick(product.id)}} src={cross_icon} alt=""  />
              </div>
              <hr />
              </>
          })}
        </div>

        {showModal && (
          <div className="modal fade show" id="myModal" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-light">
                  <h4 className="modal-title">Remove Product</h4>
                  <button type="button" className="close" onClick={handleCloseModal}>&times;</button>
                </div>
                <div className="modal-body bg-light">
                  Are you sure you want to remove the product?
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>No</button>
                  <button type="button" className="btn btn-danger" onClick={handleConfirmRemove}>Yes</button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default ListProduct

