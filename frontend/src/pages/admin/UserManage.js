import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Badge, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaKey } from 'react-icons/fa';
import api from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'customer',
    password: '',
    confirmPassword: ''
  });
  const [validated, setValidated] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filter users client-side (in a real app, might want to do this server-side)
    if (!searchTerm.trim()) {
      fetchUsers();
    } else {
      const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsers(filteredUsers);
    }
  };

  const handleShowModal = (user = null, resetPassword = false) => {
    setCurrentUser(user);
    setIsResetPassword(resetPassword);
    
    if (user && !resetPassword) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        role: user.role || 'customer',
        password: '',
        confirmPassword: ''
      });
    } else if (user && resetPassword) {
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });
    } else {
      // New user
      setFormData({
        username: '',
        email: '',
        role: 'customer',
        password: '',
        confirmPassword: ''
      });
    }
    
    setValidated(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser(null);
    setIsResetPassword(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Check if passwords match for new users or when resetting password
    if ((isResetPassword || !currentUser) && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setError(null);
      
      if (isResetPassword) {
        // Reset password
        await api.put(`/users/${currentUser.id}/reset-password`, { 
          password: formData.password 
        });
        setSuccessMessage('Password reset successfully');
      } else if (currentUser) {
        // Update user
        const userData = {
          username: formData.username,
          email: formData.email,
          role: formData.role
        };
        
        await api.put(`/users/${currentUser.id}`, userData);
        
        // Update user in state
        setUsers(users.map(user => 
          user.id === currentUser.id ? { ...user, ...userData } : user
        ));
        
        setSuccessMessage('User updated successfully');
      } else {
        // Create new user
        const userData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        };
        
        const response = await api.post('/register', userData);
        
        // Add new user to state
        setUsers([...users, response.data.user]);
        
        setSuccessMessage('User created successfully');
      }
      
      handleCloseModal();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err.response?.data?.message || 'Failed to save user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/users/${userId}`);
        
        // Remove user from state
        setUsers(users.filter(user => user.id !== userId));
        
        setSuccessMessage('User deleted successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } catch (err) {
        console.error('Error deleting user:', err);
        setError(err.response?.data?.message || 'Failed to delete user. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="d-none d-md-block sidebar">
          <AdminSidebar active="users" />
        </Col>
        
        <Col md={9} lg={10} className="ms-sm-auto px-md-4 py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="page-heading">Manage Users</h1>
            
            <Button 
              variant="primary" 
              onClick={() => handleShowModal()}
            >
              Add New User
            </Button>
          </div>
          
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
          
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}
          
          <Card className="mb-4">
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Search by username or email..."
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
              ) : users.length > 0 ? (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>
                            <Badge bg={user.role === 'admin' ? 'primary' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="admin-actions">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              className="me-1"
                              onClick={() => handleShowModal(user)}
                            >
                              <FaEdit /> Edit
                            </Button>
                            <Button 
                              variant="outline-warning" 
                              size="sm"
                              className="me-1"
                              onClick={() => handleShowModal(user, true)}
                            >
                              <FaKey /> Reset Password
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
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
                  <p>No users found.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* User Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isResetPassword ? 'Reset Password' : (currentUser ? 'Edit User' : 'Add New User')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {!isResetPassword && (
              <>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="username" 
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Username is required
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Valid email is required
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="role">
                  <Form.Label>Role</Form.Label>
                  <Form.Select 
                    name="role" 
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>
              </>
            )}
            
            {/* Password fields for new user or reset password */}
            {(isResetPassword || !currentUser) && (
              <>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="password" 
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                  <Form.Control.Feedback type="invalid">
                    Password must be at least 6 characters
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="confirmPassword" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please confirm your password
                  </Form.Control.Feedback>
                </Form.Group>
              </>
            )}
            
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isResetPassword ? 'Reset Password' : (currentUser ? 'Update User' : 'Add User')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserManage;
