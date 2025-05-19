import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaShoppingCart, FaCheck, FaPhoneAlt, FaPrint, FaEnvelope } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const OrderSuccess = () => {
  const { width, height } = useWindowSize();
  
  return (
    <>
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.1}
        initialVelocityY={-10}
        colors={['#4d79ff', '#00c9a7', '#ffc145']}
      />
      
      <Container className="py-5">
        <Card className="p-5 text-center border-0 shadow-sm">
          <Card.Body>
            <div className="success-checkmark-container mb-4">
              <div className="success-checkmark-circle rounded-circle bg-success d-flex align-items-center justify-content-center mx-auto" style={{ width: '120px', height: '120px' }}>
                <FaCheck size="3em" className="text-white" />
              </div>
            </div>
            
            <h1 className="mb-3 fw-bold text-success">Order Placed Successfully!</h1>
            
            <p className="mb-4 lead">
              Thank you for your order. We are processing it and will dispatch it soon.
            </p>
            
            <Row className="justify-content-center mb-5">
              <Col md={8} lg={6}>
                <Card className="bg-light border-0 p-3 mb-4">
                  <Card.Body>
                    <p className="mb-0">
                      <strong>Order Confirmation:</strong> We have sent an email with your order details.
                      Our team will prepare your package and notify you when it's dispatched.
                    </p>
                  </Card.Body>
                </Card>
                
                <div className="d-flex justify-content-center flex-wrap gap-3 mb-4">
                  <Button variant="outline-primary" className="d-flex align-items-center px-3">
                    <FaPrint className="me-2" /> Print Receipt
                  </Button>
                  <Button variant="outline-primary" className="d-flex align-items-center px-3">
                    <FaEnvelope className="me-2" /> Email Receipt
                  </Button>
                </div>
                
                <div className="text-muted mb-4">
                  <p>Need help with your order? Contact our customer support.</p>
                  <p className="d-flex align-items-center justify-content-center">
                    <FaPhoneAlt className="me-2 text-primary" /> (123) 456-7890
                  </p>
                </div>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-center flex-wrap gap-3">
              <Button 
                as={Link} 
                to="/orders" 
                variant="primary" 
                size="lg"
                className="d-flex align-items-center px-4 py-2"
              >
                <FaClipboardList className="me-2" /> View My Orders
              </Button>
              
              <Button 
                as={Link} 
                to="/medicines" 
                variant="outline-primary" 
                size="lg"
                className="d-flex align-items-center px-4 py-2"
              >
                <FaShoppingCart className="me-2" /> Continue Shopping
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default OrderSuccess;
