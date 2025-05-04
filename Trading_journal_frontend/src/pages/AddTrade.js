import React, { useState } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TradeForm from '../components/TradeForm';
import TradeService from '../services/api';
import ClipboardMonitor from '../components/ClipboardMonitor';



const AddTrade = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({
    instrument: 'NQ',
    direction: 'Long',
    entry: 0,
    exit: 0,
    stop_loss: 0,
    take_profit: 0,
    size: 1,
    risk: 0,
    reward: 0,
    profit_loss: 0,
    duration: '',
    //strategy: '',
    //setup: '',
    //mistakes: '',
    //lessons: ''
    comments: '',
  });

  const handleTradeDetected = (trade) => {
    // Map the parsed trade data to your form fields
    const mappedData = {
      instrument: trade.instrument || formValues.instrument || '',
      direction: trade.direction === 'short' ? 'Short' : 'Long',
    entry: trade.entry !== undefined ? Number(trade.entry) : formValues.entry || 0,
    exit: trade.exit !== undefined ? Number(trade.exit) : formValues.exit || 0,
    stop_loss: trade.stop_loss !== undefined ? Number(trade.stop_loss) : formValues.stop_loss || 0,
    take_profit: trade.take_profit !== undefined ? Number(trade.take_profit) : formValues.take_profit || 0,
    size: trade.size !== undefined ? Number(trade.size) : formValues.size || 0,
    profit_loss: trade.profit_loss !== undefined ? Number(trade.profit_loss) : formValues.profit_loss || 0,
    duration: trade.duration || formValues.duration || '',
    risk: trade.risk !== undefined ? Number(trade.risk) : formValues.risk || 0,
    reward: trade.reward !== undefined ? Number(trade.reward) : formValues.reward || 0,
      // Keep other fields unchanged
      //strategy: formValues.strategy,
      //setup: formValues.setup,
      //mistakes: formValues.mistakes,
      //lessons: formValues.lessons
    comments: formValues.comments || ''
    };
    
    // Calculate risk and reward if possible
  //   if (trade.entry && trade.stop_loss) {
  //     const riskPerUnit = Math.abs(trade.entry - trade.stop_loss);
  //     mappedData.risk = (riskPerUnit * trade.size).toFixed(2);
  //   }
    
  //   if (trade.entry && trade.take_profit) {
  //     const rewardPerUnit = Math.abs(trade.entry - trade.take_profit);
  //     mappedData.reward = (rewardPerUnit * trade.size).toFixed(2);
  //   }
    
    setFormValues(mappedData);
  };

  const handleSubmit = async () => {
    try {
      await TradeService.createTrade(formValues);
      navigate('/');
    } catch (err) {
      setError('Failed to add trade. Please try again.');
    }
  };
  
  return (
    <Container className="py-4">
      <h1 className="mb-4">Add New Trade</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <ClipboardMonitor onTradeDetected={handleTradeDetected} />
      
      <TradeForm 
        initialValues={formValues} 
        onSubmit={handleSubmit} 
        isEditing={false}
      />
    </Container>
  );

  
};

export default AddTrade;