import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Badge, Modal } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { STATUS_COLORS } from '../../config/constants';

const OrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [statusValue, setStatusValue] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filter orders client-side (in a real app, you might want to do this server-side)
    if (!searchTerm.trim()) {
      fetchOrders();
    } else {
      const filteredOrders = orders.filter(order => 
        order.id.toString().includes(searchTerm.trim()) ||
        order.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setOrders(filteredOrders);
    }
  };

  const handleShowModal = (order) => {
    setCurrentOrder(order);
    setStatusValue(order.status);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentOrder(null);
    setStatusValue('');
  };

  const handleStatusChange = (e) => {
    setStatusValue(e.target.value);
  };

  const handleUpdateStatus = async () => {
    if (!currentOrder || !statusValue) return;
    
    try {
      await api.put(`/orders/${currentOrder.id}/status`, { status: statusValue });
      
      // Update order status in the state
      setOrders(orders.map(order => 
        order.id === currentOrder.id ? { ...order, status: statusValue } : order
      ));
      
      handleCloseModal();
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.response?.data?.message || 'Failed to update order status. Please try again.');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await api.delete(`/orders/${orderId}`);
        
        // Remove order from state
        setOrders(orders.filter(order => order.id !== orderId));
      } catch (err) {
        console.error('Error deleting order:', err);
        setError(err.response?.data?.message || 'Failed to delete order. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="d-none d-md-block sidebar">
          <AdminSidebar active="orders" />
        </Col>
        
        <Col md={9} lg={10} className="ms-sm-auto px-md-4 py-4">
          <h1 className="page-heading">Manage Orders</h1>
          
          <Card className="mb-4">
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Search by order ID or customer name/email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="me-2"
                  />
                  <Button type="submit" variant="primary">
                    <FaSearch />
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          
          <Card className="admin-table">
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : orders.length > 0 ? (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>
                            {order.user?.username}<br />
                            <small className="text-muted">{order.user?.email}</small>
                          </td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>Rp {Number(order.total_amount).toLocaleString()}</td>
                          <td>
                            <Badge bg={STATUS_COLORS[order.status]} className={`status-badge-${order.status}`}>
                              {order.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="admin-actions">
                            <Button 
                              as={Link}
                              to={`/orders/${order.id}`}
                              variant="outline-primary" 
                              size="sm"
                              className="me-1"
                            >
                              <FaEye /> View
                            </Button>
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              className="me-1"
                              onClick={() => handleShowModal(order)}
                            >
                              <FaEdit /> Status
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              <FaTrash /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <p>No orders found.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Update Status Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentOrder && (
            <>
              <p>
                <strong>Order ID:</strong> #{currentOrder.id}<br />
                <strong>Customer:</strong> {currentOrder.user?.username}<br />
                <strong>Total Amount:</strong> Rp {Number(currentOrder.total_amount).toLocaleString()}
              </p>
              
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={statusValue}
                  onChange={handleStatusChange}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateStatus}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderManage;
