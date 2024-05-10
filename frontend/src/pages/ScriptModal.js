// Modal.js
import React from 'react';

const Modal = ({ isOpen, handleClose, handleSave, children }) => {
    if (!isOpen) return null;

    // Function to stop event propagation to prevent clicks inside the modal from closing it
    const stopPropagation = (e) => e.stopPropagation();

    return (
        <div className="modal-overlay" onDoubleClick={handleClose}>
            <div className="modal-content" onClick={stopPropagation}>
                <div className="modal-header">
                    <button className="close-button" onClick={handleClose}>X</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button onClick={handleSave} className="save-button">Save</button>
                    <button onClick={handleClose} className="skip-button">Skip</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;

