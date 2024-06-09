import React from 'react'
import { useLocation, useHistory } from 'react-router-dom';
import './EditProduct.css'

const EditProduct = () => {

  const location = useLocation();
  const history = useHistory();
  const { product } = location.state || {};
  const [productDetails, setProductDetails] = useState(product || {});
  const [imagePreviews, setImagePreviews] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!product) {
      history.push('/listproduct');
    }
  }, [product, history]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const imageHandler = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      setImagePreviews((prevPreviews) => ({
        ...prevPreviews,
        [name]: URL.createObjectURL(file),
      }));
    }
  };

  const Edit_Product = async () => {
    setIsLoading(true);

    const updatedProduct = {
      id: productDetails.id,
      name: productDetails.name,
      old_price: productDetails.old_price,
      new_price: productDetails.new_price,
      category: productDetails.category,
      image1: productDetails.image1,
      image2: productDetails.image2,
      image3: productDetails.image3,
      image4: productDetails.image4,
    };

    await fetch('http://localhost:4000/editproduct', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    });

    setIsLoading(false);
    history.push('/listproduct');
  };


  return (
    <div className='edit-product'>
        <div className="editproduct-itemfield">
            <p>Product Name</p>
            <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Enter Name' />
        </div>
        <div className="editproduct-price">
            <div className="editproduct-itemfield">
                <p>Price</p>
                <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Enter Price' />
            </div>
            <div className="editproduct-itemfield">
                <p>Offer Price</p>
                <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Enter Offer Price' />
            </div>
        </div>
        <div className="editproduct-itemfield">
            <p>Product Category</p>
            <select value={productDetails.category} onChange={changeHandler} name="category" className='edit-product-selector'>
                <option value="Sneakers">Sneakers</option>
                <option value="Sports">Sports</option>
                <option value="Sandals">Sandals</option>
                <option value="Sliders">Sliders</option>
            </select>
        </div>
        <div className="editproduct-thumbnails">
            {[...Array(4)].map((_, index) => (
            <div className="editproduct-itemfield" key={index}>
                <label htmlFor={`file-input-${index + 1}`}>
                <img
                    src={imagePreviews[`image${index + 1}`] || upload_area}
                    className='editproduct_thumbnail-img'
                    alt={`Product ${index + 1}`}
                />
                </label>
                <input
                    onChange={imageHandler}
                    type="file"
                    name={`image${index + 1}`}
                    id={`file-input-${index + 1}`}
                    hidden
                />
                </div>
            ))}
        </div>
        <button onClick={Edit_Product} className="editproduct-btn" disabled={isLoading}>
            {isLoading ? 'Changing...' : 'Make Changes'}
        </button>
    </div>
  )
}

export default EditProduct
