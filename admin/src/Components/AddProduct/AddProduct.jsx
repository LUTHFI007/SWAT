import React, { useState, useEffect } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
    const [images, setImages] = useState({ image1: null, image2: null, image3: null, image4: null });
    const [imagePreviews, setImagePreviews] = useState({ image1: '', image2: '', image3: '', image4: '' });
    const [productDetails, setProductDetails] = useState({
        name: "",
        category: "Sneakers",
        new_price: "",
        old_price: ""
    });
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState(''); // 'success' or 'failure'
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const previews = {};
        for (const [key, value] of Object.entries(images)) {
            if (value) {
                previews[key] = URL.createObjectURL(value);
            }
        }
        setImagePreviews(previews);

        return () => {
            for (const key in previews) {
                URL.revokeObjectURL(previews[key]);
            }
        };
    }, [images]);

    const imageHandler = (e) => {
        const { name, files } = e.target;
        setImages({ ...images, [name]: files[0] });
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const validatePrices = () => {
        const { new_price, old_price } = productDetails;
        return !isNaN(new_price) && !isNaN(old_price);
    };

    const Add_Product = async () => {
        if (!validatePrices()) {
            setModalMessage('The Price Should be given as Numbers');
            setModalType('failure');
            const modal = new window.bootstrap.Modal(document.getElementById('myModal'));
            modal.show();
            return;
        }

        setIsLoading(true);
        let responseData;
        let product = { ...productDetails };

        let formData = new FormData();
        for (const [key, value] of Object.entries(images)) {
            if (value) {
                formData.append(key, value);
            }
        }


        try {
            const uploadResponse = await fetch('http://localhost:4000/upload', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: formData,
            });
            responseData = await uploadResponse.json();

            if (responseData.success) {
                product = { ...product, ...responseData.image_urls };

                const productResponse = await fetch('http://localhost:4000/addproduct', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product),
                });
                const productData = await productResponse.json();

                if (productData.success) {
                    setModalMessage('Product Added Successfully');
                    setModalType('success');
                } else {
                    setModalMessage('Failed to Add Product');
                    setModalType('failure');
                }
            } else {
                setModalMessage('Failed to Upload Image');
                setModalType('failure');
            }
        } catch (error) {
            setModalMessage('An error occurred. Please try again.');
            setModalType('failure');
        } finally {
            setIsLoading(false);
            const modal = new window.bootstrap.Modal(document.getElementById('myModal'));
            modal.show();
        }
    };

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product Name</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Enter Name' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Enter Price' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Enter Offer Price' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                    <option value="Sneakers">Sneakers</option>
                    <option value="Sports">Sports</option>
                    <option value="Sandals">Sandals</option>
                    <option value="Sliders">Sliders</option>
                </select>
            </div>
            <div className="addproduct-thumbnails">
                {[...Array(4)].map((_, index) => (
                    <div className="addproduct-itemfield" key={index}>
                        <label htmlFor={`file-input-${index + 1}`}>
                            <img
                                src={imagePreviews[`image${index + 1}`] || upload_area}
                                className='addproduct_thumbnail-img'
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
            <button onClick={Add_Product} className="addproduct-btn" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add'}
            </button>

            {/* Modal */}
            <div className="modal fade" id="myModal">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">{modalType === 'success' ? 'Success' : 'Failure'}</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            {modalMessage}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;

