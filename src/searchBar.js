import React, { useState, useRef, useEffect } from 'react';
import './searchBar.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faLink,
  faTimes,
  faPaperPlane,
  faThumbsDown,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';

import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import logoImage from './logo.png';

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import ReactMarkdown from 'react-markdown';




SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('go', go);



const SearchBar = () => {
  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  // References
  const abortControllerRef = useRef(null);

  // Handle feedback submission
  const handleSubmit = async () => {
    const responseObj = messages[currentMessageIndex];
    const { conversation_id, session_id } = responseObj.metadata;
    const responseMessage = responseObj.content;

    const feedbackData = {
      session_id,
      conversation_id,
      message: responseMessage,
      comment: feedbackText,
      like: feedbackType,
    };

    try {
      const response = await fetch('http://0.0.0.0:8080/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }

    setFeedbackText('');
    setIsFeedbackModalOpen(false);
  };

  const openFeedbackModal = (type, index) => {
    setFeedbackType(type);
    setCurrentMessageIndex(index);
    setIsFeedbackModalOpen(true);
  };

  const cancelFeedbackModal = () => {
    setFeedbackText('');
    setCurrentMessageIndex(messages.length - 1);
    setIsFeedbackModalOpen(false);
  };

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return;

    const newUserMessage = { type: 'user', content: searchTerm };
    let newAssistantMessage = {
      type: 'assistant',
      content: '',
      metadata: null,
      isComplete: false,
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage, newAssistantMessage]);
    setSearchTerm('');
    setIsStreaming(true);

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('https://apai-app-534221778462.us-east1.run.app/process_query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchTerm, session_id: sessionId }),
        signal: abortControllerRef.current.signal,
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'content') {
              newAssistantMessage.content += data.text;
            } else if (data.type === 'metadata') {
              newAssistantMessage.metadata = data;
              if (!sessionId) {
                setSessionId(data.session_id);
              }
            }

            setMessages((prevMessages) =>
              prevMessages.map((msg, idx) =>
                idx === prevMessages.length - 1 ? { ...newAssistantMessage } : msg
              )
            );
          }
        }
      }
      newAssistantMessage.isComplete = true;
      setMessages((prevMessages) =>
        prevMessages.map((msg, idx) =>
          idx === prevMessages.length - 1 ? { ...newAssistantMessage } : msg
        )
      );
    } catch (error) {
      if (error.name === 'AbortError') {
        newAssistantMessage.isComplete = true;
        setMessages((prevMessages) =>
          prevMessages.map((msg, idx) =>
            idx === prevMessages.length - 1 ? { ...newAssistantMessage } : msg
          )
        );
      } else {
        console.error('Error fetching data:', error);
        const errorMessage = {
          type: 'assistant',
          content: 'Sorry, there was an error processing your request.',
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const formatMessage = (content) => {
    return (
      <ReactMarkdown
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  // Handle session cleanup on unload
  useEffect(() => {
    const handleUnload = () => {
      if (sessionId) {
        const data = JSON.stringify({ session_id: sessionId });
        const blob = new Blob([data], { type: 'application/json' });
        navigator.sendBeacon('http://0.0.0.0:8080/end_session', blob);
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [sessionId]);

  const renderMessageContent = (message, index) => {
    if (message.type === 'assistant' && message.content === '' && isStreaming) {
      return (
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      );
    }

    return (
      <>
        {formatMessage(message.content)}
        {message.type === 'assistant' && message.isComplete && (
          <div className="feedback-buttons">
            <button
              className="feedback-button positive"
              onClick={() => openFeedbackModal('positive', index)}
            >
              <FontAwesomeIcon icon={faThumbsUp} /> Helpful
            </button>
            <button
              className="feedback-button negative"
              onClick={() => openFeedbackModal('negative', index)}
            >
              <FontAwesomeIcon icon={faThumbsDown} /> Not Helpful
            </button>
          </div>
        )}
        {message.metadata && message.metadata.url && (
          <div className="metadata-links">
            <h4>Related Links</h4>
            <div className="link-list">
              {message.metadata.url.slice(0, 3).map((link, i) => (
                <a
                  key={i}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-item"
                >
                  <FontAwesomeIcon icon={faLink} className="link-icon" />
                  <span className="link-text">{link.topicName}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="AI-powered Metronome search . . ."
            className="search-input"
            onClick={() => setIsModalOpen(true)}
          />
          <button
            type="submit"
            className="search-button"
            onClick={() => setIsModalOpen(true)}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </form>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Ask Me Anything</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="close-button"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-content">
              <div className="chat-area">
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.type}`}>
                    <div className="message-avatar">
                      {message.type === 'assistant' ? (
                        <img
                          src={logoImage}
                          alt="Assistant"
                          className="avatar-image"
                        />
                      ) : (
                        <span className="user-avatar">U</span>
                      )}
                    </div>
                    <div className="message-content">
                      {renderMessageContent(message, index)}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSearch} className="modal-form">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Ask me anything about Metronome . . ."
                  className="modal-input"
                />
                <button
                  type="submit"
                  className="send-button"
                  disabled={searchTerm.trim() === ''}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </form>
            </div>
          </div>
          {isFeedbackModalOpen && (
            <div className="popup-overlay">
              <div className="popup feedback-popup">
                <div className="popup-header">
                  <h2>Feedback</h2>
                  <button
                    onClick={cancelFeedbackModal}
                    className="close-button"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <div className="popup-content">
                  <p className="feedback-prompt">
                    Please provide details: (optional)
                  </p>
                  <textarea
                    className="feedback-textarea"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder={
                      feedbackType === 'positive'
                        ? 'What was satisfying about this response?'
                        : 'What was unsatisfying about this response?'
                    }
                  />
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="submit-button"
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SearchBar;
