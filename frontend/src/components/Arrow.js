import React from 'react';
import '../styles/Arrow.css';  

const ArrowButton = ({ isOpen, onClick }) => {
    console.log("ArrowButton Open:", isOpen); // Debugging state change
    return (
        <div className={`arrow ${isOpen ? 'open' : 'closed'}`} onClick={onClick}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
};

export default ArrowButton;

