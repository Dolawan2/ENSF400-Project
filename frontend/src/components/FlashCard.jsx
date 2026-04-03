import { useState } from 'react';
import '../styles/Dashboard.css';

export default function FlashCard({ question, index }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className={`flashcard ${revealed ? 'revealed' : ''}`} onClick={() => setRevealed(!revealed)}>
      <div className="flashcard-front">
        <span className="flashcard-number">{index + 1}</span>
        <p>{question.question}</p>
        {question.options && (
          <ul className="flashcard-options">
            {question.options.map((opt, j) => (
              <li key={j}>{String.fromCharCode(65 + j)}) {opt}</li>
            ))}
          </ul>
        )}
        <span className="flashcard-hint">Click to reveal answer</span>
      </div>
      <div className="flashcard-back">
        <span className="flashcard-number">{index + 1}</span>
        <p className="flashcard-question">{question.question}</p>
        {question.options ? (
          <div className="flashcard-answer">
            <span className="answer-label">Answer:</span> {question.answer}) {question.options[question.answer.charCodeAt(0) - 65]}
          </div>
        ) : (
          <div className="flashcard-answer">
            <span className="answer-label">Sample Answer:</span> {question.sampleAnswer}
          </div>
        )}
      </div>
    </div>
  );
}