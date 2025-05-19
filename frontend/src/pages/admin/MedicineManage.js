import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Table, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const MedicineManage = () => {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    manufacturer: '',
    dosage: '',
    image: '',
    expiry_date: '',
    featured: false, // Add featured flag
  });
  const [currentMedicine, setCurrentMedicine] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMedicines();
    fetchCategories();
  }, []);

  const fetchMedicines = async () => {
    try {
      setError(null);
      const response = await api.get('/medicines');
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setError('Failed to load medicines. Please try again.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/medicines/categories');
      
      // Define standard medical categories that should always be available
      const standardCategories = [
        'Pain Relief',
        'Antibiotics',
        'Vitamins & Supplements',
        'Cold & Flu',
        'Allergy',
        'Digestive Health',
        'First Aid',
        'Heart Health',
        'Diabetes Care',
        'Skin Care',
        'Eye Care',
        'Respiratory',
        'Fever Reducers',
        'Anti-Inflammatory'
      ];
      
      // Combine fetched categories with standard ones, removing duplicates
      const fetchedCategories = response.data || [];
      const combinedCategories = [...new Set([...fetchedCategories, ...standardCategories])].sort();
      
      setCategories(combinedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // If fetching fails, still provide the standard categories
      setCategories([
        'Pain Relief',
        'Antibiotics',
        'Vitamins & Supplements',
        'Cold & Flu',
        'Allergy',
        'Digestive Health',
        'First Aid',
        'Heart Health',
        'Diabetes Care',
        'Skin Care',
        'Eye Care',
        'Respiratory',
        'Fever Reducers',
        'Anti-Inflammatory',
        'Other'
      ]);
    }
  };

  const handleShowModal = (medicine) => {
    setCurrentMedicine(medicine);
    if (medicine) {
      // For editing, format the date properly
      const expiryDate = medicine.expiry_date 
        ? new Date(medicine.expiry_date).toISOString().split('T')[0]
        : '';
        
      setFormData({
        name: medicine.name || '',
        description: medicine.description || '',
        price: medicine.price?.toString() || '',
        category: medicine.category || '',
        stock: medicine.stock?.toString() || '',
        manufacturer: medicine.manufacturer || '',
        dosage: medicine.dosage || '',
        expiry_date: expiryDate,
        image: medicine.image || '',
        featured: medicine.featured || false, // Add featured flag
      });
    } else {
      // Reset form for new medicine
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        manufacturer: '',
        dosage: '',
        image: '',
        expiry_date: '',
        featured: false, // Reset featured flag
      });
    }
    setShowModal(true);
    setValidated(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget || e.target;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Convert string values to appropriate types
      const medicineData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };
      
      let response;
      
      if (currentMedicine) {
        // Update medicine
        response = await api.put(`/medicines/${currentMedicine.id}`, medicineData);
        setSuccessMessage('Medicine updated successfully');
      } else {
        // Add new medicine
        response = await api.post('/medicines', medicineData);
        setSuccessMessage('Medicine added successfully');
      }
      
      await fetchMedicines(); // Refresh the list
      handleCloseModal();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error saving medicine:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Authentication error. Please log in again as admin.');
      } else {
        setError(error.response?.data?.message || 'Failed to save medicine. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine? This action cannot be undone.')) {
      try {
        setError(null);
        await api.delete(`/medicines/${id}`);
        
        // Remove from medicines list
        setMedicines(prevMedicines => prevMedicines.filter(m => m.id !== id));
        
        // Show success feedback
        setSuccessMessage('Medicine deleted successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        console.error('Error deleting medicine:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Authentication error. Please log in again as admin.');
        } else {
          setError(err.response?.data?.message || 'Failed to delete medicine. Please try again.');
        }
      }
    }
  };

  return (
    <Container>
      <h1 className="my-4">Medicine Management</h1>
      <Button variant="primary" onClick={() => handleShowModal(null)} className="mb-3">
        Add New Medicine
      </Button>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price (Rp)</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Featured</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.length > 0 ? (
            medicines.map((medicine, index) => (
              <tr key={medicine.id}>
                <td>{index + 1}</td>
                <td>{medicine.name}</td>
                <td>{medicine.description?.substring(0, 30)}{medicine.description?.length > 30 ? '...' : ''}</td>
                <td>{Number(medicine.price).toLocaleString()}</td>
                <td>{medicine.category}</td>
                <td>{medicine.stock}</td>
                <td>
                  {medicine.featured ? (
                    <Badge bg="success">Yes</Badge>
                  ) : (
                    <Badge bg="secondary">No</Badge>
                  )}
                </td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(medicine)} className="me-2 mb-1">
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(medicine.id)} className="mb-1">
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">No medicines found. Add some medicines to get started.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentMedicine ? 'Edit Medicine' : 'Add Medicine'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Medicine name is required.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    {!categories.includes('Other') && (
                      <option value="Other">Other</option>
                    )}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a category.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="price">
                  <Form.Label>Price (Rp)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Valid price is required.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="stock">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Valid stock quantity is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="manufacturer">
                  <Form.Label>Manufacturer</Form.Label>
                  <Form.Control
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="dosage">
                  <Form.Label>Dosage</Form.Label>
                  <Form.Control
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="expiry_date">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="expiry_date"
                    value={formData.expiry_date}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="image">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Enter image URL"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="featured">
                  <Form.Check
                    type="checkbox"
                    label="Featured Medicine (show on homepage)"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </Form.Group>
            
            {error && <Alert variant="danger">{error}</Alert>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (currentMedicine ? 'Update Medicine' : 'Add Medicine')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MedicineManage;