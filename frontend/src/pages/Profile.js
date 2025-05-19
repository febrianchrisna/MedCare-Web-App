import React, { useContext, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUser, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
    
    // Check if passwords match
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    
    // In a real application, you would update the user profile
    // For this demo, we'll just show a success message
    setSuccess('Profile updated successfully.');
    setShowUpdateForm(false);
  };

  return (
    <Container className="py-5">
      <h1 className="page-heading">My Profile</h1>
      
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <div className="mb-3">
                <div style={{ width: '120px', height: '120px' }} className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto">
                  <FaUser size="4em" />
                </div>
              </div>
              
              <h4>{user?.username}</h4>
              <p className="text-muted">{user?.email}</p>
              <p>
                <span className="badge bg-info text-white">{user?.role === 'admin' ? 'Administrator' : 'Customer'}</span>
              </p>
              
              <div className="d-grid gap-2 mt-4">
                <Button
                  variant="outline-primary"
                  onClick={() => setShowUpdateForm(!showUpdateForm)}
                >
                  {showUpdateForm ? 'Cancel' : 'Edit Profile'}
                </Button>
                
                <Button
                  as={Link}
                  to="/orders"
                  variant="outline-secondary"
                  className="d-flex align-items-center justify-content-center"
                >
                  <FaClipboardList className="me-2" /> My Orders
                </Button>
                
                <Button
                  variant="outline-danger"
                  onClick={logout}
                  className="d-flex align-items-center justify-content-center"
                >
                  <FaSignOutAlt className="me-2" /> Logout
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              {showUpdateForm ? (
                <>
                  <h4 className="mb-4">Update Profile</h4>
                  
                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
                        Username is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Valid email is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <hr className="my-4" />
                    
                    <h5>Change Password</h5>
                    <p className="text-muted small mb-3">Leave blank if you don't want to change your password</p>
                    
                    <Form.Group className="mb-3" controlId="currentPassword">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="newPassword">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        minLength="6"
                      />
                      <Form.Control.Feedback type="invalid">
                        Password must be at least 6 characters.
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group className="mb-4" controlId="confirmPassword">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    
                    <div className="d-grid">
                      <Button type="submit" variant="primary">
                        Save Changes
                      </Button>
                    </div>
                  </Form>
                </>
              ) : (
                <>
                  <h4 className="mb-4">Account Information</h4>
                  
                  <dl className="row mb-0">
                    <dt className="col-sm-4">Username:</dt>
                    <dd className="col-sm-8">{user?.username}</dd>
                    
                    <dt className="col-sm-4">Email:</dt>
                    <dd className="col-sm-8">{user?.email}</dd>
                    
                    <dt className="col-sm-4">Role:</dt>
                    <dd className="col-sm-8">{user?.role === 'admin' ? 'Administrator' : 'Customer'}</dd>
                    
                    <dt className="col-sm-4">Member Since:</dt>
                    <dd className="col-sm-8">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </dd>
                  </dl>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
