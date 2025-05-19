import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <Container className="py-5 text-center">
      <h1 className="display-1">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="lead mb-5">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      <Button 
        as={Link} 
        to="/" 
        variant="primary" 
        size="lg"
        className="d-inline-flex align-items-center"
      >
        <FaArrowLeft className="me-2" /> Back to Home
      </Button>
    </Container>
  );
};

export default NotFound;
