import React from 'react';
import './styles/ConfirmDialog.css';
import Button from './MenuButton';

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-dialog">
      <div className="confirm-dialog-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-dialog-actions">
          <Button onClick={onCancel} text= 'Cancel'/>
          <Button onClick={onConfirm}text= 'Confirm'/>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
