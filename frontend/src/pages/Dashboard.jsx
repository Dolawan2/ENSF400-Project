import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [generation, setGeneration] = useState(null);
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUploads();
  }, []);

  async function fetchUploads() {
    try {
      const { data } = await api.get('/upload');
      setUploads(data.uploads);
    } catch {
      setError('Failed to load uploads.');
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/upload', formData);
      setUploads((prev) => [data.upload, ...prev]);
      setSelectedUpload(data.upload);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleGenerate() {
    if (!selectedUpload) return;
    setLoading(true);
    setError('');
    setGeneration(null);

    try {
      const { data } = await api.post('/generate', {
        uploadId: selectedUpload.id,
        questionType,
        numQuestions,
      });
      setGeneration(data.generation);
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerate() {
    if (!selectedUpload) return;
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/generate/regenerate', {
        uploadId: selectedUpload.id,
        questionType,
        numQuestions,
      });
      setGeneration(data.generation);
    } catch (err) {
      setError(err.response?.data?.error || 'Regeneration failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(format) {
    if (!generation) return;
    try {
      const response = await api.get(`/download/${generation.id}?format=${format}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `study-material.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('Download failed.');
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>StudyDigest</h1>
        <div className="header-right">
          <span>Welcome, {user.name}</span>
          <button onClick={logout} className="btn btn-secondary">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="sidebar">
          <h2>Your Uploads</h2>
          <label className="upload-btn btn btn-primary">
            {uploading ? 'Uploading...' : 'Upload File'}
            <input
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFileUpload}
              disabled={uploading}
              hidden
            />
          </label>
          <ul className="upload-list">
            {uploads.map((u) => (
              <li
                key={u.id}
                className={`upload-item ${selectedUpload?.id === u.id ? 'active' : ''}`}
                onClick={() => { setSelectedUpload(u); setGeneration(null); }}
              >
                <span className="upload-name">{u.original_name}</span>
                <span className="upload-date">{new Date(u.created_at).toLocaleDateString()}</span>
              </li>
            ))}
            {uploads.length === 0 && <li className="upload-item empty">No uploads yet</li>}
          </ul>
        </aside>

        <main className="main-panel">
          {error && <div className="error-banner">{error}</div>}

          {selectedUpload ? (
            <>
              <div className="generate-controls">
                <h2>{selectedUpload.original_name}</h2>
                <div className="controls-row">
                  <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="short_answer">Short Answer</option>
                  </select>
                  <select value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))}>
                    {[3, 5, 10, 15, 20].map((n) => (
                      <option key={n} value={n}>{n} questions</option>
                    ))}
                  </select>
                  <button onClick={handleGenerate} disabled={loading} className="btn btn-primary">
                    {loading ? 'Generating...' : 'Generate'}
                  </button>
                </div>
              </div>

              {generation && (
                <div className="generation-result">
                  <section className="summary-section">
                    <h3>Summary</h3>
                    <p>{generation.summary}</p>
                  </section>

                  <section className="questions-section">
                    <h3>Questions</h3>
                    {generation.questions.map((q, i) => (
                      <div key={i} className="question-card">
                        <p className="question-text"><strong>{i + 1}.</strong> {q.question}</p>
                        {q.options && (
                          <ul className="options-list">
                            {q.options.map((opt, j) => (
                              <li key={j} className={String.fromCharCode(65 + j) === q.answer ? 'correct' : ''}>
                                {String.fromCharCode(65 + j)}) {opt}
                              </li>
                            ))}
                          </ul>
                        )}
                        {q.sampleAnswer && (
                          <p className="sample-answer"><em>Sample Answer:</em> {q.sampleAnswer}</p>
                        )}
                      </div>
                    ))}
                  </section>

                  <div className="action-row">
                    <button onClick={handleRegenerate} disabled={loading} className="btn btn-secondary">
                      {loading ? 'Regenerating...' : 'Regenerate'}
                    </button>
                    <div className="download-buttons">
                      <span>Download:</span>
                      <button onClick={() => handleDownload('txt')} className="btn btn-small">TXT</button>
                      <button onClick={() => handleDownload('csv')} className="btn btn-small">CSV</button>
                      <button onClick={() => handleDownload('md')} className="btn btn-small">MD</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <h2>Select an upload or upload a new file to get started</h2>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
