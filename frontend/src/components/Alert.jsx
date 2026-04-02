import '../styles/Feedback.css';

export default function Alert({ message, variant = 'error', onDismiss }) {
  if (!message) return null;

  return (
    <div className={`alert alert-${variant}`}>
      <span>{message}</span>
      {onDismiss && (
        <button className="alert-dismiss" onClick={onDismiss}>&times;</button>
      )}
    </div>
  );
}
