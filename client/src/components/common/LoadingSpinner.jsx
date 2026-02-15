import './LoadingSpinner.css';

export default function LoadingSpinner({ fullPage = false }) {
  if (fullPage) {
    return (
      <div className="loading-fullpage">
        <div className="loading-spinner" />
      </div>
    );
  }
  return <div className="loading-spinner" />;
}
