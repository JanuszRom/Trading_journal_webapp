import React, { useState, useEffect } from 'react';
import { Container, Alert, Row, Col, Spinner, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import TradeForm from '../components/TradeForm';
import Screenshot from '../components/Screenshot';
import TradeService from '../services/api';

const EditTrade = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trade, setTrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshotUploading, setScreenshotUploading] = useState(false);

  // Fetch trade data
  useEffect(() => {
    const fetchTrade = async () => {
      try {
        setLoading(true);
        const data = await TradeService.getTrade(id);
        setTrade(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch trade details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrade();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await TradeService.updateTrade(id, values);
      navigate(`/trade/${id}`, { state: { success: 'Trade updated successfully!' } });
    } catch (err) {
      setError(err.message || 'Failed to update trade. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle screenshot deletion
  const handleDeleteScreenshot = async (screenshotId) => {
    if (window.confirm('Are you sure you want to remove this screenshot?')) {
      try {
        await TradeService.deleteScreenshot(screenshotId);
        setTrade(prev => ({
          ...prev,
          screenshots: prev.screenshots.filter(s => s.id !== screenshotId)
        }));
      } catch (err) {
        setError(err.message || 'Failed to delete screenshot.');
      }
    }
  };

  // Handle new screenshot upload
  const handleScreenshotUpload = async (file) => {
    try {
      setScreenshotUploading(true);
      const newScreenshot = await TradeService.uploadScreenshot(id, file);
      setTrade(prev => ({
        ...prev,
        screenshots: [...prev.screenshots, newScreenshot]
      }));
    } catch (err) {
      setError(err.message || 'Failed to upload screenshot.');
    } finally {
      setScreenshotUploading(false);
    }
  };

  // Handle trade deletion
  const handleDeleteTrade = async () => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      try {
        await TradeService.deleteTrade(id);
        navigate('/trades', { state: { success: 'Trade deleted successfully!' } });
      } catch (err) {
        setError(err.message || 'Failed to delete trade.');
      }
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!trade) {
    return (
      <Container>
        <Alert variant="danger">Trade not found</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Edit Trade</h2>
          {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
        </Col>
        <Col className="text-end">
          <Button
            variant="outline-danger"
            onClick={handleDeleteTrade}
            disabled={isSubmitting}
          >
            Delete Trade
          </Button>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <TradeForm
            initialValues={trade}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </Col>
        
        <Col lg={4}>
          <div className="sticky-top" style={{ top: '20px' }}>
            <h5>Screenshots</h5>
            <div className="mb-3">
              <input
                type="file"
                id="screenshot-upload"
                accept="image/*"
                onChange={(e) => handleScreenshotUpload(e.target.files[0])}
                disabled={screenshotUploading}
                style={{ display: 'none' }}
              />
              <label htmlFor="screenshot-upload" className="btn btn-primary w-100">
                {screenshotUploading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  'Upload Screenshot'
                )}
              </label>
            </div>
            
            <div className="d-flex flex-column gap-3">
              {trade.screenshots?.length > 0 ? (
                trade.screenshots.map(screenshot => (
                  <Screenshot
                    key={screenshot.id}
                    screenshot={screenshot}
                    onDelete={handleDeleteScreenshot}
                  />
                ))
              ) : (
                <Alert variant="info">No screenshots attached</Alert>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EditTrade;