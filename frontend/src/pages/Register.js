import React, { useState, useContext } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validated, setValidated] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  
  const { register, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Check password match when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') {
        setPasswordMatch(value === formData.confirmPassword);
      } else {
        setPasswordMatch(value === formData.password);
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    
    // Check password match before form validation
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Remove confirmPassword from data sent to API
    const { confirmPassword, ...userData } = formData;
    
    const success = await register(userData);
    if (success) {
      navigate('/login', { state: { registered: true } });
    }
  };
  
  return (
    <Container className="py-5">
      <div className="auth-form-container">
        <h2 className="auth-title">Create an Account</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength="3"
            />
            <Form.Control.Feedback type="invalid">
              Username must be at least 3 characters.
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              isInvalid={validated && !passwordMatch}
            />
            <Form.Control.Feedback type="invalid">
              Password must be at least 6 characters.
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              isInvalid={!passwordMatch}
            />
            <Form.Control.Feedback type="invalid">
              Passwords do not match.
            </Form.Control.Feedback>
          </Form.Group>
          
          <Button
            variant="primary"
            type="submit"
            className="w-100 mb-3"
            disabled={loading || !passwordMatch}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
          
          <div className="text-center mt-3">
            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Register;
