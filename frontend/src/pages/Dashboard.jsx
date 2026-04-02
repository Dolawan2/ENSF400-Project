import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import '../styles/Dashboard.css';

function FlashCard({ question, index }) {
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

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [generations, setGenerations] = useState([]);
  const [activeGeneration, setActiveGeneration] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

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

  function requestDelete(e, uploadId) {
    e.stopPropagation();
    setConfirmDelete(uploadId);
  }

  async function handleDelete() {
    const uploadId = confirmDelete;
    setConfirmDelete(null);

    try {
      await api.delete(`/upload/${uploadId}`);
      setUploads((prev) => prev.filter((u) => u.id !== uploadId));
      if (selectedUpload?.id === uploadId) {
        setSelectedUpload(null);
        setActiveGeneration(null);
        setGenerations([]);
      }
    } catch {
      setError('Failed to delete upload.');
    }
  }

  async function selectUpload(upload) {
    setSelectedUpload(upload);
    setActiveGeneration(null);
    setGenerations([]);
    setActiveTab('summary');
    setError('');

    try {
      const historyRes = await api.get('/user/history');
      const uploadGens = historyRes.data.generations.filter(g => g.upload_id === upload.id);
      setGenerations(uploadGens);
      if (uploadGens.length > 0) {
        setActiveGeneration(uploadGens[0]);
      }
    } catch {
      // No past generations, that's fine
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
      selectUpload(data.upload);
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

    try {
      const { data } = await api.post('/generate', {
        uploadId: selectedUpload.id,
        questionType,
        numQuestions,
      });
      setActiveGeneration(data.generation);
      setGenerations((prev) => [data.generation, ...prev]);
      setActiveTab('summary');
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(format) {
    if (!activeGeneration) return;
    try {
      const response = await api.get(`/download/${activeGeneration.id}?format=${format}`, {
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

  const questionTypeLabel = (type) =>
    type === 'multiple_choice' ? 'Multiple Choice' : 'Short Answer';

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
                onClick={() => selectUpload(u)}
              >
                <div className="upload-item-row">
                  <span className="upload-name">{u.original_name}</span>
                  <button className="delete-btn" onClick={(e) => requestDelete(e, u.id)} title="Delete">&times;</button>
                </div>
                <span className="upload-date">{new Date(u.created_at).toLocaleDateString()}</span>
              </li>
            ))}
            {uploads.length === 0 && <li className="upload-item empty">No uploads yet</li>}
          </ul>
        </aside>

        <main className="main-panel">
          <Alert message={error} variant="error" onDismiss={() => setError('')} />

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

              {/* Past generations selector */}
              {generations.length > 1 && (
                <div className="generation-history">
                  <span>Previous generations:</span>
                  <div className="gen-chips">
                    {generations.map((g) => (
                      <button
                        key={g.id}
                        className={`gen-chip ${activeGeneration?.id === g.id ? 'active' : ''}`}
                        onClick={() => { setActiveGeneration(g); setActiveTab('summary'); }}
                      >
                        {questionTypeLabel(g.question_type)} &middot; {new Date(g.created_at).toLocaleTimeString()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeGeneration && (
                <div className="generation-result">
                  {/* Tabs */}
                  <div className="tabs">
                    <button
                      className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
                      onClick={() => setActiveTab('summary')}
                    >
                      Summary
                    </button>
                    <button
                      className={`tab ${activeTab === 'questions' ? 'active' : ''}`}
                      onClick={() => setActiveTab('questions')}
                    >
                      Questions ({activeGeneration.questions.length})
                    </button>
                    <button
                      className={`tab ${activeTab === 'download' ? 'active' : ''}`}
                      onClick={() => setActiveTab('download')}
                    >
                      Download
                    </button>
                  </div>

                  {/* Tab content */}
                  <div className="tab-content">
                    {activeTab === 'summary' && (
                      <section className="summary-section">
                        <p>{activeGeneration.summary}</p>
                      </section>
                    )}

                    {activeTab === 'questions' && (
                      <section className="questions-section">
                        <div className="flashcard-grid">
                          {activeGeneration.questions.map((q, i) => (
                            <FlashCard key={i} question={q} index={i} />
                          ))}
                        </div>
                      </section>
                    )}

                    {activeTab === 'download' && (
                      <section className="download-section">
                        <p>Download this study material in your preferred format:</p>
                        <div className="download-grid">
                          <button onClick={() => handleDownload('txt')} className="download-card">
                            <span className="download-icon">TXT</span>
                            <span>Plain Text</span>
                          </button>
                          <button onClick={() => handleDownload('csv')} className="download-card">
                            <span className="download-icon">CSV</span>
                            <span>Spreadsheet</span>
                          </button>
                          <button onClick={() => handleDownload('md')} className="download-card">
                            <span className="download-icon">MD</span>
                            <span>Markdown</span>
                          </button>
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              )}

              {!activeGeneration && !loading && (
                <div className="empty-state">
                  <p>Select question type and count, then hit Generate</p>
                </div>
              )}

              {loading && <LoadingSpinner message="Generating study material..." />}
            </>
          ) : (
            <div className="empty-state">
              <h2>Select an upload or upload a new file to get started</h2>
            </div>
          )}
        </main>
      </div>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete Upload"
        message="Delete this file and all its generated content?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
