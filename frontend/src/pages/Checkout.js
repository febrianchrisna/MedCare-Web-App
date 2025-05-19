import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { MEDICINE_DEFAULT_IMG } from '../config/constants';

const Checkout = () => {
  const { cartItems, totalAmount, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    shipping_address: '',
    payment_method: 'Cash on Delivery',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  
  // Redirect to cart if cart is empty
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Prepare order data
      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          medicineId: item.id,
          quantity: item.quantity
        }))
      };
      
      // Send order request
      await api.post('/orders', orderData);
      
      // Clear cart and redirect to success page
      clearCart();
      navigate('/order-success');
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="py-4">
      <h1 className="page-heading">Checkout</h1>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Row>
        <Col lg={8}>
          <Card className="checkout-container mb-4">
            <Card.Body>
              <h4 className="mb-4">Shipping & Payment Information</h4>
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={user?.username || ''}
                    disabled
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="shipping_address">
                  <Form.Label>Shipping Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleChange}
                    placeholder="Enter your complete shipping address"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide your shipping address.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="payment_method">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    required
                  >
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Digital Wallet">Digital Wallet</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-4" controlId="notes">
                  <Form.Label>Additional Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special instructions for delivery or order"
                  />
                </Form.Group>
                
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="order-summary">
            <Card.Body>
              <h4 className="mb-4">Order Summary</h4>
              
              {cartItems.map(item => (
                <div key={item.id} className="checkout-item">
                  <div className="d-flex">
                    <div className="me-3" style={{ width: '60px' }}>
                      <img 
                        src={item.image || MEDICINE_DEFAULT_IMG} 
                        alt={item.name}
                        className="img-fluid"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = MEDICINE_DEFAULT_IMG;
                        }}
                      />
                    </div>
                    
                    <div className="flex-grow-1">
                      <h6 className="mb-0">{item.name}</h6>
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">Qty: {item.quantity}</small>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <hr />
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>$0.00</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-0">
                <h5>Total:</h5>
                <h5>${totalAmount.toFixed(2)}</h5>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;

// Checkout flow:
// 1. Only authenticated users can access checkout
// 2. User inputs shipping address and payment details
// 3. On submit, component:
//    - Validates form data
//    - Creates order via API call with cart items and shipping info
//    - If successful, clears cart and redirects to success page
//    - If failed, displays error message
