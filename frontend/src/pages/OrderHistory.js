import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaBan } from 'react-icons/fa';
import api from '../services/api';
import { STATUS_COLORS } from '../config/constants';

// Order management flow:
// 1. Users can view their order history
// 2. Orders display status with color-coded badges
// 3. Users can view order details or cancel pending orders
// 4. Admins can manage all orders through admin dashboard

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/user/orders');
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? This will permanently delete the order.')) {
      try {
        // Call delete endpoint instead of cancel
        await api.delete(`/user/orders/${orderId}`);
        
        // Remove the order from the state entirely
        setOrders(orders.filter(order => order.id !== orderId));
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

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container className="py-5">
        <Card className="p-5 text-center">
          <Card.Body>
            <h2>No Orders Found</h2>
            <p className="mb-4">You haven't placed any orders yet.</p>
            <Button as={Link} to="/medicines" variant="primary">
              Browse Medicines
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="page-heading">My Orders</h1>
      
      {orders.map(order => (
        <Card key={order.id} className="order-card mb-4">
          <Card.Header className="order-header">
            <Row className="align-items-center">
              <Col xs={12} md={3}>
                <p className="mb-0">
                  <strong>Order ID:</strong> #{order.id}
                </p>
              </Col>
              
              <Col xs={12} md={3}>
                <p className="mb-0">
                  <strong>Date:</strong>{' '}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </Col>
              
              <Col xs={12} md={3}>
                <p className="mb-0">
                  <strong>Total:</strong> ${Number(order.total_amount).toFixed(2)}
                </p>
              </Col>
              
              <Col xs={12} md={3}>
                <Badge 
                  bg={STATUS_COLORS[order.status]} 
                  className={`status-badge-${order.status}`}
                >
                  {order.status.toUpperCase()}
                </Badge>
              </Col>
            </Row>
          </Card.Header>
          
          <Card.Body>
            <Row>
              <Col md={8}>
                <h5 className="mb-3">Order Items</h5>
                {order.order_details?.map((detail, index) => (
                  <div key={index} className="d-flex mb-2 align-items-center">
                    <div className="me-auto">
                      <p className="mb-0 fw-medium">
                        {detail.medicine?.name} x {detail.quantity}
                      </p>
                      <small className="text-muted">
                        ${Number(detail.price).toFixed(2)} each
                      </small>
                    </div>
                    <div>
                      <span className="fw-bold">
                        ${Number(detail.subtotal).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </Col>
              
              <Col md={4}>
                <h5 className="mb-3">Shipping Info</h5>
                <p className="mb-1"><strong>Address:</strong> {order.shipping_address}</p>
                <p className="mb-1"><strong>Payment:</strong> {order.payment_method}</p>
                {order.notes && (
                  <p className="mb-0"><strong>Notes:</strong> {order.notes}</p>
                )}
              </Col>
            </Row>
          </Card.Body>
          
          <Card.Footer className="order-actions">
            <Button 
              as={Link} 
              to={`/orders/${order.id}`} 
              variant="outline-primary" 
              className="me-2"
            >
              <FaEye className="me-1" /> View Details
            </Button>
            
            {order.status === 'pending' && (
              <Button 
                variant="outline-danger" 
                onClick={() => cancelOrder(order.id)}
              >
                <FaBan className="me-1" /> Cancel Order
              </Button>
            )}
          </Card.Footer>
        </Card>
      ))}
    </Container>
  );
};

export default OrderHistory;
