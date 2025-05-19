import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import api from '../services/api';
import { CartContext } from '../contexts/CartContext';
import { MEDICINE_DEFAULT_IMG } from '../config/constants';

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/medicines/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        let url = '/medicines';
        const params = new URLSearchParams();
        
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        if (selectedCategory) {
          params.append('category', selectedCategory);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await api.get(url);
        setMedicines(response.data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [searchTerm, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  return (
    <Container className="py-4">
      <h1 className="page-heading">Browse Medicines</h1>
      
      <Row className="mb-4">
        <Col md={4} lg={3}>
          <div className="filter-sidebar">
            <h5 className="mb-3">Categories</h5>
            <Form.Group className="mb-4">
              <Form.Check
                type="radio"
                id="all-categories"
                label="All Categories"
                name="category"
                checked={selectedCategory === ''}
                onChange={() => setSelectedCategory('')}
                className="mb-2"
              />
              {categories.map((category, index) => (
                <Form.Check
                  key={index}
                  type="radio"
                  id={`category-${index}`}
                  label={category}
                  name="category"
                  checked={selectedCategory === category}
                  onChange={() => setSelectedCategory(category)}
                  className="mb-2"
                />
              ))}
            </Form.Group>
            
            <h5 className="mb-3">Search</h5>
            <Form onSubmit={handleSearch}>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="primary" type="submit">
                  <FaSearch />
                </Button>
              </InputGroup>
            </Form>
          </div>
        </Col>
        
        <Col md={8} lg={9}>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : medicines.length > 0 ? (
            <Row>
              {medicines.map(medicine => (
                <Col key={medicine.id} md={6} lg={4} className="mb-4">
                  <Card className="medicine-card h-100">
                    <div className="medicine-img-container">
                      <Card.Img 
                        variant="top" 
                        src={medicine.image || MEDICINE_DEFAULT_IMG} 
                        className="medicine-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = MEDICINE_DEFAULT_IMG;
                        }}
                      />
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{medicine.name}</Card.Title>
                      <Badge bg="info" className="badge-category align-self-start mb-2">
                        {medicine.category}
                      </Badge>
                      <Card.Text className="medicine-price mb-3">
                        ${Number(medicine.price).toFixed(2)}
                      </Card.Text>
                      <Card.Text className="medicine-stock mb-3">
                        {medicine.stock > 0 
                          ? `In Stock: ${medicine.stock}` 
                          : <span className="text-danger">Out of Stock</span>}
                      </Card.Text>
                      <div className="mt-auto d-flex">
                        <Button 
                          as={Link} 
                          to={`/medicines/${medicine.id}`} 
                          variant="outline-primary"
                          className="me-2 flex-grow-1"
                        >
                          Details
                        </Button>
                        <Button 
                          variant="primary" 
                          className="flex-grow-1"
                          onClick={() => addToCart(medicine)}
                          disabled={medicine.stock <= 0}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <h4>No medicines found</h4>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MedicineList;

// Product listing flow:
// 1. Component fetches medicines with optional filters (category, search)
// 2. Renders medicines in a grid using MedicineCard components
// 3. Pagination handles large numbers of products
// 4. Filter sidebar allows users to narrow their search
