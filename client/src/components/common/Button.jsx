import './Button.css';

export default function Button({
  children, variant = 'primary', size = 'md',
  loading = false, disabled = false, type = 'button', ...props
}) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      type={type}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn-spinner" />}
      {children}
    </button>
  );
}
