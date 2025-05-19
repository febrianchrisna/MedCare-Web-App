import React, { useContext } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaInfoCircle } from 'react-icons/fa';
import { CartContext } from '../../contexts/CartContext';
import { MEDICINE_DEFAULT_IMG } from '../../config/constants';

const MedicineCard = ({ medicine }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(medicine);
  };

  return (
    <Card className="medicine-card h-100 border-0">
      <div className="position-relative">
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
        <Badge bg="info" className="badge-category position-absolute top-0 start-0 m-3">
          {medicine.category}
        </Badge>
      </div>
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-2">{medicine.name}</Card.Title>
        
        {medicine.dosage && (
          <p className="text-muted small mb-2">{medicine.dosage}</p>
        )}
        
        <Card.Text className="medicine-price mb-2 mt-2">
          Rp {Number(medicine.price).toLocaleString()}
        </Card.Text>
        
        <div className="d-flex align-items-center mb-3">
          {medicine.stock > 0 ? (
            <Badge bg="success" className="px-2 py-1">In Stock: {medicine.stock}</Badge>
          ) : (
            <Badge bg="danger" className="px-2 py-1">Out of Stock</Badge>
          )}
        </div>
        
        <div className="mt-auto d-flex">
          <Button 
            as={Link} 
            to={`/medicines/${medicine.id}`} 
            variant="outline-primary"
            className="me-2 flex-grow-1 d-flex align-items-center justify-content-center"
          >
            <FaInfoCircle className="me-1" /> Details
          </Button>
          <Button 
            variant="primary" 
            className="flex-grow-1 d-flex align-items-center justify-content-center"
            onClick={handleAddToCart}
            disabled={medicine.stock <= 0}
          >
            <FaShoppingCart className="me-1" /> Add
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MedicineCard;
