import React from 'react';
import { Card, Button } from 'react-bootstrap';

const Screenshot = ({ screenshot, onDelete, displayOnly }) => {
  return (
    <Card className="mb-3">
      <Card.Img 
        variant="top" 
        src={`http://localhost:5000/api/screenshots/${screenshot.filename}`} 
        alt="Trade Screenshot" 
      />
      {!displayOnly && (
        <Card.Body className="p-2">
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => onDelete(screenshot.id)}
            className="w-100"
          >
            Remove
          </Button>
        </Card.Body>
      )}
    </Card>
  );
};

export default Screenshot;