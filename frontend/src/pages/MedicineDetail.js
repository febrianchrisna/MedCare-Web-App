import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import api from '../services/api';
import { CartContext } from '../contexts/CartContext';
import { MEDICINE_DEFAULT_IMG } from '../config/constants';

const MedicineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/medicines/${id}`);
        setMedicine(response.data);
      } catch (error) {
        console.error('Error fetching medicine details:', error);
        setError('Failed to load medicine details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (medicine?.stock || 0)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (medicine && quantity > 0) {
      addToCart(medicine, quantity);
      navigate('/cart');
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

  if (error || !medicine) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-danger">
          {error || 'Medicine not found'}
        </div>
        <Button variant="primary" onClick={() => navigate('/medicines')}>
          Back to Medicines
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button 
        variant="outline-primary" 
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" /> Back
      </Button>
      
      <Card className="medicine-detail-card">
        <Row>
          <Col md={4}>
            <div className="medicine-img-container mb-3 mb-md-0">
              <img 
                src={medicine.image || MEDICINE_DEFAULT_IMG} 
                alt={medicine.name}
                className="img-fluid"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = MEDICINE_DEFAULT_IMG;
                }}
              />
            </div>
          </Col>
          
          <Col md={8}>
            <h2 className="mb-3">{medicine.name}</h2>
            
            <Badge bg="info" className="badge-category mb-3">
              {medicine.category}
            </Badge>
            
            <p className="medicine-price mb-3">
              ${Number(medicine.price).toFixed(2)}
            </p>
            
            <p className="medicine-stock mb-4">
              {medicine.stock > 0 
                ? <span className="text-success">In Stock: {medicine.stock}</span> 
                : <span className="text-danger">Out of Stock</span>}
            </p>
            
            <p className="mb-4">{medicine.description}</p>
            
            <dl className="row medicine-info">
              <dt className="col-sm-3">Manufacturer</dt>
              <dd className="col-sm-9">{medicine.manufacturer || 'N/A'}</dd>
              
              <dt className="col-sm-3">Dosage</dt>
              <dd className="col-sm-9">{medicine.dosage || 'N/A'}</dd>
              
              <dt className="col-sm-3">Expiry Date</dt>
              <dd className="col-sm-9">
                {medicine.expiry_date 
                  ? new Date(medicine.expiry_date).toLocaleDateString() 
                  : 'N/A'}
              </dd>
            </dl>
            
            {medicine.stock > 0 && (
              <div className="d-flex align-items-center mt-4">
                <Form.Group className="me-3" style={{ width: '100px' }}>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max={medicine.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleAddToCart}
                  disabled={medicine.stock <= 0}
                  className="d-flex align-items-center"
                >
                  <FaShoppingCart className="me-2" /> Add to Cart
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default MedicineDetail;
