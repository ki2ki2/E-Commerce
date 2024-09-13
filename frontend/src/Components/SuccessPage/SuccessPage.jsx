import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../CustomAlert/CustomAlert';
import { ShopContext } from '../../Context/ShopContext';
import './success.css'

const SuccessPage = () => {
    const [showAlert, setShowAlert] = useState(true);
    const navigate = useNavigate();
    const {all_product,cartItems,getTotalCartAmount,removeFromCart, clearcart} = useContext(ShopContext);
    const {getTotalCartItems}=useContext(ShopContext);

   async function handleClose(){
        await clearcart();
        navigate('/');
    };

    return (
        <div className='success-container'>
            <h1>Thankyou for placing order with us :)</h1>
            <img src='/images/checked.jpg'></img>
            <button className='success-btn' onClick={handleClose}>Continue Shopping </button>
        </div>
    );
};

export default SuccessPage;