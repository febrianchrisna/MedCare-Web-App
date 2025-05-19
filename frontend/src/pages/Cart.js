import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../contexts/CartContext';
import { MEDICINE_DEFAULT_IMG } from '../config/constants';

const Cart = () => {
  const { 
    cartItems, 
    totalItems, 
    totalAmount, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <Card className="p-5 text-center">
          <Card.Body>
            <FaShoppingCart size="4em" className="text-muted mb-3" />
            <h2>Your cart is empty</h2>
            <p className="mb-4">Add some medicines to your cart to continue shopping.</p>
            <Button as={Link} to="/medicines" variant="primary" size="lg">
              Browse Medicines
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="page-heading">Your Cart</h1>
      
      <Row>
        <Col lg={8}>
          <Card className="cart-container mb-4">
            <Card.Body>
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <Row className="align-items-center">
                    <Col xs={3} sm={2}>
                      <img 
                        src={item.image || MEDICINE_DEFAULT_IMG} 
                        alt={item.name}
                        className="img-fluid"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = MEDICINE_DEFAULT_IMG;
                        }}
                      />
                    </Col>
                    
                    <Col xs={9} sm={4}>
                      <h5>{item.name}</h5>
                      <p className="text-primary mb-0">${Number(item.price).toFixed(2)}</p>
                    </Col>
                    
                    <Col xs={6} sm={3} className="mt-3 mt-sm-0">
                      <Form.Group>
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col xs={6} sm={3} className="text-end mt-3 mt-sm-0">
                      <h5>${(item.price * item.quantity).toFixed(2)}</h5>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <FaTrash /> Remove
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
              
              <div className="d-flex justify-content-between mt-4">
                <Button 
                  as={Link} 
                  to="/medicines" 
                  variant="outline-primary"
                  className="d-flex align-items-center"
                >
                  <FaArrowLeft className="me-2" /> Continue Shopping
                </Button>
                
                <Button 
                  variant="outline-danger" 
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="cart-summary">
            <Card.Body>
              <h4 className="mb-4">Order Summary</h4>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Items ({totalItems}):</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>$0.00</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-4">
                <h5>Total:</h5>
                <h5>${totalAmount.toFixed(2)}</h5>
              </div>
              
              <Button 
                as={Link} 
                to="/checkout" 
                variant="primary" 
                size="lg" 
                className="w-100"
              >
                Proceed to Checkout
              </Button>
              
              <Alert variant="info" className="mt-3 mb-0 small">
                <strong>Note:</strong> Prices shown are estimates and may vary.
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
