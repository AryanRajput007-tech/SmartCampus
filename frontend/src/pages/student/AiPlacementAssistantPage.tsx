import React, { useState } from 'react';
import { aiService } from '../../services/aiService';
import { Button } from '../../components/Button';

interface Message {
  id: string;
  sender: 'student' | 'ai';
  text: string;
  source?: 'gemini' | 'fallback';
  timestamp: string;
}

export const AiPlacementAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "👋 Hi there! I'm your SmartCampus Placement & Career Assistant. Ask me anything about resume building, technical DSA patterns, STAR behavioral answers, or MERN stack interview questions!",
      source: 'fallback',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedPrompts = [
    'How should I format my resume project bullets with Google XYZ formula?',
    'What are the most frequent DSA patterns tested in SDE-1 rounds?',
    'Explain the STAR framework with a concrete technical conflict example.',
    'What are the key MERN stack interview questions asked by recruiters?'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputMessage;
    if (!messageText.trim()) return;

    const studentMsg: Message = {
      id: Date.now().toString(),
      sender: 'student',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, studentMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await aiService.chatWithAssistant(messageText);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: res.response,
        source: res.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'The AI assistant service encountered an unexpected error. Please ensure the backend and AI services are running.',
        source: 'fallback',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>🤖 AI Placement & Career Assistant</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Real-time interview preparation, resume tuning, and career mentorship powered by Google Gemini.
        </p>
      </div>

      {/* Suggested Prompts Carousel / Chips */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Suggested Placement Questions:
        </div>
        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.8125rem', borderRadius: 'var(--radius-full)' }}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
            >
              💬 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '560px',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Messages Scroll Area */}
        <div
          style={{
            flex: 1,
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'student' ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor:
                    msg.sender === 'student' ? 'var(--color-primary)' : 'var(--bg-subtle)',
                  color: msg.sender === 'student' ? '#ffffff' : 'var(--text-main)',
                  border: msg.sender === 'ai' ? '1px solid var(--border-color)' : 'none',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line'
                }}
              >
                {msg.text}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-subtle)',
                  marginTop: '0.25rem',
                  padding: '0 0.5rem'
                }}
              >
                <span>{msg.timestamp}</span>
                {msg.sender === 'ai' && (
                  <span
                    className="badge"
                    style={{
                      fontSize: '0.65rem',
                      padding: '0.1rem 0.4rem',
                      backgroundColor: msg.source === 'gemini' ? 'var(--color-primary-light)' : 'var(--bg-subtle)',
                      color: msg.source === 'gemini' ? 'var(--color-primary)' : 'var(--text-muted)'
                    }}
                  >
                    {msg.source === 'gemini' ? '✨ Gemini AI' : '⚙️ Placement Engine'}
                  </span>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <span
                style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid var(--color-primary)',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.6s linear infinite'
                }}
              />
              Generating career advice...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          style={{
            padding: '1rem',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            gap: '0.75rem'
          }}
        >
          <input
            type="text"
            className="form-input"
            style={{ flex: 1 }}
            placeholder="Ask a question about placement preparation, resumes, coding, or interviews..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" variant="primary" disabled={isLoading || !inputMessage.trim()}>
            Send ↵
          </Button>
        </form>
      </div>
    </div>
  );
};
