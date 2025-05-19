import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Badge, Row, Col, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaBan } from 'react-icons/fa';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { STATUS_COLORS, MEDICINE_DEFAULT_IMG } from '../config/constants';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const cancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order? This will permanently delete the order.')) {
      try {
        await api.delete(`/user/orders/${id}`);
        alert('Order deleted successfully');
        navigate('/orders');
      } catch (err) {
        console.error('Error deleting order:', err);
        alert(err.response?.data?.message || 'Failed to delete order. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Order not found'}</Alert>
        <Button as={Link} to="/orders" variant="primary">
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button 
          variant="outline-primary" 
          onClick={() => navigate('/orders')}
          className="d-flex align-items-center"
        >
          <FaArrowLeft className="me-2" /> Back to Orders
        </Button>
        
        <h1 className="page-heading mb-0">Order #{order.id}</h1>
      </div>
      
      <Card className="mb-4">
        <Card.Header className="bg-light">
          <Row className="align-items-center">
            <Col xs={12} md={4}>
              <p className="mb-0">
                <strong>Date:</strong>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </Col>
            
            <Col xs={12} md={4} className="text-md-center">
              <Badge 
                bg={STATUS_COLORS[order.status]} 
                className={`status-badge-${order.status}`}
              >
                {order.status.toUpperCase()}
              </Badge>
            </Col>
            
            <Col xs={12} md={4} className="text-md-end">
              <p className="mb-0">
                <strong>Total:</strong> ${Number(order.total_amount).toFixed(2)}
              </p>
            </Col>
          </Row>
        </Card.Header>
        
        <Card.Body>
          <Row>
            <Col lg={8}>
              <h4 className="mb-3">Order Items</h4>
              
              {order.order_details?.map((detail, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col xs={3} sm={2}>
                        <img 
                          src={detail.medicine?.image || MEDICINE_DEFAULT_IMG} 
                          alt={detail.medicine?.name}
                          className="img-fluid"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = MEDICINE_DEFAULT_IMG;
                          }}
                        />
                      </Col>
                      
                      <Col xs={9} sm={6}>
                        <h5>{detail.medicine?.name}</h5>
                        <p className="mb-0 text-muted">
                          {detail.medicine?.dosage && `${detail.medicine.dosage} • `}
                          {detail.medicine?.manufacturer || 'Generic'}
                        </p>
                      </Col>
                      
                      <Col sm={2} className="text-center mt-2 mt-sm-0">
                        <p className="mb-0">Qty: {detail.quantity}</p>
                      </Col>
                      
                      <Col sm={2} className="text-end mt-2 mt-sm-0">
                        <p className="mb-0 fw-bold">${Number(detail.subtotal).toFixed(2)}</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
              
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>${Number(order.total_amount).toFixed(2)}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>$0.00</span>
                  </div>
                  
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>${Number(order.total_amount).toFixed(2)}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4} className="mt-4 mt-lg-0">
              <Card>
                <Card.Body>
                  <h4 className="mb-3">Order Information</h4>
                  
                  <h6>Shipping Address</h6>
                  <p>{order.shipping_address}</p>
                  
                  <h6>Payment Method</h6>
                  <p>{order.payment_method}</p>
                  
                  {order.notes && (
                    <>
                      <h6>Notes</h6>
                      <p>{order.notes}</p>
                    </>
                  )}
                  
                  {order.status === 'pending' && (
                    <div className="d-grid gap-2 mt-4">
                      <Button 
                        variant="danger" 
                        onClick={cancelOrder}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <FaBan className="me-2" /> Cancel Order
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderDetail;
