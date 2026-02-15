import Modal from './Modal';
import Button from './Button';
import './ConfirmDialog.css';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', loading = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="confirm-message">{message}</p>
      <div className="confirm-actions">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmText}</Button>
      </div>
    </Modal>
  );
}
