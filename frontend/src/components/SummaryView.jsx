import '../styles/Dashboard.css';

export default function SummaryView({ summary }) {
  if (!summary) return null;

  return (
    <div className="summary-view">
      <h2 className="summary-title"> {summary.title}</h2>

      {summary.sections.map((section, i) => (
        <div key={i} className="summary-section-block">
          <h3>{section.title}</h3>

          {/* paragraphs */}
          {section.paragraphs?.map((p, j) => (
            <p key={j}>{p}</p>
          ))}

          {/* bullets */}
          {section.bullets?.length > 0 && (
            <ul>
              {section.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}


