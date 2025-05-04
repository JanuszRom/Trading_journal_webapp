import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

const TradeForm = ({ initialValues, onSubmit, isEditing }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);


  const validationSchema = Yup.object().shape({
    instrument: Yup.string().required('Instrument is required'),
    direction: Yup.string().required('Direction is required'),
    entry: Yup.number().required('Entry price is required'),
    exit: Yup.number().required('Exit price is required'),
    stop_loss: Yup.number().required('Stop loss is required'),
    take_profit: Yup.number().required('Take profit is required'),
    size: Yup.number().required('Position size is required'),
    risk: Yup.number().required('Risk is required'),
    reward: Yup.number().required('Reward is required'),
    profit_loss: Yup.number().required('P/L is required'),
    duration: Yup.string().required('Duration is required'),
    //strategy: Yup.string().required('Strategy is required'),
  });

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    
    // Create previews
    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    
    setPreviews([...previews, ...newPreviews]);
  };

  const removePreview = (index) => {
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index].url);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
    
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={(values) => {
        const formValues = { ...values, screenshots: selectedFiles };
        onSubmit(formValues);
      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Instrument</Form.Label>
                <Form.Control
                  type="text"
                  name="instrument"
                  value={values.instrument}
                  onChange={handleChange}
                  isInvalid={touched.instrument && !!errors.instrument}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.instrument}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Direction</Form.Label>
                <Form.Select
                  name="direction"
                  value={values.direction}
                  onChange={handleChange}
                  isInvalid={touched.direction && !!errors.direction}
                >
                  <option value="">Select Direction</option>
                  <option value="Long">Long</option>
                  <option value="Short">Short</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.direction}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Entry Price</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="entry"
                  value={values.entry}
                  onChange={handleChange}
                  isInvalid={touched.entry && !!errors.entry}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.entry}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Exit Price</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="exit"
                  value={values.exit}
                  onChange={handleChange}
                  isInvalid={touched.exit && !!errors.exit}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.exit}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Stop Loss</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="stop_loss"
                  value={values.stop_loss}
                  onChange={handleChange}
                  isInvalid={touched.stop_loss && !!errors.stop_loss}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.stop_loss}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Take Profit</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="take_profit"
                  value={values.take_profit}
                  onChange={handleChange}
                  isInvalid={touched.take_profit && !!errors.take_profit}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.take_profit}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Position Size</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="size"
                  value={values.size}
                  onChange={handleChange}
                  isInvalid={touched.size && !!errors.size}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.size}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Risk</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="risk"
                  value={values.risk}
                  onChange={handleChange}
                  isInvalid={touched.risk && !!errors.risk}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.risk}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Reward</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="reward"
                  value={values.reward}
                  onChange={handleChange}
                  isInvalid={touched.reward && !!errors.reward}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.reward}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>P/L</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="profit_loss"
                  value={values.profit_loss}
                  onChange={handleChange}
                  isInvalid={touched.profit_loss && !!errors.profit_loss}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.profit_loss}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Duration</Form.Label>
                <Form.Control
                  type="text"
                  name="duration"
                  value={values.duration}
                  onChange={handleChange}
                  isInvalid={touched.duration && !!errors.duration}
                  placeholder="e.g., 2h15m"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.duration}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>comments</Form.Label>
                <Form.Control
                  type="text"
                  name="comments"
                  value={values.comments}
                  onChange={handleChange}
                  isInvalid={touched.comments && !!errors.comments}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.comments}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row> 
          {/* /*  <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Strategy</Form.Label>
                <Form.Control
                  type="text"
                  name="strategy"
                  value={values.strategy}
                  onChange={handleChange}
                  isInvalid={touched.strategy && !!errors.strategy}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.strategy}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Setup</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="setup"
              value={values.setup}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mistakes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="mistakes"
              value={values.mistakes}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lessons</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="lessons"
              value={values.lessons}
              onChange={handleChange}
            />
          </Form.Group> */}

          <Form.Group className="mb-3">
            <Form.Label>Screenshots</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*"
            />
          </Form.Group>

          {previews.length > 0 && (
            <Row className="mb-4">
              {previews.map((preview, index) => (
                <Col key={index} md={3} className="mb-3">
                  <Card>
                    <Card.Img variant="top" src={preview.url} alt={`Preview ${index}`} />
                    <Card.Body className="p-2">
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => removePreview(index)}
                        className="w-100"
                      >
                        Remove
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <Button variant="primary" type="submit">
            {isEditing ? 'Update Trade' : 'Add Trade'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default TradeForm;