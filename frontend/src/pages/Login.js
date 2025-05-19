import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { login, loading, error, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path or default to home
  const from = location.state?.from?.pathname || '/';
  
  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  // Display backend errors
  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setFormError('An error occurred during login. Please try again.');
    }
  };
  
  return (
    <Container className="py-5">
      <div className="auth-form-container">
        <h2 className="auth-title">Login to Your Account</h2>
        
        {formError && <Alert variant="danger">{formError}</Alert>}
        {location.state?.registered && (
          <Alert variant="success">
            Registration successful! Please log in with your credentials.
          </Alert>
        )}
        
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide your password.
            </Form.Control.Feedback>
          </Form.Group>
          
          <Button
            variant="primary"
            type="submit"
            className="w-100 mb-3"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          
          <div className="text-center mt-3">
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Login;
