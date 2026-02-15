import './Input.css';

export default function Input({ label, error, id, ...props }) {
  return (
    <div className="form-group">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <input id={id} className={`form-input ${error ? 'form-input-error' : ''}`} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export function Select({ label, error, id, children, ...props }) {
  return (
    <div className="form-group">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <select id={id} className={`form-input form-select ${error ? 'form-input-error' : ''}`} {...props}>
        {children}
      </select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export function Textarea({ label, error, id, ...props }) {
  return (
    <div className="form-group">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <textarea id={id} className={`form-input form-textarea ${error ? 'form-input-error' : ''}`} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
