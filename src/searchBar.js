import React, { useState, useRef } from 'react';
import './searchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLink, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import logoImage from "./logo.png";
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import ReactMarkdown from 'react-markdown';

SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('javascript', javascript);

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return;

    // If we're already streaming, stop the current stream
    if (isStreaming) {
      abortControllerRef.current.abort();
    }

    const newUserMessage = { type: 'user', content: searchTerm };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    let assistantMessage = { type: 'assistant', content: '', metadata: null };
    setMessages(prevMessages => [...prevMessages, assistantMessage]);

    setSearchTerm(''); // Clear the search term
    setIsStreaming(true);

    try {
      abortControllerRef.current = new AbortController();
      const response = await fetch('https://backend-534221778462.us-central1.run.app/process_query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchTerm }),
        signal: abortControllerRef.current.signal,
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        
        // Parse the chunk and update the assistant's message
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'content') {
              assistantMessage.content += data.text;
            } else if (data.type === 'metadata') {
              assistantMessage.metadata = data;
            }
            setMessages(prevMessages => 
              prevMessages.map((msg, index) => 
                index === prevMessages.length - 1 ? {...assistantMessage} : msg
              )
            );
          }
        }
      }

      console.log('Stream complete');
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Stream aborted');
      } else {
        console.error('Error fetching data:', error);
        const errorMessage = { type: 'assistant', content: 'Sorry, there was an error processing your request.' };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const formatMessage = (content) => {
    return (
      <ReactMarkdown>
        {content}
      </ReactMarkdown>
    );
  };

  const extractLinkName = (url) => {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const renderMessageContent = (message) => {
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
        {message.metadata && message.metadata.url && (
          <div className="metadata-links">
            <h4>Related Links</h4>
            <div className="link-list">
              {message.metadata.url.slice(0, 3).map((link, i) => (
                <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="link-item">
                  <FontAwesomeIcon icon={faLink} className="link-icon" />
                  <span className="link-text">{extractLinkName(link)}</span>
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
          <button type="submit" className="search-button" disabled={searchTerm.trim() === ''}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </form>
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Ask Me Anything</h2>
              <button onClick={() => setIsModalOpen(false)} className="close-button">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-content">
              <div className="chat-area">
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.type}`}>
                    <div className="message-avatar">
                      {message.type === 'assistant' ? (
                        <img src={logoImage} alt="Assistant" className="avatar-image" />
                      ) : (
                        <span className="user-avatar">U</span>
                      )}
                    </div>
                    <div className="message-content">
                    {renderMessageContent(message)}
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
                <button type="submit" className="send-button" disabled={searchTerm.trim() === ''}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;