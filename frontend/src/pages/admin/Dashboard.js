import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaPills, FaUsers, FaShoppingCart, FaMoneyBillWave } from 'react-icons/fa';
import api from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';

// Admin dashboard flow:
// 1. Dashboard shows key metrics (users, orders, revenue)
// 2. MedicineManage provides CRUD operations for products
//    - "Featured" checkbox determines homepage display
//    - Categories are pre-populated with common medicine types
// 3. OrderManage allows status updates and order management
// 4. UserManage handles user account administration

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real application, you might have an endpoint for dashboard stats
        // For now, we'll simulate by fetching medicines and orders
        const [medicinesRes, ordersRes, usersRes] = await Promise.all([
          api.get('/medicines'),
          api.get('/orders'),
          api.get('/users')
        ]);
        
        const totalRevenue = ordersRes.data.reduce((total, order) => {
          if (order.status !== 'cancelled') {
            return total + Number(order.total_amount);
          }
          return total;
        }, 0);
        
        setStats({
          totalMedicines: medicinesRes.data.length,
          totalUsers: usersRes.data.length,
          totalOrders: ordersRes.data.length,
          totalRevenue
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="d-none d-md-block sidebar">
          <AdminSidebar active="dashboard" />
        </Col>
        
        <Col md={9} lg={10} className="ms-sm-auto px-md-4 py-4">
          <h1 className="page-heading">Admin Dashboard</h1>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Row>
              <Col md={6} xl={3} className="mb-4">
                <Card className="dashboard-card">
                  <div className="dashboard-icon">
                    <FaPills />
                  </div>
                  <div className="dashboard-number">{stats.totalMedicines}</div>
                  <div className="dashboard-label">Total Medicines</div>
                </Card>
              </Col>
              
              <Col md={6} xl={3} className="mb-4">
                <Card className="dashboard-card">
                  <div className="dashboard-icon">
                    <FaUsers />
                  </div>
                  <div className="dashboard-number">{stats.totalUsers}</div>
                  <div className="dashboard-label">Registered Users</div>
                </Card>
              </Col>
              
              <Col md={6} xl={3} className="mb-4">
                <Card className="dashboard-card">
                  <div className="dashboard-icon">
                    <FaShoppingCart />
                  </div>
                  <div className="dashboard-number">{stats.totalOrders}</div>
                  <div className="dashboard-label">Total Orders</div>
                </Card>
              </Col>
              
              <Col md={6} xl={3} className="mb-4">
                <Card className="dashboard-card">
                  <div className="dashboard-icon">
                    <FaMoneyBillWave />
                  </div>
                  <div className="dashboard-number">${stats.totalRevenue.toFixed(2)}</div>
                  <div className="dashboard-label">Total Revenue</div>
                </Card>
              </Col>
            </Row>
          )}
          
          <Row className="mt-4">
            <Col lg={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Recent Orders</h5>
                </Card.Header>
                <Card.Body>
                  <p className="text-center text-muted">
                    View all orders in the Orders section
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Low Stock Medicines</h5>
                </Card.Header>
                <Card.Body>
                  <p className="text-center text-muted">
                    View all medicines in the Medicines section
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
