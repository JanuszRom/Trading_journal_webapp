import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClipboardMonitor = ({ onTradeDetected }) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);

  const handlePaste = async (e) => {
    if (!isActive) return;
    
    console.log("Paste event detected");
    const clipboardText = e.clipboardData.getData('text');
    console.log("Clipboard text:", clipboardText);
    
    if (!clipboardText) {
      console.log("No clipboard text found");
      return;
    }
    
    try {
      console.log("Sending data to backend");
      const response = await axios.post('/api/parse-trade', { 
        clipboard_text: clipboardText 
      });
      
      console.log("Backend response:", response.data);
      
      if (response.data.trade) {
        console.log("Trade detected, updating form");
        onTradeDetected(response.data.trade);
      }
    } catch (error) {
      console.error('Error parsing trade data:', error);
      setError(`Error: ${error.response?.data?.error || error.message}`);
    }
  };
  
  useEffect(() => {
    // The dependency array is missing handlePaste which depends on isActive and onTradeDetected
    console.log("Setting up paste event listener, active:", isActive);
    document.addEventListener('paste', handlePaste);
    
    return () => {
      console.log("Removing paste event listener");
      document.removeEventListener('paste', handlePaste);
    };
  }, [isActive, onTradeDetected]); // Fix dependency array

  return (
    <div className="clipboard-monitor mb-3 p-3 border rounded">
      <button 
        onClick={() => setIsActive(!isActive)} 
        className={`btn ${isActive ? 'btn-success' : 'btn-primary'} mb-2`}
      >
        {isActive ? '✓ Clipboard Monitoring Active' : '▶ Start Clipboard Monitoring'}
      </button>
      
      {isActive && (
        <div className="instructions alert alert-info mt-2">
          Copy trade data from xStation5 and press Ctrl+V anywhere on this page
        </div>
      )}
      
      {error && (
        <div className="error-message alert alert-danger mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default ClipboardMonitor;