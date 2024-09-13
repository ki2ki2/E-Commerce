import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../CustomAlert/CustomAlert';
import { ShopContext } from '../../Context/ShopContext';

const SuccessPage = () => {
    const [showAlert, setShowAlert] = useState(true);
    const navigate = useNavigate();
    // const {all_product,cartItems,getTotalCartAmount,removeFromCart, clearcart} = useContext(ShopContext)
    // const {clearcart}=useContext(ShopContext);

    const handleClose = async() => {
        // window.location.reload();
        navigate('/');
    };

    return (
        <div>
            {showAlert && (
                <CustomAlert
                    message="Payment Successful!"
                    onClose={handleClose}
                />
            )}
        </div>
    );
};

export default SuccessPage;
