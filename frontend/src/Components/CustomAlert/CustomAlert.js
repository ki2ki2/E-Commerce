import React from 'react';
import './CustomAlert.css'; // Import CSS for styling

const CustomAlert = ({ message, onClose }) => {
    return (
        <div className="custom-alert">
            <div className="custom-alert-content">
            <svg width="161" height="160" viewBox="0 0 161 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M137.643 74.7756V80.0327C137.636 92.3551 133.646 104.345 126.268 114.215C118.89 124.084 108.519 131.304 96.702 134.798C84.8853 138.292 72.2558 137.872 60.697 133.602C49.1382 129.331 39.2695 121.439 32.5626 111.102C25.8558 100.764 22.6702 88.5359 23.481 76.2402C24.2918 63.9445 29.0555 52.2403 37.0616 42.8731C45.0677 33.506 55.8873 26.9778 67.9068 24.2621C79.9262 21.5465 92.5015 22.7889 103.757 27.8041M137.643 34.3185L80.5 91.5185L63.3571 74.3756" stroke="#00C48C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
                <p>{message}</p>
                <button onClick={onClose}>OK</button>
            </div>
        </div>
    );
};

export default CustomAlert;
