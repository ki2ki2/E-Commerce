import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../CustomAlert/CustomAlert';

const SuccessPage = () => {
    const [showAlert, setShowAlert] = useState(true);
    const navigate = useNavigate();

    const handleClose = () => {
        setShowAlert(false);
        setTimeout(() => {
            navigate('/');
        }, 300); // Adjust the timeout if needed
    };

    return (
        <div>
            {showAlert && (
                <CustomAlert
                    message="Payment Successful!"
                    onClose={handleClose}
                />
            )}
            {/* Rest of your SuccessPage component */}
        </div>
    );
};

export default SuccessPage;
