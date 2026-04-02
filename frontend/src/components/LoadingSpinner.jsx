import '../styles/Feedback.css';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading-state">
      <div className="spinner"></div>
      {message && <p>{message}</p>}
    </div>
  );
}
