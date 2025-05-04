import React, { useState } from 'react';
import axios from 'axios';

const ClipboardImporter = ({ onTradeDetected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleImportClick = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the Clipboard API (modern browsers only)
      const clipboardText = await navigator.clipboard.readText();
      
      const response = await axios.post('/api/parse-trade', { clipboard_text: clipboardText });
      if (response.data.trade) {
        onTradeDetected(response.data.trade);
      }
    } catch (error) {
      setError('Failed to read clipboard or parse trade data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="clipboard-importer">
      <button 
        onClick={handleImportClick} 
        disabled={isLoading}
      >
        {isLoading ? 'Importing...' : 'Import from Clipboard'}
      </button>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};