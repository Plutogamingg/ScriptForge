// Modal.js
import React from 'react';

const DraftModal = ({ isOpen, handleClose, handleCommit, handleDelete, children }) => {
    if (!isOpen) return null;

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
                    <button onClick={handleCommit} className="commit-button">Commit</button>
                    <button onClick={handleDelete} className="delete-button">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DraftModal;
